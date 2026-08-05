# Session procedures

Five procedures, one per directory. They are **adapted copies** of the `agent-method` plugin, version
`0.5.0`, taken on 2026-08-05 from
[agent-project-rules](https://github.com/nanatsusaya/agent-project-rules).

Copying rather than installing is what that repository recommends for anyone who wants to change them,
and it is what makes this project self-supporting: the procedures are here, in the repository, whether
or not anything is installed. An agent working a ticket has this repository and nothing else.

| Type | Was | When to reach for it |
|---|---|---|
| `/moin` | `session-start` | Sitting down. Reads `docs/STATUS.md` first, ends with a question, never an action. |
| `/weiterimtext` | `after-merge` | A PR just landed. Keeps the session's context, re-verifies the outside world. |
| `/feierabend` | `session-end` | Stopping. Parks work honestly and brings the living docs current. |
| `/adr` | `decision-record` | Writing a decision and taking it through to `Accepted`. |
| `/passtdas` | `adopt` | Checking whether `method.json` still matches how work is actually done. |

The German names are a deliberate choice the source repository invites: a skill name is typed in
conversation rather than read in a document, so it does not belong to the one language everything
committed here is written in. The procedures themselves stay in English, like every other file.

## What was changed

Nine adaptations, each for a reason this project actually ran into.

1. **`/moin` and `/feierabend` brief and close in German**, and `/moin` ends on the coffee question.
   The owner conversation is German (`CLAUDE.md`); only the artefacts are English.
2. **The four role bindings are named in the procedures, not looked up.** `method.json` is still the
   authority and is still read, but a procedure that cannot say where the state artefact is until it
   has parsed a file is one step further from being usable when that file is missing.
3. **`/moin` reports whether the checks are green, and whose fault a red one is.** Added on 2026-08-05,
   when two open PRs were red for a cause that belonged to `main` rather than to them. Whether a red
   check is inherited or the PR's own decides whether the owner or an agent has to act, and the
   briefing was silent on it.
4. **`/weiterimtext` keeps the two incidents that produced it** — a commit orphaned by a merge that
   happened mid-edit, and `gh pr view` returning stale data that was believed over `git ls-remote`.
   They are evidence for the rule, not illustrations of it, and a reader who has them argues with the
   rule less.
5. **`/weiterimtext` and `/feierabend` carry this project's stop-and-ask list.** "Ask the owner" is
   unambiguous and useless without saying which questions are theirs: a business fact, sequencing,
   licensing, hosting, anything outward-facing or expensive to reverse.
6. **`/feierabend` no longer restates the Definition of Done or the check chain.** It points at
   [`CLAUDE.md`](../../CLAUDE.md) and at [`ci.yml`](../../.github/workflows/ci.yml), which are the
   authorities. Its own copy had gone stale exactly as a copy does: it said the chain was
   `node tools/check-docs.mjs` and would grow "once ADR 0002 is `Accepted` and the scaffold ships". The
   scaffold shipped on 2026-07-19 and the sentence did not notice.
7. **`/adr` keeps the two-PR status flip**, where the plugin's procedure sets `Accepted` on the branch
   before the merge. Here the owner answers the open questions *on* the first PR, so `Proposed` is the
   true status at the moment it merges.
   [ADR 0001](../../docs/adr/0001-record-architecture-decisions.md) is the authority; aligning with the
   plugin would mean amending an `Accepted` ADR, which is an owner decision rather than a tidy-up.
8. **`/adr` keeps the house style for a record's body.** ADR 0001 defines the process, the statuses and
   immutability, but not the internal structure of a record — so unlike the process, that section has
   no other authority to point at.
9. **`/passtdas` leads with the review case.** This project has a `method.json`, so the first-time
   adoption path cannot happen here again.

**One thing that was *not* an adaptation.** Copying these files made them documents of this repository,
so they fall under its spelling regime — and needed no conversion, because both repositories write
British English. `tools/check-docs.mjs` scans them like every other Markdown file here.

**And one thing that was a correction rather than an adaptation.** The old `/moin` still taught, in its
summary of the standing rules, something that had been withdrawn on 2026-07-18:

> every change on a branch through an **owner-merged** PR; the single exception is an ADR
> `Proposed → Accepted` status flip

It is gone. It had survived there for three weeks *underneath* a check written to catch exactly that —
the method log's entry for 2026-08-05 has why.

## The cost

These are copies. When the plugin releases a new version they no longer match it, and nothing will
announce that.

**The trigger is a release of `agent-project-rules`.** Compare these five files against the new
version, take what applies, and leave what was adapted on purpose — the nine changes above are the list
of what not to overwrite. `/passtdas` step 3 carries the same instruction, so the trigger is written
down where a session will actually meet it.

This is a real convenience gap, recorded as one rather than papered over. It is deliberately **not** in
[`docs/recurring-tasks.md`](../../docs/recurring-tasks.md): that file is for maintenance that comes due
on a **calendar**, and this comes due in response to an event.
