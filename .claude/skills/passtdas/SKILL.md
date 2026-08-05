---
name: passtdas
description: >-
  Use to review how well this project still fits the agent-project-rules method — whether method.json
  still describes how work is actually done here, whether the four roles are still bound to the right
  files, and what the coherence check says. Also covers the first-time adoption case, which has already
  happened here. Ends by presenting findings for a decision; it changes nothing on its own authority.
---

# Passt das? — reviewing the method against reality

*Carries out rules A1, A2 and C1 of
[agent-project-rules](https://github.com/nanatsusaya/agent-project-rules/blob/main/method/rules.md).
The catalogue is the authority; this file is only the procedure.*

This project **has already adopted** the method: `method.json` is at the repository root and binds the
four roles. So the ordinary use of this procedure is a **review**, not an adoption — the question is
whether the declaration still describes how work is actually done, which is a thing that goes quietly
untrue rather than loudly wrong.

**Guardrails (do not violate):**

- **Propose, do not impose.** Present what you found and get the owner's decision before changing the
  declaration or the rules it declares.
- **Never claim the check passed without running it.**
- **Do not widen an adaptation to silence a finding.** An adaptation records a decision about how this
  project works; using one to mute a real defect converts the record into a cover for it.
- **Do not vendor the method.** The catalogue and the check live in a clone **beside** this repository,
  never inside it — a second copy of the catalogue drifts from the first, which is the defect rule C2
  exists to prevent.

## 1. Read the declaration against the repository

`method.json` binds four roles. Check each one still points at the file that genuinely answers its
question, and that the file still answers it:

| Role | Bound to | Answers |
|---|---|---|
| `operating-rules` | `CLAUDE.md` | How is work done here? |
| `decisions` | `docs/adr/` | What was decided, and why? |
| `state` | `docs/STATUS.md` | Where do we stand? |
| `method-log` | `docs/meta/agent-collaboration-log.md` | Why does the way we work look like this? |

Then the rest of the declaration:

- **`authorities`** — the gate, the issue tracker, the secret scanning. These are addresses a person
  reads, never something to fetch. A pointer nobody maintains rots and no check will catch it, so read
  them against reality: has the review boundary moved from branch protection to rulesets, for example.
- **`language`** — `british`, which `tools/check-docs.mjs` also enforces locally.
- **`ignore`** — `docs/inhalte/` is the verbatim German extract of the old site and `Archive/` is
  excluded from the repository entirely. Both are **source material, not documentation**: their links
  are the old site's own URLs and their prose is quoted evidence, so scanning them would report
  findings about text that must not be changed (rule L2).
- **`adaptations`** — every rule not listed is claimed to be in force. If the project has quietly
  stopped following one, the honest fix is an adaptation with a reason and a date, or resuming the
  rule — never leaving the claim standing.

## 2. Run the coherence check

The check has no dependencies and runs from a clone beside this repository:

```bash
node ../agent-project-rules/checks/check-method.mjs .
```

If the clone is not there:

```bash
git clone https://github.com/nanatsusaya/agent-project-rules ../agent-project-rules
```

Run it as **its own command**, never chained into a pipeline: a pipeline reports the last command's
exit status, so trimming a check's output can hide its failure.

**Report what it says, including what it says it could not verify.** The blind-spot section is the part
worth reading — how many documents it scanned, how many references it actually resolved, which rules
are `manual` and rest on review alone. A green run over nothing is the failure mode this section
exists to make visible.

## 3. Compare the procedures against their source

The five procedures in `.claude/skills/` are **adapted copies** of the `agent-method` plugin, not the
plugin itself. Copies do not update, and nothing announces that they have fallen behind.

**The trigger is a release of `agent-project-rules`.** Compare the five files against the new version,
take what applies, and leave what was adapted on purpose. [The skills README](../README.md) lists what
was deliberately changed here and why — that list is what must **not** be overwritten by a later
comparison.

## 4. Look for what the method would call a defect

Independently of the check, which decides only what a command can decide:

- a fact with two authorities — the same value stated in two files, one of which will age
- a rule stated in two places, so that changing one leaves the other teaching the old version
- documentation that assumes knowledge no longer in the repository
- a check that reports success without deciding anything: a pattern that matches nothing, a scan whose
  filter excludes everything. This has already happened here — the withdrawn-rule check matched only
  text inside its own exemption while two live copies of the retired rule sat elsewhere.

## 5. Present the findings and wait

Show the owner, **in German**:

- what the declaration says versus what is true
- what the check reported, and what it said it could not verify
- every rule that is claimed in force but is not being followed, and the honest options for each
- anything found under step 4

Then **stop and wait for a decision.** Changing how this project is worked is the owner's call, not a
tidy-up an agent performs on its own authority. Whatever is decided goes through a branch and a PR like
every other change.
