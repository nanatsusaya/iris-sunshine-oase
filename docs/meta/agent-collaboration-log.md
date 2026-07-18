# Agent collaboration log

A running journal of **how** the owner and AI agents work together on this project — separate from the
ADRs ([`docs/adr/`](../adr/README.md), which record architecture decisions) and
[`docs/STATUS.md`](../STATUS.md) (which records project state).

This exists because the project is maintained **indirectly**: the owner files issues, an agent works
them, and that agent has the repository and nothing else — no conversation history, no memory of how a
rule came to exist. The ADRs record *what* was decided. This file records *why the way we work* looks
the way it does, including the mistakes that shaped it. A rule whose origin is lost gets quietly dropped
by the next session that finds it inconvenient.

**What goes here:** genuinely methodological moments — an owner correction with its rationale, a
workflow experiment and its outcome, a mistake worth not repeating, a cross-check against another
source.

**What does not go here:** routine task execution. That is what the commit history and `STATUS.md` are
for. The test question before writing an entry: *would an agent with no memory of that session make a
worse decision without it?*

**Entry template:**

```
## YYYY-MM-DD — Short title

**Trigger:** how the topic came up.
**Action / method:** what was actually done.
**Impact:** what changed as a result (or did not).
**Lessons learned:** what this suggests for next time, if anything.
```

Like every other change, an entry goes through a **branch and a PR**. ADR 0001 makes the ADR
`Proposed → Accepted` status flip the *single* exception to that rule, and a living doc is not worth a
second one — an entry may simply ride along with the `docs/STATUS.md` sync at the end of a session,
since keeping the living docs current is one concern.

---

> **Backfill note.** Every entry below is dated 2026-07-18 and was written retroactively that same day,
> at the end of the founding session — this log did not yet exist while the work happened. They are the
> project's origin methodology moments, reconstructed from that session.

## 2026-07-18 — How this project is worked: adopting a sibling project's method

**Trigger:** After the analysis of the old site was documented and the first commit made, the owner
pointed at their other project, [grimora](https://github.com/nanatsusaya/grimora), and asked that this
rebuild be developed the same way — explicitly *how*, not *what*: GitHub issues, ADRs, one concern per
PR, owner-merged.

**Action / method:** The grimora repository was read as a **method** rather than a template — its ADR
discipline, its `CLAUDE.md` structure, its label taxonomy, its PR template, its use of machine-enforced
conventions instead of remembered ones. What transferred was adapted to this project's scale (8 planned
ADRs against grimora's 29; one CI step against seven). One deliberate difference was set by the owner:
**early drafts must be viewable via GitHub Pages**, where grimora has no preview.

**Impact:** `CLAUDE.md`, ADR 0001, the ADR index, `STATUS.md`, the PR template, the label set, CI and
`tools/check-docs.mjs` all date from this. Two further owner decisions were settled at the same time:
all repository artefacts in English, and the site itself German by default with English as an
additional locale.

**Lessons learned:** Copying a working method is cheap; copying it *unadapted* is not. Half of what
grimora's artefacts assert would be false here — a different stack, a different risk profile, a
different scale. The useful unit of transfer was the *rule*, not the file.

## 2026-07-18 — A wrong recommendation about publishing the archive

**Trigger:** The question of where to keep the ~600 MB archive of the old site — images with
undocumented rights and a database export containing third parties' personal data — once `.gitignore`
excluded it from the repository.

**Action / method:** A **GitHub Release in this repository** was recommended as the storage location.
That recommendation was wrong: **this repository is public, and the release assets of a public
repository are public too** — downloadable by anyone, without signing in. It would have published
precisely what the `.gitignore` exclusion exists to prevent, while looking like a safe archival step.

**Impact:** The recommendation was withdrawn and the reasoning corrected in
`docs/analyse/06-medien-inventar.md`, which now names the ruling-out explicitly rather than leaving it
unsaid. Backup and versioning of the archive are now the **owner's** responsibility, deliberately
outside this repository. `CLAUDE.md` gained the rule that the blanket `Archive/` exclusion must not be
weakened by per-file exceptions or a release attachment.

**Lessons learned:** "Not in the repository" is not the same as "not published". Every proposed storage
or distribution step for excluded material has to be checked against the repository's **visibility**,
not just against `.gitignore`. The failure mode was a recommendation that *felt* like a safeguard.

## 2026-07-18 — Owner correction: epics before child tickets

**Trigger:** A plan to create the first child tickets and start work. The owner asked: *"sollten wir
nicht zuerst die phasen als epics in ticket form definieren?"*

**Action / method:** The correction was accepted as catching a real error rather than expressing a
preference. The project's own **Definition of Ready** — written hours earlier in `CLAUDE.md` — requires
every ticket to link its parent epic. No epics existed. The first child ticket would therefore have
violated the rule on the day the rule shipped. The six phase epics (#2–#7) were created first, and
`STATUS.md` was restructured around a phase-to-epic table.

**Impact:** Every ticket since links a parent epic, and `STATUS.md` has a single place where phase state
is read.

**Lessons learned:** A freshly written rule is the one most likely to be broken, because it is not yet
habit. Before starting the first instance of a new process, check the process against itself.

## 2026-07-18 — Trusting a tool's report over the underlying state

**Trigger:** Two separate incidents in the same session, with the same shape.

**Action / method:**

1. A push appeared to have failed, because `gh pr view` reported the old head. The push had in fact
   succeeded; `git ls-remote` showed the truth. The actual problem was different — the owner had merged
   PR #1 in the meantime, orphaning a second commit, which then had to be cherry-picked onto a fresh
   branch.
2. A PR body was updated by piping text through `python -c`. **Python is not installed on this
   machine.** The command reported success, `gh` accepted the empty output without complaint, and the
   PR body was **wiped to zero characters**. It was noticed only because the body length was queried
   afterwards, and was restored from a file via `gh pr edit --body-file`.

**Impact:** Both were disclosed rather than quietly repaired. The second is the reason PR bodies are now
written to a file and passed with `--body-file` instead of piped.

**Lessons learned:** Two rules, and they are the same rule twice. **Do not pipe through an interpreter
whose presence has not been verified** — a missing binary can fail as *empty output plus exit code 0*,
which is indistinguishable from success. And **after a write, read the result back**; an exit code
reports that a command ran, not that it did what was intended. When two sources disagree about
repository state, believe the one closest to the git data.

## 2026-07-18 — A translated quote is a misquote

**Trigger:** While translating `docs/` to English, a subagent translated a passage from the old site's
Impressum — its claim that all images are either from Pixabay under CC0 or the owner's own photos — and
left it inside quotation marks.

**Action / method:** The German original was restored, with an English gloss beside it. The reasoning:
a translated passage presented as a quote asserts that the source said something it did not, and this
particular passage is the entire documentary basis for the site's image-rights position. The same fix
was applied to a second quoted passage. `CLAUDE.md` already carried the rule that `docs/inhalte/` stays
German; the gap was that **quotations elsewhere in the documentation** were not covered by it.

**Impact:** Verbatim quotes now stay in the source language throughout the documentation, with a gloss
where the meaning carries an argument. The related defect — an entry in
`docs/analyse/05-maengelliste.md` that presents a *paraphrase* inside quotation marks — was filed as
#12 rather than fixed in passing (see the next entry).

**Lessons learned:** Evidence and prose have different rules. Prose is translated; evidence is
reproduced. The distinction matters most exactly where the quote is load-bearing — which is also where
translating it is most tempting, because that is where the reader most wants to understand it.

## 2026-07-18 — Keeping a PR reviewable as one thing

**Trigger:** The translation PR uncovered a genuine defect: a `verified`-tagged entry in the defect list
presents a shortened paraphrase as a verbatim quote, on a legal question. It predated the translation —
it came from the German original.

**Action / method:** It was deliberately **not** fixed in that PR. Ticket #12 was filed instead, with
the exact correction written out.

**Impact:** The translation PR stayed reviewable as a translation: its load-bearing claim was that no
old-site content changed, and that claim was demonstrated (page and post text byte-identical, generator
idempotent, all 28 `M-NN` identifiers intact). A silent content correction inside it would have made
that claim false and the diff unreviewable as either thing.

**Lessons learned:** "One concern per PR" is not tidiness. A PR that claims *nothing changed except X*
loses its verifiability the moment it also changes Y — and the correction is usually the cheaper thing
to defer.

## 2026-07-18 — A convention that had already drifted before it was set

**Trigger:** The owner settled an open question from a PR review: British spelling throughout.

**Action / method:** Rather than only recording it, the repository was audited first. The convention had
**already** drifted: `authorisation` and `authorization` both appeared, in files written within an hour
of each other by the same session, alongside `prioritize`, `Internationalization` and `PHP-serialized`.
They were corrected, the rule was written into `CLAUDE.md` — and then made **machine-enforced** as check
5 in `tools/check-docs.mjs`: a short list of irregular forms plus a general `-ise` rule, with an
allowlist for English words that legitimately end in `-ize`, and exclusions for code spans (identifiers
mirror their API's spelling), for `docs/inhalte/`, and for `CLAUDE.md` itself, which necessarily
contains examples of what it forbids. The check was counter-tested against four deliberate
Americanisms before being trusted.

**Impact:** Spelling drift now fails CI instead of accumulating.

**Lessons learned:** The audit was the informative part. A rule written into a file nobody re-reads
mid-task does not survive contact with the next session — the same inattention that produced the drift
will reproduce it. Where a convention can be asserted by a check, a note is the weaker option. This is
the same principle the ADRs call a fitness function, applied to prose.
