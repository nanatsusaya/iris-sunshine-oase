# 04 — Design System of the Old Site

Recorded from the screenshots of 2026-07-18. **All colour, size and spacing
figures are visual estimates**, not values read out of the stylesheet. Intended
as a reference point for the design direction, not as a
specification.

The only exactly documented colour figure comes from the Custom CSS in the export:
the hero gradient `#c2d1f0 → #ffc000`.

## Colours

| Role | Value (estimated) | Usage |
|---|---|---|
| Accent orange | ~`#F5A623` | Links, active menu item, phone number, „Zu den Preisen…" |
| Button orange | ~`#FF9800` – `#F57C00` | Search button, category badges |
| Headings | ~`#3C4858` | all H1–H4 in the content (blue-tinged anthracite, Hestia default) |
| Body text | ~`#55595C` – `#767676` | Paragraphs |
| Helper text | ~`#9A9A9A` | Subtexts, dates — low contrast |
| Surfaces | `#FFFFFF` | Header, content card |
| Section change | ~`#F5F5F7` | individual sections with a light grey background |
| Footer | ~`#2D3436` – `#333` | dark anthracite block |

The sun colour world in orange and amber is the load-bearing idea and fits the
name. It should be retained.

## Typography

Throughout, a sans-serif grotesque with a Roboto character — presumably Roboto
itself, which is the Hestia default.

| Level | Size (estimated) | Styling |
|---|---|---|
| Hero H1 | ~40–42 px | Bold, white, centred, text shadow |
| Section H2 | ~30–32 px | Semibold, centred |
| H3 | ~24–26 px | left-aligned |
| Body text | ~16–17 px | Line height ~1.5 |
| Menu | ~11–12 px | Uppercase, slight letter spacing |

The hero title does not scale with the text length — long titles keep the same
size and run right up to the edge.

## Layout

**The defining element is Hestia's `main-raised`:** The entire content sits on
a white card that overlaps the hero upwards by about 50 px, with a soft drop
shadow and minimally rounded corners. On the left and right about 24 px of
margin remain, through which the page background shows.

Further characteristics:

- **Cards** with a soft, diffuse shadow (Material Design look), radius
  ~4–6 px. The card image sits slightly offset upwards and carries its own,
  stronger shadow — a characteristic detail.
- **Buttons** with a coloured drop shadow in the button colour.
- **Form fields** in Material style: no border, only an underline.
- **Spacing** is produced via explicit Elementor spacer widgets, not
  via CSS margins. Between practically every section there is a separate
  spacer as a full-width section.
- **Grid:** three-column for cards (33 % each), two-column for image-text blocks
  (50/50), single-column for body text.
- **No effective maximum width** — the layout runs fluid up to at least
  1568 px, text lines become very wide on large monitors.

## What should be kept

- The **warm sun colour world** in orange/amber as an accent
- The **generous photo heroes** as the page entry point
- The **card structure** for services and prices — sensibly structured in terms
  of content, only poorly implemented technically
- The **clear section structure** of the home page

## What should be discarded

**The gradient hero.** On Impressum, Zertifizierung and one blog post, the CSS
gradient from grey-blue to yellow appears instead of a photo. It looks like a
missing image and breaks the colour world. Either an image everywhere or
a deliberately designed surface everywhere.

**The serif style break.** The „im Aufbau" notice boxes and the
footer headings are set in a serif typeface, everything else
sans-serif. Without discernible intent.

**The Material Design look of 2017.** Overlapping card, coloured
button shadows, underline form fields — that dates the site immediately.

**Fluid without a maximum width.** Limit to a reading width of about 65–75 characters.

**Spacing via spacer elements.** Belongs in a spacing system in CSS.

## Brand Presence

**There is no logo.** The header carries only the wordmark „Iris' Sunshine Oase"
in the system font, without a graphic mark and without a claim.

The media library does contain files with logo names (`Logo.png`, `logo2.png`,
`logo3.png`, `logo4.png`, `Logo-Sun.svg`, `favicon.ico`), but:

> **`Logo-Sun.svg` is not a vector logo.** The file is an SVG container into
> which a 500 × 500 px PNG was embedded as Base64. It therefore does not
> scale losslessly.

For the rebuild this means: a real vector logo has to be created anew, if
one is wanted. The existing PNGs can serve as a template.

A minor aside: the brand name is written inconsistently — in the header
with a straight apostrophe, in the hero with a typographic one. Settle on one
spelling for the rebuild. Recommendation: `Iris’ Sunshine Oase` with a typographic
apostrophe.

## Navigation

Menu structure of the old site:

```
HOME
LEISTUNGEN & PREISE  ▾  (Submenu: Sonderaktionen)
SUNSHINE
MOMENTS              ▾  (Submenu: Kosmetik, Massage, Ton Erden, Honig)
ÜBER UNS                (Zertifizierung subpage missing from the menu)
proWIN
BEITRÄGE
[Phone icon]  [Search icon]
```

Notes:

- „proWIN" is the only item that breaks the uppercase convention (forced via the
  CSS pseudo tags `<lower>`/`<upper>`)
- The active menu item is not highlighted on subpages and in the blog
- The export contains two unused menu entries with **Hestia demo data**:
  `1-800-123-4567` and `friends@themeisle.com`. They do not appear in the header,
  but they exist.
- There is **no call to action** in the header — neither an appointment request nor
  a call button. For a local studio a direct call button is an obvious choice,
  especially on mobile devices.
