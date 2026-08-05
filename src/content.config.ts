/**
 * The content model (ADR 0003).
 *
 * Every fact about the studio that a page shows — a price, an opening time, the address — is defined
 * exactly once, here, and rendered from that definition. The old site did the opposite: the same price
 * lived in an Elementor layout block, a pricing-table widget and a text paragraph, and over nine years
 * they drifted apart (`docs/analysis/05-defect-list.md`). A fact duplicated away from its authority
 * degrades into an assertion.
 *
 * The property that makes this worth doing is measured, not hoped for: **a schema violation fails the
 * build with exit 1** (ADR 0003, Context). That converts a class of content defect from "renders
 * wrongly" into "does not ship".
 *
 * Two Astro details that are easy to get wrong from memory, both current as of Astro 7:
 *   - this file is `src/content.config.ts`; `src/content/config.ts` is legacy and needs a flag
 *   - Zod comes from `astro/zod`, not from `astro:content`, which Astro 6 deprecated (and moved to Zod 4)
 */

import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { IS_LIVE } from './config/site';

/**
 * Who vouched for this entry, and when — required on every entry (ADR 0003 §8).
 *
 * `false` is a legitimate, recordable state, not a missing value: it means the figure is *invented* and
 * nobody has confirmed it. Making the field required rather than optional is the whole point — an entry
 * cannot become publishable by someone forgetting to mark it.
 *
 * What it gates: an unconfirmed entry renders in the `preview` build and **fails the `live` build**.
 * Failing rather than hiding, because a price list that silently drops three services looks finished
 * and is wrong.
 */
const confirmation = z
  .union([
    z.literal(false),
    z.object({
      by: z.string().min(1),
      on: z.coerce.date(),
      /** Where the value came from, when that is not obvious from `by`. */
      source: z.string().optional(),
    }),
  ])
  /**
   * **This is the gate, and it lives in the schema on purpose.**
   *
   * It was first written in `query.ts`, where it only ran when a page actually read a collection. That
   * looked right and was not: the first live build passed, exit 0, with a file full of invented prices
   * in the repository — because no page read `services` yet. A gate that depends on somebody
   * remembering to walk through it is not a gate.
   *
   * Here it runs during the loader's own validation, for every entry in every collection, whether or
   * not anything renders it. And it fails the build the same way any other schema violation does, which
   * is the one behaviour of Astro that was measured rather than assumed (exit 1).
   */
  .superRefine((value, ctx) => {
    if (IS_LIVE && value === false) {
      ctx.addIssue({
        code: 'custom',
        message:
          'unconfirmed content cannot be published (ADR 0003 §8). This entry holds an invented ' +
          'placeholder value that nobody has vouched for, and the live build refuses it rather than ' +
          'hiding it — a page that silently drops three services looks finished and is wrong. Set ' +
          '`confirmed: { by: owner, on: YYYY-MM-DD }` once the value is confirmed.',
      });
    }
  });

/**
 * A price is a discriminated union, not a number with optional extras (ADR 0003 §3).
 *
 * Every variant below exists because the old site's price list contains it — a floor („ab 3,00 €"), a
 * range (39,00 – 44,00 €), two variants in one item (30,00 € / 57,00 €), a status instead of an amount
 * („zZ. vergriffen"), and items with no price at all (Gutschein, Happy Hour).
 *
 * Optional fields would make „ab 39,00 – 44,00 € / 57,00 €" representable. It is not a price. The union
 * also makes rendering exhaustive by construction: adding a `kind` breaks the type-check in every
 * template that formats a price, which is precisely the reminder wanted.
 *
 * **Amounts are integer cents**, never floats and never formatted strings. „ab 3,00 €" fuses three
 * facts — an amount, a currency and a qualifier — and fusing them is how „ab" becomes impossible to
 * translate and impossible to sort.
 */
const cents = z.number().int().positive();

const price = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('fixed'), cents }),
  z.object({ kind: z.literal('from'), cents }),
  z.object({ kind: z.literal('range'), from: cents, to: cents }),
  z.object({
    kind: z.literal('variants'),
    variants: z.array(z.object({ label: z.string().min(1), cents })).min(2),
  }),
  /**
   * The one place free text can enter a price, and deliberately narrow. It exists because
   * „zZ. vergriffen" is real — it is not a general-purpose note field, and the content check keeps a
   * currency symbol out of it so it cannot quietly become one.
   */
  z.object({ kind: z.literal('status'), status: z.string().min(1) }),
  z.object({ kind: z.literal('none') }),
]);

/** `HH:MM`, 24-hour. A string rather than a number because 09:05 is not 9.05 and never was. */
const clock = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'a time must be HH:MM in 24-hour form, e.g. "09:30"');

/** ISO weekday: 1 = Monday … 7 = Sunday. */
const weekday = z.number().int().min(1).max(7);

/**
 * Identity and contact details (ADR 0003 §9).
 *
 * These were `docs/business-facts.md` — a Markdown table parsed with a regex, which was the right
 * interim answer when no content model existed and is the wrong permanent one. The `source` column
 * survives as a field, because two of these rows have a non-obvious provenance: the e-mail address,
 * which the PII cleaning of the WordPress export destroyed along with 2,216 customers' addresses, and
 * the trading name's apostrophe, which the owner settled in ADR 0004 R5.
 */
const business = defineCollection({
  loader: file('src/content/business.yaml'),
  schema: z.object({
    value: z.string().min(1),
    source: z.string().min(1),
    confirmed: confirmation,
  }),
});

/** What the studio offers, grouped. Categories are the spine services hang from (ADR 0003 §6). */
const categories = defineCollection({
  loader: file('src/content/categories.yaml'),
  schema: z.object({
    name: z.string().min(1),
    /** One line, used for the homepage teaser. Prose, never a fact. */
    teaser: z.string().min(1),
    /** Display order; the file order is not load-bearing. */
    order: z.number().int().nonnegative(),
    confirmed: confirmation,
  }),
});

/**
 * The services themselves — the authority for what is offered and what it costs.
 *
 * `category` is an id, not a name. That is what makes `M-28`'s dead jump anchors structurally
 * impossible: an anchor is generated from an id, so an anchor pointing nowhere cannot be written. The
 * old site's anchors were hand-typed strings that outlived the sections they pointed at.
 */
const services = defineCollection({
  loader: file('src/content/services.yaml'),
  schema: z.object({
    category: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    price,
    order: z.number().int().nonnegative(),
    confirmed: confirmation,
  }),
});

/**
 * Opening hours as intervals with a validity period (ADR 0003 §4).
 *
 * `docs/analysis/02-content-inventory.md` records that the export holds **two conflicting summer sets with
 * differing Sunday hours**. A model that can only hold one gets resolved by somebody deleting the other,
 * and the wrong one is exactly as likely as the right one. So sets coexist and carry their own validity;
 * the build selects.
 *
 * An open `validUntil` means "until replaced", not "forever".
 */
const hours = defineCollection({
  loader: file('src/content/hours.yaml'),
  schema: z.object({
    label: z.string().min(1),
    validFrom: z.coerce.date().optional(),
    validUntil: z.coerce.date().optional(),
    intervals: z
      .array(z.object({ days: z.array(weekday).min(1), opens: clock, closes: clock }))
      .min(1),
    confirmed: confirmation,
  }),
});

/**
 * Dated exceptions — holidays and closures.
 *
 * Separate from `hours` and deliberately not a sentence in the prose, because a closure that lives in
 * prose cannot suppress anything. This list is what the status badge consults before it is allowed to
 * claim anything (ADR 0003 §4, R2); without it the badge would be a weekday clock pretending to be a
 * calendar.
 */
const closures = defineCollection({
  loader: file('src/content/closures.yaml'),
  schema: z.object({
    from: z.coerce.date(),
    until: z.coerce.date(),
    reason: z.string().min(1),
    confirmed: confirmation,
  }),
});

export const collections = { business, categories, services, hours, closures };
