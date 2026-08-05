---
name: feierabend
description: >-
  Use at the end of a working session to wind down cleanly: tidy the git and branch state, finish or
  safely park work in flight at an honest stopping point, bring the living docs current (docs/STATUS.md,
  the method log, memory), run any due recurring task, then give a hand-off summary and wish the owner a
  good evening. This is a wind-down, NOT a trigger to start new work. The counterpart to /moin.
---

# Feierabend — session wind-down

*Carries out rules S1, S3, W1 and H1 of
[agent-project-rules](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md).
The catalogue is the authority for the rules; this file is only the procedure.*

Closing a session cleanly is a procedure. The goal is to leave the repository and the hand-off at an
**honest stopping point**: everything genuinely finished is finished, everything unfinished is parked
visibly and handed off.

Work the steps in order and **report faithfully** — a skipped step or a red check is stated plainly,
never glossed over. The next session has this repository and nothing else; anything left unsaid is
lost.

**Guardrails (do not violate):**

- **Start no new work.** If a task surfaces, record it — a ticket, the backlog, the next step. Do not
  begin it.
- **Never merge.** The owner merges every PR. List what is open and report its state.
- **Never commit to `main`, without exception.** Everything, including the living docs, goes on a
  branch through a PR. `main` is branch-protected against administrators too, so a direct push is
  refused rather than merely discouraged.
- **Do not round a partial result up to a finished one.** The cost of an honest "this part is not done"
  is one sentence; the alternative compounds.
- **Owner conversation is German**; repository artefacts stay English (`CLAUDE.md`).

## 1. Git and branch hygiene

- `git status` — make sure nothing important is uncommitted or about to be lost. Uncommitted work is
  either **finished** (step 2), **parked** on a branch with a clear work-in-progress commit, or
  explicitly named in the hand-off. Never leave it dangling and unmentioned.
- If PRs merged this session: `git checkout main && git pull --ff-only`, delete the merged branches
  (`git branch -d …`; the remote branch is usually auto-deleted on merge), then `git fetch --prune`.
- `gh pr list` — report every still-open PR and its state, so the owner knows what awaits a merge. If
  one is red, say whether the cause is that PR's own or was inherited from `main`.
- End on `main` with a clean working tree, unless a branch is deliberately parked and named in the
  hand-off.

## 2. Finish what is finishable

`CLAUDE.md` → *Definition of Done* is the authority for the bar, and it governs every hand-back rather
than only a wind-down. Read it there. What this step adds is the discipline of applying it **before**
calling anything done, and two project specifics that decide most cases here:

- **Run the check chain and report what it returned.** `.github/workflows/ci.yml` is the authority for
  what the gate actually runs — read it rather than trusting a list in this file, because a list here
  is a copy that ages. `npm run check` covers the bulk of it locally. Run each check as its own
  command: a pipeline reports only the last command's status, so chaining them can hide a failure.
- **Anything with visible output is verified in a browser** — look at the rendered page. A green build
  says the thing compiles, not that the page is right. Three real defects on the homepage were found
  this way and none of them was visible in a passing build.
- **Every business fact that was touched has a source.** A price, an opening time, an address or an
  Impressum detail comes from `docs/content/` or from the owner. If a value could not be sourced it is
  left out and raised — never guessed. An empty field is recoverable; a wrong price is not.
- **Any image added has documented provenance** — source, licence and evidence, written down. If it
  does not, it does not ship.
- **The `noindex` gate is still in place** if this session touched anything near the preview's head,
  metadata or deployment. Removing it is an explicit go-live step, never a side effect — and adding a
  `Disallow` to `robots.txt` is not a safety improvement, it defeats the gate (ADR 0006 §4).

## 3. Bring the living docs current

- **`docs/STATUS.md`** — refresh `Last updated`, *Where we stand* and *Next step* if the session changed
  them, and make what is open honest: PRs awaiting the owner's merge, parked work, the single clearest
  next step. A single next step, not a roadmap.
- **`docs/meta/agent-collaboration-log.md`** — only for a genuinely methodological moment: an owner
  correction and its rationale, a workflow experiment and its outcome, a mistake worth not repeating.
  Never routine task execution — that is what the commit history and `STATUS.md` are for. The test:
  *would an agent with no memory of this session decide worse without this entry?* It may ride along
  with the `STATUS.md` sync, since both are the same concern.
- **Memory**, if the tooling has one — durable user, feedback, project or reference facts worth
  carrying forward, one file per fact plus the pointer in `MEMORY.md`. Not what the repository already
  records, and not what mattered only to this conversation. **Never a customer's data, or any third
  party's.**

## 4. Recurring maintenance

Run any task in [`docs/recurring-tasks.md`](../../../docs/recurring-tasks.md) whose interval has
elapsed, then update its date — its own small PR if it produces a change. Unlike `/moin`, running it
here is correct: the session is ending, and a task that depends on somebody noticing is a task that
does not happen.

## 5. Hand-off and close

- Give a **concise** recap in German: what was accomplished, what is open (PRs awaiting the owner's
  merge, any parked work), and the single clearest next step for the next session.
- Include anything that went wrong and how it was resolved. A wind-down that reports only successes
  trains the next session to trust a picture that was never true.
- Wish the owner a good evening — **"Schönen Feierabend!"**
- Then stop: begin nothing new, and leave the session at a clean stopping point.
