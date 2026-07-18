# ADR 0001 — Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-07-18

## Context

This site is rebuilt and then maintained **indirectly**: the owner files GitHub issues, and an AI
agent works them. An agent starting a ticket has this repository and nothing else — no conversation
history, no memory of earlier sessions, no access to the excluded `Archive/`.

That makes undocumented decisions unusually expensive. A choice made in a chat and never written down
is not merely forgotten; it gets **re-litigated** by the next session, often differently, and the
codebase drifts toward whatever the most recent agent found reasonable. The old WordPress site is the
cautionary example: nobody recorded which images were licensed how, and eight years later that
information is simply gone.

The project is small. The temptation is to skip the ceremony and just build.

## Decision

We keep **Architecture Decision Records** as numbered Markdown files under `docs/adr/`, indexed in
[`docs/adr/README.md`](README.md). Each records the context, the decision and its consequences.

**Scope — what earns an ADR.** Anything that a later change would otherwise silently reverse, and
anything whose *rationale* is not obvious from the result:

- technology and tooling choices
- how content is structured and where its authority lives
- anything with legal or privacy consequences
- anything outward-facing: hosting, domains, indexing, third-party services
- deliberate constraints (what we refuse to do, and why)

Routine implementation work does not. If in doubt, ask whether a future agent could undo it without
noticing that a decision was being made — if yes, it needs an ADR.

**Status** is one of `Proposed` · `Accepted` · `Superseded` · `Planned` (ticketed, not yet written).

**`Accepted` means the decision is recorded and binding — it does **not** mean it is implemented.**
Implementation progress lives in [`docs/STATUS.md`](../STATUS.md). Reading an Accepted ADR as "already
built" is the most likely misreading and the one that causes work to be skipped.

**Immutability.** An `Accepted` ADR is immutable **except when the owner explicitly authorises an
amendment**, which is recorded in that ADR's *Amendments* section with the date and a note that the
owner authorised it. Absent that authorisation, a later ADR **supersedes** an earlier one rather than
editing it. The point is an audit trail: the reasoning that was valid at the time stays readable, even
once it has been overtaken.

**Workflow.** Branch `adr/NNNN-slug` from `main` → write the ADR with `Status: Proposed` and add it to
the index → open a PR that names the **open questions for the owner** → the owner merges → sync
`main` and flip `Proposed → Accepted` in both the ADR and the index as a direct follow-up commit. That
status flip is the single documented exception to the never-commit-to-`main` rule; it is mechanical
and carries no reviewable content.

## Consequences

- A durable, greppable decision log that survives session boundaries and does not depend on any chat
  history — the precondition for the agent-maintained workflow this project is built around.
- Overhead per decision. Accepted deliberately: for a site this small the ADR set should stay in the
  range of a handful, not dozens. An ADR per trivial choice would bury the load-bearing ones.
- Amendments are possible but gated on explicit owner authorisation and are logged, so the audit trail
  survives.
- A two-step dance for every decision (propose, then flip to accepted). Slower than deciding in a
  commit; the point is that the decision becomes reviewable *before* code depends on it.
