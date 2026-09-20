# ADR 0005 — Internationalisation: German default, English secondary

- **Status:** Proposed
- **Date:** 2026-09-20
- **Depends on:** [ADR 0002](0002-tech-stack-and-tooling.md) §6 (Astro's built-in i18n routing is the
  mechanism; `hreflang` is left to this ADR), [ADR 0003](0003-content-model.md) §10 (facts are
  locale-independent, prose is separate, the schema does not foreclose a second language),
  [ADR 0004](0004-styling-and-design-tokens.md) §4 (the `latin` subset is what is shipped) and
  [ADR 0006](0006-deployment-preview-hosting.md) §4–§5 (the `noindex` gate and the live-only sitemap,
  both untouched here)

## Context

The owner decided on 2026-07-18 that the site is **German by default, with English as an additional
locale** (`docs/STATUS.md`, *Decisions taken*). The old site was German only, so there is nothing to
inherit: no English page, no English URL that search engines know, no translation to keep. That is
the one respect in which this decision is easy. It is also why it has to be taken now rather than
discovered later — [`docs/adr/README.md`](README.md) lists 0005 because locale routing and `hreflang`
are hard to retrofit once URLs are public and indexed, and Phase 3 (#5) cannot build its second page
without knowing where that page's English text goes and what its English address is.

Three earlier ADRs have already fenced the problem:

- **ADR 0002 §6** chose Astro's built-in i18n routing over an integration, with
  `prefixDefaultLocale: false` — German unprefixed at `/…`, English at `/en/…` — and recorded that
  Astro generates no `hreflang`, so that stays this ADR's problem.
- **ADR 0003 §10** made the separation this ADR relies on: a price is an integer in cents and a clock
  time is `HH:MM`, and neither translates; a description does. Prose is a separate concern from facts
  precisely so that a second language does not become a second copy of the price list.
- **ADR 0004 §4** ships Cormorant Garamond and Mulish in the `latin` subset, and `tools/check-fonts.mjs`
  fails the build on any rendered character outside it. English is inside it. "Locale-specific
  typography" was delegated here (ADR 0004 §11).

What exists in code is a homepage in German with every UI string it needs — „ab", the weekday names,
„geschlossen" — collected in `src/content/format.ts` under a header that says, in as many words, that
they are provisional and wait for this ADR. That file is the seam this decision opens.

Two properties of Astro's i18n were checked against its documentation rather than assumed, because
each is the kind of default that quietly becomes a decision:

- **`i18n.fallback` with `fallbackType: "rewrite"` serves the fallback page's content at the requested
  URL** — `dist/en/about/index.html` with the German page's body, under an English address and an
  English `lang`. Astro's default is `"redirect"`, which emits a page that sends the visitor to the
  German URL instead. Either is automatic; neither is what a bilingual site should do silently.
- **`@astrojs/sitemap` takes an `i18n` option** (`defaultLocale`, `locales` as path segment →
  language tag) and emits `xhtml:link rel="alternate"` entries for URLs that pair up by path. It pairs
  by *identical path under a different prefix*, so it only works for translated slugs if the sitemap
  is told about them — a constraint on §2 below.

The old site contributes one defect worth naming: `M-10` (the contact form) mixed English placeholders
with German labels on a single German page. A locale that leaks is the failure mode a bilingual site
adds to a monolingual one, and everything below is arranged so that a leak is a failed check rather
than a matter of proofreading.

## Decision

### 1. Two locales; German is the default and lives at the root

`locales: ['de', 'en']`, `defaultLocale: 'de'`, `routing: { prefixDefaultLocale: false }` — as
ADR 0002 §6 anticipated. German pages sit at `/…`, English pages under `/en/…`, both served from the
root of whichever host the build state names (ADR 0006 §2 R1). Nothing about the German URL tree
changes for this decision, which matters because ADR 0008 will map the old site's 32 URLs onto it and
must not find it moved.

**No automatic language selection.** The site does not read `Accept-Language`, does not redirect by
browser locale and runs no script to guess. A static host cannot negotiate, a client-side guess is a
flash of the wrong page, and a German customer on a device set to English is the ordinary case, not
the edge case. The default is German because the studio is in Herxheim; a visitor who wants English
takes the link. `x-default` therefore points at the German page (§4).

### 2. English slugs are translated, and the pairing is data

An English page has an English address: `/en/services-and-prices/`, not `/en/leistungen-und-preise/`.
A German path under an English prefix is the URL-level form of the `M-10` leak.

The de ↔ en pairing lives in **one route map** — a typed module, one entry per page, carrying both
slugs and the page's locale coverage — and everything that needs a counterpart reads it: the
language switch (§6), the `hreflang` set (§4), and the sitemap's `i18n` configuration, which cannot
infer translated slugs on its own and is generated from this map rather than hand-maintained. A page
that is not in the map is not a page.

This is the one place a URL is written down. Templates do not build paths by string concatenation;
they ask the map (Astro's `getRelativeLocaleUrl` for the prefix, the map for the slug).

### 3. Every page exists in both locales, or is declared single-locale — and nothing falls back

A route map entry is either **paired** (a German and an English slug) or **`de` only** (an English slug
of `null`). There is no third state, and there is **no `i18n.fallback`**: a request for an English
page that was not built is a 404, not a rewritten German page and not a redirect emitted on the
build's behalf. A `de`-only page is unreachable from the English tree except through the language
switch, which on such a page says so (§6).

The reason is the one the context names: a fallback produces a page that *claims* a locale it does not
have. Rewrite puts German prose under `lang="en"`, which lies to screen readers, hyphenation and
search engines at once; redirect is honest but arrives at a German page unannounced. A missing
translation should be visible in the route map and in the build check (§8), where it can be acted
on, not papered over at the URL.

Which pages are paired and which stay `de`-only is **O2** and **O3** below — the mechanism is decided
here, the coverage is the owner's.

### 4. `lang`, `hreflang` and `x-default` come from the route map, and the sitemap agrees

Every page emits:

- `<html lang="de">` or `<html lang="en">` from `Astro.currentLocale` — never typed in a layout;
- for a paired page, three `<link rel="alternate">` elements: `hreflang="de"`, `hreflang="en"` and
  `hreflang="x-default"` pointing at the German URL, all absolute against `SITE_URL` so the preview
  never advertises the live host (ADR 0006 §5);
- for a `de`-only page, none — a page with no alternate has nothing to declare, and a self-referencing
  `hreflang` set of one is noise.

The sitemap (live state only, ADR 0006 §4) is configured with `i18n: { defaultLocale: 'de',
locales: { de: 'de', en: 'en' } }` **and** its URL list is filtered through the route map, so that a
paired page appears with both alternates and a `de`-only page appears alone. Sitemap and `<head>` say
the same thing because they are computed from the same object; a disagreement between them is the
symptom search consoles report as "hreflang errors", and it is not reachable from here by construction.

### 5. Translatable text has three grains, and each has exactly one home

Facts do not translate (ADR 0003 §10); what does is arranged by how it is used:

**a. UI strings** — navigation labels, button text, „ab", „geschlossen", „Foto folgt", the weekday and
month names, the site's title suffix. One dictionary per locale in `src/i18n/`, both typed against
the same key set so that a key present in German and missing in English **fails `astro check`**, not
a page. `src/content/format.ts` stops carrying German literals and takes the locale as an argument.
Weekday and month names come from `Intl.DateTimeFormat(locale, …)`, not from a table — the
`DAY_NAMES` array in `format.ts` is the kind of thing that gets translated once and drifts from the
`Intl` output the moment somebody adds dates.

**b. Prose inside the content model** — a service's `name` and `description`, a category's `name` and
`teaser`, an hours set's `label`, a closure's `reason`, a price's `status` text and a variant's
`label`. These become **locale-keyed objects in the same entry**: `name: { de: 'Gesichtsbehandlung',
en: 'Facial' }`, with `de` required and `en` optional. The fact beside them — `price`, `intervals`,
`from`/`until` — stays a single value. This keeps ADR 0003's rule intact: the entry is still the one
definition of the service, and a second file per locale would be a second place for its price to
drift.

A missing `en` string renders the German one **marked as German** — `<span lang="de">` — which is
correct HTML, honest to the reader, and visible: `tools/check-content.mjs` reports the count of
untranslated strings per collection so the gap is a number in the build log rather than a surprise
on the page. It does not fail the build. A service called „Gesichtsbehandlung" on the English page is
a shortfall; a service missing from the English page because its name was untranslated would be a
content defect of the kind ADR 0003 §8 exists to prevent.

**c. Whole-page prose** — the body of *Über uns*, *Sunshine*, the *Moments* pages. One **page
component per page** (`src/pages-content/` or equivalent, name to be settled in code) that receives
`locale` and renders the layout, the facts from the model and the prose for that locale; and **two
thin route files** — `src/pages/ueber-uns.astro` and `src/pages/en/about-us.astro` — each a handful
of lines that import the component and pass the locale. Prose lives with the component, in a
per-locale block, not in the route file: the route file's only job is to exist at the right path.
This keeps the two locales structurally identical by construction — there is one layout, one order
of sections, one set of facts — while the words differ.

Nothing in any grain may contain a price, a clock time or an address; ADR 0003 §7's content check
applies to an English sentence exactly as it applies to a German template.

### 6. The language switch is a text link to the counterpart page

A single link in the header — „EN" on German pages, „DE" on English ones, `lang`-attributed and with
an `aria-label` naming the language in its own tongue („English" / „Deutsch") — pointing at the
**same page** in the other locale, resolved through the route map. Not a flag: a flag names a country,
and neither locale here is one. Not a `<select>`: a two-way toggle is a link.

On a `de`-only page the English tree has no counterpart. The switch is not hidden — a control that
disappears reads as broken — but points at the English homepage, and the page carries a short English
line saying that this page is available in German only. That line is a UI string (§5a), not prose,
so it is written once.

### 7. Locale-aware formatting comes from `Intl`, with the German conventions kept where they are facts

- **Currency**: `Intl.NumberFormat('de-DE')` → „3,00 €"; `Intl.NumberFormat('en-GB')` → "€3.00". The
  qualifier („ab" / "from") is a UI string; the amount is the same integer either way.
- **Clock times stay 24-hour in both locales** — „09:00 – 18:00" and "09:00 – 18:00". Opening hours are
  a fact about a German business, the 24-hour form is unambiguous, and a 12-hour rendering would be the
  one place the English page carried a *different* value for the same fact.
- **Dates** (closures): `Intl.DateTimeFormat(locale, { dateStyle: 'long' })`.
- **Weekday and month names**: `Intl`, as in §5a.
- **Typographic conventions follow the locale**: German prose uses „…" and the en dash with spaces;
  English prose uses "…" and the same spaced en dash for ranges. Both come from the text as written,
  not from a transform. A German quotation mark inside an English string is the `M-10` leak at the
  character level and is a candidate for the check in §8.

Node 24 ships full ICU, so `de-DE` and `en-GB` format correctly at build time without a locale
package (ADR 0002 §2).

### 8. What is asserted rather than remembered

Following ADR 0002 §5 and ADR 0004 §10, the rules above that a command can decide become checks; the
rest stay rules. Candidates, in order of value:

1. **Route map completeness** (blocking) — every file under `src/pages/` corresponds to a route map
   entry, and every paired entry has both route files; every `de`-only entry has no `/en/` file.
   Catches the forgotten English page and the orphaned one.
2. **`hreflang` ↔ sitemap agreement** (blocking, live state) — reads `dist/`, asserts that every page's
   `<link rel="alternate">` set equals its sitemap entry's alternates. This is what makes §4's "by
   construction" a measured property rather than a claim.
3. **Dictionary completeness** — already a type error under §5a; no separate check needed.
4. **No hard-coded German in a template** — extends `tools/check-content.mjs`: a weekday name or
   „geschlossen" typed into a `.astro` file outside the dictionary is the same class of defect as a
   typed price. Reporting first, blocking once the homepage is migrated.
5. **Untranslated prose count** (reporting) — §5b's number in the build log.
6. **Quotation marks per locale** (reporting) — „ in an `en` string or " in a `de` one.

The first two are the ones that decide whether §3 and §4 hold; they are built with the first paired
page, not after it.

### 9. What stays German everywhere

- **The trading name.** *Iris’ Sunshine Oase* is a name, not a phrase; it is not translated, not
  anglicised in its apostrophe (ADR 0004 R5), and read from `business.yaml` in every locale.
- **The postal address.** It stays in the German postal form `business.yaml` holds — a street name is
  not translated, and an English rendering would be a second copy of a fact that has one authority
  (ADR 0003 §9).
- **The legal pages' *content*.** Whether the Impressum and the Datenschutzerklärung get an English
  version at all is **O3** and belongs with ADR 0007's legal review; if they do, the German text is
  the binding one and says so.

### 10. What this ADR does not decide

- **Which pages exist.** The keep/rework/drop assessment in
  [`02-content-inventory.md`](../analysis/02-content-inventory.md) still needs the owner; this ADR
  decides what a page looks like in two locales, not which ones there are.
- **The English words.** Prose is Phase 3 content and arrives page by page, reviewed in the PR that
  introduces it (**O4**). Nothing here is a translation.
- **Redirects.** ADR 0008 owns the old URLs. The English tree is new and has no old URLs; the German
  tree is unchanged by this decision.
- **Legal obligations of a bilingual site.** ADR 0007. Nothing here introduces a third-party service,
  a script or a request the CSP (ADR 0009 §7) would have to allow.

**Phase gate.** This unblocks Phase 3 (#5) together with ADR 0003: the second page can be built once
it is `Accepted`. It depends on no still-`Planned` decision — ADR 0007 and 0008 are named where they
are touched, and neither has to be written first. `Accepted` here means **designed**; the route map,
the dictionaries and the two checks do not exist until the first paired page brings them.

## Consequences

**Positive**

- Every page is bilingual by construction rather than by discipline: one component, two route files,
  one route map. Adding a page in one locale without the other is a failed check, not an oversight.
- No fact gains a second copy. Prices, hours and the address stay single values inside single entries;
  only words are keyed by locale.
- `hreflang`, the sitemap and the language switch cannot disagree, because none of them is written by
  hand.
- The `M-10` class of leak — a German string on an English page — becomes visible (marked `lang="de"`,
  counted in the build log) and, for UI strings, impossible (a type error).
- German URLs are untouched, so ADR 0008's redirect table has a stable target.

**Negative / costs**

- **Every page costs two sets of words.** The content work of Phase 3 roughly doubles for whatever the
  owner puts in scope (**O2**), and the English text has to come from somewhere (**O4**). The
  mechanism above does nothing to reduce that; it only makes the gap countable.
- **Locale-keyed prose makes the YAML wider.** `name: { de: …, en: … }` is more to read than
  `name: …`, and every hand-edited service entry now has two places for a typo. Accepted: the
  alternative — a parallel English file — is a second file whose entries can fall out of step with
  the prices they describe.
- **Two route files per page** is boilerplate. Thin boilerplate, but fourteen pages will produce
  twenty-odd files of five lines each. Accepted for the property it buys: `prefixDefaultLocale: false`
  means one dynamic `[locale]` route cannot serve both trees, and a file per path is what Astro's
  static routing wants.
- **No fallback means a 404 is possible** for an `/en/` URL someone guesses. Accepted deliberately;
  the alternative is a page that lies about its language.
- **The sitemap's own `i18n` pairing is by identical path**, so translated slugs require the sitemap
  URL set to be generated from the route map rather than left to the integration's defaults. A little
  more code than the integration's one-liner; the price of readable English URLs.
- **`Intl` output is what Node ships.** A Node upgrade (`docs/recurring-tasks.md`) can change a
  formatted string by a character — ICU updates have done so for the narrow no-break space in French
  and could for German. The content check's rendered-output assertions are where such a change would
  surface, and it would be a one-line fixture change, not a defect.

## Alternatives considered

- **German slugs under `/en/` (`/en/leistungen-und-preise/`)** — rejected because the URL itself is
  then in the wrong language, and because the one thing it buys — pairing by identical path, which
  the sitemap integration does for free — is exactly what the route map provides for translated
  slugs at the cost of a few lines. See §2.
- **Astro `i18n.fallback` with `fallbackType: "rewrite"`** — rejected because it emits German content
  under `lang="en"` at an English URL (verified against Astro's configuration reference). It is the
  automatic answer to a missing translation, and it is the wrong one. See §3.
- **Astro `i18n.fallback` with the default `"redirect"`** — rejected as the lesser version of the
  same: honest about the language, but a visitor arrives at a German page from an English link with
  no explanation, and the build has silently decided that a missing page is fine. A missing page
  should be a red check.
- **A parallel content file per locale (`services.de.yaml`, `services.en.yaml`)** — rejected because
  it forks the fact list: two files, two `price` fields, two `confirmed` blocks for one service.
  ADR 0003's founding rule is that a fact has one definition; this would give it two by design. See
  §5b.
- **Translation keys for all prose (`t('services.facial.description')`)** — rejected for whole-page
  prose as indirection with no payoff at this scale: a paragraph of *Über uns* is read in its page,
  not looked up; a key layer between the two adds a file to open and nothing a check could assert
  that §5c's per-locale block does not already give.
- **One `[locale]` dynamic route for both trees** — rejected because `prefixDefaultLocale: false` puts
  the German tree at the root, where a `[locale]` segment would swallow every top-level path. Two
  thin route files are the cost of unprefixed German URLs, which ADR 0002 §6 already chose.
- **A client-side language redirect on first visit** — rejected: it needs a script, it guesses, and
  the guess is wrong for the ordinary case of a German customer with an English device locale. See
  §1.
- **Flags as the language switch** — rejected; a flag names a country and an English-speaking visitor
  from Poland, the Netherlands or the US base is not addressed by any one of them.
- **A third locale now** — rejected as speculative. The route map and dictionaries are locale-agnostic
  by construction, so a third would be additive; no design work is spent on it before it is asked for.

## Open questions (for owner review)

- **O1 — Who is the English locale for?** The answer sets the tone of the prose and the spelling
  variety. *Recommended default:* visitors in the region who read English more comfortably than
  German — tourists, expatriates, people posted to the area — written in **British English**, which
  is also the repository's own rule (`CLAUDE.md`) and keeps one convention across artefacts and site.
  Formatting follows with `en-GB`. If the intended audience is predominantly American, `en-US` and
  American spelling are a one-line change to the dictionary's locale tag and a review of the prose;
  worth deciding before any prose is written, not after.
- **O2 — Full mirror, or a reduced English set?** *Recommended default:* every page that survives the
  keep/rework/drop assessment is paired, **except** the legal pages (O3). A reduced set (say: home,
  services and prices, contact, about) is legitimate and halves the translation work, but leaves the
  English visitor a smaller site with visible gaps; if chosen, the omitted pages are `de`-only in the
  route map and the switch behaves as §6 describes.
- **O3 — Do Impressum and Datenschutzerklärung get an English version?** *Recommended default:*
  **German only**, marked as such, with a one-line English notice on the English pages' footer that
  the legal notices are in German. An English translation of a legal text carries the question of
  which version binds, which is ADR 0007's territory and needs the owner's legal review rather than an
  agent's translation. This ADR only has to know whether those two pages are paired or `de`-only.
- **O4 — Who writes the English text, and how is it reviewed?** *Recommended default:* the agent
  drafts each page's English prose in the PR that introduces that page, alongside the German, and the
  owner reads both in review; nothing renders in `live` that the owner has not approved in a PR.
  Translation is prose, not a fact, so the `confirmed` gate of ADR 0003 §8 does not apply to it — the
  PR review is the gate. If the owner would rather supply the English text themselves, or have a
  third party do it, the mechanism does not change; only the author of the PR's words does.
- **O5 — Translated English slugs, or German slugs under `/en/`?** §2 decides translated slugs and
  *Alternatives considered* says why; it is listed here because it is outward-facing and hard to reverse once
  indexed, so it should be a decision the owner has seen. *Recommended default:* translated
  (`/en/services-and-prices/`). If the owner prefers the German slugs, §2's route map still exists —
  it simply holds identical slugs and the sitemap integration's own pairing suffices.

## References

- [ADR 0002 — Tech stack and tooling](0002-tech-stack-and-tooling.md), §2 (Node 24, full ICU), §5
  (checks over rules), §6 (built-in i18n; `hreflang` deferred here)
- [ADR 0003 — Content model](0003-content-model.md), §7 (the content check), §8 (the confirmation
  gate), §10 (locale explicitly not decided; prose separate from facts)
- [ADR 0004 — Styling and design tokens](0004-styling-and-design-tokens.md), §4 (`latin` subset), §11
  (locale-specific typography deferred here), R5 (the apostrophe)
- [ADR 0006 — Deployment, preview and hosting](0006-deployment-preview-hosting.md), §4 (sitemap only
  in `live`), §5 (the gate governs the canonical host)
- [ADR 0009 — Security by design](0009-security-by-design.md), §6–§7 (no external resource; nothing
  here adds one)
- [`docs/analysis/05-defect-list.md`](../analysis/05-defect-list.md) — `M-10`, the mixed-language form
- [`docs/analysis/02-content-inventory.md`](../analysis/02-content-inventory.md) — the page set the
  route map will hold
- `src/content/format.ts` — the provisional German strings this ADR takes over
- [Astro — i18n routing guide](https://docs.astro.build/en/guides/internationalization/) and
  [configuration reference, `i18n.routing.fallbackType`](https://docs.astro.build/en/reference/configuration-reference/#i18nroutingfallbacktype)
  — the fallback behaviour checked on 2026-09-20
- [`@astrojs/sitemap` — `i18n` option](https://docs.astro.build/en/guides/integrations-guide/sitemap/#i18n)
- Ticket: #83 · Parent epic: #3 · Unblocks: #5
