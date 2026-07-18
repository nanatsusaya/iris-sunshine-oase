# 02 — Content Inventory

All pages and posts of the old site with an assessment for the rebuild.
Details read out of the WordPress export.

Legend:

- **Keep** — content is usable, carries over largely unchanged
- **Rework** — substance is there, needs editorial additions
- **Rewrite** — practically no usable content
- **Drop** — removed without replacement

## Pages

| Page | Path | ID | State | Assessment |
|---|---|---|---|---|
| Iris' Sunshine Oase (Start) | `/` | 15 | Complete, Elementor | **Keep** |
| Leistungen & Preise | `/leistungen-und-preise` | 83 | Complete, maintained | **Keep** |
| Sunshine | `/sunshine` | 74 | Complete | **Keep** |
| Über uns | `/ueber-uns` | 283 | Complete | **Keep** |
| Impressum | `/impressum` | 131 | Complete, but legally outdated | **Rework** |
| Kontakt | `/kontakt` | 132 | Brief, functional | **Rework** |
| Zertifizierung | `/zertifizierung` | 1557 | Real subject-matter text + placeholder text | **Rework** |
| Honig | `/honig` | 2249 | Real content, wrongly marked as under construction | **Rework** |
| Moments | `/moments` | 77 | Introduction real, rest placeholder text | **Rework** |
| Ton Erden | `/ton-erden` | 2201 | Partly real, partly placeholder text | **Rework** |
| Kosmetik | `/kosmetik` | 2187 | Service list real, rest placeholder text | **Rework** |
| Massage | `/massage` | 2191 | Mostly placeholder text | **Rewrite** |
| proWIN | `/prowin` | 285 | 750 characters, points to an external site | **Clarify** |
| Spielewiese | (draft) | 429 | Elementor playground, pure placeholder text | **Drop** |

### Notes

**Structure:** "Moments" is the parent page of Kosmetik, Massage, Ton Erden and
Honig. "Über uns" is the parent page of Zertifizierung.

**Zertifizierung is unreachable.** The page exists and is correctly attached
under "Über uns", but no entry for it is set up in the menu tree — verified
via the `nav_menu_item` data. It can only be found through inline links in the text.

**The certification text is valuable in substance**, despite the placeholder text
around it: in 2008 the studio was certified for three years by the Bundesamt für
Strahlenschutz; the certification has not been offered since then, and according
to the text the standards continue to be met. That is a trust argument
and should be preserved — but worded carefully, because an expired
certification must not be presented as a current one.

**proWIN** is a direct-sales business for cleaning and wellness products that the
studio runs on the side. The page consists of two paragraphs and a raw
external URL. To be clarified before the rebuild: is this still active? If so, it
belongs properly integrated; if not, drop it without replacement.

**Spielewiese** is a draft with slug `/` — an Elementor test page with
placeholder text and example price tables. Without value.

## Blog Posts

19 posts, all between December 2017 and May 2020.

| Period | Count | Type |
|---|---|---|
| 2017 | 2 | Welcome post "Neuer Webauftritt", Christmas promotion |
| 2018 | 5 | Special promotions, 5-year anniversary with prize draw |
| 2019 | 9 | "Kosmetik des Monats" series, winter opening hours |
| 2020 | 3 | Corona statement, reopening, Kosmetik des Monats Mai |

### Assessment

The posts are **expired promotions**. "Kosmetik des Monats Mai" from 2019
and 2020, Christmas offers from 2017 and 2018, a 2018 prize draw with
its own terms-of-participation page. None of it is still valid today.

Two posts are actively harmful if they stay online:

- **"Neuer Webauftritt"** (2017-12-22) announces that the site will "be filled
  with life over the coming days and weeks". Eight years later this reads
  as an unkept promise.
- **The Corona statement** (2020-03-15) and the reopening notice
  (2020-05-09) are visibly outdated and make the site look dead.

**Recommendation:** do not carry the blog over into the rebuild. The post structure
as such makes sense — for "Kosmetik des Monats" and seasonal promotions —, but it
should start empty. If an archive is wanted, it belongs behind a
clear dating and not on the home page.

Important for the rebuild: on the **home page** and on the **price page** these
posts are currently embedded as "Sonderaktionen". The home page thereby
prominently advertises a "Juni Highlight" from 2019. This embedding must be
replaced — either by maintained promotions or without replacement.

## What Is Missing in Terms of Content

For a complete new site, the following would have to be added editorially:

1. **Moments area** — Kosmetik, Massage, Ton Erden need real
   descriptive texts. The services and prices are known (see
   [03-leistungen-und-preise.md](03-leistungen-und-preise.md)), what is missing is the
   explanatory text around them.
2. **Current opening hours** — the stored data sets are from 2024,
   and two summer sets exist with differing Sunday hours. Before
   going live, check against the owner.
3. **Team introduction** — "Unser Team" exists as a heading with a
   general paragraph, without any people.
4. **Current prices** — the price list is complete, but its date is
   unknown. Have it confirmed before keeping it.
5. **Privacy policy** — see [05-maengelliste.md](05-maengelliste.md);
   the existing one predates the GDPR.
