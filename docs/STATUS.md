# Status & next steps

> Living handoff note between working sessions. Last updated: **2026-07-18**.
> Binding decisions live in the ADRs ([`docs/adr/`](adr/README.md)); this file is only the progress
> and handoff overview. Stable working rules live in [`CLAUDE.md`](../CLAUDE.md).

## Maturity legend

So that "decided" is never read as "built", every capability sits at one of:

- **planned** — ticketed, not yet designed
- **designed** — an Accepted ADR exists, no code
- **draft** — built and visible on the preview, not content-complete or verified
- **content-complete** — real content in place, checked against the source or the owner
- **live** — served to the public under the real domain

**An Accepted ADR is `designed`, not `built`.**

## Where we stand

Each phase is tracked as an epic; this section is the summary, the epic is the detail.

| Phase | Epic | State |
|---|---|---|
| 0 — Analysis & foundation | [#2](https://github.com/nanatsusaya/iris-sunshine-oase/issues/2) | ▶ in progress |
| 1 — Decisions (ADRs 0002–0008) | [#3](https://github.com/nanatsusaya/iris-sunshine-oase/issues/3) | ▶ in progress |
| 2 — Scaffold & first preview | [#4](https://github.com/nanatsusaya/iris-sunshine-oase/issues/4) | planned |
| 3 — Content | [#5](https://github.com/nanatsusaya/iris-sunshine-oase/issues/5) | planned |
| 4 — Defects, accessibility, SEO | [#6](https://github.com/nanatsusaya/iris-sunshine-oase/issues/6) | planned |
| 5 — Go-live | [#7](https://github.com/nanatsusaya/iris-sunshine-oase/issues/7) | planned |

**Phase 0 — analysis and foundation** (#2)**:** ▶ in progress.

- ✅ The old WordPress site is analysed and documented (`docs/analyse/`): stack and data situation,
  content inventory, the full price list, the design system, a media inventory, and 28 defects as work
  packages `M-01`…`M-28`.
- ✅ All texts of the old site extracted to [`docs/inhalte/`](inhalte/README.md) via
  `tools/extract-wp-content.mjs` — the only versioned source of the old content.
- ✅ The WordPress export is PII-cleaned (2,216 contact-form submissions, 2 spam comments and every
  real e-mail address removed); `Archive/` is excluded from the repository entirely.
- ✅ `Archive/` cleaned up: 749.7 MB → 594.0 MB, protocol in `Archive/AUFRAEUMPROTOKOLL.md`.
  Backup and archival of it are the **owner's** responsibility, deliberately outside this repository.
- ▶ Process foundation: `CLAUDE.md`, ADR 0001 and the index, this file, the PR template, labels, CI.

**Phase 1 — decisions** (#3)**:** ▶ in progress. ADRs 0002–0008, one PR each (see the
[ADR index](adr/README.md) for the set and its rationale).

- ✅ [ADR 0002](adr/0002-tech-stack-and-tooling.md) — tech stack and tooling — **Accepted**
  (2026-07-18): Astro 7 static with npm, Node 24, TypeScript `strict` with `astro check`, plain CSS
  with custom properties, Biome as a **blocking** check, `@astrojs/sitemap` as the only integration,
  and no unit-test framework until something exists that needs one. State: **designed** — no code yet.
- ✅ [ADR 0006](adr/0006-deployment-preview-hosting.md) — deployment, preview and hosting — **Accepted**
  (2026-07-18): GitHub Pages serves both the preview and the live site; domain **and DNS** stay at
  netcup so the studio's `MX` and `SPF` records are never touched; the preview lives at
  `preview.iris-sunshine-oase.de`; `noindex` is the indexing gate and `robots.txt` must **not** block
  the crawl that delivers it. State: **designed** — nothing deployed.
- ▶ ADRs 0003, 0005, 0007 and 0008 outstanding.
- 🔜 **ADR 0004** (styling and design tokens) — **Proposed** (2026-07-19, #35). The input it was parked
  on has arrived: the owner's Claude Design draft, read and measured on 2026-07-19. It supplies a
  14-token layer already stable across all ten iterations, and preserves `#FFC000` — the only colour the
  old site documented exactly. It supplies **no** breakpoints, spacing scale or type scale, which is what
  the ADR adds. Five open questions await the owner, two of them genuine trade-offs: a WCAG shortfall on
  the page gradient, and whether 15 px body text at weight 300 stays.
- ✅ [ADR 0009](adr/0009-security-by-design.md) — security by design (#28) — **Accepted** (2026-07-18):
  an addition to the reserved eight, taken **before** the scaffold because it decides workflow
  permissions, dependency policy and the no-external-resources invariant — all cheaper to build in than
  to retrofit. It amended [ADR 0001](adr/0001-record-architecture-decisions.md) (owner-authorised): the
  `Proposed → Accepted` flip is no longer a direct commit, because `main` is now protected against
  administrators too. Unusually for an ADR, part of it is already **in force** rather than only
  designed — see the table below.

**Phase 2 — scaffold and first preview** (#4)**:** ▶ in progress.

- ✅ **Astro scaffold** (2026-07-19): Astro 7 static, Node 24, TypeScript `strict` with `astro check`,
  Biome blocking, `@astrojs/sitemap` in the live state only. State: **draft** — one holding page, no
  design.
- ✅ **The full check chain** replaces the documentation-only step: audit → typecheck → lint → build →
  docs → external-resource check.
- ✅ **The indexing gate**, as one build-time flag defaulting to `preview` (ADR 0006 §5). Verified in
  both directions locally: `preview` emits `noindex` and no sitemap; `live` emits neither the tag nor
  a `Disallow`, and does emit the sitemap.
- ⛔ **Not yet deployed, and the deploy workflow is switched off on purpose.** GitHub Pages is not
  enabled on the repository, so the workflow failed on the first merge to `main`. Its `push` trigger
  is commented out until the precondition exists — a check that is always red teaches everyone to
  ignore failing checks. The workflow file carries the four-step re-enable procedure. Until then the
  epic's Definition of Done — *a URL the owner can open* — is unmet.

> **Two of the epic's own constraints are superseded and were deliberately not followed.** It requires
> `robots.txt` `Disallow: /`, which **ADR 0006 §4** shows defeats the `noindex` it sits beside; and it
> describes GitHub *project-page* hosting from a subpath, which **ADR 0006 §2 (R1)** replaced with a
> preview subdomain so that both states serve from the root and no `base` path changes at cutover.
> Where the ticket and an ADR disagree, the ADR wins.

**Phase 3 — content** (#5)**:** planned. The 14 pages, prices and opening hours as structured data.

**Phase 4 — defects, accessibility, SEO** (#6)**:** planned. `M-01`…`M-28` as tickets, plus the checks that
keep them from recurring.

**Phase 5 — go-live** (#7)**:** planned. Domain cutover from netcup, redirects for the 32 old URLs, removal of
the `noindex` gate. Every step here is owner-approved.

## Security controls — decided vs. in force

ADR 0009 is `Accepted`, which means *decided*. A security control that is decided and not applied
protects nothing, so this table tracks the gap explicitly; the ADR's status never answers this question.

| Control | ADR | State |
|---|---|---|
| `main` branch-protected — PR required, `verify` must pass, no force-push, no deletion, admins included | 0009 §4 | ✅ in force (2026-07-18) |
| Allowed actions restricted to GitHub-owned | 0009 §3, R2 | ✅ in force (2026-07-18) |
| SHA pinning required by repository policy | 0009 §3, R2 | ✅ in force (2026-07-18) |
| Default workflow token permissions `read` | 0009 §3 | ✅ in force (pre-existing) |
| Private Vulnerability Reporting | 0009 §9, R4 | ✅ in force (pre-existing) |
| Secret scanning + push protection | 0009 | ✅ in force (pre-existing) |
| **Apex domain verified with GitHub** (`TXT` at `_github-pages-challenge-nanatsusaya`) | 0009 §5, R3 | ⛔ **owner action — blocks the CNAME, and with it the whole deployment** |
| netcup: two-factor authentication, automatic renewal | 0009 §5 | ❓ owner action, unverified |
| `npm ci --ignore-scripts`, `npm audit` gating, Dependabot npm entry | 0009 §2 | ✅ in force (2026-07-19) |
| Explicit `permissions:` block per workflow | 0009 §3 | ✅ in force (2026-07-19) |
| External-resources fitness function | 0009 §6 | ✅ in force (2026-07-19) |
| CSP via `<meta http-equiv>` | 0009 §7 | ✅ in force (2026-07-19) |
| `SECURITY.md` | 0009 §9 (#18) | ⏳ not written |

## Decisions taken (not yet ADRs)

Recorded here so they are not lost before the owning ADR is written:

| Decision | Date | Owning ADR |
|---|---|---|
| Maintenance runs through GitHub issues, worked by an AI agent | 2026-07-18 | — (working model, `CLAUDE.md`) |
| Repository artefacts in English; conversation in German | 2026-07-18 | — (`CLAUDE.md`) |
| Site content German by default, English as an additional locale | 2026-07-18 | 0005 |
| No contact form — telephone and e-mail only | 2026-07-18 | 0007 |
| `Archive/` excluded wholesale; no Release upload (public repository) | 2026-07-18 | — (`.gitignore`, `docs/analyse/06`) |

## Open questions for the owner

- **Image material** — no image can be used until its provenance is documented. Whether to re-shoot
  the studio or re-license stock is an owner call with cost implications.
- **Content scope** — `docs/analyse/02-inhaltsinventar.md` rates each old page as keep, rework or
  drop. The drops need confirmation.

## Next step

**Answer ADR 0004's five open questions**, then accept it and implement the homepage.

[ADR 0004](adr/0004-styling-and-design-tokens.md) is `Proposed` (#35). Most of the design's system was
recoverable by measurement: the palette, the two typefaces that matter, and a set of tokens the draft had
already stabilised. What it did **not** contain — breakpoints, a spacing scale, a type scale, a maximum
reading width — the ADR supplies, and three of those close defects the old site is on record for
(`M-09`, and two from `docs/analyse/04-design-system.md`).

Five questions genuinely need the owner. Two are trade-offs rather than confirmations:

- **O1** — two colour tokens miss WCAG AA on the page gradient. Concrete replacements are proposed.
- **O2** — 15 px body text at weight 300 is the draft's stated character *and* small-and-light at once.
  An accessibility default and the design's intent pull apart here; the ADR does not decide it.
- **O3/O4** — are photographs planned, and where did the sun come from? The draft uses exactly one image
  and no photographs, so the provenance problem may be almost entirely absent.
- **O5** — the draft spells the brand name with both apostrophes, 39 × `'` and 18 × `’`, which is the old
  site's own inconsistency reproduced.

**Then:** accept 0004, and the two owner actions that unblock the preview URL — verify the apex domain
with GitHub, add the `preview` `CNAME` — followed by the homepage itself and the remaining Phase 2
tickets.

Phase 0's remainder (#11, #12, #17, #18, #19) is low-priority tidying and does not block anything.
