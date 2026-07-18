---
name: adr-author
description: >-
  Use when writing a new Architecture Decision Record, or fleshing out a Planned one, for this project
  (files in docs/adr/). Covers classifying the change (new vs. amendment vs. superseding), the required
  structure and house style, the branch → Proposed → PR-with-owner-questions → merge → Accepted
  workflow, and the index and STATUS updates. Not for code changes.
---

# Iris Sunshine Oase — ADR author

Authoring or reworking an ADR is a repeatable procedure. Follow it exactly: ADRs are **normative**
(`CLAUDE.md`) and every later change is bound by them. Keep the ADR a *decision record*, never a shadow
implementation.

## 0. Read the ground truth first

- `docs/adr/0001-record-architecture-decisions.md` — the rules this whole procedure implements: what
  earns an ADR, the four statuses, immutability, the workflow. Read it, do not paraphrase it from memory.
- `docs/adr/README.md` — the index: current statuses and the next free number. ADRs 0002–0008 are
  already **reserved by topic** there; take the reserved number for your topic rather than appending a
  new one.
- `docs/STATUS.md` — current phase, what is actually built, the intended next decision.
- The **owning issue** (`gh issue view <n>`) — its Context, its decisions-to-make, its acceptance
  criteria. The open questions the ticket lists are the ones the ADR must surface, not silently answer.
- Every **Accepted ADR this one depends on or touches** — actually read them.
- `docs/analyse/` for what the old site did and why it was wrong. Most decisions here are a reaction to
  a specific documented defect; cite it (`M-NN`) rather than arguing from first principles.
- `CLAUDE.md` guardrails, especially "do not implement ahead of a decision" and the stop-and-ask list.

## 1. Classify the change (decision tree)

- **New decision** → new ADR at its reserved `NNNN`, or the next free number if the topic is not
  reserved.
- **Change to an `Accepted` ADR** → **STOP and ask the owner.** Accepted ADRs are immutable except with
  explicit owner authorisation, recorded in that ADR's *Amendments* section with the date (ADR 0001).
  Without that authorisation a changed decision needs a **superseding** ADR, not an edit.
- **Supersede** an earlier decision → new ADR with `Supersedes: NNNN`; set the old ADR's status to
  `Superseded` in both the file and the index.

## 2. Branch + files

- Branch `adr/NNNN-slug` from current `main`.
- Create `docs/adr/NNNN-slug.md` with `Status: Proposed`.
- Set the index row in `docs/adr/README.md` to **Proposed** and **link the file**.
  `node tools/check-docs.mjs` asserts that every ADR is indexed and that the status in the file matches
  the status in the index — run it before pushing.

## 3. Structure & house style

**Header** — a bullet list, matching ADR 0001:

- `**Status:**` one of `Proposed` · `Accepted` · `Superseded` · `Planned`
- `**Date:**` `YYYY-MM-DD`
- `**Depends on:**` linked ADRs, naming the **specific sections** relied on, where the dependency is
  real — plus `**Supersedes:**` or an `## Amendments` section where they apply

**Body:**

1. **Context** — the forces, the current state of the repository, what an earlier ADR already settled
   versus what is still open. Where the old site is the reason for the decision, cite the defect from
   `docs/analyse/05-maengelliste.md` by its `M-NN` identifier.
2. **Decision** — numbered `### 1. …` subsections. Make *decisions*, not a literature review. **Reuse**
   existing ADRs instead of re-deciding their subject matter, and cite them (`ADR 000X §Y`). Prefer
   **enforceable** choices: anything `tools/check-docs.mjs` could assert should become a check rather
   than a rule nobody re-reads.
3. **Consequences** — **Positive** and **Negative / costs**, honestly. Name the real downsides; an ADR
   whose consequences are all positive has not been thought through.
4. **Alternatives considered** — each with a one-line "rejected because …".
5. **Open questions (for owner review)** — `O1..On`, the genuinely owner-domain choices, each with a
   recommended default. Do **not** self-answer these. On this project that includes anything touching
   business content, cost, hosting, legal exposure or a third-party service.
6. **References** — the ADRs, docs and issue.

**Scale it to the project.** This is a 14-page brochure site for a single studio. Prefer the boring,
small solution and avoid speculative infrastructure — but record a deferred concern as a ticket so it is
not silently lost.

## 4. Open the PR

- `Closes #<issue>` if it fully resolves the ticket — as **plain text, never inside backticks**, or
  GitHub silently will not auto-close it.
- Use `.github/PULL_REQUEST_TEMPLATE.md`. The body states **what** · **why** · **which issue and ADR** ·
  **how it was verified** (`node tools/check-docs.mjs`) · **merge-order caveats** · **follow-ups**, and
  ends with the Claude Code line. Surface `O1..On` prominently — the open questions are the reason the
  owner is reading this PR at all.
- The template's **Content sources** section still applies: if the ADR quotes a business fact, name where
  it came from. A fact with no source does not ship.

## 5. After the owner answers the open questions

- Fold the answers into the Decision sections, and convert **"Open questions"** into **"Resolved
  questions (owner decisions, YYYY-MM-DD)"**, recording `R1..Rn`: what was decided, and why. Push to the
  same PR and leave a short resolution comment. The answers belong in the ADR, not only in the PR thread
  — a future agent reads the file, not the conversation.

## 6. After the owner merges

- Sync `main`, then flip **`Proposed → Accepted`** in both the ADR header and the index, as a direct
  follow-up commit on `main`. This is the one workflow-sanctioned non-PR commit (ADR 0001). Delete the
  branch.
- Update `docs/STATUS.md` if this changes the roadmap or the phase state — and keep the wording honest:
  an `Accepted` ADR moves a capability to **designed**, never to **built**.

## Quality bar

Run [adr-review-checklist.md](adr-review-checklist.md) before opening the PR. Language: **English**,
British spelling.
