# Direction K — design reference

The six artboards of **direction K**, the look [ADR 0010](../../adr/0010-visual-design-refresh.md)
decided, copied from the owner's private design canvas *„Iris Sunshine Oase – Redesign 2"* on
2026-10-23, unchanged. They are here because the canvas is not: an agent working a ticket has this
repository and nothing else, and ADR 0010 states every value but not every layout.

## Read these first

- **Reference, not source.** Where an artboard and ADR 0010 disagree, the ADR governs (§1). An
  implementation is built from the tokens and components, never by copying markup from these files.
- **The content is placeholder.** `[Preis]`, `[Zeiten]` and `[Name]` mark facts that come from the
  content model (ADR 0003). Each „Bildmotiv: …" panel is a photograph that does not exist yet (ADR 0010
  §7, #106). The review cards show the layout of a section that ships only when consented reviews
  exist (§8). The telephone number, address and e-mail are the real ones, but the built site reads them
  from `src/content/business.yaml`, not from here.
- **Two known drifts, both overruled by the ADR:**
  - the bands use `#C9D6EE`, but the token is the brand blue **`#C2D1ED`** (R3);
  - body copy is 15 px, but the decision is **`1rem`** (R1).
- **The Google Fonts `<link>` is a mockup convenience.** The site self-hosts its fonts and loads nothing
  from a third party (ADR 0009 §6). This folder is not built, so `check:external` never sees it.
- **The phone and e-mail glyphs are filled gold here.** ADR 0010 §3 allows ornament colour only for
  decoration, so wherever an icon carries meaning on its own it uses a text colour.

## The artboards

| Artboard | Screenshot | Page | Route (ADR 0008) |
|---|---|---|---|
| [`Start-K-Mockup3.dc.html`](Start-K-Mockup3.dc.html) | [webp](Start-K-Mockup3.webp) | Homepage | `/` |
| [`K-StartMobil.dc.html`](K-StartMobil.dc.html) | [webp](K-StartMobil.webp) | Homepage at 390 px | `/` |
| [`K-Angebot.dc.html`](K-Angebot.dc.html) | [webp](K-Angebot.webp) | Services and prices | `/leistungen-und-preise/` |
| [`K-Studio.dc.html`](K-Studio.dc.html) | [webp](K-Studio.webp) | Sunbeds, cabins, FAQ | `/sunshine/` |
| [`K-UeberUns.dc.html`](K-UeberUns.dc.html) | [webp](K-UeberUns.webp) | About | `/ueber-uns/` |
| [`K-Kontakt.dc.html`](K-Kontakt.dc.html) | [webp](K-Kontakt.webp) | Contact, directions, legal | `/kontakt/` |

The navigation labels on the artboards are *Angebot*, *Über uns*, *Studio* and *Kontakt*. They label the
routes ADR 0008 fixes and are not new addresses (ADR 0010 §10).

## Opening them

The `.dc.html` files are the canvas's own format: plain HTML with inline styles, wrapped in an `<x-dc>`
element. A browser renders them directly from disk. The `support.js` they reference belongs to the
canvas and is absent here, which changes nothing in what they show.

## Provenance of the screenshots

The `.webp` files are not photographs. They are renderings of the `.dc.html` files beside them, made on
2026-10-23 with headless Chrome at 1440 px (390 px for the phone artboard). The empty page background
was trimmed below the footer, and the result was encoded as WebP (quality 72) with `sharp`. They show
nothing the HTML does not, and they are regenerated rather than edited if an artboard changes.

The artboards themselves were drawn by an agent in the owner's design sessions of 2026-10-22/23,
working from the owner's own ChatGPT mockups. None of those mockups' content was carried over.
