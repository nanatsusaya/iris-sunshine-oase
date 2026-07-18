# ADR 0004 — Styling and design tokens

- **Status:** Proposed
- **Date:** 2026-07-19
- **Depends on:** [ADR 0002](0002-tech-stack-and-tooling.md) §4 (plain CSS with custom properties — the
  mechanism, which explicitly hands the *values* to this ADR) and §5 (the precedent that a check blocks
  rather than warns); [ADR 0009](0009-security-by-design.md) §6 (the site loads nothing from a third
  party, which decides how fonts arrive)

## Context

This is the last of the reserved decisions that was **parked on input from outside the repository**.
`docs/STATUS.md` recorded on 2026-07-18 that design tokens invented before a design existed would only
be replaced by it, so 0004 was deliberately not taken in numerical order.

That input now exists: the owner drafted the redesign in Claude Design — project *„Iris Sunshine Oase
Redesign"*, one file `Startseite.dc.html`, ten iterations. It was read and measured on 2026-07-19. Every
figure below comes from that file, not from an impression of it.

ADR 0002 §4 already settled the **mechanism** — plain CSS with custom properties, no framework, no
preprocessor — and said in as many words that the values belong here. The scaffold (#31) ships a holding
page that declares no colours, type scale or spacing on purpose, so nothing has been settled in code
ahead of this decision.

### What the draft already provides

**Turns 6–10 are canonical.** Turn 5 is labelled *„Finale Version"* and is **not**: turn 6 supersedes it
with a WCAG rework. This has to be stated once, in writing, because the label invites exactly the wrong
reading.

The draft carries its own token layer — **14 CSS custom properties, byte-identical across all ten
iterations**. Only one value ever changed: `--muted`, from `#8C7A75` to `#6B5D57`, which *is* the
accessibility rework of turn 6. A design that already thinks in tokens is a considerable head start;
most of this ADR is naming and systematising what is there, not inventing it.

### A continuity worth recording

`docs/analyse/04-design-system.md` notes that almost every colour of the old site is a visual estimate,
with exactly one exception: the hero gradient `#c2d1f0 → #ffc000`, read out of the Custom CSS in the
export. It is the only hard colour fact the old site left behind.

The draft's `--orange` is **`#FFC000`** — identical — and its `--blue` is `#C2D1ED`, three hex digits off
`#c2d1f0`. The new design is a direct descendant of the one documented colour pair the business already
owned. That is worth writing down, because it means the palette carries nine years of recognition rather
than replacing it.

The draft also **resolves an old-site defect rather than repeating it.** The analysis said to discard the
gradient hero, because it appeared only where a photograph was missing and therefore read as a broken
image — and it named the remedy: *"Either an image everywhere or a deliberately designed surface
everywhere."* The draft takes the second option and promotes the gradient to the page's own background.
Same colours, opposite intent.

### What the draft does not provide

Measured, not assumed. These are the gaps this ADR exists to close:

| Gap | Evidence |
|---|---|
| **No breakpoints** | The file contains **zero `@media` rules**. Desktop and mobile are separate static mockups, not one responsive document. |
| **No spacing scale** | `padding`/`gap` values run 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 30, 34, 40, 44, 52, 56 px — near-continuous, hand-placed. |
| **No type scale** | Headings use 22 distinct sizes between 17 px and 66 px. |
| **No single container width** | `max-width` clusters at 260, 288, 460, 600, 620, 780, 820, 900 px. |

The absence of breakpoints is the one with a documented precedent: **`M-09` — the old site's two-column
layout does not wrap on mobile.** A draft that supplies no responsive rules is not neutral about that
defect; it leaves the decision to whoever implements it, which is how `M-09` happened in the first place.

## Decision

### 1. The draft is the source of record, and turns 6–10 are canonical

The design is treated the way `docs/inhalte/` treats the old site's text: **source material, quoted from
rather than owned.** This ADR extracts a system from it; where the two disagree, this ADR governs,
because a mockup cannot express a rule.

Turn 5's *„Finale Version"* label is superseded by turn 6. Turns 3–5 are iteration history.

### 2. One tier of semantic tokens, not two

Every value below lives in a single CSS custom-property layer on `:root`. **No primitive tier under it.**
A two-tier system (raw palette → semantic aliases) is the right answer at a scale where many brands or
themes share a codebase; here it would be one indirection for one theme on fourteen pages, and ADR 0002's
whole argument is that this project's failure mode is accumulated machinery nobody can reason about.

Names are **semantic, not presentational**, which is the one place the draft's own naming is changed:

| This ADR | Draft | Value | Notes |
|---|---|---|---|
| `--colour-brand` | `--ink` | `#6E1015` | bordeaux; used ×359 in the draft |
| `--colour-text` | `--body` | `#5C4944` | body copy |
| `--colour-text-muted` | `--muted` | `#6B5D57` | **see O1** |
| `--colour-accent` | `--orange` | `#FFC000` | **surface only, never text — §3** |
| `--colour-accent-cool` | `--blue` | `#C2D1ED` | surface |
| `--colour-accent-cool-text` | `--blue-ink` | `#4E63A0` | **see O1** |
| `--surface-card` | `--card` | `rgb(255 255 255 / .72)` | |
| `--surface-card-strong` | `--card-2` | `rgb(255 255 255 / .86)` | |
| `--surface-card-border` | `--card-brd` | `rgb(255 255 255 / .85)` | |
| `--colour-rule` | `--hair` | `rgb(110 40 30 / .16)` | hairlines |
| `--shadow-colour` | `--sh` | `rgb(120 60 30 / .32)` | |
| `--glow-warm` / `--glow-cool` | same | `rgb(255 196 0 / .45)` / `rgb(194 209 237 / .6)` | |
| `--page-background` | `--page` | `linear-gradient(158deg, #FFD24A, #FBE3AC 22%, #EDE8E2 50%, #D8DEEE 78%, #C2D1ED)` | |

`--ink` is renamed because it does not mean ink: it is the brand bordeaux, used for headings and marks,
while the actual body colour is `--body`. A name that misdescribes its value is a defect waiting for a
confident reader.

The mapping column stays in this table permanently. It is how a future session reads the draft without
having to re-derive which token became which.

### 3. Colour rules that are not preferences

Three of these are arithmetic, not taste, and they are stated as rules so that nobody has to re-measure:

- **`--colour-accent` is never text.** `#FFC000` scores 1.07–1.60 against every background in the
  palette — it cannot carry text at any size. The draft uses it correctly, as a surface. Written down
  because "the brand colour" is exactly what a later session reaches for when setting a heading.
- **Body text meets WCAG 2.2 AA (4.5:1) against its actual background, not against a representative
  one.** The page background is a five-stop gradient, so a token has five contrasts, and the **worst**
  governs. `--colour-brand` (7.80) and `--colour-text` (5.47) clear it everywhere. Two tokens do not —
  see **O1**.
- **Contrast is asserted, not reviewed.** §9.

### 4. Typography: four families, self-hosted — and the wordmark stops being two of them

ADR 0009 §6 forbids third-party resources, and the draft loads all four families from
`fonts.googleapis.com`. Self-hosting is therefore not a preference but a consequence, and it is
available: **Mulish, Cormorant Garamond and Kaushan Script are OFL; Yellowtail is Apache 2.0**, verified
against the `google/fonts` repository rather than a summary. Each font file enters under the same
provenance rule as any other asset (`CLAUDE.md`): source, licence and evidence recorded.

**Two of the four families exist only to set two words.** Kaushan Script renders „Iris'" and Yellowtail
renders „Sunshine" — the wordmark, and nothing else in the entire draft. Shipping two webfont families
for one fixed string is a poor trade, so **the wordmark becomes an inline SVG** and those two families do
not ship at all. The lockup is a logo; drawing it as one is also what makes it render identically
everywhere instead of depending on two fonts loading.

That leaves **Cormorant Garamond** for headings and **Mulish** for body text — two families, subset to
the Latin glyphs the site actually uses, `woff2`, `font-display: swap`, preloaded.

`docs/analyse/04-design-system.md` lists the old site's *"serif style break"* among the things to
discard: notice boxes and footer headings were serif while everything else was sans, *"without
discernible intent"*. The draft's serif headings against sans body are the same contrast **with**
intent, which is the distinction — the defect was arbitrariness, not serifs.

**Type scale.** The draft's 22 heading sizes collapse onto a stepped scale with a ratio near 1.25,
fluid only at the top two steps where the draft's own desktop/mobile pair differs most:

| Token | Size | Draft sizes it absorbs |
|---|---|---|
| `--text-xs` | 0.75rem | 11, 12, 12.5 |
| `--text-sm` | 0.875rem | 13, 13.5, 14, 14.5 |
| `--text-base` | 1rem | 15, 15.5, 16 — **see O2** |
| `--text-lg` | 1.125rem | 17, 18, 19 |
| `--text-xl` | 1.375rem | 20, 21, 22, 23 |
| `--text-2xl` | 1.625rem | 24, 25, 26, 27 |
| `--text-3xl` | 2rem | 28, 30, 32 |
| `--text-4xl` | `clamp(2.125rem, 1.6rem + 2.2vw, 2.75rem)` | 34, 36, 38, 39, 44 |
| `--text-5xl` | `clamp(2.75rem, 1.8rem + 4vw, 4.125rem)` | 56, 58, 66 |

`clamp()` on the top two steps is what replaces the mockups' separate desktop and mobile headline sizes
without a breakpoint, and it fixes another named old-site defect in passing: *"The hero title does not
scale with the text length — long titles keep the same size and run right up to the edge."*

Line heights collapse to three: `1.15` headings, `1.6` body, `1` for single-line labels.

### 5. A spacing scale, because the old site had none

`docs/analyse/04-design-system.md` records that the old site produced spacing with **Elementor spacer
widgets** — a full-width empty section between practically every block — and says plainly that this
*"belongs in a spacing system in CSS"*. This is that system.

Base 4 px, nine steps: `--space-1` 4 px, `--space-2` 8, `--space-3` 12, `--space-4` 16, `--space-5` 24,
`--space-6` 32, `--space-7` 48, `--space-8` 64, `--space-9` 96.

The draft's near-continuous values round onto it. A 13 px gap becomes 12 and a 15 px gap becomes 16; the
visual difference is under a pixel of perception and the gain is that the next page does not invent a
17 px gap. **A scale that is not exhaustive is the point** — the constraint is the feature.

### 6. Layout: one reading measure, one container

`docs/analyse/04-design-system.md` lists *"Fluid without a maximum width"* as a defect, with the remedy
already stated: *"Limit to a reading width of about 65–75 characters."*

- `--measure` = **34rem** (≈ 544 px) — prose. At `--text-base` this is roughly 68 characters, and it is
  what the draft's own 600/620 px text columns already are.
- `--container` = **60rem** (960 px) — the widest layout band, absorbing the draft's 780–900 px cluster.
- Gutter `--space-5` (24 px) below the container width, matching the old site's 24 px side margin, which
  the analysis records without criticising.

The draft's narrower `max-width` values (260, 288, 460 px) are component widths, not layout, and stay
with their components.

### 7. Responsive strategy: mobile-first, two breakpoints

The draft supplies none, so this ADR chooses — and chooses few.

**Mobile-first**: unprefixed rules are the small-screen case, `min-width` queries add to them. The draft's
320 px reflow check (turn 10) is the floor and stays the floor.

Two breakpoints, named for what changes rather than for a device:

- `--bp-wide` **48rem** (768 px) — single-column stacks become multi-column.
- `--bp-full` **64rem** (1024 px) — the container reaches `--container` and stops growing.

Two, not five, because fourteen brochure pages have two layouts: stacked and side-by-side. Additional
breakpoints are added when a component demonstrably needs one, in the PR that needs it — not reserved in
advance.

This is the section that answers `M-09`. A layout that does not wrap on mobile is now a rule violation
rather than an oversight, because the unprefixed case *is* the mobile case: a two-column grid can only
exist inside a `min-width` query.

### 8. Icons are inline SVG, never emoji

The draft uses emoji as interface icons: ☎ 📍 ✉ ✔ ☀ ☾. This is corrected rather than carried over, and it
is a defect fix rather than a design change:

- they render as a different picture on every operating system, so the design is not reproducible;
- a screen reader announces them by their Unicode name — 📍 is read as *"round pushpin"* next to a
  postal address;
- they are text, so they inherit the text colour and cannot carry two-tone marks.

Inline SVG: no icon font (a third-party file and a fetch, which ADR 0009 §6 forbids anyway), no sprite
sheet at this size. Decorative icons get `aria-hidden="true"`; an icon that carries meaning alone gets an
accessible name.

### 9. What becomes a check rather than a rule

ADR 0002 §5's finding — a convention left to discipline drifts within hours — applies to a token system
more than to most things, because the failure is a single hard-coded hex that nobody notices.

Three assertions, added with the implementation and blocking like every other check:

1. **No raw colour outside the token file.** No `#rrggbb`, `rgb(` or `hsl(` in any `.astro` or component
   `.css` file; colours come from `var(--colour-…)`. This is the one that actually prevents drift.
2. **No spacing value outside the scale.** `padding`/`margin`/`gap` take `var(--space-…)`, `0`, or a
   percentage.
3. **Contrast holds.** For each text token, the worst contrast against every `--page-background` stop and
   every card surface is computed and compared to 4.5. This one is worth more than the paragraph in §3,
   because it is the rule most likely to be broken by a well-meant colour tweak — and it is arithmetic, so
   a machine should do it.

The third also means the numbers in **O1** stop being a one-off measurement and become a standing
guarantee.

### 10. What this ADR does not decide

- **Which images exist.** §4 and §8 decide how assets arrive, not that any may be added. No image enters
  without documented source, licence and evidence (`CLAUDE.md`), and the old site's image rights are
  explicitly undocumented (`docs/analyse/06-medien-inventar.md`). See **O3** and **O4**.
- **Page structure and content.** Which pages exist, and where prices and opening hours live, is ADR 0003.
  **The draft's price and opening-hours strings are illustration.** They were checked against
  `docs/analyse/03-leistungen-und-preise.md` on 2026-07-19 and all 32 match — but matching today is not a
  reason to copy them; the built site reads them from the content model.
- **Locale-specific typography.** ADR 0005.
- **Anything about the `noindex` gate.** ADR 0006 §4 and §5 are untouched by this ADR.

**Phase gate.** This unblocks the homepage implementation in Phase 2 (#4), which is currently a
deliberately undesigned holding page. It depends on no still-`Planned` decision: ADR 0003 owns the
content, but a token system does not need to know what text it will style. `Accepted` here means
**designed** — the tokens exist as a decision, not as code.

## Consequences

**Positive**

- The design arrives with its token layer intact, so this is mostly naming and systematising rather than
  invention — and the mapping table keeps the draft readable against the implementation.
- The palette preserves the only colour fact the old site documented, so nine years of recognition
  survive a complete rebuild.
- Three of this project's inherited defects are closed structurally rather than by vigilance: spacing
  becomes a scale (`04-design-system.md`), the layout gets a maximum measure (same), and mobile-first
  makes `M-09` unexpressible.
- Dropping two font families costs nothing visible and removes two network-loaded dependencies.
- The colour, spacing and contrast rules are machine-checkable, so they survive sessions that never read
  this file.

**Negative / costs**

- **The scale will fight the draft.** A 13 px gap becomes 12 px and a 15 px gap becomes 16 px, in
  hundreds of places. Implementations will not be pixel-identical to the mockup, and that is the intended
  trade — but it should be said plainly rather than discovered during review.
- **Two breakpoints will not be enough somewhere.** A component will want a third. The cost is a decision
  in that PR rather than a system that already has the answer.
- **The no-raw-colour check will be annoying at least once**, most likely for a one-off decorative value
  that genuinely is not a token. The escape hatch is adding a token, not an exception to the check.
- **Self-hosted fonts are a maintenance surface.** Subsets have to be regenerated if the character set
  changes, and a font update is a manual step Dependabot cannot do.
- **The wordmark as SVG cannot reflow.** For a fixed two-word lockup that is acceptable, but it does mean
  the brand name is an image with an accessible name rather than selectable text.
- **This ADR touches the owner's aesthetic.** §4's type scale and **O2** in particular push against the
  draft's deliberately light, fine character. That is a real cost and the reason O2 is a question rather
  than a decision.

## Alternatives considered

- **Two-tier tokens (primitive palette + semantic aliases)** — rejected as machinery for a scale that
  does not exist here: one theme, fourteen pages. Revisit only if a second theme appears.
- **Keeping the draft's token names verbatim** — rejected because `--ink` does not mean ink and `--sh`
  means nothing; the mapping table preserves the link without preserving the confusion.
- **Adopting the draft's pixel values as-is, with no scale** — rejected. It is the old site's failure
  mode exactly: values placed individually, drifting apart, with no authority to check against.
- **Tailwind or another utility framework** — already rejected by ADR 0002 §4 and not re-opened here.
- **A container-query-based layout instead of breakpoints** — rejected as premature. It is the better
  answer for a component library; this is fourteen pages with two layouts.
- **Keeping emoji icons** — rejected on reproducibility and screen-reader behaviour (§8).
- **Shipping all four font families** — rejected: two of them set two words. See §4.
- **`clamp()` for every step of the type scale** — rejected; fluid type between fixed bounds is useful at
  display sizes and merely unpredictable at body sizes.

## Open questions (for owner review)

- **O1 — Two tokens miss WCAG AA on the page gradient. May they be darkened?** On card surfaces both pass;
  directly on `--page-background` they do not, at the cool end:

  | on the gradient | `#FFD24A` | `#FBE3AC` | `#EDE8E2` | `#D8DEEE` | `#C2D1ED` |
  |---|---|---|---|---|---|
  | `--colour-text-muted` `#6B5D57` | 4.38 | 5.01 | 5.18 | 4.69 | **4.10** |
  | `--colour-accent-cool-text` `#4E63A0` | 4.03 | 4.61 | 4.77 | 4.31 | **3.77** |

  AA requires 4.5 for body text. Note that turn 6 *already* darkened `--muted` once for exactly this
  reason (`#8C7A75` → `#6B5D57`); the correction was real but stopped short on the gradient.
  **Recommendation:** darken both by the smallest amount that clears 4.5 at the worst stop, preserving
  hue — `--colour-text-muted` → **`#645651`** and `--colour-accent-cool-text` → **`#45578D`**, both
  landing at 4.54. The alternative, if the lighter tones matter to you, is to forbid these two as body
  text outside a card, which is a narrower rule but one more thing to remember.

- **O2 — Body text at 15 px in weight 300: keep, or raise to 16 px / weight 400?** The draft's own
  description of its direction is *„Zarte Serifen-Headlines und feine, dünne Fließschrift statt kräftigem
  Fett"*, so this is central to its character, not incidental. But 15 px at weight 300 is small **and**
  light at once, and the studio's customers are not uniformly young eyes.
  **Recommendation:** 16 px at weight 400 for body copy, keeping weight 300 for large text where it reads
  as elegance rather than as thinness. This is your call, not mine — it is the one place where an
  accessibility default and the design's stated intent genuinely pull apart, and I would rather ask than
  quietly thicken your design.

- **O3 — Are photographs planned?** The draft contains **none** and references exactly one image, the sun.
  If that is deliberate, it is a load-bearing design decision and it removes almost the entire image-rights
  problem — which, given that the old site's rights are undocumented and Pixabay changed its terms in
  2019, would be a genuinely valuable outcome. If photographs are merely absent for now, the layout must
  reserve space for them and the provenance question returns.
  **Recommendation:** confirm photograph-free as the design intent if you are content with it.

- **O4 — Where did the sun come from?** `assets/sun-orange.png`, plus `sun.svg` and two `Logo.png` in the
  draft's reference folder. Self-drawn, derived from the old logo, or third-party? It is the only image
  the design needs, and no image enters this repository without documented source, licence and evidence.
  Worth knowing: `docs/analyse/04-design-system.md` records that the old site's `Logo-Sun.svg` is **not a
  vector logo** — it is a 500 × 500 px PNG embedded in an SVG container, so it does not scale. If the new
  sun descends from that file it inherits the same problem, and §4's inline-SVG wordmark wants a real
  vector beside it.

- **O5 — Which apostrophe?** The draft uses both: **39 × the straight `'`** and **18 × the typographic
  `’`**. `docs/business-facts.md` uses the straight one. This is the old site's defect reproduced —
  `docs/analyse/04-design-system.md` recorded the same inconsistency there and recommended settling on
  `Iris’ Sunshine Oase` with a typographic apostrophe.
  **Recommendation:** the typographic `’`, applied everywhere including `docs/business-facts.md`, and
  asserted by a check so it cannot drift again. A brand name spelled two ways is a small thing that reads
  as carelessness.

## References

- Issue #35 — the owning ticket
- [ADR 0001](0001-record-architecture-decisions.md) — the ADR workflow
- [ADR 0002](0002-tech-stack-and-tooling.md) — §4 plain CSS with custom properties, §5 blocking checks
- [ADR 0003](README.md) — the content model, which owns prices and opening hours (`Planned`)
- [ADR 0006](0006-deployment-preview-hosting.md) — §4 and §5, untouched by this ADR
- [ADR 0009](0009-security-by-design.md) — §6, which decides how fonts arrive
- [`docs/analyse/04-design-system.md`](../analyse/04-design-system.md) — the old site's design system, the
  documented `#c2d1f0 → #ffc000` gradient, and the defects §5 and §6 close
- [`docs/analyse/05-maengelliste.md`](../analyse/05-maengelliste.md) — `M-09`, the layout that does not
  wrap on mobile
- [`docs/analyse/03-leistungen-und-preise.md`](../analyse/03-leistungen-und-preise.md) — the price
  authority the draft's illustrative figures were checked against
- [W3C — WCAG 2.2, Success Criterion 1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)
- [google/fonts](https://github.com/google/fonts) — the licence evidence for the four families
