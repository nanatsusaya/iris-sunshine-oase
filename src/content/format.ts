/**
 * Turning stored facts into readable text — the other half of ADR 0003's separation.
 *
 * A price is stored as an amount and a shape; the words around it („ab", „bis 30 min") are produced
 * here. That split is the point: `„ab 3,00 €"` stored as a string fuses three facts — an amount, a
 * currency and a qualifier — and fused, it cannot be sorted, compared or translated.
 *
 * All of this runs at build time.
 *
 * **Locale is provisional.** ADR 0005 owns German/English and is still `Planned`, so the German strings
 * below are hard-coded rather than resolved. They are collected in this one file precisely so that ADR
 * 0005 has a single place to take over, instead of finding day names scattered through templates.
 */

const EUR = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

/** Cents to „3,00 €". Integer cents in, formatted string out — never the reverse. */
export const euros = (cents: number): string => EUR.format(cents / 100);

/** The shape of a price, mirroring the discriminated union in `src/content.config.ts` (ADR 0003 §3). */
export type Price =
  | { kind: 'fixed'; cents: number }
  | { kind: 'from'; cents: number }
  | { kind: 'range'; from: number; to: number }
  | { kind: 'variants'; variants: { label: string; cents: number }[] }
  | { kind: 'status'; status: string }
  | { kind: 'none' };

/**
 * A price as one line of text.
 *
 * The `switch` is exhaustive by construction: adding a variant to the schema makes this fail to compile
 * in every template that formats a price, which is the reminder the union exists to give. That is why
 * there is no `default` branch — a default would swallow exactly the case that needs attention.
 */
export function formatPrice(price: Price): string {
  switch (price.kind) {
    case 'fixed':
      return euros(price.cents);
    case 'from':
      return `ab ${euros(price.cents)}`;
    case 'range':
      // An en dash, not a hyphen: this is a range, and the old site's own price list sets it this way.
      return `${euros(price.from)} – ${euros(price.to)}`;
    case 'variants':
      return price.variants.map((v) => `${v.label} ${euros(v.cents)}`).join(' · ');
    case 'status':
      return price.status;
    case 'none':
      return '';
  }
}

/** The cheapest amount in a price, or `null` where there is no amount at all („zZ. vergriffen"). */
export function lowestCents(price: Price): number | null {
  switch (price.kind) {
    case 'fixed':
    case 'from':
      return price.cents;
    case 'range':
      return Math.min(price.from, price.to);
    case 'variants':
      return Math.min(...price.variants.map((v) => v.cents));
    case 'status':
    case 'none':
      return null;
  }
}

// --- contact ----------------------------------------------------------------

/**
 * The `tel:` target for a telephone number, derived from how the number is written.
 *
 * Stored once, in `src/content/business.yaml`, in the form a human reads:
 * `+49 (0)7276 50 50 550`. A dialable URI needs the same number without the spacing and **without the
 * national trunk prefix** — the `(0)` is what a caller inside Germany dials *instead of* `+49`, so
 * leaving it in produces a number that fails from abroad and, on some networks, at home too.
 *
 * Derived rather than stored beside the readable form, because a second copy of a telephone number is
 * the same defect as a second copy of a price: it survives every review until the day the number
 * changes and only one of them is updated.
 */
export function telHref(telephone: string): string {
  return `tel:${telephone.replace(/\(0\)/, '').replace(/[^\d+]/g, '')}`;
}

// --- opening hours ----------------------------------------------------------

/** ISO weekday 1–7. Provisional German, see the file header. */
const DAY_NAMES = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

/**
 * `[1,2,3,4,5]` → „Montag – Freitag"; `[6,7]` → „Samstag & Sonntag"; `[1,3]` → „Montag, Mittwoch".
 *
 * Derived rather than stored, so a day range cannot disagree with the days it is built from — which is
 * the same class of defect as a price existing twice, at a smaller scale.
 */
export function formatDays(days: number[]): string {
  const sorted = [...new Set(days)].sort((a, b) => a - b);
  const name = (d: number) => DAY_NAMES[d - 1];

  const isRun = sorted.every((d, i) => i === 0 || d === sorted[i - 1] + 1);
  if (sorted.length >= 3 && isRun) return `${name(sorted[0])} – ${name(sorted[sorted.length - 1])}`;
  if (sorted.length === 2) return `${name(sorted[0])} & ${name(sorted[1])}`;
  return sorted.map(name).join(', ');
}

/**
 * The state the status badge may show (ADR 0003 §4, R2).
 *
 * **It fails in the cheap direction by construction.** The two possible errors are not symmetrical: a
 * wrongly shown „geschlossen" costs a visitor a telephone call, a wrongly shown „geöffnet" costs them
 * the drive to a locked door. So `'open'` is only ever returned from data somebody has confirmed —
 * everything else, including "we do not know", resolves to `'closed'`.
 *
 * While the hours are placeholders this therefore always returns `'closed'`, which is what the badge
 * shows and what makes it safe to render invented times at all.
 */
export type OpeningState = 'open' | 'closed' | 'unknown';

export function badgeState(hoursConfirmed: boolean): OpeningState {
  // Deliberately not computed from the clock. A static page is generated once and read later, so it
  // cannot know the time it is being read; computing this in the browser would require the dated
  // exception list (src/content/closures.yaml) to be complete and current, and it is not. Until it is,
  // the honest answer is the safe one.
  return hoursConfirmed ? 'unknown' : 'closed';
}
