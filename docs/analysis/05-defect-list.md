# 05 — Defect List of the Old Site

Concrete defects of the current state, phrased as work packages. Intended as
source material for tickets.

Every entry can be referenced by `M-nn`. The **Source** column states how
reliable the finding is:

- **verified** — machine-checked against the WordPress export
- **observed** — read off screenshots, visual assessment

## Quotations in this file

**Anything inside quotation marks or a blockquote here is verbatim.** Where the
old site's wording is shortened, emphasised or tidied, the quotation marks come
off and the paraphrase is open about being one.

That rule had to be written down because it was broken: `M-15` quoted the
Impressum's image-rights sentence in a form nobody had ever published — words
dropped, others silently changed — while the entry was tagged **verified** and
argued a legal point about what that sentence says. `M-02` carried editorial
`**bold**` inside its quotation marks, and `M-27` replaced the site's three full
stops with a typographic ellipsis. Small on their own; together they meant the
**verified** tag could not be trusted to mean what it says.

Every quotation in this file was re-checked against
[`../content/`](../content/README.md) on 2026-07-19. All of them match except
three, which are **not** in that extract for a reason — recorded here so the next
spot-check does not re-open them as though they were findings:

| Entry | Quotation | Why it is not in `../content/` |
|---|---|---|
| `M-08` | "Mo.. – Mi..", "Sa.." | rendered widget output. The export stores the opening hours as data; this is what the plugin drew from them, and the doubled full stops are the bug. |
| `M-10` | "Email", "Message", "Absenden" | form field attributes. The extract records the contact form only as a widget, not its markup. |
| `M-20` | "Hestia \| Entwickelt von ThemeIsle" | theme chrome, not page content. |

`M-08` and `M-20` are tagged `observed`, which is exactly the distinction the
Source column exists to draw. **`M-10` is tagged `verified` and cannot be
re-checked from this repository**: it was machine-checked against the WordPress
export, and the export lives in `Archive/`, which is excluded on purpose. That is
a limit of this re-check, not a finding against the entry.

---

## Content

### M-01 — Placeholder text on five pages
**Source:** verified · **Priority:** high

Lorem ipsum placeholder text stands as page content on `/moments`, `/kosmetik`,
`/massage`, `/ton-erden` and `/zertifizierung`. On `/zertifizierung` even as a
heading ("Lorem ipsum dolor") directly above genuine specialist text on the
BfS certification.

**To do:** Write the texts editorially. Affects above all the Moments area;
the services and prices are known, what is missing are the explanatory texts.

### M-02 — "im Aufbau" notices with date stamp
**Source:** verified · **Priority:** high

Six pages carry a construction notice, two of them with a date — **the dates are
the point**, and they are the site's own:

> Diese Seite befindet sich seit Januar 2018 im Aufbau.

on `/zertifizierung`, and

> Diese Seite befindet sich seit Juli 2019 im Umbau.

on `/moments`. That exposes the standstill.

On `/honig` the notice appears even though the page has complete content.

**To do:** Remove the notices. Either finish the pages or do not publish them
at all.

### M-03 — Outdated promotions in the shop window
**Source:** verified · **Priority:** high

Under "Sonderaktionen" the home page advertises posts from 2019 and 2020,
among them a "Juni Highlight" dated 2019-06-01. The same embed is found
on the price page.

**To do:** Replace the embed. Either maintained, dated promotions or remove it
without replacement.

### M-04 — Unfulfilled promise in the oldest post
**Source:** verified · **Priority:** medium

The post "Neuer Webauftritt" of 2017-12-22 announces that the site will be "in
den kommenden Tagen und Wochen mit Leben gefüllt".

**To do:** Do not carry the post over.

---

## Function

### M-05 — 15 of 20 anchors lead nowhere
**Source:** verified · **Priority:** high

The service tiles on the home page link to anchors on the price page, but with
wrong IDs. 20 anchor links were checked; only 5 have a target.

| Linked | Exists |
|---|---|
| `#naturkosmetik` (3×) | no — it is called `#moments-naturkosmetik` |
| `#solarium` (3×) | no — it is called `#sunshine` |
| `#massagen` (3×) | no — it is called `#moments-massagen` |
| `#wellness-paket` (2×) | no — it is called `#moments-wellness-pakete` |
| `#wellness` (1×) | no |
| `#freundinnen-wellness-paket` (3×) | no — it is called `#moments-freundinnen-wellness-pakete` |

Within a tile only the text link "Zu den Preisen..." works; image and title of
the same tile lead nowhere.

**To do:** In the rebuild, generate anchors from the category IDs so that
target and reference cannot drift apart. See
[03-services-and-prices.md](03-services-and-prices.md).

### M-28 — Four links to pages that never existed
**Source:** verified · **Priority:** high

The home page and "Über uns" link to `/ueber-uns/sonnenstudio` and
`/ueber-uns/kosmetikstudio`. **Neither page exists anywhere in the export**
— neither as a page nor as a post.

| Location | Link text | Target |
|---|---|---|
| Home page, "Sunshine" tile | Image/title | `/ueber-uns/sonnenstudio` |
| Home page, "Moments" tile | Image/title | `/ueber-uns/sonnenstudio` |
| Über uns, Solarien paragraph | "hier" | `/ueber-uns/sonnenstudio` |
| Über uns, Moments paragraph | "hier" | `/ueber-uns/kosmetikstudio` |

In addition a mix-up: the **"Moments"** tile on the home page likewise points
to `sonnenstudio` instead of to a cosmetics target.

Further dead links in the existing content: `/test1` and
`/sonderaktion-weihnachten-2018` (both from the draft page "Spielewiese", which
is dropped anyway) as well as `/leistungen-und-preise/embed` and
`/ueber-uns/kosmetikstudio` from blog posts.

**To do:** In the rebuild, link to the pages that actually exist
(`/sunshine`, `/moments`). Together with M-05 these are the two places where
the old site systematically sends its visitors nowhere — a link check belongs
in the build pipeline.

### M-06 — Zero-width space in anchor and heading
**Source:** verified · **Priority:** medium

The heading "Moments - Massagen" and the corresponding anchor
`#moments-massagen` contain an invisible character (U+200B) at the end.
Reference and target do match character for character, but that is fragile.

The same character stands in the address on the home page ("Herxheim bei
Landau​ (Pfalz)").

**To do:** When transferring the texts, check for control characters and remove
them.

### M-07 — Certification page not reachable via the navigation
**Source:** verified · **Priority:** medium

`/zertifizierung` hangs correctly as a subpage under "Über uns", but no entry
for it exists in the menu tree. The page can only be found via inline links.

**To do:** In the rebuild, add it to the navigation or integrate it into
"Über uns".

### M-08 — Opening hours widget shows double periods
**Source:** observed · **Priority:** medium

The widget renders the weekdays as "Mo.. – Mi..", "Do.. – Fr..", "Sa..",
"So..". Visible on every page with a sidebar.

**To do:** Goes away with the plugin. In the rebuild, model the opening hours
as data.

### M-09 — Two-column layout does not wrap on mobile
**Source:** observed · **Priority:** medium

On `/honig` image and text column stay side by side on mobile devices. The
text column is squeezed to about 130 px, the heading breaks in mid-sentence.

### M-10 — Contact form without validation and with mixed languages
**Source:** verified · **Priority:** medium

The email field is declared as `type="text"` instead of `type="email"`, so
without browser validation. The placeholders are partly English ("Email",
"Message"), the button German ("Absenden"). Visible labels are missing — the
`<label>` elements are empty, there are only placeholders.

**To do:** In the rebuild, correct field types, consistently German labelling,
real labels (not just placeholders, that is an accessibility problem) and
effective spam protection.

### M-11 — Spam volume of the old form
**Source:** verified · **Priority:** high

Between 2017 and 2021 the Pirate Forms form collected **2,216 submissions**,
overwhelmingly spam, and stored them in the database together with email and IP
addresses.

**To do:** In the rebuild, no server-side storage of submissions. Sending by
email suffices. Provide spam protection without cookies.

---

## Legal

### M-12 — Privacy policy at pre-GDPR state
**Source:** verified · **Priority:** high

The Impressum contains a Google Analytics section with the wording
"Durch die Nutzung dieser Website erklären Sie sich mit der Bearbeitung der über
Sie erhobenen Daten … einverstanden". That is the consent model from before
2018.

Furthermore: privacy policy and Impressum stand on one page; the policy
consists of three paragraphs and covers neither legal bases nor data subject
rights, storage periods or processors.

**To do:** Separate, up-to-date privacy policy. Have it reviewed legally before
going live.

### M-13 — No cookie banner despite Google Analytics
**Source:** observed · **Priority:** high

On none of the 15 screenshots is a consent banner visible, while the Impressum
describes Google Analytics. Possibly clicked away while taking the screenshots
— to be checked.

**To do:** In the rebuild, manage without consent-requiring services if
possible, then the banner is unnecessary. If statistics are wanted, choose a
cookie-free solution.

### M-14 — Google Maps embedded without consent
**Source:** verified · **Priority:** high

The home page embeds Google Maps directly as an iframe. As a result data flows
to Google when the page is called up, without prior consent.

**To do:** Static map graphic with a link, or load the map only after an active
click.

### M-15 — Image rights not documented
**Source:** verified · **Priority:** high

The Impressum states, verbatim:

> Alle auf dieser Webseite präsentierten Bilder sind entweder von der Webseite
> https://pixabay.com/ und somit unter dem CC0 veröffentlicht oder eigene Fotos.

So: every image is either from Pixabay and therefore published under CC0, or one
of the owner's own photos. Which image belongs to which category is recorded
nowhere.

**To do:** Clarify before reuse. See
[06-media-inventory.md](06-media-inventory.md).

---

## Text and Consistency

### M-16 — Recurring grammatical error in headings
**Source:** verified · **Priority:** low

"Unser Wellnessprodukte" (`/moments`), "Unser Kosmetikprodukte" (`/kosmetik`),
"Unser Massageangebote" (`/massage`) — in each case "Unser" instead of "Unsere".

### M-17 — Inconsistent spellings
**Source:** verified · **Priority:** low

- "Ton Erden" (page title) vs. "Tonerden" (heading)
- "Honig Massage" (heading) vs. "Honigmassage" (body text)
- Phone number as "+49 (0)7276 50 50 550" (Impressum) vs. "07276 / 5050550"
  (blog post)
- Brand name with straight vs. typographic apostrophe

**To do:** Fix the spellings and unify them during the transfer.

### M-18 — Typos
**Source:** verified · **Priority:** low

"staffender Maske" (meant: straffender), "Kostemtik" in several post excerpts,
"Highligt", "hygiensch".

### M-19 — Raw URL as link text
**Source:** verified · **Priority:** low

On `/prowin`, `http://www.prowin.net/cms/aktuelle-aktionen.htm` stands as
visible link text — unencrypted and wrapping across two lines.

### M-20 — Theme credit instead of copyright
**Source:** observed · **Priority:** low

The footer carries as its only footer line "Hestia | Entwickelt von ThemeIsle".
A copyright notice of its own is missing.

---

## Design and Accessibility

### M-21 — Image motifs with no relation to the offering
**Source:** observed · **Priority:** medium

On the price page a sea bay, beach chairs and a fantasy ruins illustration
illustrate the solarium categories — three image styles side by side, none of
them with any relation to the studio. The hero of the same page shows vintage
stationery with dried flowers.

"Über uns" shows dark mannequin torsos — for the page about a personally run
studio the most unsuitable motif imaginable.

### M-22 — Gradient hero looks like a missing image
**Source:** observed · **Priority:** medium

Impressum, certification and one blog post show, instead of a photo, the CSS
gradient from grey-blue to yellow (`#c2d1f0 → #ffc000`, set in the custom CSS).

### M-23 — Contrast problems
**Source:** observed · **Priority:** medium

- On the blog post "Neuer Webauftritt" the white meta line with the date stands
  on the brightest point of the hero image and is practically unreadable
- Helper texts of the construction notices in very light grey on white — likely
  falls below WCAG AA
- Hero titles on light images (`/ton-erden`, `/honig`, `/ueber-uns`) with
  insufficient text shadow
- Links are marked by colour alone, without underlining

### M-24 — Inconsistent padding
**Source:** observed · **Priority:** low

The left text start varies noticeably from page to page. The cause is the
mixture of theme container and Elementor sections with their own paddings. In
addition there are two different sidebar grids, one for pages and one for blog
posts.

### M-25 — No call button on mobile devices
**Source:** observed · **Priority:** medium

The mobile header contains only the wordmark and the burger menu. For a local
studio whose appointments are arranged by phone, this means the most obvious
course of action is missing.

### M-26 — Most important page without content in the first screen
**Source:** observed · **Priority:** medium

On `/leistungen-und-preise`, after a full screen on mobile not a single price
is visible yet — header, hero, empty space, introductory text. On six further
pages the first screen consists of header, hero, empty space and construction
notice.

### M-27 — No maximum width
**Source:** observed · **Priority:** low

The layout runs fluid up to at least 1568 px without an effective limit. Lines
of text become very long on large monitors.