# ADR 0002 — Tech stack and tooling

- **Status:** Accepted
- **Date:** 2026-07-18
- **Depends on:** [ADR 0001](0001-record-architecture-decisions.md) for the workflow this ADR follows

## Context

Nothing can be scaffolded before this decision. `CLAUDE.md` forbids settling a tech stack in a passing
commit, and CI has a single step today because asserting a build chain would pre-empt this ADR.

The owner has set **Astro** as the static site generator. Everything around it was open.

The relevant history is in [`docs/analysis/01-starting-point.md`](../analysis/01-starting-point.md). The old
site accumulated WordPress, Hestia, Elementor, Orbit Fox, an opening-hours plugin, Google Analytics and
**two competing SEO plugins**, with no record of why any of them was chosen. Each was a defensible local
decision that nobody wrote down; together they became a stack nobody could reason about, and one that
could not be updated without fear.

So the purpose of this ADR is not to pick good tools. It is to pick **few** tools, to say why each one
earns its place, and to make the set revisitable. Every dependency here is something a future agent has
to understand, and a supply-chain surface on a public repository.

The measurements below were taken on 2026-07-18 against primary sources; each is cited where it decides
something.

## Decision

### 1. Astro 7, static output, npm

**Astro 7** (7.1.1 at the time of writing) in its default static mode. No adapter, no server runtime:
the output is files, and that is the entire point — it is what makes the site cheap to host, trivial to
back up, and impossible to break through a plugin update.

**npm** as the package manager, with `package-lock.json` committed and `npm ci` in CI. The criterion
from the ticket was install speed and lockfile determinism for a repository cloned per ticket, and on
that criterion npm's disadvantage is real but negligible at this size: the dependency set is a handful
of packages, not a monorepo. Against that, npm ships with Node, so it costs no setup step in CI and no
pinned tool version to maintain. The sibling project *grimora* uses bun and carries a standing
maintenance task because Dependabot does not update bun lockfiles reliably in workspaces; there is no
reason to import that cost here.

### 2. Node 24 (Krypton), pinned

The **active LTS line**, pinned explicitly in CI rather than tracking `latest`, so that a Node release
cannot change the build unbidden.

This corrects something already wrong: CI currently pins `node-version: '22'`, and **Node 22 entered
maintenance on 2025-10-21** — Node 24 has been the active LTS since 2025-10-28
([nodejs/Release schedule](https://github.com/nodejs/Release/blob/main/schedule.json)). Astro 7 requires
`node >=22.12.0`, so both would work; the choice is to sit on the line that still receives full support.

The pin ages and must be bumped deliberately. That makes it the project's first genuine recurring
maintenance task, and it is the trigger for creating `docs/recurring-tasks.md` (deferred in #14 for want
of a real entry).

### 3. TypeScript with Astro's `strict` preset, checked by `astro check`

Extend `astro/tsconfigs/strict`. Astro ships `base`, `strict` and `strictest`; `strictest` is not chosen
because the type system is not where this project's correctness risk lives — a wrong price is a *content*
defect, and ADR 0003 will put runtime validation on the content data, which catches the real failure.

**Type checking is not part of `astro build`.** The Astro documentation is explicit that the dev server
performs no type checking and that `tsc` ignores `.astro` files entirely; `astro check` (via
`@astrojs/check`) is the command that checks both
([Astro TypeScript guide](https://docs.astro.build/en/guides/typescript/)). It therefore belongs in the
check chain as its own step, not as an assumed side effect of building.

### 4. Plain CSS with custom properties

No CSS framework and no preprocessor. Astro scopes and bundles component styles natively, and custom
properties are the mechanism ADR 0004 needs for design tokens.

Rejecting a utility framework here is not a matter of taste. The old site's central defect was that
presentation and content were welded together in Elementor layout blocks, so the same price existed in
three places and drifted (`docs/analysis/05-defect-list.md`). Utility classes in markup are a milder
version of the same coupling, and this project's whole thesis is the separation. Nesting and variables,
the historical reasons to reach for Sass, are native CSS today.

**This ADR decides the mechanism only.** The values — colours, type scale, spacing — belong to ADR 0004.

### 5. Biome as the single linter and formatter

One tool rather than two, matching the owner's other projects.

**This choice has a known limitation and it is recorded rather than glossed over.** Biome's own
documentation states that Astro support, added in 2.3.0, is **experimental**: it formats and lints the
HTML, CSS and JavaScript parts of `.astro` files, but it does not parse Astro-specific syntax, so
"formatting may not meet expectations and linting rules might miss certain cases"
([Biome language support](https://biomejs.dev/internals/language-support/)). CSS, JSON and JavaScript
or TypeScript files are fully supported; Markdown linting is not supported at all.

The alternative was Prettier with `prettier-plugin-astro`, which does understand Astro syntax — but its
last npm release is **0.14.1, published 2024-07-16**, roughly two years old, against 41 open issues,
while its repository has commits that never shipped. Neither option is clean. Biome was chosen for
active maintenance and consistency across the owner's projects, accepting the experimental parser.

Consequences of that acceptance:

- Biome runs in the check chain over the whole repository, and **its failure blocks CI** from the
  start (owner decision, R1). An advisory check is one nobody reads, and the drift it is there to
  prevent is exactly what accumulated silently in this repository before the spelling rule became a
  check. If the experimental parser does misfire on a template, the answer is the exclusion below —
  not a downgrade to warnings.
- `.astro` formatting is treated as **best effort**. If it turns out to reformat templates wrongly or
  destructively, `.astro` is excluded from the formatter — not worked around by hand-fighting it — and
  that exclusion is recorded here as an amendment.
- **Revisit trigger:** when Biome's Astro support leaves experimental status, or when
  `prettier-plugin-astro` resumes releasing. Whichever happens first is a reason to re-open this
  sub-decision, and a superseding ADR is the cheap outcome.

### 6. Integrations: sitemap only

The set is deliberately one package.

- **`@astrojs/sitemap`** — yes. The old site's 32 indexed URLs are the search ranking of a nine-year-old
  local business (ADR 0008's subject); a sitemap is part of not losing it. **Note the interaction with
  the `noindex` gate**: until go-live the preview must not be indexed, so the sitemap must not invite
  crawling of the draft. How that is squared is ADR 0006's decision, not this one.
- **Images — no integration needed.** `astro:assets` is built into Astro, uses **sharp** as its default
  image service, transforms at build time for prerendered pages, and can emit `webp` and `avif`
  ([Astro images guide](https://docs.astro.build/en/guides/images/)). This is a finding worth writing
  down, because assuming an image integration is the obvious wrong guess. **This decides how images are
  processed, not which images exist**: no image enters this repository without documented source,
  licence and evidence (`CLAUDE.md`), and the old site's image rights are explicitly undocumented
  (`docs/analysis/06-media-inventory.md`). A build pipeline that can optimise an image is not permission
  to add one.
- **i18n — no integration needed.** Astro's routing has built-in i18n with `defaultLocale` and `locales`,
  and `prefixDefaultLocale: false` yields exactly the shape ADR 0005 needs: German unprefixed at `/…`,
  English at `/en/…` ([Astro i18n guide](https://docs.astro.build/en/guides/internationalization/)).
  `hreflang` tags are **not** generated automatically and remain ADR 0005's problem.
- **MDX — no.** The content here is structured data and short prose; MDX buys embedded components that
  14 brochure pages do not need. Revisit if a page genuinely requires one.

### 7. No unit-test framework — verification runs at build time instead

The ticket invited this conclusion explicitly, and it is the conclusion.

There is no logic to unit-test on this site. There are no calculations, no state machine, no API. What
can actually break is content and output: a price that contradicts its source, a dead link, a missing
image, a page that fails to render. A unit-test runner tests none of those; adding one would be tooling
that produces the *appearance* of verification while the real risks stay uncovered.

The check chain instead:

| Step | Catches |
|---|---|
| `astro check` | type errors across `.astro` and `.ts` |
| `biome check` | style and lint drift |
| `astro build` | anything that stops the site from rendering |
| `node tools/check-docs.mjs` | ADR index, dead documentation links, British spelling |
| link and image check over the built output | dead internal links, missing images — the class the old site actually suffered from (`M-28`: four links to pages that never existed) |

The last row is the one that earns its keep, and it is the one still to be specified. It is decided
here **in principle** and **specified and implemented in Phase 4 (#6)** (owner decision, R2), where it
sits alongside the defect list it exists to close. Phase 2 gets the scaffold and the first four rows;
pulling the link check forward is allowed if it turns out to be cheap once the build exists, but it is
not a Phase 2 obligation.

If real logic ever appears — a price calculator, a booking form — this decision is revisited, and a test
framework is the right answer then. It is not one now.

## Consequences

**Positive**

- A stack of one framework, one package manager, one quality tool and one integration. Every piece is
  justified above, which is precisely what the old site could not say about any of its plugins.
- Nothing to run on a server, so no runtime to patch and nothing that can be compromised at request time.
- Three capabilities that would otherwise have been dependencies — images, i18n and scoped styling — come
  from Astro itself, verified against its documentation rather than assumed.
- The check chain maps onto real failure modes rather than onto the habits of a larger project.

**Negative / costs**

- **Biome's Astro support is experimental**, by its maintainers' own description. This is a knowingly
  accepted risk with a named revisit trigger, not an oversight. If it misbehaves, the fallback is
  narrower coverage, and the project keeps a formatter that shipped this month rather than one that has
  not shipped in two years.
- The Node pin ages and must be bumped by hand, which is exactly the kind of task that is silently
  forgotten. This is why it becomes a tracked recurring task rather than a comment.
- npm is the slowest of the three candidates. Accepted; at this dependency count the difference does not
  pay for a pinned extra tool in CI.
- Plain CSS means conventions have to be held by discipline where a framework would enforce them. ADR
  0004 has to carry that weight.
- No test framework means a regression in real logic would be caught late — accepted only for as long as
  there is no real logic.

## Alternatives considered

- **bun or pnpm** — rejected because the speed gain is not measurable at this size, and each adds a
  pinned tool in CI; pnpm additionally complicates `sharp`, which Astro's own documentation names as a
  known friction for strict package managers.
- **Tailwind** — rejected because utility classes in markup re-couple presentation to content, which is
  the specific defect this rebuild exists to undo.
- **Sass** — rejected as a dependency for what native CSS now does.
- **Prettier + ESLint** — rejected on maintenance grounds despite genuinely better Astro parsing; see §5.
- **Node 22** — rejected because it entered maintenance in October 2025.
- **Vitest or similar** — rejected; see §7.
- **A meta-framework with a server runtime** (Next.js and the like) — rejected without much deliberation.
  Fourteen static pages do not need a server, and one would add exactly the class of attack surface and
  upgrade pressure the rebuild is meant to remove.

## Resolved questions (owner decisions, 2026-07-18)

- **R1 — Biome's check blocks CI from the start.** The risk accepted knowingly: the experimental Astro
  parser could fail on a template it merely misreads. Chosen anyway, because an advisory check is one
  nobody reads — the repository has already demonstrated that a convention left to discipline drifts
  within hours. If the parser does misfire, §5's fallback is to exclude `.astro` from the formatter, not
  to soften the check into a warning.
- **R2 — The link and image check is specified and built in Phase 4 (#6)**, not Phase 2. It is decided
  in principle here so that Phase 2's scaffold does not foreclose it. It may be pulled forward if it
  proves cheap once a build exists, but Phase 2 is not obliged to carry it. Folded into §7.
- **R3 — The CI Node pin is not changed by this PR.** This is a decision PR; §2 records that Node 24 is
  the decision and that the current `'22'` pin is on a maintenance line, and the pin itself moves with
  the scaffold in Phase 2 (#4). Recording the decision without touching the implementation is the whole
  point of the separation.

## References

- Issue #10 — the owning ticket
- [ADR 0001](0001-record-architecture-decisions.md) — the ADR workflow
- [`docs/analysis/01-starting-point.md`](../analysis/01-starting-point.md) — the old site's stack
- [`docs/analysis/05-defect-list.md`](../analysis/05-defect-list.md) — `M-28`, dead links on the old site
- [Astro i18n guide](https://docs.astro.build/en/guides/internationalization/)
- [Astro images guide](https://docs.astro.build/en/guides/images/)
- [Astro TypeScript guide](https://docs.astro.build/en/guides/typescript/)
- [Biome language support](https://biomejs.dev/internals/language-support/)
- [nodejs/Release schedule](https://github.com/nodejs/Release/blob/main/schedule.json)
