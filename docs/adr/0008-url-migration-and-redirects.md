# ADR 0008 — URL migration and redirects from the old site

- **Status:** Proposed
- **Date:** 2026-09-20
- **Depends on:** [ADR 0006](0006-deployment-preview-hosting.md) §1 (GitHub Pages serves the live
  site — static files, no server, no response headers) and §6 (the cutover, which is when this ADR
  is executed), [ADR 0005](0005-internationalisation.md) §1–§2 (the German URL tree is unchanged and
  every page's slugs live in one route map), [ADR 0002](0002-tech-stack-and-tooling.md) §1 (static
  output, no adapter) and §5 (checks over rules)

## Context

Thirty-two addresses of the old site are indexed today, and a nine-year-old local business has
accumulated search ranking against them; existing links point at them from directories, social
profiles and customers' bookmarks. The go-live epic (#7) names those two assets as the ones the
project did not create and cannot rebuild, and its Definition of Done requires that *all 32 old URLs
resolve or redirect, verified by request*. This ADR decides how.

**What the 32 addresses are, and how that was established.** The generated inventory
[`docs/content/urls-and-redirects.md`](../content/urls-and-redirects.md) lists every published page
and post from the WordPress export. Until 2026-09-20 it listed six of them wrongly — the generator
built each path from the slug, but WordPress page permalinks are hierarchical (`kosmetik` under
`moments` is `/moments/kosmetik/`) and the front page's slug is not its URL. The defect was found by
fetching the live site's own `sitemap.xml` and the pages' `rel="canonical"` tags and comparing; the
generator now reads the permalink the export records, and the regenerated list is identical to the
live sitemap, 32 for 32 (#86). The lesson is written here because it is the lesson of this whole ADR:
**the authority for an old URL is what the old server served and search engines indexed — never a
reconstruction.** Everything below was checked against the live site on 2026-09-20.

The 32 break down as **13 pages** — `/`, `/leistungen-und-preise/`, `/sunshine/`, `/moments/` and
its four children, `/ueber-uns/` and its child `/ueber-uns/zertifizierung/`, `/kontakt/`,
`/impressum/`, `/prowin/` — and **19 posts**, all expired promotions and announcements from
2017–2020 ([`02-content-inventory.md`](../analysis/02-content-inventory.md) recommends not carrying
the blog over). The old server additionally *answers* addresses that are not in the inventory: the
flat aliases of the five child pages (`/kosmetik/` returns 200 with a canonical to
`/moments/kosmetik/`), `/iris-sunshine-oase/` (already a 301 to `/`), the WordPress side channels
(`/feed/`, `/category/…/`, `/author/…/`, `/?p=83`) and 505 media files under `/wp-content/uploads/`.

**What the new host can and cannot do — the constraint that shapes everything.** ADR 0006 chose GitHub
Pages, which serves static files and offers **no server-side redirects**: no `301`, no `410`, no
rewrite rules, no query-string matching. What it does offer is a custom `404.html`, served with a
real `404` status. Astro's `redirects` configuration, in static output without an adapter, emits an
HTML page per redirect with `<meta http-equiv="refresh" content="0;url=…">`; a status code cannot be
set and would not be honoured. That page's exact shape was **measured on 2026-09-20**, not read from
a changelog: it carries the instant refresh, its own `noindex`, an absolute `rel="canonical"` to the
target built from `site` (so it obeys ADR 0006 §5's gate), and a visible link for anyone whose browser
does not follow the refresh. Google's documentation orders redirect methods by how reliably it
interprets them — server-side first — and states that it **treats an instant `meta refresh` as a
permanent redirect** and a delayed one as temporary; JavaScript redirects are the last resort because
rendering can fail. The instant meta refresh is therefore the strongest signal this host can send,
and it is a real one.

ADR 0005 has already fixed the other half of the picture: the German URL tree is **unchanged** by the
locale split (§1), the English tree is new and has no old URLs, and every page's slugs live in one
route map (§2). ADR 0006 §6 already lists "the old URLs redirect (ADR 0008)" among the things verified
at cutover by fetching, and its rollback — set the `A` records back — is what makes a mistake here
recoverable in minutes rather than permanent.

## Decision

### 1. Every surviving page keeps its old URL exactly, so most of the 32 need no redirect at all

The strongest way to preserve a URL is not to change it. Every page that survives the content
assessment is served at the **same path the old site indexed** — `/leistungen-und-preise/`,
`/moments/kosmetik/`, `/ueber-uns/zertifizierung/`, and so on — with the trailing slash the old
permalinks carried, which `build.format: 'directory'` produces and GitHub Pages serves. A page that
keeps its address needs no redirect, cannot get one wrong, and passes on its ranking without a hop.

This means the German slugs in ADR 0005's route map **are the old permalinks**, hierarchy included.
Whether the section is still called *Moments* on the new site is a wording question for the owner
(**O3**); the URL is decided here, and a later rename of the section produces a redirect, not a
different starting point.

### 2. What changes address is redirected with an instant meta refresh; what is gone gets a real 404

Two outcomes exist for an old URL whose page does not survive at that address, and the choice between
them follows one rule: **redirect where there is a successor page a visitor would recognise as the
thing they were looking for; otherwise answer `404` honestly.**

- **Redirect** — Astro `redirects`, one entry per old path, instant meta refresh to the successor.
  Applies to a page that moved, and to a post whose subject lives on in a page: a promotion for a
  service sends the visitor to the page that lists that service today.
- **`404`** — the custom error page (§4). Applies to content with no successor: an announcement from
  2017, a prize draw's terms, a statement about a pandemic. Redirecting those to the homepage would
  be what Google calls a soft 404 — a "found" answer for something that is not there — and it teaches
  the index nothing except that the site is evasive. `410 Gone` would be the precise answer and the
  host cannot send it; `404` is the honest one it can.

There is deliberately **no third outcome**: no catch-all to the homepage, no "redirect everything
somewhere". Every old URL is in exactly one of three states — *kept*, *redirected to X*, or *gone* —
and that state is written down (§3).

### 3. The mapping is decided here and lives in one module, and a check holds the build to it

**The decision table.** For the 13 pages, assuming the content assessment's *keep* and *rework*
verdicts and the recommended defaults of O1–O3 below:

| Old URL | State | Because |
|---|---|---|
| `/` | kept | — |
| `/leistungen-und-preise/` | kept | — |
| `/sunshine/` | kept | — |
| `/ueber-uns/` | kept | — |
| `/ueber-uns/zertifizierung/` | kept | `M-07`'s unreachable page becomes reachable *and* keeps its address |
| `/kontakt/` | kept | — |
| `/impressum/` | kept | `de`-only per ADR 0005 R3; content reworked per ADR 0007 |
| `/moments/` | kept | O3 |
| `/moments/kosmetik/` `/moments/massage/` `/moments/ton-erden/` `/moments/honig/` | kept | O3 |
| `/prowin/` | **O2** | kept if the business is still active; `gone` if not |

For the 19 posts, under **O1**'s recommended default (the blog is not carried over):

| Old URL | State |
|---|---|
| `/winter-oeffnungszeiten-2019-20/` | → the opening-hours section of `/` |
| `/kosmetik-des-monats-{februar,maerz,april,mai,mai-2020}/`, `/juni-highlight/`, `/sonderaktion-{weihnachten-2017,januar-2018,winter-2018,weihnachtsangebot-2018,januar-2019,maerz-2019}/` | → `/leistungen-und-preise/` — promotions for services that page lists |
| `/rework-von-moments/` | → `/moments/` |
| `/neuer-webauftritt/`, `/5-jahre-jubilaeum-mit-gewinnspiel/`, `/teilnahmebedingungen-gewinnspiel-01-02-2018/`, `/stellungnahme-zur-corona-covid-19-virus-zeit/`, `/hurra-wir-duerfen-wieder-fuer-sie-da-sein/` | gone (`404`) |

Plus **six courtesy redirects** for addresses the old server answered although it never indexed them:
`/iris-sunshine-oase/` → `/` (today a 301 on the old server) and the five flat child aliases
`/kosmetik/` `/massage/` `/ton-erden/` `/honig/` `/zertifizierung/` → their hierarchical page.
They are free, they cannot be wrong, and somebody may have typed one into a listing in 2018.

**Where it lives.** One typed module — `src/redirects.ts` or equivalent — holding every old path with
its state, read by `astro.config.ts` (`redirects:` is generated from the *redirected* entries) and by
the check below. It is the authority; this table is the decision that put it there, and the generated
inventory in `docs/content/` is the *input* — the list of what existed — whose `New URL` column
therefore goes: the generator cannot know the answer, and a column that says `_open_` forever is a
second, empty copy of the mapping.

**The check** — `tools/check-redirects.mjs`, blocking, reads the inventory and `dist/`:

1. every path in `docs/content/urls-and-redirects.md` is *kept* (an `index.html` exists at that path
   in `dist/`), *redirected* (a redirect page exists there whose refresh target is itself a page in
   `dist/`), or *gone* (listed as such in the module) — **no fourth state, and no path missing**;
2. no redirect targets another redirect — a chain is a hop Google may not follow and a visitor waits
   through;
3. every redirect page carries an instant refresh (`content="0;url=…"`), because a delayed one is
   read as temporary.

This is what turns "none may silently 404" from a sentence in a document into a build that fails.

### 4. A real 404 page, in both locales, that is not a redirect in disguise

`src/pages/404.astro` becomes GitHub Pages' `404.html`, served with status `404`. It says in German
and English that the page does not exist, names the three places a visitor most likely wanted —
services and prices, opening hours, contact — as links read from ADR 0005's route map, and offers
nothing else: no search box (there is nothing to search), no automatic forwarding (that would be the
soft 404 of §2 with a delay). It carries the studio's telephone number from `business.yaml`, because
a visitor who followed a dead link from a directory usually wanted to call.

### 5. What is not redirected, and why that is the decision rather than an omission

- **The WordPress side channels** — `/feed/`, `/sitemap.rss`, `/category/…/`, `/author/…/`,
  `/tag/…/`, `/wp-admin/`, `/wp-json/`. Machine addresses with no human successor; they answer `404`
  through §4. The old `robots.txt` advertised `/sitemap.xml`; the new sitemap is at
  `/sitemap-index.xml` (`@astrojs/sitemap`'s output), advertised by the new `robots.txt` in the live
  state (ADR 0006 §4). No meta refresh is written for an XML address — a crawler fetching a sitemap
  does not execute a refresh, so a redirect page there would be an HTML file pretending to be XML.
- **Query-string addresses** — `/?p=83`, `/?page_id=429`. A static host cannot match a query string;
  those requests land on `/`, which is the homepage rather than an error and is accepted as such.
- **Media files** — 505 items under `/wp-content/uploads/`. None may be reused
  ([`06-media-inventory.md`](../analysis/06-media-inventory.md): rights undocumented), so there is
  no successor to redirect to; they answer `404`. Image-search traffic to them, if any exists, is
  lost, and that loss is accepted because the alternative — republishing images whose licence nobody
  can show — is the thing `CLAUDE.md` forbids.
- **`www.` → apex, `http` → `https`, trailing-slash normalisation.** Host-level, handled by GitHub
  Pages, decided in ADR 0006 §1–§2. Astro's documentation is explicit that its `redirects` cannot do
  these on a static host, and this ADR does not try.

### 6. The redirects are permanent — kept for the life of the site, verified at cutover and after

A redirect page costs nothing to keep, and the moment it is removed is the moment the last bookmark
breaks. None is scheduled for removal. At cutover, ADR 0006 §6's verification step fetches every URL
in the inventory from the live domain and confirms the outcome §3 assigned it — *by request, not by
inspection*, as #7 requires. After cutover, the owner's Search Console property for the domain
(**O4**) is where the actually-requested dead URLs surface; anything it reports that the inventory
did not know about is a new row in the module, not an emergency.

### 7. What this ADR does not decide

- **Which pages survive.** The keep/rework/drop assessment still needs the owner; §3's table shows the
  consequence of the recommended defaults and changes with the answers.
- **The English tree.** ADR 0005. It is new, has no old URLs and appears here only as the other
  language of the 404 page.
- **The content of `/impressum/` and the privacy page.** ADR 0007.
- **The cutover itself** — ADR 0006 §6, executed by the owner in Phase 5.

**Phase gate.** This unblocks the redirect half of Phase 5 (#7) and constrains Phase 3 (#5) in one
respect: the German slugs in the route map are the old permalinks (§1). It depends on no
still-`Planned` decision — ADR 0007 owns the legal pages' content, not their addresses. `Accepted`
here means **designed**; the module, the 404 page and the check are built with the first page that
needs a redirect, and the full table is verified against the live domain only at cutover.

## Consequences

**Positive**

- The largest class of old URLs — the pages — is preserved without any redirect at all, which is the
  one mechanism that cannot fail.
- Every one of the 32 addresses has a written, checked outcome; "silently 404" is a failed build, not
  a discovery after go-live.
- The signal sent for moved content is the strongest the host permits, and Google documents it as
  permanent.
- Gone content answers honestly. The index is not taught that this site returns "found" for anything.
- The mapping has one authority in code, the decision has one record here, and the inventory of what
  existed is generated from the export — three artefacts, three different jobs, no copy of another.

**Negative / costs**

- **A meta refresh is not a `301`.** Google reads it as permanent; other search engines and link
  checkers vary, and some tools will report the redirect pages as `200`s. Accepted: it is the best
  GitHub Pages offers, ADR 0006 chose GitHub Pages knowingly, and the cost falls on secondary engines
  for a business whose customers are local and search on Google.
- **No `410`.** Gone content returns `404`, which Google treats as "may come back" for a while longer
  than `410`. The difference is weeks of crawl budget on a 32-URL site — negligible.
- **The German slugs are frozen to 2017's information architecture** — *Moments*, *Sunshine* — unless
  the owner renames, and a rename then costs a redirect (§1). Accepted: the ranking attached to those
  paths is the asset being protected, and a redirect is available if the wording has to change.
- **Media traffic is lost** (§5). Accepted for the reason stated there.
- **Query-string addresses degrade to the homepage** rather than to a target. Two are known; neither
  is indexed.
- **The check reads the inventory, so the inventory has to be right.** It was wrong for two months
  without anyone noticing (#86). The check now makes the inventory load-bearing, which is exactly why
  the generator reads permalinks instead of deriving them — and why re-running the generator after
  any change to it is part of its own header comment.

## Alternatives considered

- **Cloudflare (or any proxy) in front of GitHub Pages for real `301`s and `410`s** — rejected in
  ADR 0006 already: it moves the nameservers, which touches the studio's mail records, and adds a
  provider to gain a status code Google does not need.
- **Redirect every dead URL to the homepage** — rejected as a soft 404 by construction: Google's own
  guidance describes a "found" response for missing content as a signal to ignore, and it hides the
  gap from the owner instead of surfacing it in Search Console.
- **JavaScript redirects** — rejected; Google documents them as the last resort because rendering
  can fail, and ADR 0009 §7's CSP would have to be loosened for an inline script. The meta refresh
  needs neither.
- **Rename the German paths to a flatter tree now (`/kosmetik/` instead of `/moments/kosmetik/`)
  and redirect the old ones** — rejected because it exchanges "no redirect" for "a redirect" on the
  pages that carry the most ranking, for a tidiness gain nobody asked for. If the owner renames the
  section (O3), the redirect is the cost of that decision, taken then.
- **Keep the blog and its 19 URLs as an archive** — rejected on the content inventory's assessment:
  every post is an expired promotion or a dated announcement, two are actively harmful ("Neuer
  Webauftritt", the pandemic statement), and an archive nobody maintains is the old site's defect
  reproduced. Subject to **O1**.
- **A `New URL` column in the generated inventory** — rejected (it exists today and goes): the
  generator cannot know the new URL, so the column is either hand-edited output — which
  `CLAUDE.md` forbids — or permanently `_open_`.
- **Removing the redirects after a year** — rejected; the pages are free and the breakage would be
  silent.

## Open questions (for owner review)

- **O1 — Is the blog dropped, as `02-content-inventory.md` recommends?** *Recommended default:*
  **yes**, no post is carried over, and the 19 post URLs get the outcomes in §3: promotions redirect
  to `/leistungen-und-preise/`, the winter-hours post to the opening hours, the *Moments* rework
  post to `/moments/`, and the five announcements answer `404`. If the owner wants a news section in
  future it starts empty (ADR 0003 ticket #41 raised the same question); nothing here prevents that.
- **O2 — Is proWIN still active?** `02-content-inventory.md` marks the page *Clarify*: two paragraphs
  and an external link to a direct-sales business the studio ran on the side. *Recommended default:*
  if active, `/prowin/` is **kept** at its address with reworked content; if not, it is **gone**
  (`404`) — not redirected to the homepage, and not redirected to the external proWIN site, which
  would hand a nine-year-old URL of the studio's domain to a third party.
- **O3 — Do *Moments* and *Sunshine* stay as section names, so the URLs `/moments/…` and
  `/sunshine/` stay exactly as they are?** *Recommended default:* **yes** — keep the paths, whatever
  the visible headings say; a heading can read „Kosmetik & Massage" above a page whose address is
  `/moments/kosmetik/`, and the ranking stays attached. If the owner wants the paths renamed, §1's
  redirect covers it, at the cost of one hop on the pages that carry the most weight.
- **O4 — Does the owner have (or will they create) a Google Search Console property for
  `iris-sunshine-oase.de` before cutover?** *Recommended default:* **yes, before cutover** — it is
  the only place the dead URLs that were actually requested after go-live become visible, and it is
  free. Ownership is verified with a DNS `TXT` record at netcup, the same mechanism as ADR 0009 §5's
  GitHub verification; no code, no tag on the pages, no third-party request (ADR 0009 §6 stays
  intact). An owner action for #7, not a repository change.

## References

- [ADR 0002 — Tech stack and tooling](0002-tech-stack-and-tooling.md), §1 (static, no adapter), §5
  (checks over rules)
- [ADR 0005 — Internationalisation](0005-internationalisation.md), §1 (German tree unchanged), §2
  (the route map), R3 (legal pages `de`-only)
- [ADR 0006 — Deployment, preview and hosting](0006-deployment-preview-hosting.md), §1 (GitHub
  Pages), §2 (`www` → apex), §4 (sitemap only in `live`), §5 (the gate governs the canonical host),
  §6 (cutover verification and rollback)
- [ADR 0009 — Security by design](0009-security-by-design.md), §5 (DNS verification), §6 (no
  external resource), §7 (CSP)
- [`docs/content/urls-and-redirects.md`](../content/urls-and-redirects.md) — the inventory, generated
  from the export's permalinks (#86)
- [`docs/analysis/02-content-inventory.md`](../analysis/02-content-inventory.md) — keep/rework/drop,
  the blog assessment, the proWIN question
- [`docs/analysis/05-defect-list.md`](../analysis/05-defect-list.md) — `M-07`, the unreachable page
- [`docs/analysis/06-media-inventory.md`](../analysis/06-media-inventory.md) — why no media URL has a
  successor
- [Astro — `redirects` configuration reference](https://docs.astro.build/en/reference/configuration-reference/#redirects)
  and [routing guide, configured redirects](https://docs.astro.build/en/guides/routing/#configured-redirects)
  — static output emits meta refresh, no status codes, host-level redirects out of scope (read
  2026-09-20)
- [Google Search Central — Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
  — instant `meta refresh` treated as permanent, delayed as temporary, JavaScript last (read
  2026-09-20)
- [GitHub Docs — Creating a custom 404 page for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)
- Parent epic: #3 · Unblocks: #7 · Constrains: #5
