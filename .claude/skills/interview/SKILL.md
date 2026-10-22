---
name: interview
description: >-
  Use when an undertaking needs a series of decisions from a person before anything is written or
  built — a new project, a plan for a run, a large piece of work whose shape is still open. Asks in
  rounds: each round is every question whose prerequisites are settled, numbered O1..On across
  rounds, each with a recommended default. Looks facts up instead of asking them. Ends only when
  nothing is left to ask and the person confirms the understanding is shared. Not for a single
  question met during a task — that is simply asked. Never acts on what was agreed.
---

# Interview — decisions in rounds

*Carries out rules G2, H4 and H5. The
[catalogue](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md)
is the authority; this file is only the procedure. An adapted copy of the
`agent-method` plugin's `interview`; what was changed and why is in
[the skills README](../README.md).*

**Here, "the person" is the owner**, and the rounds are asked **in German** —
the owner conversation is German, every repository artefact English
(`CLAUDE.md`). The questions that are always the owner's, and never a fact to
look up, are the stop-and-ask list in `CLAUDE.md` → *Working with the owner*:
a business fact (a price, an opening time, a service, wording), roadmap and
sequencing, licensing and legal questions, hosting and provider choices, and
anything outward-facing or hard to reverse. A price or an opening time is
**never** given a recommended value — its recommendation is where to source
it, because a guessed price is the defect this project exists to remove.

Some work needs many decisions from a person before it can start, and they
depend on each other. Asked one at a time, they take a session each. Asked all
at once, half of them guess at answers not yet given, and the person answers a
question that an earlier answer should have changed. This procedure asks them in
**rounds**: as many at once as can honestly be asked, and no more.

It is called by other procedures, and it can be run on its own. A caller
repeats its essence in a few sentences, so that if this file does not load, the
interview gets poorer rather than disappearing.

**Guardrails (do not violate):**

- **Never answer a decision yourself.** Recommending is your job; deciding is
  the person's. A recommendation the person has not answered is still an open
  question.
- **Never ask for a fact you could look up.** Facts are your job.
- **Never act on what was agreed.** The interview ends with shared
  understanding, not with work. What happens next is the caller's, or the
  person's.
- **Leave plan mode off**, if your tooling has one. It primes the agent to
  produce a plan, which is the opposite of staying in inquiry.

## The four ideas

- **The design tree.** The undertaking is a tree of decisions: each one has
  decisions hanging off it that cannot be answered until it is.
- **The frontier.** The decisions whose prerequisites are all settled — the
  questions that can be asked *now* without guessing at an answer not yet heard.
- **The round.** The whole frontier at once, then wait. Two questions where one
  depends on the other never share a round; the dependent one waits for the
  next.
- **Facts against decisions.** A fact is something the environment can settle:
  what exists, what a tool does, what a document says. You find it. A decision
  is a choice a person makes. You ask it.

The frontier is your judgement, not a computed graph. If an answer shows that
two questions in the same round should not have been asked together, say so and
reopen the affected one in the next round.

## 1. Facts first

Before the first round, read what can be read: the working directory, what
already exists, anything the person pointed you at, in full. Every fact found
now is a question not asked later.

Where a lookup would take long, hand it to a sub-agent if your tooling has one,
and do not wait for it: only the questions downstream of it wait. Say in the
round which lookups are running and which questions they hold back.

Facts about the world outside the repository come from primary sources
([H4](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md#h4));
a fact a command can settle is settled by running the command
([H5](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md#h5)).

## 2. Ask a round

Work out the frontier, then ask all of it:

```
Round 2 — settled so far: O1–O4.

O5 — «title». «The question; the choices, where there are choices.»
     Recommended: «the default, and in one clause why».

O6 — «title». …
     Recommended: …

Being looked up, not asked: «what is being found out, and which O-numbers
wait for it».
```

- **Numbers run on across rounds** and are never reused. An `O`-number quoted
  later in a ticket or a record must mean one question.
- **Every question carries a recommended default**, with its reason. A question
  without one hands the person the whole analysis.
- **Say who each question is for** where more than one person decides. A
  question addressed to nobody is answered by whoever is nearest.

Then stop and wait. The person answers by number — *"O5 yes, O6 the second
option, because …"*.

## 3. Take the answers in

- **Record each answer against its number**, in your own summary of the round,
  with the reason where one was given.
- **"I don't know" is an answer.** Park the question with that answer, and say
  what would settle it — a prototype, a lookup, someone else. Do not press for a
  guess, and do not fill it in.
- **Recompute the frontier.** Settled answers unblock the questions that hung
  off them. Then ask the next round.

## 4. Two failures to watch for

- **Passivity.** A round nodded through — every recommendation accepted, no
  pushback, no reasons — is a plan the agent wrote and the person initialled.
  Under this method it becomes worse than that: a stack of records the agent
  wrote, carrying the person's authority. When it happens, say so, and ask the
  one or two questions in the round whose answer matters most again, in the
  person's words rather than yours.
- **Scope.** The frontier should shrink round by round. If it grows instead,
  the undertaking is too large for one interview. Stop, propose a split, and
  put the split to the person as the next `O`-question. There is deliberately
  no cap on questions; a growing frontier is the signal, not a count.

## 5. End

The interview is over when **both** hold:

- the frontier is empty — every branch visited, nothing silently assumed; and
- the person confirms that the understanding is shared.

An empty frontier alone is not the end. Present every settled `O`-number with
its answer in one list, and ask whether that is what was agreed. Then stop.

Nothing agreed may stay in the conversation: across sessions only the
repository remembers. A caller says where each answer goes. Run on its own,
end by saying that none of it is recorded yet, and propose where each answer
belongs — a decision record, a working convention, a task's definition of done,
or the comment that answers a question held in a ticket
([G2](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md#g2)).

In this repository those places are: an ADR under `docs/adr/`, rewritten into
`R1..Rn` through `/adr`; `CLAUDE.md` for a working convention; the ticket's
acceptance criteria; and, for a question held in a PR or an issue, **a comment
naming its `O`-number** that quotes the answer and says when and where it was
given — never an edit to the description.

## For a caller

A procedure that runs this interview repeats these sentences in its own text:

> Ask in rounds: each round holds every question whose prerequisites are
> settled, and no question that depends on another in the same round. Number
> them `O1..On`, running on across rounds, each with a recommended default.
> Facts are looked up, never asked; decisions are the person's, and the
> interview ends only when nothing is left to ask and the person confirms.
