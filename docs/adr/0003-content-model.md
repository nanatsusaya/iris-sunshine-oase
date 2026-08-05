# ADR 0003 — Content model: structured data and where authority lives

- **Status:** Accepted
- **Date:** 2026-07-19
- **Depends on:** [ADR 0002](0002-tech-stack-and-tooling.md) §1 (Astro 7, static, no adapter — which is
  why everything below happens at build time) and §5 (the precedent that a check blocks rather than
  warns); [ADR 0004](0004-styling-and-design-tokens.md) §10 (the same pattern applied to the
  presentation half, and the working example this ADR copies)

## Context

This is the decision the rebuild exists for. [`docs/adr/README.md`](README.md) calls it "the single most
load-bearing decision here", and the reason is a specific documented failure rather than a principle:
on the old site the same price existed in an Elementor layout block, a pricing-table widget and a text
paragraph, and over nine years they drifted apart
([`05-defect-list.md`](../analysis/05-defect-list.md)). Content welded into markup has no authority, so
every copy is equally plausible and none is correct.

### It is also what is currently blocking Phase 2

`docs/STATUS.md` named "the homepage" as the step after the token layer (#40). On 2026-07-19 that turned
out to be untrue. The homepage as drawn needs opening hours (*„Montag – Freitag 17:00 – 19:00"*, and a
live *„Jetzt geöffnet bis 19:00 Uhr"* badge) and four price teasers (*„ab 3 €"*, *„ab 39 €"*, *„ab
30 €"*, *„ab 49 €"*). Address, telephone and e-mail already have an authority; **none of the rest does.**

Building it first would have meant typing an opening time into a template — the exact defect the project
exists to remove, committed on day one of the implementation. So the order changed.

### What already exists to build on

- **The full price list**, [`03-services-and-prices.md`](../analysis/03-services-and-prices.md),
  extracted from the WordPress export. Its closing section is unusually useful: it enumerates the
  **special cases any schema must survive**, which is the part of a content model that is normally
  discovered too late.
- **Every page text**, verbatim, in [`docs/content/`](../content/README.md).
- **[`docs/business-facts.md`](../business-facts.md)**, holding identity and contact details under an
  explicit *"Interim location"* notice that names this ADR. That notice is a promissory note; §8 redeems
  it.
- **The token layer** (#40) — the presentation half of the same separation, and a working precedent for
  §7.

### Four things were verified against the scaffold rather than assumed

Astro's own documentation does not state these, so they were measured on 2026-07-19 with `astro 7.1.1`.
They matter because two of them are load-bearing and one of them is a trap.

| Question | Result |
|---|---|
| Does a schema violation fail the build? | **Yes — exit 1.** `InvalidContentEntryDataError`, naming the file, field and expected type. |
| Does `file()` read YAML, with comments? | **Yes.** Entries and comments both survive; ids are preserved. |
| Is a **missing** `id` an error? | **Logged `[ERROR]` — and the build exits 0.** The entry is silently dropped. |
| Is a **duplicate** `id` an error? | **Logged `[WARN]` — and the build exits 0.** *"Later items with the same id will overwrite earlier ones."* |

The last two are the trap, and they decide §7. **A duplicated id means one price silently overwrites
another and the build still prints `Complete!`** — which is the old site's defect reproduced inside the
mechanism chosen to prevent it. A warning in a build log is not a control.

## Decision

### 1. Astro content collections, at build time

Content lives in Astro's content collections, declared in **`src/content.config.ts`** (the current path;
`src/content/config.ts` is legacy and needs a compatibility flag since Astro 6). Schemas are Zod,
imported as **`import { z } from 'astro/zod'`** — not from `astro:content`, which Astro 6 deprecated.
Astro 6 also moved to Zod 4, so pre-2026 examples are subtly rather than loudly wrong.

Chosen because the alternative — hand-rolled parsing — is what `src/config/business.ts` currently does,
and it has no schema, no types and no failure mode except a thrown string. Collections are queried in
`.astro` frontmatter with `getCollection` / `getEntry`, resolve during the build, and ship no query code
to the browser. Nothing here needs a server (ADR 0002 §1).

**The build failing on invalid data is the single most valuable property**, because it converts a whole
class of content defect from "renders wrongly" into "does not ship".

### 2. YAML files, and amounts in integer cents

Data files are **YAML** under `src/content/`, loaded with `file()` for datasets and `glob()` for prose.

YAML over JSON for one reason that outweighs the rest: **it takes comments.** A price list maintained by
a human — and by an agent working a ticket — needs to carry *why* a value is what it is next to the
value. JSON cannot, so the reason would move to a document that then drifts from the data.

**Money is an integer number of cents** (`300`, not `3.00`), formatted for display with
`Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })` at build time. A price is never
stored as a string: `„ab 3,00 €"` is three facts fused — an amount, a currency and a qualifier — and
fusing them is how `„ab"` ends up impossible to translate and impossible to sort.

### 3. A price is a discriminated union, not a number with exceptions

This is where most price models fail, so it is stated concretely. The special cases are not hypothetical
— every one below is in the old site's list:

| Case | Example |
|---|---|
| a fixed amount | Hotstone Rückenmassage, 54,00 € |
| a floor | Einsteiger, *„ab 3,00 €"* |
| a range | Problemhaut, 39,00 – 44,00 € |
| two variants in one item | Relax-Massage, 30,00 € / 57,00 € (bis 30 min / 60 min) |
| a status instead of an amount | Fußreflexzonen-Massage, *„zZ. vergriffen"* |
| no price at all | Gutschein, Happy Hour |

```ts
const price = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('fixed'),    cents: z.number().int().positive() }),
  z.object({ kind: z.literal('from'),     cents: z.number().int().positive() }),
  z.object({ kind: z.literal('range'),    from: z.number().int().positive(),
                                          to:   z.number().int().positive() }),
  z.object({ kind: z.literal('variants'), variants: z.array(z.object({
                                            label: z.string(), cents: z.number().int().positive() })
                                          ).min(2) }),
  z.object({ kind: z.literal('status'),   status: z.string() }),
  z.object({ kind: z.literal('none') }),
]);
```

A discriminated union rather than optional fields, because optional fields make *„ab 39,00 – 44,00 €
/ 57,00 €"* representable. It cannot be. Rendering becomes exhaustive by construction: a new `kind`
breaks the type-check in every template that formats a price, which is exactly the reminder wanted.

**The escape hatch is deliberately narrow.** `status` is a free string and is the one place arbitrary
text can enter a price. It exists because *„zZ. vergriffen"* is real; it is not a general-purpose note
field, and §7's check keeps a currency symbol out of it.

### 4. Opening hours are intervals with a validity, not a paragraph

[`02-content-inventory.md`](../analysis/02-content-inventory.md) records that the export holds **two
conflicting summer sets with differing Sunday hours**. A model that cannot hold two sets at once will be
resolved by someone deleting one of them, and the wrong one is as likely as the right one.

So a set of hours is an entry with `validFrom` / `validUntil` (both optional — an open end means "until
replaced") and a list of `{ days, opens, closes }` intervals, times as `HH:MM` strings validated by
pattern. Multiple sets coexist; the build selects. Public holidays and closures are a separate list of
dated exceptions rather than a note in the prose, because a closure that lives in prose cannot suppress
anything.

**The status badge is built, and it may never claim „geöffnet" from data nobody has confirmed** (**R2**).

The problem it has to survive: a static page is generated once and read later, so it cannot know the
time it is being read. Computing the state in the browser means making a claim that is wrong on every
holiday the exception list has not anticipated — and **a wrong "open now" badge sends someone to a
locked door**, which is a worse failure than a wrong price, because it costs the visitor a journey
rather than a correction.

The owner's resolution is the asymmetry, and it is the right one: the two errors are not equally bad.
Claiming *„geschlossen"* when the studio is open costs a visitor a telephone call. Claiming
*„geöffnet"* when it is closed costs them the drive. So the badge fails in the safe direction by
construction:

- With **unconfirmed** hours (§8) the badge renders the closed state and never computes anything. It is
  present, so the layout is real, and it cannot lie in the expensive direction.
- With **confirmed** hours it may compute the current state — against the dated exception list above,
  which is what makes the computation honest. Without that list it would be a weekday clock pretending
  to be a calendar.

The residual is recorded rather than solved: the exception list has to be *maintained*, and a badge
computed against a stale list is exactly the failure this section is about. That maintenance is the
price of the feature, and it falls due at go-live, not now.

### 5. Prose is Markdown; facts are never prose

A page's running text lives in a Markdown collection; its **facts do not appear in it**. A price, an
opening time, an address or a telephone number in a Markdown body is the same defect as one in a
template, and §7 checks for it.

The split is: `.astro` carries structure, the Markdown carries voice, the YAML carries facts. Where a
page needs a fact inside a sentence, the sentence is composed in the template from the datum — not
typed with the number in it.

### 6. Services are the spine, and ids are the joins

One `services` collection is the authority for what the studio offers. Categories, the price page, the
homepage teasers and the per-service pages all *reference* it by id; none restates it.

This is what makes `M-28`'s dead jump anchors structurally impossible rather than merely fixed: an
anchor is generated from an id, so an anchor that points nowhere cannot be written. The old site's
anchors were hand-typed strings that outlived the sections they pointed at.

### 7. What becomes a blocking check

The measured behaviour in the Context decides this section. Astro fails the build on a **bad value** and
merely logs on a **broken id**, so the checks cover what Astro does not:

1. **Every entry has an id, and ids are unique per collection.** Astro warns and continues; the entry is
   dropped or overwritten. Silent content loss is the worst failure available here.
2. **No price literal outside the data.** A `€` sign, or a digit-comma-digit money pattern, in any
   `.astro` or content Markdown file. This is the direct analogue of ADR 0004 §10's no-raw-colour rule,
   and it is the one that actually prevents the old site's defect from returning.
3. **No time-of-day literal outside the data**, for the same reason — `M-05` records opening hours
   appearing in two places on the old site.
4. **No unconfirmed content reaches a page** — §8.
5. **Every referenced id resolves.** A teaser naming a service that does not exist is a broken page.

### 8. Confirmed content, and why an unverified price must be *unable* to render

The price list is dated *"presumably 2019/2020"* and its own header says the prices "are to be confirmed
by the owner". The opening hours are unconfirmed too. Without a mechanism this leaves two bad options:
publish unverified figures, or refuse to record them at all and keep them in a chat log.

There is a third. **Every entry carries its confirmation as data:**

```yaml
- id: hotstone-rueckenmassage
  price: { kind: fixed, cents: 5400 }
  confirmed: false          # or: { by: owner, on: 2026-08-01 }
```

`confirmed` is **required**, so a new entry cannot omit it by accident, and `false` is a legitimate,
recordable state. Templates never call `getCollection` directly; a single module `src/content/query.ts`
exports the accessors, and check 4 asserts that `astro:content` is imported nowhere else.

**The gate is the existing state flag, not a second one** (**R1**). ADR 0006 §5 already splits the build
into `preview` and `live`, and that split is exactly the right seam:

| Build state | Unconfirmed entry |
|---|---|
| `preview` | **renders**, visibly marked as a placeholder |
| `live` | **fails the build** |

The live build *fails* rather than hiding the entry, and the difference matters. Hiding would produce a
price list that is silently incomplete — a page that looks finished and is missing three services is
worse than one that never shipped. Failing means an unconfirmed figure cannot reach the public site by
any route, including forgetting about it.

This is what makes the mechanism worth its machinery: it is the difference between an unverified price
being *unlikely* to render and being *unable* to. `CLAUDE.md` puts it as "an empty field is recoverable,
a wrong price is not" — this is that rule with something under it.

**Placeholders are obviously false on sight, by construction.** While a value is unconfirmed it is not
merely unverified, it is *invented*, and an invented figure that looks plausible is the most dangerous
thing in this repository. So placeholder amounts are repdigits — 11,11 €, 22,22 €, 33,33 € — and
placeholder times are implausible clock values, never a tidy `10:00 – 18:00` that would survive a
screenshot as if it were real. In the preview they additionally carry a visible marker, so a page shared
as an image still says what it is.

It also unblocks work: the whole price list can be transcribed now, reviewed as a diff, and confirmed by
the owner row by row, while the site is built against placeholders that cannot escape the preview.

### 9. `docs/business-facts.md` folds in and stops being interim

Its seven rows become an entry in the content model, carrying the same provenance its *Source* column
carries today — including the two rows with a non-obvious source (the e-mail address, which the PII
cleaning destroyed, and the trading name's apostrophe, settled by the owner in ADR 0004 R5).

`src/config/business.ts` currently parses that Markdown table with a regex at build time. That was the
right interim answer when no model existed; it is the wrong permanent one, and it goes.
`docs/business-facts.md` becomes a pointer to the data file, so links to it keep working and its
rationale — *why* these facts may be published at all — is not lost.

### 10. What this ADR does not decide

- **The values.** Every figure in `docs/analysis/` is unconfirmed. This ADR decides the shape and the
  gate; the content itself is Phase 3 and needs the owner (#41).
- **Locale.** ADR 0005 owns German/English. The schema must not foreclose it, which is why prose is a
  separate collection from facts — an amount in cents does not translate, and a description does.
- **URLs and redirects.** ADR 0008.
- **Which pages exist**, beyond the keep/rework/drop assessment already in
  [`02-content-inventory.md`](../analysis/02-content-inventory.md), which still needs owner confirmation.

## Consequences

**Positive**

- The project's founding rule finally has a mechanism: a fact has one definition, and a second copy is a
  failed check rather than a matter of vigilance.
- Invalid data cannot ship — verified, not assumed (exit 1).
- The price list can be transcribed and reviewed *before* it is confirmed, without risk (§8).
- `M-28`'s dead anchors and `M-05`'s duplicated hours close structurally rather than by fixing them.
- `docs/business-facts.md`'s interim notice is resolved rather than accumulating.
- A price change becomes one line in a YAML file — which is the precondition for the ticket-driven
  maintenance model this project is built around working at all.

**Negative / costs**

- **A discriminated union is more ceremony than a number**, and the first few entries will feel
  heavy-handed for `54,00 €`. The cost is paid at entry six, the range.
- **The confirmation gate will be in the way**, deliberately. Someone will add a price, see nothing
  render, and have to go and find §8. That is the design, but it should be said plainly rather than
  discovered.
- **Check 2 will produce a false positive** on a `€` that genuinely belongs in prose — a Gutschein
  described without a fixed amount, say. The remedy is a data field, not an exception.
- **One more indirection between an author and the page.** For fourteen pages that is a real cost and
  it is accepted because the alternative is the documented failure this project was commissioned to
  undo.
- **`src/config/business.ts` gets rewritten** three weeks after it was written. Its `?raw` Markdown
  parsing was a reasonable interim, and interim work being replaced is not waste — but it is churn.

## Alternatives considered

- **Plain TypeScript modules exporting typed objects** — rejected: no schema validation of the *shape*
  at the boundary, no build failure on bad data, and content becomes code so a price change becomes a
  code review of a `.ts` file.
- **JSON instead of YAML** — rejected on comments alone (§2). Provenance next to the value is the point.
- **Prices as formatted strings** (`"ab 3,00 €"`) — rejected: unsortable, untranslatable, and it makes
  the six special cases invisible rather than solved.
- **Floating-point euros** — rejected. Integer cents removes a class of arithmetic and formatting bug
  for no cost.
- **A headless CMS** — rejected as infrastructure a fourteen-page brochure site cannot justify, and it
  would reintroduce a third-party dependency ADR 0009 §6 exists to avoid.
- **Optional fields instead of a discriminated union** — rejected: it makes contradictory prices
  representable, and the type system stops helping exactly where it is most needed.
- **Trusting Astro's duplicate-id warning** — rejected on measurement. It exits 0 (Context).
- **A `draft: true` flag instead of `confirmed`** — rejected as the wrong default. `draft` reads as
  "not finished yet"; the real state is "nobody has vouched for this figure", and inverting it makes
  omission fail safe.

## Resolved questions (owner decisions, 2026-07-19)

- **R1 — The confirmation gate stays, and the owner's own constraint improved it.** The answer did not
  arrive as a yes: it arrived as *"I do not know the current values yet, I will supply them during the
  day — use obviously dummy values."*

  That is a stronger requirement than the question anticipated, because it makes invented figures a
  *deliberate, temporary state of the repository* rather than an accident to be prevented. §8 was
  rewritten around it. The gate is no longer "unconfirmed cannot render" — it is **unconfirmed renders
  in `preview` and fails the build in `live`**, riding on the state flag ADR 0006 §5 already defines
  rather than inventing a second one.

  Two properties follow, and both are better than what was proposed:

  1. **Work is unblocked without lowering the bar.** The homepage can be built today against
     placeholders, and no route exists by which one reaches the public site — not even forgetting.
  2. **The live build fails rather than hiding.** A silently incomplete price list looks finished and is
     wrong, which is worse than one that never shipped.

  And a rule the original §8 did not have: **a placeholder must be false on sight.** An invented figure
  that looks plausible is the most dangerous object in this repository, so placeholder amounts are
  repdigits and placeholder times are implausible clock values. Not `10:00 – 18:00`, which would survive
  a screenshot as though it were real.

- **R2 — The badge is built, and it shows the closed state while the hours are unconfirmed.** The owner
  overruled the recommendation to drop it, and the reasoning is better than the recommendation: the two
  possible errors are not symmetrical. A wrongly-shown *„geschlossen"* costs a visitor a telephone call;
  a wrongly-shown *„geöffnet"* costs them a journey to a locked door.

  So the badge exists — the layout is real, the design survives — and it fails in the cheap direction by
  construction. It computes nothing from unconfirmed data. Once the hours are confirmed it may compute
  the live state against the dated exception list, and the maintenance of that list becomes the price of
  the feature. Folded into §4.

**Content facts still outstanding (Phase 3, tracked on #41):** the prices are unconfirmed and undated;
both Freundinnen packages cost 115,00 € although Paket 2 contains more; the opening hours have two
conflicting 2024 summer sets; Fußreflexzonen-Massage is *„zZ. vergriffen"*; the Honigmassage is
described but unpriced; proWIN's status is unclear; and the blog is 19 expired promotions that
`02-content-inventory.md` recommends not carrying over. The owner will supply the current prices and
opening hours; until then the repository holds placeholders under R1.

## References

- Issue #41 — the owning ticket; epic #5 (Phase 3), currently blocking #4 (Phase 2)
- [ADR 0001](0001-record-architecture-decisions.md) — the ADR workflow
- [ADR 0002](0002-tech-stack-and-tooling.md) — §1 static build, §5 blocking checks
- [ADR 0004](0004-styling-and-design-tokens.md) — §10, the check-not-rule precedent this ADR follows
- [ADR 0005](README.md) — internationalisation (`Planned`), which owns locale
- [`docs/analysis/02-content-inventory.md`](../analysis/02-content-inventory.md) — the page inventory and the
  two conflicting summer hour sets
- [`docs/analysis/03-services-and-prices.md`](../analysis/03-services-and-prices.md) — the price list
  and its enumeration of the special cases §3 must survive
- [`docs/analysis/05-defect-list.md`](../analysis/05-defect-list.md) — `M-05` duplicated opening hours,
  `M-28` dead jump anchors
- [`docs/business-facts.md`](../business-facts.md) — the interim location §9 resolves
- [Astro — Content collections](https://docs.astro.build/en/guides/content-collections/) and the
  [content loader reference](https://docs.astro.build/en/reference/content-loader-reference/)
- [Astro — Upgrade to v6](https://docs.astro.build/en/guides/upgrade-to/v6/) — legacy collections
  removed, `z` moved to `astro/zod`, Zod 4
