# ADR 0010 — Visual design refresh (direction K)

- **Status:** Accepted
- **Date:** 2026-10-23
- **Supersedes:** [ADR 0004](0004-styling-and-design-tokens.md) — in full, with §5–§10 of it carried
  forward by this ADR (§9 below)
- **Depends on:** [ADR 0002](0002-tech-stack-and-tooling.md) §4 (plain CSS with custom properties) and
  §5 (checks over rules); [ADR 0009](0009-security-by-design.md) §6 (no third-party resources, which
  decides how fonts arrive); [ADR 0003](0003-content-model.md) (where business facts live — untouched
  here)

## Context

ADR 0004 turned the owner's first Claude Design draft into a token system, and the homepage was built
from it on 2026-07-19. On 2026-10-22 the owner looked at the rendered page and rejected the look — in
conversation, *„die seite sieht doof aus"*. What followed is recorded here because the route matters as
much as the result:

1. **A first redraft** (orange and blue as large flat surfaces, rounded cards, cartoon suns) and **six
   directions** (A–F) were rejected as *„super kindisch"*.
2. The owner asked for the look of current, successful tanning-studio sites. Three were read on
   2026-10-23 — SUNPOINT, Palm Beach Tan and Ergoline — and they share one pattern: **photography carries
   the page, the interface stays quiet, the brand colour is an accent rather than a surface**, the
   ground is a warm neutral, and booking information sits high. The rejected drafts had done the
   opposite. Three directions (G–I) followed that pattern.
3. The owner then supplied ten ChatGPT-generated homepage mockups, with **mockup 3** as the preferred
   one: cream ground, a full-width warm photograph, a high-contrast serif with a handwritten accent,
   orange as buttons and line icons, blue as calm bands and footer, a line-drawn sun as the mark. Their
   phone numbers, addresses, opening hours and reviews are placeholders — the owner said so — and were
   not carried over.
4. **Direction J** was drawn from those mockups with this project's real content; **direction K**
   moved closer to mockup 3. The owner chose **K** and asked for all pages in it: K-Start, K-Angebot,
   K-Studio, K-UeberUns, K-Kontakt and a phone-width homepage, on the canvas *„Iris Sunshine Oase –
   Redesign 2"* (claude.ai, private to the owner).

**Two facts survive every round and are the brand:** orange **`#FFC000`** and blue **`#C2D1ED`**. ADR 0004
recorded why — they are the direct descendants of the only colour pair the old site documented exactly
(`docs/analysis/04-design-system.md`) — and the owner restated it: *„die farben mit dem orange und blau
müssen bleiben, das ist so ziemlich das markenzeichen"*.

**Why this supersedes rather than amends.** ADR 0004 is `Accepted`; ADR 0001 makes it immutable unless
the owner authorises an amendment. What changes here is not a detail of it but its palette, its type,
its mark and its source of record — most of its decision. A superseding ADR keeps 0004's reasoning
readable as it stood, which is the point of immutability, while §9 below names exactly which of its
sections still bind.

### What the canvas does not settle

Measured, not assumed. These are the gaps the decision has to close:

| Gap | Evidence |
|---|---|
| **The canvas is not in the repository.** | It lives on claude.ai and is private. An agent working a ticket cannot open it, so every value it needs has to be written down here. |
| **Two blues drifted in.** | The canvas uses `#C9D6EE` for its bands, not the brand's `#C2D1ED` — a value nobody chose. |
| **Two text colours fail on blue.** | `#6E655C` scores 3.71 and `#8C5B00` scores 3.78 against `#C2D1ED`. Both pass on cream. Neither may appear on blue. |
| **Icon strokes are below 3:1.** | The gold strokes (`#C98F00`, `#E2A200`) score 2.63 and lower on cream. That is fine for decoration and not fine for an icon that carries meaning. |
| **Hero text sits over a picture.** | ADR 0004 §9 requires a scrim or a solid panel. The canvas fades the photograph into the ground, and the rule for where text may sit has to say so. |
| **Body copy is 15 px.** | The owner chose 16 px (**R1**). |

## Decision

### 1. Direction K is the source of record — and this ADR, not the canvas, is the authority

The K artboards are treated the way ADR 0004 treated its draft: **source material, quoted from rather
than owned**. Where the canvas and this ADR disagree, this ADR governs, because a mockup cannot state a
rule. Because the canvas is outside the repository, **every value an implementation needs is in this
file**, and nothing is to be measured off the canvas again.

The mockups the owner supplied are reference only. None of their content — names, numbers, reviews,
photographs — enters the repository.

### 2. Colour: a warm ground, orange as accent, blue as calm bands

One tier of semantic tokens on `:root`, as ADR 0004 §2 decided — the mechanism is unchanged, only the
values move.

| Token | Value | Role |
|---|---|---|
| `--surface-ground` | `#FBF6EE` | the page — warm cream |
| `--surface-sand` | `#F5ECDF` | alternating bands (about, kabine) |
| `--surface-card` | `#FFFFFF` | cards, header bar, review cards |
| `--surface-cool` | **`#C2D1ED`** | brand blue — reviews band, package band, footer (**R3**) |
| `--colour-accent` | **`#FFC000`** | brand orange — primary buttons, gift card, small marks. **Never text.** |
| `--colour-heading` | `#1F1C1A` | headings |
| `--colour-text` | `#2B2724` | body copy, text on orange |
| `--colour-text-muted` | `#5B544D` | secondary copy |
| `--colour-text-subtle` | `#6E655C` | notes, footnotes — **cream, sand and white only** |
| `--colour-accent-text` | `#8C5B00` | eyebrows, wordmark, small links — **cream, sand and white only** |
| `--colour-cool-text` | `#1F2B44` | text on blue |
| `--colour-cool-text-muted` | `#2E3E5E` | secondary text on blue |
| `--colour-ornament` | `#C98F00` | decorative strokes and decorative icons only (§3) |
| `--colour-ornament-light` | `#E2A200` | the mark in the header |
| `--colour-rule` | `#E4D8C6` | hairlines, price-list leaders |

**The bordeaux `#6E1015` is retired** (**R4**). It was the draft's heading colour in ADR 0004; the brand
is orange and blue, and headings are now near-black.

There is **no page gradient**. ADR 0004's five-stop `--page-background` goes; the ground is a solid
colour. The warm gradient survives where it belongs — inside photographs.

### 3. Colour rules that are arithmetic, with the figures

Measured 2026-10-23 (WCAG 2.2 relative luminance). **AA is 4.5 for text, 3 for meaningful graphics.**

| Text token | on ground | on sand | on card | on blue |
|---|---|---|---|---|
| `--colour-heading` | 15.75 | 14.48 | 16.95 | 11.00 |
| `--colour-text` | 13.76 | 12.65 | 14.81 | 9.61 |
| `--colour-text-muted` | 6.92 | 6.36 | 7.45 | 4.84 |
| `--colour-text-subtle` | 5.31 | 4.88 | 5.71 | **3.71 — forbidden** |
| `--colour-accent-text` | 5.40 | 4.97 | 5.81 | **3.78 — forbidden** |
| `--colour-cool-text` | — | — | 14.12 | 9.17 |
| `--colour-cool-text-muted` | — | — | 10.68 | 6.93 |

`--colour-text` on `--colour-accent` scores **9.02**: dark text on orange buttons is fine. `--colour-accent`
as text scores **1.53** on the ground — it carries no text at any size, as in ADR 0004 §3.

**Ornament is decoration, and is marked as such.** `--colour-ornament` scores 2.63 on the ground, so it
may draw only what a reader loses nothing by missing: the four-promise icons, the line-sun, dividers.
Every such SVG is `aria-hidden="true"` and stands next to text that says the same thing. An icon that
carries meaning on its own — the phone glyph on an icon-only button, for instance — uses a text token and
gets an accessible name.

### 4. Typography: three self-hosted families, 16 px body in `rem`

| Role | Family | Weights | Licence |
|---|---|---|---|
| Headings, wordmark | **Libre Caslon Display** | 400 (the only one it has) | OFL 1.1 |
| Body, interface | **Lato** | 400, 700 | OFL 1.1 |
| Handwritten accent | **Sacramento** | 400 | OFL 1.1 |

Licences verified against `google/fonts` (`ofl/librecaslondisplay`, `ofl/lato`, `ofl/sacramento`) on
2026-10-23. Self-hosted, subset to the Latin glyphs used, `woff2`, `font-display: swap` — exactly the
regime ADR 0004 §4 set up and `docs/fonts.md` documents. Each file enters under the provenance rule.
Cormorant Garamond and Mulish leave with their records.

**Body copy is `1rem` — 16 px at the browser default — in weight 400** (**R1**). ADR 0004's 15 px in
weight 300 is gone, and with it the accepted residual it carried. **The root font size is never
overridden**, as before: every size is `rem`, so a reader who has raised the browser's default gets a
proportionally larger page.

| Token | Size | Used for |
|---|---|---|
| `--text-xs` | 0.75rem | eyebrows (upper case, tracked), footnotes |
| `--text-sm` | 0.875rem | secondary copy, card text, navigation |
| `--text-base` | **1rem** | body |
| `--text-lg` | 1.125rem | lead paragraphs |
| `--text-xl` | 1.375rem | small serif headings (price-list items) |
| `--text-2xl` | 1.625rem | card titles |
| `--text-3xl` | 2.125rem | band headings |
| `--text-4xl` | `clamp(2.25rem, 1.7rem + 2.2vw, 3rem)` | section headings |
| `--text-5xl` | `clamp(2.75rem, 1.8rem + 4vw, 5.25rem)` | the hero name |

**The handwritten accent is decoration, never information** (**R2**):

- it sets short phrases only — *„Zeit für Sie ♡"*, *„Licht ist Leben"*, *„Schönheit. Sonne.
  Entspannung."*;
- it is never smaller than `--text-3xl`, because a script at body size is illegible;
- it is `aria-hidden="true"`, and nothing it says is unavailable elsewhere on the page;
- its wording is page copy and lives in the content model and dictionaries like any other copy (ADR
  0003, ADR 0005), not in a template.

### 5. The mark: a line-drawn sun, drawn in this repository

The mark is the **rising line-sun** from direction K — a half sun on a horizon line with rays — as an
inline SVG authored in this repository (**R5**). Because it is drawn here, its provenance is the commit
that adds it, and no external file has to be obtained. That supersedes ADR 0004 R4, under which the
owner's own sun would have been used once a vector source existed; #39 closes with this ADR's
acceptance instead of with a file.

The **name is text, not a picture**: „IRIS’" over „SUNSHINE OASE", in Libre Caslon Display, tracked,
in `--colour-accent-text`. That reverses ADR 0004 §4's SVG wordmark. That wordmark existed to avoid
shipping two script fonts for two words; the new name is set in the heading face that ships anyway, so
the reason is gone, and live text is selectable, scales with the reader's settings and needs no
accessible-name workaround. The mark's SVG is `aria-hidden="true"`; the link around mark and name is
named by the name.

### 6. Form: few radii, hairlines over shadows

- **Radii:** `--radius-image` 2 px, `--radius-control` 4 px, `--radius-card` 6 px. Nothing is
  pill-shaped and nothing is rounded beyond 6 px. The rounded, bubbly shapes were a large part of what
  read as childish.
- **Lines rather than shadows:** hairlines in `--colour-rule`, dotted leaders in price lists. One soft
  shadow is allowed, on the hero's booking-information surface where it overlaps the photograph.
- **Buttons:** a primary button is `--colour-accent` with `--colour-text`; a secondary button is a 1 px
  outline. There is no third kind.
- **Container:** `--container` becomes **77.5rem** (1240 px) — the canvas's width. `--measure` stays
  **34rem** for prose (ADR 0004 §6).

### 7. Photographs and AI-generated images

ADR 0004 §9's handling still holds (§9 below). This section decides **what may be shown and where it
may come from** (**R7**, **R10**).

**Real photographs only** for anything a visitor could mistake for a fact about the studio: Iris, the
team, the studio rooms, the entrance, the sunbeds, the products actually sold. An AI image of those
would depict an existing person or place as authentic — a deep fake under EU AI Act Art. 3(60), which
Art. 50(4) requires to be disclosed from 2 August 2026 — and would mislead a customer whatever its
label (§ 5 UWG).

**AI-generated images are allowed for mood motifs only:** light, towels, hands, oil, plants, an
anonymous person who represents no one in the studio. Each one needs a provenance record before it
enters the repository:

- the tool;
- the date;
- the prompt;
- the version of the provider's terms in force — for ChatGPT, OpenAI's *Terms of Use for Europe*,
  updated 16 January 2026, which assign the output to the user and forbid claiming that output was made
  by a person.

The record lives beside the image the way `docs/fonts.md` records fonts.

**Provenance metadata in the file is kept.** Art. 50(2) obliges the provider to mark output as
machine-readable; the image pipeline must not strip that marking when it optimises the file.

**How they are made, to start with:** an agent writes the prompt, the owner generates the image in
ChatGPT and places it in a folder, and an agent records its provenance and integrates it (**R10**). No
API key, no additional service and no runtime call. A move to OpenAI's image API is a later decision,
taken if the number of images makes the manual route a burden.

**A photograph from the old site is reused only with its own provenance record** — never on the
strength of having been there (ADR 0004 §9, `CLAUDE.md`). The two groups differ, and
`docs/analysis/06-media-inventory.md` already says so: the **studio's own photographs** were taken by
Iris around 2016 and their rights lie with the studio (**R13**), so they qualify once each has its
record. The **stock motifs** from Pixabay, 2013–2017, do not: their licence cannot be proven after
Pixabay's 2019 change, and none of them is reused.

Each studio photograph that is taken over must also **show the studio as it is today** — the same
sunbed, the same room — confirmed by the owner photo by photo when they are chosen (#106). One that
shows a sunbed or room that no longer exists would mislead in exactly the way §7 forbids for AI
images. Third-party artwork that dominates a frame — the pop-art portrait in one of the gallery
shots — is cropped out or the photograph is not used.

**Where text may sit on a photograph:** only on the ground colour. A hero photograph is placed against
one edge and fades into `--surface-ground`; text sits on the faded, flat part, never on picture detail.
The fade is part of the image component, so the contrast of hero text is the ground's contrast (§3) and
can be asserted.

### 8. Reviews and social media

**Reviews** (**R8**, **R11**):

- The page shows **real Google reviews, with each author's consent**, attributed only as
  *„Google-Bewertung"* with the star rating — **no name or initial**. Customer names in a public
  repository are third-party personal data, which `CLAUDE.md` forbids.
- One sentence states the source and the selection: *„Ausgewählte Google-Bewertungen, mit Zustimmung
  wiedergegeben."* § 5b Abs. 3 UWG requires the page to say whether and how reviews are verified.
- Below them is a plain link to the studio's Google profile. There is no embedded widget (ADR 0009 §6).
- **The section is rendered only when at least one consented review exists in the content data.** An
  empty section, or one with placeholder text, never ships.

**Social media** (**R9**, **R12**): accounts are linked from the footer as plain `<a>` links with a
self-hosted SVG icon and an accessible name. There are no embedded feeds, share buttons or pixels.
Which accounts exist is a fact the owner supplies (#104). Until then, no social link is shown.

### 9. What carries forward from ADR 0004 unchanged

Superseding ADR 0004 does not reopen these. They bind through this ADR, with the reasoning still read
there:

- **§2's mechanism** — one tier of semantic custom properties on `:root`, names semantic rather than
  presentational. (§2 here replaces the values.)
- **§5 Spacing** — base 4 px, `--space-1` … `--space-9`. The canvas's values round onto it.
- **§6 Layout** — `--measure` 34rem. (`--container` changes, §6 here.)
- **§7 Responsive** — mobile-first, `--bp-wide` 48rem, `--bp-full` 64rem.
- **§8 Icons** — inline SVG, never emoji, no icon font.
- **§9 Photographs** — ratio tokens, `astro:assets`, lazy below the fold only, no text baked into an
  image. **The ratio values change** to the canvas's: `--ratio-card` 7/5, `--ratio-portrait` 4/5, and
  the hero has a minimum height instead of a ratio, because it bleeds to the viewport edge.
- **§10 Checks** — no raw colour outside the token file, no spacing off the scale, and contrast
  asserted. **The contrast check changes its subject:** it composited ADR 0004's five gradient stops,
  and there is no gradient now. It asserts the pairs in §3 instead — each text token against each
  surface it is allowed on — and fails if a forbidden pairing appears in a component.
- **The `rem` rule** — no size in `px` except hairlines, radii and the subset of the mark's SVG
  geometry.

### 10. What this ADR does not decide

- **Pages, URLs, navigation targets and locales** — ADR 0003, ADR 0005, ADR 0008. The canvas labels
  pages *Angebot*, *Über uns*, *Studio* and *Kontakt*. Those are labels for routes ADR 0008 already
  fixes, not new addresses.
- **Business facts** — prices, opening hours, services. The canvas shows placeholders, and the content
  model is still the only authority (ADR 0003).
- **Legal pages** — the Impressum and the privacy policy are ADR 0007.
- **Address form** — *Sie* and *wir* (**R6**). That is recorded here because the canvas's copy depends
  on it. It is a content convention, and it is enforced by review of the dictionaries, not by a check.

**Phase gate.** This replaces the visual layer of the homepage built on 2026-07-19 (Phase 2, #4) and is
the look Phase 3's pages are built in. It depends on no still-`Planned` decision. `Accepted` will mean
**designed**: the homepage in the repository still shows the ADR 0004 look until an implementation PR
replaces it.

## Consequences

**Positive**

- The look the owner chose is written down as numbers. A session with no access to the canvas can
  implement it, and a reviewer can check an implementation against it.
- The brand pair survives a second redesign exactly, and is now used the way established studios use
  a brand colour: as accent, not wallpaper.
- Body copy moves to 16 px in weight 400, which retires ADR 0004's one knowingly accepted accessibility
  residual.
- The mark becomes something the repository can produce itself, which removes a dependency on an
  outside file (#39).
- The two contrast traps on blue are named before anyone falls into them, and the check will hold
  them.
- The image and review rules turn three legal exposures into conventions with a check point: deep fakes
  of the studio, misleading imagery, and personal data in a public repository.

**Negative / costs**

- **The homepage built in July is visually obsolete.** Its structure, content wiring and checks survive.
  Its tokens, fonts and wordmark are replaced, which is a substantial implementation PR.
- **Three font families instead of two.** The script is about 30–40 kB more to load, for a purely
  decorative role. It is subset and swapped, but it is weight that carries no information.
- **The look depends on photographs that largely do not exist yet.** The studio's own shots from about
  2016 cover the sunbeds and rooms (**R13**), but they are snapshots — small, mixed light — and do not
  carry a full-width hero. Without new photographs the cream-and-serif design reads as unfinished. That moves "obtain photographs" from a nice-to-have onto the critical path, and
  it is the owner's work, not an agent's.
- **The contrast check has to be rewritten**, not merely re-pointed: from gradient stops to a matrix of
  token-surface pairs.
- **A ChatGPT image is unprotected by copyright in Germany** (§ 2 Abs. 2 UrhG requires a human
  creation). Others may reuse it freely, which matters little for mood images but is a reason never to
  build the brand on one.
- **Reviews depend on the owner asking customers for consent.** Until someone does, the section simply
  is not there.

## Alternatives considered

- **Amending ADR 0004** — rejected. Palette, type, mark and source all change, so an amendment would
  rewrite most of an `Accepted` record and destroy the reasoning ADR 0001's immutability preserves.
- **Directions A–F** (flat orange and blue surfaces, playful forms) — rejected by the owner as childish.
- **Directions G–I** (patterned on SUNPOINT, Palm Beach Tan and Ergoline) — superseded by the owner's
  own mockups, which were closer to what the studio is: personal and local rather than a chain.
- **Direction J** — a first draft from the mockups. The owner preferred K, which follows mockup 3 more
  closely.
- **Keeping the owner's raster sun and waiting for a vector (#39)** — rejected (**R5**). A mark drawn
  here has clean provenance today.
- **AI images everywhere, including the studio** — rejected. It is a deep fake under the AI Act and
  misleading under the UWG, whatever the label.
- **Named reviews, as in the mockups** — rejected. They would put third-party personal data into a
  public repository.
- **Embedding Google reviews or a social feed** — rejected by ADR 0009 §6, and each would add a
  third-party request and cookies to every page view.

## Resolved questions (owner decisions, 2026-10-22/23)

Asked in conversation in two rounds before this PR opened, as ADR 0008 did. The answers are quoted on
the PR with date and place.

- **R1 — Body copy is 16 px, expressed in `rem`.** Owner: *„verwende 16px, nutze aber rem werte"*. So
  `--text-base` is `1rem` and the weight is 400. ADR 0004 R2 (15 px, weight 300) is superseded.
- **R2 — A handwritten script is the third family**, for short decorative phrases only, hidden from
  assistive technology. ADR 0004 had dropped its two script faces. This one is admitted because it
  carries the mockups' personal tone, under the limits in §4.
- **R3 — The blue is exactly `#C2D1ED`.** The canvas's `#C9D6EE` was drift, not a choice.
- **R4 — The bordeaux is retired.** The brand is orange and blue.
- **R5 — The line-sun drawn in this repository is the mark.** It supersedes ADR 0004 R4 (the owner's
  own sun, pending a vector source). #39 is closed by this ADR's acceptance.
- **R6 — *Sie* and *wir*.** The site addresses visitors formally and speaks as the studio, not as Iris
  in the first person, as the old site did. The mockups' *du*/*ich* is not adopted.
- **R7 — Photographs: real ones for everything that depicts the studio, AI only for mood**, each AI
  image with a provenance record, provider metadata kept (§7).
- **R8 — Reviews come from Google** — reproduced as R11 specifies.
- **R9 — The studio has social-media accounts**; which ones is open (#104).
- **R10 — AI images are made manually to start:** an agent writes the prompts, the owner generates the
  images in ChatGPT, and an agent records and integrates them. Moving to the API is a later decision. Two
  directory plugins were considered and not used: *image-generation* only writes prompts, and *Asset
  Generator* sends prompts to an unvetted third party with unclear rights.
- **R11 — Reviews: no names, with consent, the source stated, a plain link to Google, and the section
  is shown only when at least one consented review exists** (§8). The owner's first instinct was to
  copy them from Google. The conflict with `CLAUDE.md`'s personal-data rule was raised, and the owner
  chose this form.
- **R12 — The ADR fixes the rule for social links, and the accounts come from the owner as a ticket**
  (#104), rather than from a guess.
- **R13 — The studio photographs on the old site are the studio's own** (owner, 2026-10-23: *„iris hat
  die bilder selbst gemacht vor etwa 10 jahren"*). This corrects the draft of §7, which had barred every
  photograph from the old site and so contradicted `docs/analysis/06-media-inventory.md`. The owner
  pointed out the real photographs, and the rule is now the one ADR 0004 §9 actually stated: reuse with
  a record, never by default. Whether each photo still shows the studio as it is today is confirmed per
  photo in #106 rather than here.

## References

- [ADR 0001](0001-record-architecture-decisions.md) — immutability and superseding
- [ADR 0004](0004-styling-and-design-tokens.md) — superseded by this ADR; §5–§10 carried forward (§9)
- [ADR 0002](0002-tech-stack-and-tooling.md) §4, §5 · [ADR 0003](0003-content-model.md) ·
  [ADR 0005](0005-internationalisation.md) · [ADR 0008](0008-url-migration-and-redirects.md) ·
  [ADR 0009](0009-security-by-design.md) §6
- `docs/analysis/04-design-system.md` — the documented colour pair; the old site's defects of form
- `docs/fonts.md` — the self-hosting and provenance regime this ADR reuses
- Issue #103 (this ADR), #104 (social-media accounts), #39 (the sun as a vector), epic #3
- External, read 2026-10-23: [EU AI Act Art. 50](https://artificialintelligenceact.eu/article/50/);
  [OpenAI Terms of Use for Europe](https://openai.com/de-DE/policies/eu-terms-of-use/) (updated
  16 January 2026); font licences in [google/fonts](https://github.com/google/fonts) `ofl/`
