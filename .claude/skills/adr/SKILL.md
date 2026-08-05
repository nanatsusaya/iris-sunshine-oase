---
name: adr
description: >-
  Use when writing a new Architecture Decision Record, or fleshing out a Planned one, for this project
  (files in docs/adr/). Covers classifying the change (new vs. amendment vs. superseding), the required
  structure and house style, the branch → Proposed → PR-with-owner-questions → merge → second-PR-to-
  Accepted workflow, and the index and STATUS updates. Not for code changes.
---

# ADR — writing a decision record

*Carries out rules D1, D2, D3 and G2 of
[agent-project-rules](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md).
The catalogue is the authority for the rules,
[ADR 0001](../../../docs/adr/0001-record-architecture-decisions.md) for this project's decision
process, and this file only for the procedure that carries them out.*

Authoring or reworking an ADR is a repeatable procedure. Follow it exactly: ADRs are **normative**
(`CLAUDE.md`) and every later change is bound by them.

Keep it a *decision record*, never a shadow implementation. If a section is turning into a design
document, the design belongs elsewhere and this file should say which choice was made and why the
alternatives were not.

**Guardrails (do not violate):**

- **Do not answer the open questions yourself.** They exist because they belong to the owner.
- **Do not edit an `Accepted` ADR.** See step 1.
- **Do not implement what this ADR is still deciding.**

## 0. Read the ground truth first

- [`docs/adr/0001-record-architecture-decisions.md`](../../../docs/adr/0001-record-architecture-decisions.md)
  — the authority for what earns an ADR, the four statuses, immutability and the workflow. Read it; do
  not paraphrase it from memory.
- [`docs/adr/README.md`](../../../docs/adr/README.md) — the index: current statuses and the next free
  number. ADRs 0002–0008 are **reserved by topic** there; take the reserved number for your topic
  rather than appending a new one.
- [`docs/STATUS.md`](../../../docs/STATUS.md) — the current phase, what is actually built, and which
  decision this one is meant to unblock.
- The **owning issue** (`gh issue view <n>`) — its context, its decisions-to-make, its acceptance
  criteria. The open questions the ticket lists are the ones the ADR must surface, never silently
  answer.
- Every **`Accepted` ADR this one depends on or touches** — actually read them.
- [`docs/analysis/`](../../../docs/analysis/README.md) for what the old site did and why it was wrong.
  Most decisions here react to a specific documented defect; cite it by its `M-NN` identifier rather
  than arguing from first principles.
- `CLAUDE.md`, especially its stop-and-ask list and "do not implement ahead of a decision".

## 1. Classify the change

- **A new decision** → a new ADR at its reserved `NNNN`, or the next free number where the topic is not
  reserved. Numbers are never reused.
- **A change to an `Accepted` ADR** → **stop and ask the owner.** An `Accepted` ADR is immutable except
  with explicit owner authorisation, recorded in that ADR's *Amendments* section with the date and the
  superseded wording quoted verbatim (ADR 0001). Without that authorisation, a changed decision needs a
  **superseding** ADR, not an edit.
- **Superseding** → a new ADR with `Supersedes: NNNN`; set the old one's status to `Superseded` in both
  the file and the index.

## 2. Branch and files

- Branch `adr/NNNN-slug` from the current `main`.
- Create `docs/adr/NNNN-slug.md` with `Status: Proposed`.
- Set the index row in `docs/adr/README.md` to **Proposed** and **link the file**, in the same change.
  An unlisted ADR is invisible to the index check and to the next session.
- `node tools/check-docs.mjs` asserts that every ADR is indexed and that the status in the file matches
  the status in the index. Run it before pushing, as its own command — a pipeline reports only the last
  command's status, so chaining checks can hide a failure.

## 3. Structure and house style

**Header** — a bullet list, matching ADR 0001:

- `**Status:**` one of `Proposed` · `Accepted` · `Superseded` · `Planned`
- `**Date:**` `YYYY-MM-DD`
- `**Depends on:**` linked ADRs, naming the **specific sections** relied on where the dependency is
  real — plus `**Supersedes:**` or an `## Amendments` section where they apply

**Body, in this order:**

1. **Context** — the forces, the current state of the repository, what an earlier ADR already settled
   versus what is genuinely open. State the problem so that a reader who disagrees with the outcome can
   still see it was the right problem. Where the old site is the reason, cite the defect from
   `docs/analysis/05-defect-list.md` by its `M-NN` identifier.
2. **Decision** — numbered `### 1. …` subsections, each making an actual choice rather than surveying
   one. **Reuse** existing ADRs instead of re-deciding their territory, and cite them (`ADR 000X §Y`).
   **Prefer formulations something could check**: a choice phrased so a command can decide whether it
   holds becomes a check, while a choice phrased as a principle becomes folklore.
3. **Consequences** — **Positive** and **Negative / costs**, honestly. An ADR whose consequences are all
   positive has not been thought about, and the reader can tell.
4. **Alternatives considered** — each with a one-line "rejected because …".
5. **Open questions (for owner review)** — `O1..On`, the genuinely owner-domain choices, each with a
   recommended default. Do **not** self-answer them. Here that includes anything touching business
   content, cost, hosting, legal exposure or a third-party service.
6. **References** — the ADRs, docs and the issue.

**Scale it to the project.** This is a 14-page brochure site for a single studio. Prefer the boring,
small solution and avoid speculative infrastructure — but record a deferred concern as a ticket so it
is not silently lost.

## 4. Open the PR

- Use `.github/PULL_REQUEST_TEMPLATE.md`. The body states **what** · **why** · **which issue and ADR** ·
  **how it was verified** · **merge-order caveats** · **follow-ups**, and ends with the Claude Code
  line.
- **Surface `O1..On` prominently** — the open questions are the reason the owner is reading this PR at
  all, and a numbered list buried in prose gets answered partially with nobody noticing which ones were
  skipped.
- `Closes #<issue>` if it fully resolves the ticket — as **plain text, never inside backticks**, or
  GitHub silently will not auto-close it.
- The template's **Content sources** section still applies: if the ADR quotes a business fact, name
  where it came from. A fact with no source does not ship.

## 5. After the owner answers the open questions

Fold the answers into the *Decision* sections, then convert **Open questions** into **Resolved
questions (owner decisions, YYYY-MM-DD)**, recording `R1..Rn`: what was decided, and why. The answers
belong in the ADR, not only in the PR thread — a future agent reads the file, not the conversation.

## 6. The status flip is a second PR

After the owner merges: sync `main`, delete the branch, then open a **second pull request** that folds
in the resolved questions from step 5 and flips **`Proposed → Accepted`** in both the ADR header and
the index.

> **This is a deliberate divergence from the method's own `decision-record` procedure**, which sets
> `Accepted` on the branch before the merge. Here the flip is a second PR because the owner answers the
> open questions **on** the first PR — so at the moment that PR merges the questions are not yet
> answered, and `Proposed` is the true status rather than a stale one.
> [ADR 0001](../../../docs/adr/0001-record-architecture-decisions.md) *Workflow* is the authority and
> says so in as many words. Changing this would mean amending an `Accepted` ADR, which is an owner
> decision and not a tidy-up. Do not "fix" it toward the plugin.

> **There is no direct-commit exception.** ADR 0001 once sanctioned the status flip as the one
> permitted commit straight to `main`; that was **withdrawn on 2026-07-18** (owner-authorised, ADR 0001
> *Amendments*, arising from ADR 0009 §4). `main` is branch-protected against administrators too, so a
> direct push is refused rather than merely discouraged.

## 7. After it merges

Update `docs/STATUS.md` if this changed the roadmap or the phase state — and keep the wording honest:
an `Accepted` ADR moves a capability to **designed**, never to **built**.

## Quality bar

Run [the ADR review checklist](adr-review-checklist.md) before opening the PR. Language: **English**,
British spelling.
