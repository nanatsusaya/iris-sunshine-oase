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

**Phase 0 — analysis and foundation:** ▶ in progress.

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

**Phase 1 — decisions:** planned. ADRs 0002–0008, one PR each (see the
[ADR index](adr/README.md) for the set and its rationale).

**Phase 2 — scaffold and first preview:** planned. The Astro scaffold plus the GitHub Pages
deployment, so drafts are reviewable in a browser early. Gated on ADR 0002 and ADR 0006.

**Phase 3 — content:** planned. The 14 pages, prices and opening hours as structured data.

**Phase 4 — defects, accessibility, SEO:** planned. `M-01`…`M-28` as tickets, plus the checks that
keep them from recurring.

**Phase 5 — go-live:** planned. Domain cutover from netcup, redirects for the 32 old URLs, removal of
the `noindex` gate. Every step here is owner-approved.

## Decisions taken (not yet ADRs)

Recorded here so they are not lost before the owning ADR is written:

| Decision | Date | Owning ADR |
|---|---|---|
| Astro as the static site generator | 2026-07-18 | 0002 |
| Maintenance runs through GitHub issues, worked by an AI agent | 2026-07-18 | — (working model, `CLAUDE.md`) |
| Repository artefacts in English; conversation in German | 2026-07-18 | — (`CLAUDE.md`) |
| Site content German by default, English as an additional locale | 2026-07-18 | 0005 |
| Early drafts visible via GitHub Pages, `main` → one preview URL | 2026-07-18 | 0006 |
| `Archive/` excluded wholesale; no Release upload (public repository) | 2026-07-18 | — (`.gitignore`, `docs/analyse/06`) |

## Open questions for the owner

- **Hosting after go-live** — netcup is under review. GitHub Pages is currently the *preview*
  decision, not necessarily the final host. Belongs in ADR 0006.
- **Image material** — no image can be used until its provenance is documented. Whether to re-shoot
  the studio or re-license stock is an owner call with cost implications.
- **Content scope** — `docs/analyse/02-inhaltsinventar.md` rates each old page as keep, rework or
  drop. The drops need confirmation.

## Next step

Finish Phase 0 (process foundation), then open ADR 0002 (tech stack) as the first decision PR.
