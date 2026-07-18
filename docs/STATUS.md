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
- ⏸ **ADR 0004** (styling and design tokens) waits on input from outside this repository: the owner is
  drafting a visual design for the new site (2026-07-18, in progress). Design tokens invented before
  that design exists would be replaced by it, so 0004 is deliberately *not* the next ADR despite its
  low number. The other ADRs do not depend on how the site looks.
- 🔜 **ADR 0009 — security by design** (#28) is proposed as an addition to the reserved set. It is not
  in the original eight, and it is deliberately taken **before** the scaffold: it decides workflow
  permissions, dependency policy and the no-external-resources invariant, all of which are cheaper to
  build in than to retrofit.

**Phase 2 — scaffold and first preview** (#4)**:** **unblocked** — both gates (ADR 0002 and ADR 0006)
are Accepted. The Astro scaffold plus the GitHub Pages deployment, so drafts are reviewable in a
browser early. Nothing is built yet.

> The epic's *Constraints* section still requires `robots.txt` `Disallow: /`. That requirement is
> **superseded by ADR 0006 §4** and is corrected in the ticket; if the two ever appear to disagree, the
> ADR wins.

**Phase 3 — content** (#5)**:** planned. The 14 pages, prices and opening hours as structured data.

**Phase 4 — defects, accessibility, SEO** (#6)**:** planned. `M-01`…`M-28` as tickets, plus the checks that
keep them from recurring.

**Phase 5 — go-live** (#7)**:** planned. Domain cutover from netcup, redirects for the 32 old URLs, removal of
the `noindex` gate. Every step here is owner-approved.

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

**ADR 0009 — security by design (#28), then the Phase 2 scaffold.**

Phase 2 is unblocked and could start now. It is taken second on purpose. The scaffold is where the
build workflow, its token permissions, the dependency set and the site's external-resource policy come
into existence, and each of those is a security decision that is cheap to make now and expensive to
retrofit. Security by design means the decision precedes the scaffold, not that it audits one.

Two findings already argue for it, and neither is theoretical:

- **`main` is not branch-protected.** "Never commit directly to `main`" is currently convention only —
  nothing enforces it, including against an agent with a wrong idea.
- ADR 0006 §2 introduces `preview.iris-sunshine-oase.de` as a `CNAME` to GitHub Pages. If that
  repository is ever renamed, deleted or made private while the record survives, the subdomain becomes
  claimable by a stranger — on the studio's own domain. The decision is right; it needs the
  corresponding lifecycle rule written next to it.

Phase 0's remainder (#11, #12, #17, #18, #19) is low-priority tidying and does not block anything.
