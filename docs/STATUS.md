# Status & next steps

> Living handoff note between working sessions. Last updated: **2026-08-05**.
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
| 0 — Analysis & foundation | [#2](https://github.com/nanatsusaya/iris-sunshine-oase/issues/2) | ✅ complete |
| 1 — Decisions (ADRs 0002–0008) | [#3](https://github.com/nanatsusaya/iris-sunshine-oase/issues/3) | ▶ in progress |
| 2 — Scaffold & first preview | [#4](https://github.com/nanatsusaya/iris-sunshine-oase/issues/4) | planned |
| 3 — Content | [#5](https://github.com/nanatsusaya/iris-sunshine-oase/issues/5) | planned |
| 4 — Defects, accessibility, SEO | [#6](https://github.com/nanatsusaya/iris-sunshine-oase/issues/6) | planned |
| 5 — Go-live | [#7](https://github.com/nanatsusaya/iris-sunshine-oase/issues/7) | planned |

> **The audit gate has now fired on a real advisory, and the shape of that failure is worth knowing
> (2026-08-05).** `fast-uri@3.1.3` on `main` fell under a high-severity advisory, so
> `npm audit --audit-level=high` failed on **every** branch cut from `main` — five red PRs whose own
> contents were all fine. The instinct to debug the branch is wrong here: read the failing *step*
> first, because a vulnerable dependency on `main` reddens everything downstream of it and only the
> PR that raises the version can clear it. #52 did (`fast-uri` → 3.1.5) and was therefore the merge
> that had to go first. `main` is green again.

**Phase 0 — analysis and foundation** (#2)**:** ✅ complete; the epic was closed by the owner on
2026-08-05, with its Definition of Done checked clause by clause in the
[closing comment](https://github.com/nanatsusaya/iris-sunshine-oase/issues/2#issuecomment-5197108173).

- ✅ The old WordPress site is analysed and documented (`docs/analysis/`): stack and data situation,
  content inventory, the full price list, the design system, a media inventory, and 28 defects as work
  packages `M-01`…`M-28`.
- ✅ All texts of the old site extracted to [`docs/content/`](content/README.md) via
  `tools/extract-wp-content.mjs` — the only versioned source of the old content.
- ✅ The WordPress export is PII-cleaned (2,216 contact-form submissions, 2 spam comments and every
  real e-mail address removed); `Archive/` is excluded from the repository entirely.
- ✅ `Archive/` cleaned up: 749.7 MB → 594.0 MB, protocol in `Archive/AUFRAEUMPROTOKOLL.md`.
  Backup and archival of it are the **owner's** responsibility, deliberately outside this repository.
- ✅ Process foundation: `CLAUDE.md`, ADR 0001 and the index, this file, the PR template, the issue
  forms (#17), `SECURITY.md` (#18), the contributor files (#19), labels, CI.
  - **The chooser was checked by the owner on the rendered page** (2026-08-05), not inferred from a
    passing parse: all four forms appear with their descriptions, the blank box is reduced to
    *"Maintainers only"* as `blank_issues_enabled: false` is documented to do, and the security
    contact link is present. Still unverified: whether the required fields actually block submission.
  - **No API can stand in for looking at that page.** GraphQL `issueTemplates` returns `[]` for this
    repository and `community/profile` reports `issue_template: null` — but so do both for
    `withastro/astro`, which demonstrably ships working YAML forms (checked 2026-08-05). Neither
    surface exposes YAML forms at all, so an empty result there is evidence in *neither* direction.
    Worth knowing before someone reads `[]` as breakage and repairs something that is not broken.
- ✅ **The method is declared** (2026-08-05): [`method.json`](../method.json) binds this repository's
  four artefacts to the roles of [agent-project-rules](https://github.com/nanatsusaya/agent-project-rules)
  catalogue 0.5, with **no adaptations** — all 32 rules are in force, which its coherence check
  verifies. The way of working had been followed since 2026-07-18 and never written down as a named
  thing. The five session procedures are adapted copies of that method's plugin; what was changed in
  them is in [`.claude/skills/README.md`](../.claude/skills/README.md).
- ✅ **The `docs/` paths are English** (#11, 2026-08-05): `analyse/` → `analysis/`, `inhalte/` →
  `content/`, `seiten/` → `pages/`, and the German file names with them. The **page slugs under
  [`content/pages/`](content/README.md) deliberately stay German** — they are identifiers of old-site
  URLs, and renaming them would break the mapping the redirect table exists to record.
  - **The rename had to edit four `Accepted` ADRs, and the owner ruled that this is maintenance
    rather than an amendment** (see *Decisions taken*). Nothing an ADR decides changed; only link
    targets moved.
- ✅ **`.gitignore` is English too** (#67, 2026-08-05) — the last German prose outside the two
  documented exceptions, found while working #11. Comment lines only: every pattern is byte-identical
  and `git check-ignore` resolves the same paths to the same rules. The block matters more than a
  comment usually does, because it is the written reason the `Archive/` exclusion is **blanket**, and
  a rule whose justification cannot be read is a rule the next session treats as arbitrary.

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
- ✅ [ADR 0003](adr/0003-content-model.md) — content model (#41) — **Accepted** (2026-07-19): Astro
  content collections at build time, YAML with comments, money as integer cents, a price as a
  discriminated union that expresses all six of the old site's special cases, opening hours as intervals
  with a validity period, and a **confirmation gate** so an unverified price is *unable* to render rather
  than merely unlikely to. Four of Astro's behaviours were measured against the scaffold rather than
  assumed — including the finding that a duplicate id only *warns* and the build still exits 0, which is
  why id integrity becomes a blocking check. **R1** turned the owner's own constraint — *"I do not know
  the current values yet, use dummy ones"* — into the gate's shape: unconfirmed content renders in
  `preview` and **fails the build** in `live`, and a placeholder must be false on sight. **R2** keeps the
  status badge but makes it fail in the cheap direction: it shows the closed state while the hours are
  unconfirmed, because a wrong *„geschlossen"* costs a telephone call and a wrong *„geöffnet"* costs a
  journey. State: **designed** — no data files yet.
- ▶ ADRs 0005, 0007 and 0008 outstanding.
- ✅ [ADR 0004](adr/0004-styling-and-design-tokens.md) — styling and design tokens (#35) — **Accepted**
  (2026-07-19): one semantic token tier, a 4 px spacing scale, a stepped type scale with `clamp()` at
  display sizes, a 34rem reading measure, mobile-first with two breakpoints, inline-SVG icons and
  wordmark, and self-hosted fonts. Derived by measurement from the owner's Claude Design draft, which
  already carried a stable 14-token layer and preserves `#FFC000` — the only colour the old site
  documented exactly. Three inherited defects close structurally: `M-09` becomes unexpressible under
  mobile-first, and spacing and maximum width get a system. State: **designed** — no CSS yet.
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
  docs → tokens → external-resource check.
- ✅ **The token layer** (2026-07-19): `src/styles/tokens.css` carries every colour, size, space and
  ratio ADR 0004 decided, and `tools/check-tokens.mjs` asserts the rules around them — no raw colour,
  no off-scale spacing, contrast holds, `--colour-accent` is never text, and `@media` uses only the two
  sanctioned breakpoints with no `max-width`. State: **draft** — the tokens exist and the holding page
  uses them; the designed homepage does not exist yet.
  - ✅ **The fonts are self-hosted** (2026-07-19). Cormorant Garamond 500 and the Mulish variable
    font, `latin` subset, 52 kB together, under the SIL Open Font License with its text shipped
    beside them. Provenance, checksums and how to reproduce the download:
    [`docs/fonts.md`](fonts.md). `tools/check-fonts.mjs` asserts six properties, of which one is the
    reason the check exists: **every character the built pages render must lie inside a shipped
    `unicode-range`**, so a future page containing a letter outside `latin` fails the build instead
    of rendering that one letter in a system font.
- ✅ **The content model** (2026-07-19): five collections, the discriminated-union price schema, the
  accessor module and the five checks of ADR 0003 §7. `docs/business-facts.md` folded into
  `src/content/business.yaml` and became a pointer; `src/config/business.ts` and its regex parsing of a
  Markdown table are gone. State: **draft** — the shape is complete, the values are placeholders.
- ✅ **The homepage** (2026-07-19): built from the design draft's turn 6, mobile-first, out of the
  tokens (#40) and the content model (#41). Header, hero, four service teasers, opening hours, contact
  and footer. Every figure on it is read from the model — `tools/check-content.mjs` rejects a price or
  a clock time typed into a template — and every invented one is struck through and labelled.
  State: **draft** — the layout is complete, the values and the photographs are not.
  - **Three defects were found by measuring the rendered page rather than by trusting the build**, and
    all three are fixed: a decorative glow disc 320 px wide inside a 272 px hero added a horizontal
    scrollbar at the reflow floor; „Öffnungszeiten" at `--text-3xl` was wider than its own panel at
    320 px; and the header used flexbox `order`, so a keyboard user tabbed from the wordmark to the
    far-right call button and back to the middle (WCAG 2.2 SC 2.4.3). None of them is visible in a
    passing build.
  - **The wordmark is text, not the inline SVG ADR 0004 §4 decided.** It needs two things that do not
    exist here: the sun as a vector (#39 — the draft ships a PNG) and the glyph outlines, which can
    only come from the two script fonts the ADR deliberately does not ship. Recorded in
    `src/components/Wordmark.astro`; a smaller wrong than a raster mark that does not scale.
  - **No photographs.** The frames are drawn at their aspect ratio and marked „Foto folgt", so
    arriving images cannot reflow the page (ADR 0004 §9). None of the old site's may be reused.
  - **No Impressum, and that is a go-live gate.** § 5 TMG attaches at cutover, not to a `noindex`
    preview that is not the studio's live site. Listed under Phase 5 below.
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

> **Two legal gates belong to this phase and are named here so they are not discovered on the day.**
> § 5 TMG requires a German commercial site to carry an **Impressum**, and § 13 TMG / Art. 13 DSGVO a
> **Datenschutzerklärung**; the preview carries neither, because it is `noindex`, unlinked and not the
> site being served to the public. Both attach at cutover. Separately,
> `docs/analysis/02-content-inventory.md` records the *old* site's Impressum as **legally outdated**, so
> the address, telephone and VAT rows in `src/content/business.yaml` need an explicit pre-go-live
> confirmation from the owner rather than one inherited from a page written in 2017.

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
| `npm ci --ignore-scripts`, `npm audit` gating, Dependabot npm entry | 0009 §2 | ✅ in force (2026-07-19); first stopped a real advisory 2026-08-05 |
| Explicit `permissions:` block per workflow | 0009 §3 | ✅ in force (2026-07-19) |
| External-resources fitness function | 0009 §6 | ✅ in force (2026-07-19) |
| CSP via `<meta http-equiv>` | 0009 §7 | ✅ in force (2026-07-19) |
| `SECURITY.md` | 0009 §9 (#18) | ✅ in force (2026-08-05) — best-effort wording, no invented service level |

## Decisions taken (not yet ADRs)

Recorded here so they are not lost before the owning ADR is written:

| Decision | Date | Owning ADR |
|---|---|---|
| Maintenance runs through GitHub issues, worked by an AI agent | 2026-07-18 | — (working model, `CLAUDE.md`) |
| Repository artefacts in English; conversation in German | 2026-07-18 | — (`CLAUDE.md`) |
| Site content German by default, English as an additional locale | 2026-07-18 | 0005 |
| No contact form — telephone and e-mail only | 2026-07-18 | 0007 |
| `Archive/` excluded wholesale; no Release upload (public repository) | 2026-07-18 | — (`.gitignore`, `docs/analysis/06`) |
| Issue forms are English, like every other repository artefact — **no** exception for the two aimed at non-developers | 2026-08-05 | — (`CLAUDE.md` language rule, unchanged) |
| Code-of-conduct enforcement contact is the owner's **GitHub account** plus GitHub's abuse form — no e-mail address, and never the studio's | 2026-08-05 | — (#19, `.github/CODE_OF_CONDUCT.md`) |
| Repairing a link inside an `Accepted` ADR because a file moved is **maintenance, not an amendment** — no *Amendments* entry, and this row is the authorisation | 2026-08-05 | — (ADR 0001's immutability rule, unchanged) |

## Open questions for the owner

- **Image material** — no image can be used until its provenance is documented. Whether to re-shoot
  the studio or re-license stock is an owner call with cost implications.
- **Content scope** — `docs/analysis/02-content-inventory.md` rates each old page as keep, rework or
  drop. The drops need confirmation.

## Next step

**The preview URL** (Phase 2, #4) — and it is the owner's move, not an agent's. The homepage, the
token layer, the content model and the fonts are all in place; what is missing is the two netcup and
GitHub Pages actions listed below. Until they happen the epic's Definition of Done — *a URL the owner
can open* — stays unmet no matter what else ships, which is worth saying plainly rather than letting
the work drift on around it.

**The homepage and the fonts shipped on 2026-07-19**, and the ordering note that used to stand here is
spent: the homepage waited for the content model rather than following the token layer directly,
because as drawn it needs opening hours and four price teasers and neither had an authority. Building
it first would have meant typing an opening time into a template — the exact defect this project exists
to remove, on day one of the implementation. That worked; nothing on the page carries a figure of its
own.

**There is no decision-free work left.** That list ran through the whole of Phase 0 and is now empty:
#67 was the last entry on it. Saying so plainly is the point of this section — an agent arriving here
should stop and ask rather than go looking for something to pick up, because everything still open
needs the owner.

**Owner-gated.** Note that `agent-ready` means a ticket is ready to be *worked*, not that working it
needs no answers — #17 and #19 both carried the label and both contained a question only the owner
could settle. Read the ticket, not the label.

- **#39** (the sun as a vector) — the mark has to be **obtained**, not written; it is the owner's own
  work, listed under what the owner owes the repository below.
- **ADRs 0005, 0007 and 0008**, each as its own two-PR cycle. They exist in order to put questions to
  the owner, so an agent can draft one but never finish it alone.

The pages the homepage cannot yet link to — Leistungen & Preise, Über uns, Kontakt — are Phase 3 and
wait on the owner's figures.

### The repository currently contains invented prices and opening hours, on purpose

The owner does not yet have the current values and will supply them (2026-07-19). Under ADR 0003 **R1**
the repository holds placeholders until then, and the arrangement that makes this safe rather than
reckless is:

- every placeholder entry is `confirmed: false`;
- the **`live` build fails** if any rendered entry is unconfirmed — so no placeholder can reach the
  public site by any route, including being forgotten about;
- placeholders are **false on sight** — repdigit amounts (11,11 €) and implausible clock times, never a
  tidy `10:00 – 18:00` that would survive a screenshot as though it were real.

**Nothing here may be read as a price or an opening time of the studio.** `docs/analysis/` remains the
record of the *old* site, itself undated and unconfirmed.

**Two owner actions still gate the preview URL** and neither blocks the work above:

1. Verify the apex domain with GitHub (ADR 0009 §5, R3) — *Settings → Pages → Add a domain*, then the
   `TXT` record at netcup.
2. Add the `preview` `CNAME` at netcup → `nanatsusaya.github.io` (ADR 0006 §2), then enable Pages with
   *Source: GitHub Actions* and re-enable the `push` trigger in `.github/workflows/deploy.yml`.

**Two things the owner owes the repository**, both now on the critical path for content rather than for
the build:

- **The sun as a vector.** R4 records it as the owner's own work, which clears the provenance gate, but
  the draft ships a PNG. §4 puts an inline-SVG wordmark beside it and the old site's `Logo-Sun.svg` was a
  PNG in an SVG wrapper — repeating that would be the same defect twice.
- **Photographs and their provenance.** R3 confirms photographs are coming. None of the old site's may be
  reused: those rights are undocumented (`docs/analysis/06-media-inventory.md`). Each new one needs who
  took it, when, and confirmation that the studio holds the rights.

**Phase 0 is finished and its epic is closed** — #1, #9, #11, #12, #17, #18, #19 and #67, and #2 with
them on 2026-08-05.

What that does **not** mean is worth stating here, because "Phase 0 complete" is the kind of line a
later session reads as more than it says. Phase 0 established what the old site *said* and how work is
done here. It established nothing about what is **true today**: every price and opening hour in the
repository is a placeholder marked `confirmed: false`, and no image has documented provenance. Those
belong to Phase 3 and Phase 5 and are recorded there.
