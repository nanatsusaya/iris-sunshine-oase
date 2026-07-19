/**
 * The only module that reads the content collections (ADR 0003 §8).
 *
 * Templates never call `getCollection` themselves; `tools/check-content.mjs` asserts that
 * `astro:content` is imported nowhere but here. That is what makes the confirmation gate below a
 * property of the system rather than a habit — there is exactly one door, so there is exactly one place
 * to put the lock.
 *
 * Everything here runs at build time. Nothing in this file reaches a visitor's browser.
 */

import { getCollection } from 'astro:content';
import { IS_LIVE, SITE_STATE } from '../config/site';

/** An entry nobody has vouched for. `confirmed: false` is a recorded state, not a missing value. */
type Confirmation = false | { by: string; on: Date; source?: string };

/**
 * A backstop, not the gate.
 *
 * **The real gate is in `src/content.config.ts`**, on the `confirmed` field itself, where it runs
 * during the loader's own validation for every entry in every collection — read or not.
 *
 * It started here, and that was wrong in a way worth recording. This version only runs when a page
 * actually reads a collection, so the first `SITE_STATE=live` build passed with exit 0 while the
 * repository held a file of invented prices: nothing rendered `services` yet, so nothing walked through
 * the door the lock was on. A gate that depends on someone remembering to use it is not a gate.
 *
 * This copy stays because the failure it guards against is a wrong price on a real business's website,
 * and the cost of the redundancy is a dozen lines. It catches the case where the schema-level refinement
 * is weakened without this being noticed.
 */
async function gated<T extends { id: string; data: { confirmed: Confirmation } }>(
  entries: T[],
  collection: string,
): Promise<T[]> {
  if (IS_LIVE) {
    const unconfirmed = entries.filter((entry) => entry.data.confirmed === false);
    if (unconfirmed.length > 0) {
      throw new Error(
        `Content gate: ${unconfirmed.length} unconfirmed entr${unconfirmed.length === 1 ? 'y' : 'ies'} ` +
          `in "${collection}" — ${unconfirmed.map((e) => e.id).join(', ')}.\n` +
          '\nThe live build refuses content nobody has vouched for (ADR 0003 §8). These entries hold ' +
          "invented placeholder values; publishing them would put figures on a real business's " +
          'website that no one has confirmed.\n' +
          '\nFix by setting `confirmed: { by: owner, on: YYYY-MM-DD }` in the data file once the value ' +
          'is confirmed — never by removing this check, and never by deleting the entry, which would ' +
          'publish a silently incomplete list instead.',
      );
    }
  }
  return entries;
}

/** True when this entry carries invented data — used to mark it visibly in the preview. */
export const isPlaceholder = (entry: { data: { confirmed: Confirmation } }): boolean =>
  entry.data.confirmed === false;

/** Whether the current build shows placeholders at all. Exported so a layout can say so once. */
export const SHOWS_PLACEHOLDERS = !IS_LIVE;
export { SITE_STATE };

// --- business facts ---------------------------------------------------------

/**
 * One identity fact by id, e.g. `trading-name`.
 *
 * Throws rather than returning `undefined`: a template asking for the telephone number and silently
 * rendering nothing is the failure mode this whole model exists to remove. An empty field is
 * recoverable only if somebody notices it.
 */
export async function businessFact(id: string): Promise<string> {
  const entries = await gated(await getCollection('business'), 'business');
  const entry = entries.find((candidate) => candidate.id === id);
  if (!entry) {
    throw new Error(
      `business fact "${id}" does not exist in src/content/business.yaml. ` +
        "That file is the authority for the studio's details — add it there, never inline here.",
    );
  }
  return entry.data.value;
}

// --- services ---------------------------------------------------------------

export async function categories() {
  const entries = await gated(await getCollection('categories'), 'categories');
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export async function services() {
  const entries = await gated(await getCollection('services'), 'services');
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export async function servicesIn(categoryId: string) {
  return (await services()).filter((service) => service.data.category === categoryId);
}

// --- opening hours ----------------------------------------------------------

/**
 * The hour set in force, selected by validity.
 *
 * **Ambiguity is an error, not a coin toss.** The WordPress export holds two conflicting summer sets
 * (`docs/analyse/02-inhaltsinventar.md`), and the tempting behaviour — take the first match — is how
 * one of them silently wins. If two sets are valid at once, that is a content defect and the build says
 * so.
 *
 * A caveat worth stating rather than discovering: "now" here is **build time**, because a static page is
 * generated once. A seasonal changeover therefore needs a rebuild, not merely a date passing. That is
 * fine for two sets a year and is the same reason the status badge cannot compute its own state
 * (ADR 0003 §4).
 */
export async function currentHours() {
  const entries = await gated(await getCollection('hours'), 'hours');
  const now = new Date();
  const valid = entries.filter(
    ({ data }) =>
      (!data.validFrom || data.validFrom <= now) && (!data.validUntil || data.validUntil >= now),
  );

  if (valid.length === 0) {
    throw new Error(
      'No opening-hour set is valid at build time. Every set in src/content/hours.yaml has expired — ' +
        'the site would show no hours at all, which is worse than showing old ones because nobody ' +
        'would notice.',
    );
  }
  if (valid.length > 1) {
    throw new Error(
      `${valid.length} opening-hour sets are valid at once: ${valid.map((e) => e.id).join(', ')}. ` +
        'Their validity periods overlap, so which one applies is undefined. This is exactly the ' +
        'situation the old site was in — two conflicting summer sets — and picking one silently is ' +
        'how the wrong one wins. Narrow the validity periods in src/content/hours.yaml.',
    );
  }
  return valid[0];
}

export async function closures() {
  const entries = await gated(await getCollection('closures'), 'closures');
  return entries.sort((a, b) => a.data.from.getTime() - b.data.from.getTime());
}
