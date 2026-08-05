# 01 — Starting Point

## The Studio

Iris' Sunshine Oase, tanning and cosmetics studio in Herxheim bei Landau (Pfalz).
Owner Iris Zellner, taken over in February 2013. Since November 2016 expanded by
the cosmetics studio „Moments" (natural cosmetics, massages).

Master data for Impressum and contact:

```
Kosmetik- & Sonnenstudio Iris' Sunshine Oase
Inh. Iris Zellner
Offenbacher Str. 2
76863 Herxheim bei Landau (Pfalz)
Telefon: +49 (0)7276 50 50 550
USt-ID:  DE276633210
```

The email address is deliberately not in this documentation — see the data
protection note in the [README](README.md).

## Technical State of the Old Site

| | |
|---|---|
| CMS | WordPress **5.8.13** (outdated, End of Life) |
| Theme | **Hestia** (ThemeIsle) with Custom CSS |
| Page Builder | **Elementor 3.4.6** |
| Hosting | netcup |
| Language | de |

### Plugins in Use

Recognisable from the traces in the export:

- **Elementor** — page construction; 10 saved templates in `elementor_library`
- **Orbit Fox** (ThemeIsle) — supplies `obfx-posts-grid` (post tiles),
  `obfx-pricing-table` and `content_form_contact` (contact form)
- **Pirate Forms** — older contact form; stored the submissions as
  post type `pf_contact` in the database
- **Opening Hours** — opening hours as post type `op-set`, output via the
  widget `widget_op_overview`
- **Google Analytics** — described in the Impressum, with a consent text
  from the time **before** the GDPR
- **Yoast SEO** and **All in One SEO** — metadata from both plugins is present
  in the pages, so they ran in parallel or one after the other

### Custom CSS

Contains essentially workarounds that fall away without replacement in the rebuild:

- self-built tables via `div.my-table` with `display: table` — because the
  page builder could not do usable tables
- pseudo tags `<upper>` and `<lower>` for upper/lower case, used in the menu for
  the spelling „proWIN"
- helper classes for absolute positioning and shadows
- a background gradient `header-filter-gradient` from `#c2d1f0` to `#ffc000` —
  this is the grey-blue-to-yellow gradient that appears as a hero on three
  pages and there looks like a missing image

## Data Situation in the Backup

The folder `Archive/` contains three components:

### 1. WordPress Export (XML)

Complete WXR export from 2026-07-18. After cleanup it contains
**576 items**:

| Post Type | Count | Content |
|---|---|---|
| `attachment` | 504 | media library entries |
| `post` | 19 | blog posts |
| `nav_menu_item` | 17 | menu structure |
| `page` | 14 | pages |
| `op-set` | 11 | opening hours sets (seasons) |
| `elementor_library` | 10 | reusable layout building blocks |
| `custom_css` | 1 | theme customisations |

The export contains the Elementor layout data as JSON in the post meta
`_elementor_data`. It holds both the texts and the complete page
construction — it is therefore the most reliable source for the content.

### 2. Media Holdings

Two separate collections, around 750 MB in total. Details and recommendation on
storage in [06-media-inventory.md](06-media-inventory.md).

### 3. Screenshots

69 captures (3.3 MB) of the state as of 2026-07-18, in four variants:
desktop and mobile, each as a viewport section and as a full page. In addition,
segment captures of the home page and the pricing page.

Useful as a visual reference, but with limitations: the
viewport captures show only the first screen, the full-page captures
are heavily scaled down and hard to read, and the segment captures do not cover
the pages without gaps. For content, the XML export is the better source.

## Current State of the Live Site

The site is reachable and functional. In terms of content it stands at the state
of **May 2020** — the last blog post is from 2020-05-09, before that a
Corona statement. The opening hours, by contrast, were maintained up to
**winter 2024/25**.

It follows that: the business is running, only the bare minimum was maintained.
The decay is editorial, not technical in nature.

## Assessment for the Rebuild

The site is not a restoration case, but a **completion case**. In 2017/18
a viable structure was built and afterwards never finished: five
pages contain placeholder text to this day, six carry a „Diese Seite befindet sich derzeit im Aufbau." notice,
partly with a date stamp from January 2018.

In terms of content there is enough substance to build a complete site
from it — above all the price list, the descriptions of the tanning beds and the
about-us texts. What is missing is manageable and can be solved editorially.

Against continuing with WordPress speaks the operating effort: WordPress,
Elementor and four plugins would have to be kept up to date permanently, for
functions that a site that is static at its core does not need. The 2,216
spam submissions in the contact form show what an unsupervised setup
produces over the years.
