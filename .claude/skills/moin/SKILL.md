---
name: moin
description: >-
  Use at the start of a working session to come up cleanly and orient: read what this project is and
  what it is for, the standing operating rules and the available procedures, the last few work units,
  and — above all — the current state and the single clearest next step from the living docs. Flag but
  do not run any maintenance that has come due, then ask the owner whether coffee is ready and whether
  we continue as planned. This is orientation, NOT a trigger to start work — it ends with a question,
  not an action. The counterpart to /feierabend.
---

# Moin — session bring-up

*Carries out rules S1, S2, S3 and H1 of
[agent-project-rules](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md).
The catalogue is the authority for the rules; this file is only the procedure. Everything specific to
this project is stated here rather than fetched from anywhere.*

Starting a session cleanly is a procedure, not something reconstructed from memory. Improvised
bring-up fails in a consistent way: something is skipped, and the skip goes unnoticed because there
was no list to skip from.

Work the steps in order. Read every source **fresh** — do not trust context carried in from anywhere —
and **report faithfully**: an open PR awaiting the owner's merge, a red check or an overdue task is
stated plainly.

**Guardrails (do not violate):**

- **Orient, do not start work.** This ends with a **question**, never an action. If the briefing
  surfaces a task, name it and wait. Opening a session by starting work chooses the session's
  direction on the owner's behalf.
- **Read-only.** No commits, no branches, no edits to the living docs. The *only* possible write is a
  due maintenance task, and only after the owner confirms in step 7.
- **The living docs are the source of truth for state** — not this file, not memory, not what was true
  last session: `docs/STATUS.md` for state and next steps, `git` and `gh` for work units and open PRs.
- **Do not invent state you could not read.** If an artefact is missing, say it is missing.
- **Owner conversation is German**; repository artefacts stay English (`CLAUDE.md`). The briefing and
  the closing question are delivered in German.

## 0. Locate the artefacts

`method.json` at the project root binds the four roles to this project's files. Read it: it also
carries the `authorities` block, so where the issue tracker and the review boundary live is something
this session already knows rather than something it asks about.

| Role | Here |
|---|---|
| `operating-rules` | `CLAUDE.md` |
| `decisions` | `docs/adr/` |
| `state` | `docs/STATUS.md` |
| `method-log` | `docs/meta/agent-collaboration-log.md` |

Any rule the declaration marks as adapted is exactly the kind of thing a fresh session gets wrong —
name it in step 2. Today there are none, which is itself worth knowing.

## 1. What this is

- **What this is** and what it is for, from the top of `CLAUDE.md`. One or two sentences, not a wall
  of text. The load-bearing fact worth repeating on every bring-up: this is the public presence of a
  **real business that is still trading**, and the prices, opening hours and address on it are what
  customers act on.
- **Since when**: the first commit date — `git log --reverse --format="%ad" --date=short | head -1`.
- Name the repository and working directory, so it is unambiguous which project this session is in —
  the owner runs more than one.

## 2. Standing rules and available procedures

- The load-bearing rules from `CLAUDE.md` that shape *how* work happens here — a compact reminder, not
  a re-read of the whole file. At minimum:
  - content correctness outranks everything; never invent a price, an opening time or an address
  - bugs before features
  - **every** change goes on a branch through an owner-merged PR; there is no exception, and `main` is
    branch-protected against administrators too
  - ADRs are normative; `Accepted` means *decided*, not *built*
  - no image without documented provenance; `Archive/` stays excluded; never commit personal data
  - the preview carries `noindex` until go-live
  - English in the repository, British spelling; German with the owner
- **Available procedures**: what is in `.claude/skills/` and when to reach for each — currently `moin`,
  `weiterimtext`, `feierabend`, `adr` and `passtdas`. Where they came from, and what was deliberately
  changed in them, is in [the skills README](../README.md).

## 3. Recent work

- The **last ~6 work units** as merged PRs — the meaningful unit, because review is what makes a change
  a unit: `git log --grep="Merge pull request" --format="%ad %s" --date=short -6`. Fall back to
  `git log --oneline -6` where the history holds few of those.
- Mention a genuinely methodological recent moment only if it bears on today's work —
  `docs/meta/agent-collaboration-log.md` is the home for those, not this briefing.

## 4. Where we stand

- **Repository state**: `git status` (branch, clean or dirty) and `gh pr list` — report every open PR
  awaiting the owner's merge, and any parked branch with work in flight. **Fetch first**, so this
  reflects the shared state rather than a stale local view.
- **Project state**: `docs/STATUS.md` → *Where we stand* — the honest current-phase snapshot. Condense
  it; do not paste the whole file.
- **Ticket state**: `gh issue list --state open` — in particular anything labelled `agent-ready`, and
  any open `type:bug`, which jumps the queue.
- **Are the checks green?** A red PR, or a red run on `main`, is part of where we stand. Say so, and
  say whether the cause belongs to that PR or was inherited from `main` — the difference decides who
  has to act.

## 5. Maintenance that has come due — flag, do not run

- Compare each task in [`docs/recurring-tasks.md`](../../../docs/recurring-tasks.md) against today and
  **report** which, if any, are due.
- **Do not run one here.** List it and *offer* it as part of the go-ahead in step 7. Running
  maintenance is work, and work starts after the owner says so. If nothing is due, say so explicitly
  with the next date — never skip this step silently.

## 6. The next step

- From `docs/STATUS.md` → *Next step*, name the **single clearest next step** for this session — not
  the roadmap — plus any owner-domain decision that must be settled *before* it can start. Do not
  implement ahead of a decision, and surface owner-domain questions rather than resolving them quietly.
- If the next step touches a business fact — a price, an opening time, the address, the Impressum — and
  the source for it is not in `docs/inhalte/`, name that as the blocking question here. It is the most
  common way this project can go wrong.

## 7. Coffee and go-ahead — the close

- Deliver the briefing **concisely in German**: identity, rules and procedures, recent work, current
  state, due maintenance, the one next step.
- Then end with the ritual question in German — coffee first, then the direction check, e.g.:
  **"Hast du eine Tasse Kaffee bereit? ☕ Machen wir wie geplant weiter, oder lenken wir um?"**
- If step 5 flagged something due, fold it into that go-ahead ("… und soll ich zuerst die fällige
  Wartungsaufgabe X erledigen?").
- Then **stop and wait**. Begin nothing until the owner answers; the answer sets the session's
  direction.
