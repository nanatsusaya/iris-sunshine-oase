---
name: feierabend
description: >-
  Use at the end of a working session to wind down cleanly: tidy the git and branch state, finish or
  safely park work in flight at an honest stopping point, bring the living docs current (docs/STATUS.md,
  the meta-log, memory), run any due recurring task, then give a hand-off summary and wish the owner a
  good evening. This is a wind-down, NOT a trigger to start new work.
---

# Iris Sunshine Oase — Feierabend (session wind-down & close-out)

Closing a session cleanly is a repeatable procedure. The goal is to leave the repository and the hand-off
note at a **clean, honest stopping point**: everything genuinely finished is finished; everything
unfinished is safely parked and clearly handed off. Follow the steps in order and **report faithfully** —
a skipped step or a failing check is stated plainly, never glossed over.

**Guardrails (do not violate):**

- **Start no new work.** If a new task surfaces, note it (ticket, backlog, next step) — do not begin it.
- **Do not merge PRs** — the owner merges every PR. List them and report their state.
- **Do not commit to `main`.** The single documented exception is an ADR `Proposed → Accepted` status
  flip (ADR 0001). Everything else — including the living docs — goes on a branch through a PR.
- **Owner conversation is German**; repository artefacts stay English (`CLAUDE.md`).

## 1. Git & branch hygiene

- `git status` — make sure nothing important is uncommitted or about to be lost. Uncommitted work is
  either **finished** (step 2), or **parked** on a branch with a clear WIP commit, or explicitly
  surfaced in the hand-off. Never leave it dangling and unmentioned.
- If PRs merged this session: `git checkout main && git pull --ff-only`, delete the merged branches
  (`git branch -d …`; the remote branch is usually auto-deleted on merge), then `git fetch --prune`.
- `gh pr list` — report every still-open PR and its state, so the owner knows what awaits a merge.
- End on `main` with a clean working tree, unless a branch is deliberately parked and named in the
  hand-off.

## 2. Finish what is finishable (Definition of Done)

For work done this session, apply `CLAUDE.md`'s Definition of Done before calling anything done:

- **The local check chain is green.** Today that chain is `node tools/check-docs.mjs` — the ADR index,
  link resolution and British spelling. It grows once ADR 0002 is `Accepted` and the scaffold ships;
  run **whatever the chain is at the time**, and report any red honestly rather than describing it as a
  known issue.
- **Anything with visible output is verified in a browser** — look at the rendered page. A green build
  is not evidence that a page is correct.
- **Every business fact that was touched has a source.** A price, an opening time, an address or an
  Impressum detail is either taken from `docs/inhalte/` or confirmed by the owner. If a value could not
  be sourced, it is left out and raised — never guessed. An empty field is recoverable; a wrong price is
  not.
- **Any image added has documented provenance** — source, licence and evidence, written down. If it
  does not, it does not ship.
- **The `noindex` gate and `robots.txt` are still in place** if this session touched anything near the
  preview's head, metadata or deployment. Removing them is an explicit go-live step, never a side effect.
- Code **and** its docs changed together (ADRs, `STATUS.md`, READMEs, inline headers) — stale docs are a
  defect.
- Only claim a task done at **≥ 95 % confidence**. If you are not there, park it and hand off the
  *specific* uncertainty rather than declaring it finished.

## 3. Bring the living docs current

- **`docs/STATUS.md`** — refresh `Last updated`, *Where we stand* and *Next step* if the session changed
  them, and make "what is open, what is next" honest (open PRs awaiting a merge, parked work, the single
  clearest next step). This is a PR change like any other, not direct-to-`main`.
- **`docs/meta/agent-collaboration-log.md`** — log **only** genuinely methodological moments: an owner
  correction and its rationale, a workflow experiment and its outcome, a mistake worth not repeating.
  Never routine task execution — that is what the commit history and `STATUS.md` are for. Ask the test
  question: *would an agent with no memory of this session make a worse decision without this entry?*
  It goes through a PR like everything else, and may ride along with the `STATUS.md` sync above.
- **Memory** — save durable new user, feedback, project or reference facts worth carrying into the next
  session, one file per fact, plus the one-line pointer in `MEMORY.md`. Do not save what the repository
  already records (docs structure, git history, `CLAUDE.md`) or what only mattered to this one
  conversation. **Never put a customer's data, or any third party's, into memory.**

## 4. Recurring maintenance

- If `docs/recurring-tasks.md` exists, run any task whose interval has elapsed since its "last checked"
  date, then update that date — its own small PR if it produces a change. If the file does not exist
  yet, skip this step; it is created when the first genuine recurring task appears.

## 5. Hand-off summary + close

- Give a **concise** recap in German: what was accomplished, what is open (PRs awaiting the owner's
  merge, any parked work), and the single clearest next step for the next session.
- Include anything that went wrong and how it was resolved. A wind-down that only reports successes
  trains the next session to trust a picture that was never true.
- Wish the owner a good evening — **"Schönen Feierabend!"**
- Then stop: begin nothing new, and leave the session at a clean stopping point ready to close.
