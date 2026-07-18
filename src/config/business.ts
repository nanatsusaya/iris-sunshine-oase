// The authority is inlined at build time by Vite's `?raw` import rather than read from disk at
// runtime. Reading it with `fs` and a path relative to this module looks equivalent and is not:
// the module gets bundled into `dist/.prerender/chunks/`, so the relative path resolves from
// there and the build fails. `?raw` embeds the file's contents during the build, which is also
// what makes the dependency visible to Vite — editing the authority triggers a rebuild.
import AUTHORITY_SOURCE from '../../docs/business-facts.md?raw';

/**
 * The studio's own facts, taken at build time from their single authority.
 *
 * **This module deliberately parses `docs/business-facts.md` rather than restating it.** The rule
 * the whole rebuild exists to serve is that a fact has exactly one definition (`CLAUDE.md`): the old
 * site carried the same price in an Elementor block, a pricing-table widget and a text paragraph,
 * and over nine years they drifted apart. Copying the trading name into a TypeScript constant would
 * be the same mistake in a new syntax — smaller, but the same shape.
 *
 * The parse is strict on purpose. If the table's format changes, the build fails loudly instead of
 * silently rendering a stale or empty value, and a build failure is the cheap outcome.
 *
 * **Interim.** ADR 0003 decides the content model and gives these facts a typed home; this module
 * is the stopgap until it does, and it is expected to be replaced rather than extended. Prices and
 * opening hours are explicitly *not* here — they are a larger dataset that belongs to ADR 0003 from
 * the start, and `docs/business-facts.md` says so.
 */
const AUTHORITY_PATH = 'docs/business-facts.md';

function readFact(label: string): string {
  // Rows look like: `| Trading name | Kosmetik- & Sonnenstudio … | inhalte/seiten/impressum.md |`
  for (const line of AUTHORITY_SOURCE.split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').map((cell) => cell.trim());
    if (cells[1] === label) {
      const value = cells[2];
      if (value) return value;
    }
  }
  throw new Error(
    `business-facts: no value for "${label}" in ${AUTHORITY_PATH}. ` +
      "That file is the authority for the studio's details — correct it there, never here.",
  );
}

/**
 * The studio's trading name, as registered.
 *
 * Deliberately not quoted in this comment. A doc comment that repeats the value is a third copy that
 * nobody updates — and the apostrophe in this particular string changed on 2026-07-19 (ADR 0004 R5),
 * which is precisely how such a copy goes stale without anyone noticing.
 */
export const TRADING_NAME = readFact('Trading name');
