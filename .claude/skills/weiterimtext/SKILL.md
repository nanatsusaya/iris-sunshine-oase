---
name: weiterimtext
description: >-
  Use mid-session to move cleanly from a just-merged PR to the next task — the seam between two units
  of work, the counterpart to /moin (session bring-up) and /feierabend (session wind-down). After the
  owner merges a PR: confirm it actually landed, tidy the git and branch state, bring the living docs
  current, then re-validate the next task against current reality and start it ONLY if it is genuinely
  agent-ready and decision-free — otherwise surface the decision and stop. Keeps the session's context;
  re-verifies the external world before writing. Triggered by the owner ("PR gemergt, weiter im Text").
---

# Weiter im Text — the seam between two units of work

*Carries out rules S1, S2, G1 and C4 of
[agent-project-rules](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md).
The catalogue is the authority for the rules; this file is only the procedure.*

Between finishing one unit of work and starting the next there is a **seam**, and the seam is where
things quietly go wrong: a branch is left dangling, `docs/STATUS.md` drifts, or the next task you had
in mind was already done — or invalidated — by a merge that happened while you were busy.

This runs **mid-session**, so it is deliberately light. You are already oriented — do **not** re-brief
project identity, history or standing rules. Focus on the seam.

## The principle: keep your context, re-verify the world

The context accumulated this session — the decisions, the reasoning, the *why* — is an **asset. Keep
it.** This procedure does not ask you to distrust it or start from a blank slate.

What changes outside your control is the **shared, external state**: `main`, open PRs, issue status
and the actual contents of `origin`. The owner moves those while you work.

That is not hypothetical here. It has already happened twice in this repository, in one session:

- The owner merged PR #1 while a second commit was being prepared against it, which orphaned that
  commit. It had to be cherry-picked onto a fresh branch.
- Worse, the diagnosis went wrong first: `gh pr view` returned **stale** data showing the old head, and
  that was believed over the repository. `git ls-remote` had the truth the whole time.

So the discipline is narrow and specific: **before writing to a shared artefact or committing to the
next task, re-fetch and re-check the external state — and when two sources disagree, believe the one
closest to the git data.**

Losing your own context to be safe costs everything you worked out this session and prevents none of
that.

**Guardrails (do not violate):**

- **Gated autonomy — the crux.** Steps 1 to 3 run autonomously. Starting the next task in step 5 does
  **not**: begin only when the task is genuinely **agent-ready and decision-free**. Stop and ask if it
  needs an owner-domain decision — a business fact (price, service, wording, opening hours), roadmap
  and sequencing, an image whose rights are unclear, anything legal or licensing, hosting or provider
  choice, an external network call, tracking, analytics or a third-party embed, publishing anything
  public, touching netcup or the live site, amending an `Accepted` ADR, or a cutover step. Also stop if
  the ticket is an **epic that must be decomposed with the owner first**, or is simply ambiguous.
- **The owner merges every PR.** This procedure never merges. It runs *after* a merge the owner already
  performed — step 1 verifies that; if the PR is not actually merged, it stops.
- **Never commit to `main`, without exception.** Every change, including the doc-sync in step 3, goes on
  a branch through a PR. `main` is branch-protected against administrators too, so a direct push is
  refused rather than merely discouraged.
- **Owner conversation is German**; repository artefacts stay English (`CLAUDE.md`).

## 1. Did the unit actually close?

Do not tidy up work that is not finished. Read the **current** state fresh; do not assume:

- `git fetch` first, then `git status` and `gh pr list` — confirm the just-finished PR is **actually
  merged**, not merely opened, approved or green.
- If it is **not** merged (the owner has not merged it, CI is red, or changes were requested), or there
  is uncommitted or dangling work that was not part of the merged unit — **stop here.** Report the real
  state plainly and let the owner resolve it. Cleaning up on a false premise destroys work.

## 2. Git and branch hygiene

- `git checkout main && git pull --ff-only origin main` — sync to the merged state.
- Delete the merged branch: `git branch -d <branch>` locally; the remote branch is usually
  auto-deleted on merge, so a failing `git push origin --delete` just means it was already gone.
- `git fetch --prune`. End on `main` with a clean working tree.

## 3. Bring the living docs current — after re-checking external state

The finished PR may have changed *what is true*; a **parallel** change may have recorded it already. So
re-verify before writing:

- Re-read the **current** `docs/STATUS.md` on the freshly synced `main`, plus recent merges
  (`git log --grep="Merge pull request" -5`) and open PRs, to see whether the state is **already**
  reflected. If another change got there first, do not duplicate it — note it and move on.
- Only if genuinely stale, update `docs/STATUS.md` and any other affected living doc: the ADR index, a
  README, `docs/analyse/05-maengelliste.md` if a defect was closed. This is a normal branch-and-PR
  change, kept to one concern; a doc-sync PR is its own PR.
- `docs/meta/agent-collaboration-log.md` — only if a genuinely methodological moment occurred: an owner
  correction and its rationale, a workflow experiment, a mistake worth not repeating. Not routine task
  execution. It may ride along with the `STATUS.md` sync, since both are the same concern.

## 4. Re-validate the next task against current reality

Take the **single clearest next task** from `docs/STATUS.md` → *Next step* and its GitHub issue — but
treat the plan you formed earlier as a **hypothesis**, because the world may have moved:

- **Still the right next step?** Or has a merge reordered priorities — or is there now a **bug**, which
  jumps the queue?
- **Already done or obsolete?** Re-read the issue's current state and acceptance criteria.
- **Preconditions met?** The dependencies it names — another ticket, an ADR being `Accepted` — are they
  actually in place *now*? `Accepted` means decided, not built: it is a precondition for implementing a
  decision, never evidence that it already was.
- **Owner decision open?** Check it against the stop-and-ask list in the guardrails above. The most
  frequent trigger on this project is a **business fact with no source** — if the task needs a price, an
  opening time or a wording that is not in `docs/inhalte/`, that is the gate, not a detail to resolve
  along the way.

## 5. Start clean, or stop

- **Agent-ready and decision-free:** cut a fresh branch from the up-to-date `main` (`feat/…`, `fix/…`,
  `docs/…`, `chore/…`, `adr/…` per its type) and begin, carrying the full session context forward and
  working end to end to `CLAUDE.md`'s Definition of Done. This is the "weiter im Text".
- **The gate tripped:** do **not** start. Present the specific decision or planning need **concisely in
  German**, recommend a default, and wait. Starting the next task is never worth undermining the
  owner's review control.

Either way, report the transition briefly: what closed, what the docs now say, and either what you
started and on which branch, or the open question that needs the owner.
