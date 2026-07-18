# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A rebuild of **iris-sunshine-oase.de** — the website of *Iris' Sunshine Oase*, a tanning and cosmetics
studio in Herxheim bei Landau (Pfalz, Germany). The site is a real business's public presence: an
existing WordPress installation from 2017, still online and still receiving customers, to be replaced
by a statically generated site.

**This is a small project with a high correctness bar.** There is no scale problem to solve, no
complex domain to model — but the prices, opening hours and address on this site are what customers
act on. A wrong price is a production defect, not a typo.

Read [`docs/README.md`](docs/README.md) first; it is the single source of truth and indexes everything
else. [`docs/STATUS.md`](docs/STATUS.md) holds the current phase and next step — check it before
starting work. This file (`CLAUDE.md`) holds the stable operating rules, not the current state.

## Project state

The old site is **still live at netcup** and stays live until an explicit cutover. Nothing in this
repository touches it. Until then, the rebuild is a draft.

The scaffold does not exist yet — this repository currently contains documentation only. Commands, the
build chain and the Definition of Done's technical steps land once ADR 0002 (tech stack) is `Accepted`
and the scaffold ships. Until then, **do not assert a tech stack in code or docs**: the target is
Astro (owner's decision), everything around it — package manager, styling approach, test tooling — is
still open and belongs in an ADR, not in a passing commit.

## Session skills

Four skills in `.claude/skills/` make the recurring session rituals repeatable, so
that starting, continuing and closing a session is a procedure rather than an improvisation. They are
adapted from the sibling project *grimora*; the names are German because the owner types them, while
their contents are English like every other artefact.

| Skill | When |
|---|---|
| `moin` | Session bring-up. Orients from the living docs and **ends with a question, never an action**. |
| `weiterimtext` | Mid-session, after the owner merged a PR: close the unit out, re-verify the world, start the next task only if it is decision-free. |
| `feierabend` | Session wind-down. Tidy git, finish or park work honestly, bring the living docs current. |
| `adr-author` | Writing or reworking an ADR. Encodes ADR 0001's workflow and the house style. |

## Architecture (read the ADRs before changing structure)

Every significant decision is recorded in [`docs/adr/`](docs/adr/README.md) and is **normative**.

This is a static site, so "architecture" here mostly means **where content lives and how it becomes
HTML**. The load-bearing principle, carried over from the analysis of the old site:

**Content is structured data, not markup.** Prices, opening hours, services and treatments live in
typed data files with one authoritative definition each; templates render them. The old site's central
defect was the opposite — the same price existed in an Elementor layout block, a pricing-table widget
and a text paragraph, and they drifted apart. A fact duplicated away from its authority degrades into
an assertion.

## Working conventions specific to this repo

- **Content correctness outranks everything.** Prices, opening hours, the address, the phone number
  and the Impressum data are **facts about a real business**. Never invent, guess or "reasonably
  assume" one. Take them from [`docs/inhalte/`](docs/inhalte/README.md) (the verbatim extract of the
  old site) or ask the owner. If a value cannot be sourced, leave it out and raise it — an empty field
  is recoverable, a wrong price is not.
- **Bugs before features** — always prioritise fixing a defect over new work.
- **ADRs are the source of truth for decisions.** An `Accepted` ADR is immutable **except with
  explicit owner authorisation**, recorded in that ADR's *Amendments* section (ADR 0001). Otherwise a
  new decision needs a superseding ADR, not an edit.
- **Per-ADR workflow**: branch `adr/NNNN-slug` from `main` → write the ADR (`Status: Proposed`, add it
  to `docs/adr/README.md`) → open a PR that states the **open questions for the owner** → owner merges
  → sync `main`, delete the branch → **a second PR** folds the owner's answers into the ADR as resolved
  questions and flips `Proposed → Accepted` (ADR file + index).
- **`Accepted` means the decision is recorded and binding — not that it is built.** Implementation
  progress is tracked in `docs/STATUS.md`, never inferred from an ADR's status.
- **No image enters this repository without documented provenance.** The old site's image rights are
  undocumented (see `docs/analyse/06-medien-inventar.md`); Pixabay changed its licence terms in 2019,
  so "it was CC0 when we downloaded it" is not a record. Every image under version control needs its
  source, licence and evidence written down. No "provisionally" — an unsourced image is not added.
- **`Archive/` stays excluded.** It holds ~600 MB of rights-unclear images and a database export with
  third-party personal data. The `.gitignore` rule is deliberately **blanket** — do not weaken it with
  per-file exceptions, do not re-add any part of it, and do not attach it to a GitHub Release: **this
  repository is public, and release assets of a public repository are public too.**
- **Never commit real personal data.** No customer names, e-mail addresses, IP addresses or form
  submissions in content, fixtures, tests or logs. The business's own contact details are public by
  law (Impressum) and are fine; anything belonging to a third party is not.
- **The preview must not be indexed until go-live.** The GitHub Pages preview shows a real business's
  name, address and prices, and it is reachable under the studio's own domain, so a half-finished draft
  must not compete with the live site in search results. The mechanism is **`noindex` on every page,
  and a `robots.txt` that does not block crawling** — deliberately not both belts (ADR 0006 §4).
  Blocking the crawl stops the crawler from ever reading the `noindex`, and a URL nobody may fetch can
  still be indexed by name; the two together are weaker than `noindex` alone. Removing the `noindex` is
  an explicit go-live gate, never a side effect of another change — and **adding a `Disallow` is not a
  safety improvement**, it defeats the gate.

## Delivery workflow & PRs

- **Every change goes on a branch and through a PR — never commit directly to `main`.** There is **no
  exception**; `main` is branch-protected and enforces this against administrators too (ADR 0009 §4),
  so a direct push will simply be refused. **The owner merges every PR.** After a merge, sync `main`,
  prune, and delete the merged branch.
- **Required approving reviews are set to zero on purpose** — the owner authors and merges, and GitHub
  forbids approving one's own PR, so any non-zero count would deadlock `main` rather than improve it.
  Review happens because the owner reads the PR. Do not "fix" this setting.
- **No third-party GitHub Action.** Only GitHub-owned actions (`actions/*`) may run, enforced by
  repository policy, and every `uses:` must be pinned to a full commit SHA (also enforced). Needing
  another publisher is an owner decision, not a workflow edit (ADR 0009 §3, R2).
- **One concern per PR** — split unrelated changes so each stays reviewable in isolation. Don't fold
  refactors, formatting churn or dependency upgrades into unrelated work.
- **Commits & PRs:** Conventional Commits (`type(scope): summary`, imperative subject, body explains
  the *why*); end commit messages with the `Co-Authored-By` trailer and PR bodies with the Claude Code
  line. A PR body states **what**, **why**, **which issue/ADR it follows**, how it was **verified**,
  any **merge-order** caveats, and known **follow-ups**. Branch prefixes: `adr/…`, `feat/…`, `fix/…`,
  `chore/…`, `docs/…`.
- **Definition of Done (before handing work back):** the local check chain is green; **for anything
  with visible output, verify it in a browser** — look at the rendered page, don't just trust that the
  build passed; the PR's CI is green. **Report outcomes faithfully**, including failures and skipped
  steps.
- **Only hand a task back when you are ≥ 95 % confident it is correct, complete and safe.** The owner
  delegates and reviews mainly essential questions and the PRs, so the bar for "done" is high — if you
  are not that confident, keep working or raise the specific uncertainty instead of returning it.

## Working with the owner

- **Surface owner-domain decisions before acting** — anything about the business itself (prices,
  services, wording, opening hours), roadmap and sequencing, legal and licensing questions, hosting
  and provider choices, and anything hard to reverse or outward-facing. Recommend a default, but let
  the owner choose. **Stop and ask** in particular before: amending an Accepted ADR; publishing
  anything (pushing to a public remote, a Release, a deploy that changes a public URL); changing the
  live site or anything at netcup; adding an image whose rights are unclear; introducing external
  network calls, tracking, analytics or a third-party embed; or a cutover step.
- **Verify external facts from primary sources** (library capabilities, licence terms, legal
  obligations, provider limits) rather than asserting from memory; cite the source.
- **Scale decisions to the project's actual stage** — a 14-page brochure site for a single studio.
  Prefer the boring, small solution; avoid speculative infrastructure. But record deferred concerns as
  tickets so nothing is silently lost.
- **Language:** **all repository artefacts are written in English** — code, comments, ADRs, everything
  under `docs/`, READMEs, commit messages, PR titles and bodies, and issues. **Direct conversation
  with the owner is in German.**

  **British spelling** (owner's decision, 2026-07-18): `colour`, `licence` as a noun, `analyse`,
  `behaviour`, `authorisation`, and `-ise` rather than `-ize` throughout. Not a matter of taste —
  a repository that drifts between both reads as though several people wrote it, and in a project
  written entirely by agents that impression is the thing to avoid. Identifiers that mirror an
  external API keep that API's spelling (`phpUnserialize`, `JSON.stringify`).

  Two deliberate exceptions:

  1. **`docs/inhalte/`** is a verbatim extract of the old German site. The *framing* (headings, table
     headers, explanatory prose) is English; the **quoted page content stays German and unmodified**.
     It is source material, not documentation — translating it would destroy the record. The generator
     `tools/extract-wp-content.mjs` produces it; correct the generator, never the output.
  2. **User-facing site content** is German by default, with English as an additional locale (owner's
     decision, 2026-07-18). Handled via i18n, not by writing project docs in German.

## Documentation & comments

Comments and docs explain **why**, not **what** — the purpose, the constraint, the thing a reader
could not infer from the code. Verbose is fine; clarity for a future agent outweighs brevity.

**Keep docs current in the same change.** When behaviour changes, update the affected inline docs
**and** the relevant Markdown (ADRs, `STATUS.md`, READMEs) in the *same* PR. Stale documentation is a
defect, and in a project maintained through tickets by agents it is the most expensive kind — it
silently misinforms every future session.

The documentation is **self-supporting by design**: an agent working a ticket has this repository and
nothing else — no conversation history, no access to `Archive/`, no memory of how a thing came to be.
Everything needed to do the work correctly must be written down here.

**[`docs/meta/agent-collaboration-log.md`](docs/meta/agent-collaboration-log.md)** carries the other
half of that: not *what* was decided, but why the way we work looks the way it does — owner corrections
and their rationale, workflow experiments, and the mistakes that produced a rule. Write an entry only
for a genuinely methodological moment, never for routine task execution; the test is whether an agent
with no memory of that session would decide worse without it. Like every other change it goes through
a PR — it may ride along with the `STATUS.md` sync, since both are the same concern.

## Tickets (issues) — Definition of Ready / Done

Agents write the tickets too; hold them to the same bar as code.

- **Definition of Ready** (before a ticket is worked): a scoped title with priority; **Context** (the
  problem or goal, and *why* it exists); concrete scope — "decisions to make" for an ADR, or
  **testable acceptance criteria** for implementation; links to the parent epic and related
  ADRs/issues; and any constraints (legal, content-correctness, ADR references).
- **Definition of Done** (before closing): acceptance criteria met and **verified**; code **and** docs
  updated; CI green; the PR merged; for ADR tickets the ADR is `Accepted` and the index and
  `STATUS.md` are synced; the ticket closed via a `Closes #NN` line in the PR body — written as
  **plain text, never inside backticks or a code span**, or GitHub silently will not auto-close it.

Labels run on four axes — `type:` · `priority:` · `area:` · `phase:` — plus `epic`, `blocked` and
`agent-ready`.

## Agent guardrails

- **Read before writing.** Before changing anything, check `docs/STATUS.md`, the owning ADR(s), and
  `docs/analyse/` for what the old site did and why it was wrong. Do not invent folders, packages or
  abstractions that no Accepted ADR covers.
- **Do not implement ahead of a decision.** If a task would settle in code something a still-`Planned`
  ADR owns, write or update the ADR first; don't decide it silently in a commit.
- **Do not restate a fact that has an authority.** A price, an opening time or a service name has
  exactly one definition in the content data. If you need it in a template, read it from there.
- **The old site is a source, not a target.** `docs/analyse/05-maengelliste.md` lists 28 known defects
  of the old site — reproducing its structure faithfully means reproducing those. Check the list
  before mirroring an old-site behaviour.
