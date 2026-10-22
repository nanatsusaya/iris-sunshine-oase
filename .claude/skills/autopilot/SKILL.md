---
name: autopilot
description: >-
  Use when the person wants a planned set of tasks worked through without approving each change and
  without the session standing still while nobody answers. Checks the start strictly, reads every
  open task, asks every question up front, and presents a closed plan; only an explicit yes starts
  the run. Then works the list one entry at a time, merges within it, parks any task that meets a
  question, lists each change's judgement calls, and ends with a report when the list is done. Never
  extends the plan. Run after session-start.
disable-model-invocation: true
---

# Autopilot — working through an approved plan

*Carries out rules G4, G1, G2, S2, S3, W1 and H1. The
[catalogue](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md)
is the authority; this file is only the procedure. An adapted copy of the
`agent-method` plugin's `autopilot`; what was changed and why is in
[the skills README](../README.md).*

**In this repository.** The person who grants the run is **the owner**, and the
conversation is **German**; the plan, the PR descriptions and the closing
report are English like every other artefact. The method's roles are bound
here: the state artefact is `docs/STATUS.md`, the trunk is `main`, the check
chain is whatever `.github/workflows/ci.yml` runs, `session-start` is `/moin`,
`session-end` is `/feierabend`, and `interview` is `/interview`. `main`
requires **zero** approving reviews by design (`CLAUDE.md`), so no merge here
ever waits for a platform approval — every merge in a run is held by this
procedure alone, which is why the guardrails below are worded as hard as they
are. What the platform does require is the `verify` check and a branch that is
**up to date with `main`**: after one entry merges, the next PR is behind and
must be updated and re-checked before it can merge.

Sometimes the planning has been done well, and what the person wants is the
work: no approval per change, no question in the middle of the day, and no
session standing still overnight because nobody was there to answer.
[G4](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md#g4)
allows that — a plan approved instead of each change — on five conditions.
This procedure carries them out.

An autopilot flies a route someone else set. When the route ends, it hands the
controls back; it does not pick a new destination.

**Guardrails (do not violate):**

- **Only an explicit yes in this conversation starts the run.** Not silence,
  not a document, not a yes from an earlier session. The grant ends with the
  session, and when the list is done.
- **Nothing outside the list.** A task that grows something new on the way — a
  second concern, a new capability in a tool it was only meant to use — has
  become a new entry. Park the growth; do not build it.
- **Never answer a question that belongs to a person.** Park the task with the
  question written where it is held, and take the next entry.
- **Never merge past a review the platform requires**, and never lower a
  platform setting. A change that needs an approval waits for one.
- **No force-push, no rewriting the trunk's history**, and no decision record
  changed or accepted: a task that needs one decided first is not on the list.
- **A closing keyword only where it is meant.** Read the description of each
  change for one before you create it; a negation around it does not stop the
  platform closing the ticket.
- **This project's hard lines hold inside a run as everywhere else.** No price,
  opening time, address or Impressum detail without a source in `docs/content/`
  or from the owner; no image without documented provenance; nothing at netcup
  or on the live site; the `noindex` gate is never removed and no `Disallow` is
  added; no external network call, tracking or embed; no `Accepted` ADR
  amended. An entry that would need any of these is not ready — it belongs in
  the interview of step 3, and if the answer is a decision record, the record
  is the entry.

## 1. Check the start, strictly

Before anything is planned:

- The trunk is current, the tree is clean, and the project's check chain is
  green on the trunk.
- No change is waiting for the person. A run built on an unreviewed change
  builds on something nobody approved; settle it first.
- The state artefact is current. If bring-up reported that the last session
  ended without a wind-down, that repair comes first, outside the run.
- **The tools the run will need are allowed in advance.** An unattended run
  that meets a permission prompt stands still until someone answers it. Name
  what the run will use — the check chain, the version-control and platform
  commands — and have the person allow them now.

If any of these fails, stop and say which. Do not plan around a broken start.

## 2. Read every open task

Read each candidate task against the current state, not against what it said
when it was written. Sort them:

- **Ready** — it says what finishes it
  ([W1](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md#w1)),
  nothing it depends on is open, and it needs no decision first.
- **Needs a decision** — a question belongs to a person before it can start.
- **Blocked** — waiting on something the run cannot provide.

A task that has gone stale — already done, overtaken, or its criteria no longer
true — is noted. Refreshing it is a plan entry or a question, not something done
before the grant.

## 3. Ask everything up front

The point of the run is that it has nothing left to ask. Run the `interview`
procedure through your skill tool, for every question in the *needs a decision*
group and every question the plan itself raises. In case it does not load, its
essence:

> Ask in rounds: each round holds every question whose prerequisites are
> settled, and no question that depends on another in the same round. Number
> them `O1..On`, running on across rounds, each with a recommended default.
> Facts are looked up, never asked; decisions are the person's, and the
> interview ends only when nothing is left to ask and the person confirms.

Each answer goes where its question is held
([G2](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md#g2))
before the plan is written. A task whose answer needs a decision record is not
on this list; the record is.

## 4. Write the plan

A closed list, in the order it will be worked. For each entry:

- the task, and **what finishes it**;
- its expected size;
- **what it may merge** — which changes, into what.

And for the list as a whole:

- **what is out of scope**, named — the obvious next steps above all, because
  those are the ones a run drifts into;
- **the budget**: a number of changes or an end time. The list expires at the
  budget or when it is done, whichever comes first;
- **one change open at a time**, unless the plan names an exception. Parallel
  changes conflict in the state artefact, and in anything generated. A change
  waiting for an approval is still open, so the run stops there rather than
  taking the next entry (step 7);
- **the review each change gets**, if the operating rules require one.

## 5. The grant

Present the plan and ask for a yes. Only an explicit yes to this plan, in this
conversation, starts the run. A question about the plan is not a yes; answer it
and ask again.

The run's first change writes the plan into the state artefact
([S3](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md#s3)),
before the first entry starts. If the run stops, that is what the next session
reads.

## 6. Keeping the run alive — optional, and untested in a real stall

The run does not depend on anything in this step. Neither mechanism below has
yet been shown to rescue a stalled run; use them as a precaution, never describe
them as a guarantee.

- **A goal the session works towards.** In Claude Code, after the grant, the
  person sets it — it is a command a person types:

  ```
  /goal Every entry of the plan in docs/STATUS.md is merged or parked with
  its question written in its ticket, and the closing report is in
  docs/STATUS.md. Nothing outside the plan is started. Stop after «budget».
  ```

  After each turn a small model checks the condition and, if it does not hold,
  starts the next turn. At a usage limit the goal pauses and resumes when the
  limit resets, if the session is waiting for that. When the condition holds,
  the goal ends — which is what makes the run expire rather than extend. It
  does not change the permission mode, which is why step 1 allows the tools
  first. Source:
  [code.claude.com/docs/en/goal](https://code.claude.com/docs/en/goal).
- **A recurring nudge**, where a goal is not available. Schedule a prompt in
  the session, every 30 minutes, whose text stands on its own — a scheduled
  fire does not run this procedure, because only a person may start it:

  > If your last turn ended with a question to the person that is still
  > unanswered, say so in one sentence and do nothing else. Otherwise say in
  > one sentence what stopped the work, and continue with the next entry of the
  > approved plan — that plan and nothing else.

  It fires only between turns, while the session is running and idle — not
  while a turn hangs on a prompt. It expires after seven days, and a new
  conversation clears it. Source:
  [code.claude.com/docs/en/scheduled-tasks](https://code.claude.com/docs/en/scheduled-tasks).

**A watch outside the session is not a safeguard.** A scheduled job elsewhere
can only report. It cannot tell a session waiting for the person from one that
hangs, and whether its report reaches the person away from the desk is not
established. Do not name one as protection for the run.

## 7. Work the list

For each entry, in order:

1. **Branch** fresh from the up-to-date trunk.
2. **Work to what finishes it.** The check chain is green; anything with
   observable behaviour has been exercised.
3. **The change that closes the entry marks it in the state artefact** (S3), in
   the same change.
4. **List the judgement calls** in the change's description: every choice in
   it that a person could have made differently. None is written as *none*.
   This list, not the diff, is what the person reviews.
5. **Review**, if the operating rules require one. A reviewing agent only
   reads: compare the working tree before and after it runs, and treat a
   difference as a finding.
6. **Merge** within what the entry allows. Where the platform requires an
   approval, the change cannot merge — see *a required approval* below.
7. **The seam after the merge**: confirm it landed, tidy the branches. The next
   entry on the list needs no further yes
   ([S2](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md#s2));
   anything not on the list does.

When an entry cannot finish:

- **A question for a person** → write it where it is held, with a recommended
  default; mark the entry parked in the state artefact; take the next entry.
  Never wait, never answer it.
- **The task grew** → finish only what the entry covers, and write the rest up
  as a proposed entry for the next list.
- **Something failed** that you cannot put right within the entry → park it
  with what failed and what was tried
  ([H1](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md#h1)).
- **A required approval** → the change stays open, waiting for it, and **the
  run stops**: go to step 8. Taking the next entry would open a second change
  while the first is still open, and the two would collide in the state
  artefact — each closing change marks its entry there. A required approval
  means a person has to act anyway; the report tells them where. Only an
  exception the plan names, for these two entries, lets the run go on.

## 8. Land

When every entry is merged or parked, the budget runs out, or a change waits
for an approval:

- **Write the closing report** where the state artefact holds the plan: what
  merged, **what waits for an approval and where**, what is parked and the
  question each one waits on with its recommendation, what was not started,
  and **every judgement call the run made, collected in one list**. It goes in
  the run's last change — which, when a change is waiting for approval, is that
  change, so the report arrives with the approval rather than beside it.
- **Remove what kept the run alive**: the goal ends with its condition — if it
  has not, the person clears it with `/goal clear`; delete the nudge.
- **Then wind down** with `/feierabend`, and deliver the report to the owner in
  German.

The grant ends here. If the state artefact names a next step, that step is not
on the list by being next. Carrying on means presenting the next list and
waiting. End with the report and a question, then stop.
