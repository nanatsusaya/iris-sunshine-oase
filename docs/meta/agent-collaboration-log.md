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

Like every other change, an entry goes through a **branch and a PR**. There is **no** exception, and
none has existed since the ADR `Proposed → Accepted` status flip lost its own on 2026-07-18 (ADR 0001
*Amendments*). An entry may simply ride along with the `docs/STATUS.md` sync at the end of a session,
since keeping the living docs current is one concern.

---

> **Backfill note.** Every entry below is dated 2026-07-18 and was written retroactively that same day,
> at the end of the founding session — this log did not yet exist while the work happened. They are the
> project's origin methodology moments, reconstructed from that session.

## 2026-07-18 — How this project is worked: adopting the agent-project-rules method

> **Revised 2026-08-05, owner-authorised.** The way of working recorded here was first met in another
> repository and has since been extracted into a method of its own, with a name, a versioned catalogue
> and a rule identifier per rule. This entry was rewritten to name that method rather than the
> repository it was first seen in, so that a session reading it looks the working method up where it
> now lives. The original wording is in the git history.

**Trigger:** After the analysis of the old site was documented and the first commit made, the owner
asked that this rebuild be developed the same way as their other project,
[grimora](https://github.com/nanatsusaya/grimora) — explicitly *how*, not *what*: GitHub issues, ADRs,
one concern per PR, owner-merged.

**Action / method:** What grimora carried was read as a **method** rather than a template — the ADR
discipline, the `CLAUDE.md` structure, the label taxonomy, the PR template, the use of machine-enforced
conventions instead of remembered ones. That method is now
[**agent-project-rules**](https://github.com/nanatsusaya/agent-project-rules), a catalogue of 32 rules
in eleven clusters, and it is the authority this project follows; grimora is where it was first seen,
not what it is. What transferred was adapted to this project's scale (8 planned ADRs against grimora's
29; one CI step against seven). One deliberate difference was set by the owner: **early drafts must be
viewable via GitHub Pages**, where grimora has no preview.

**Impact:** `CLAUDE.md`, ADR 0001, the ADR index, `STATUS.md`, the PR template, the label set, CI and
`tools/check-docs.mjs` all date from this. Two further owner decisions were settled at the same time:
all repository artefacts in English, and the site itself German by default with English as an
additional locale. The adoption was **declared** rather than merely practised on 2026-08-05 — see the
entry for that date.

**Lessons learned:** Copying a working method is cheap; copying it *unadapted* is not. Half of what
grimora's artefacts assert would be false here — a different stack, a different risk profile, a
different scale. The useful unit of transfer was the *rule*, not the file — which is the same
conclusion the method itself later reached by becoming a catalogue of rules rather than a repository to
copy.

## 2026-07-18 — A wrong recommendation about publishing the archive

**Trigger:** The question of where to keep the ~600 MB archive of the old site — images with
undocumented rights and a database export containing third parties' personal data — once `.gitignore`
excluded it from the repository.

**Action / method:** A **GitHub Release in this repository** was recommended as the storage location.
That recommendation was wrong: **this repository is public, and the release assets of a public
repository are public too** — downloadable by anyone, without signing in. It would have published
precisely what the `.gitignore` exclusion exists to prevent, while looking like a safe archival step.

**Impact:** The recommendation was withdrawn and the reasoning corrected in
`docs/analysis/06-media-inventory.md`, which now names the ruling-out explicitly rather than leaving it
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
was applied to a second quoted passage. `CLAUDE.md` already carried the rule that `docs/content/` stays
German; the gap was that **quotations elsewhere in the documentation** were not covered by it.

**Impact:** Verbatim quotes now stay in the source language throughout the documentation, with a gloss
where the meaning carries an argument. The related defect — an entry in
`docs/analysis/05-defect-list.md` that presents a *paraphrase* inside quotation marks — was filed as
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
mirror their API's spelling), for `docs/content/`, and for `CLAUDE.md` itself, which necessarily
contains examples of what it forbids. The check was counter-tested against four deliberate
Americanisms before being trusted.

**Impact:** Spelling drift now fails CI instead of accumulating.

**Lessons learned:** The audit was the informative part. A rule written into a file nobody re-reads
mid-task does not survive contact with the next session — the same inattention that produced the drift
will reproduce it. Where a convention can be asserted by a check, a note is the weaker option. This is
the same principle the ADRs call a fitness function, applied to prose.

## 2026-07-18 — Reasoning from a plausible model instead of measuring

**Trigger:** The owner asked for a hosting recommendation and said he was unsure how domains and
hosting relate. The answer given was that the domain could stay at netcup while the site ran on
Cloudflare Pages, and that a cutover would therefore be a DNS-record edit, reversible in minutes.

**Action / method:** That recommendation was accepted, and a ticket was written around it. While
drafting the ADR, Cloudflare's own documentation was read and contradicted it: an **apex** domain must
be a Cloudflare *zone*, which means moving nameservers, not records. A single DNS query then showed why
that mattered — the zone carries two `MX` records and an `SPF` entry. The recommendation would have put
the studio's working e-mail inside the blast radius of a website change. The same query showed the
zone's default TTL is 86 400 seconds, so "reversible in minutes" was false for *any* option unless the
TTL is lowered first. The error was disclosed to the owner before the ADR was written, and the ADR
records the rejected assumption rather than quietly adopting the new one.

**Impact:** Hosting moved to GitHub Pages, which serves an apex from ordinary `A` records at any DNS
provider. Two records move at cutover; `MX` and `SPF` are never touched.

**Lessons learned:** The mistake was not a wrong fact — it was answering a question about *this*
domain from a general model of how domains work, when the domain was one query away. "The domain stays
registered at netcup" and "DNS stays at netcup" are different sentences, and nothing in the general
model surfaces the difference; only the actual zone does. Where a recommendation depends on the state of
something real and reachable, read the real thing first. The corollary held too: the measurement that
falsified the recommendation also improved the option that replaced it.

## 2026-07-18 — Two safeguards that cancel

**Trigger:** Writing ADR 0006's indexing gate. `CLAUDE.md` and the Phase 2 epic both required the
preview to carry `robots.txt` `Disallow: /` **and** a `noindex` meta tag.

**Action / method:** Google's documentation says a page blocked by `robots.txt` is never crawled, so
its `noindex` is never read — and the URL can still be indexed by name if anything links to it. The two
rules together are **weaker** than `noindex` alone. Rather than fix it silently, it was raised as an
open question, because the rule protects a live business's search ranking; the owner authorised the
correction, and `CLAUDE.md` now states the mechanism *and* the inversion: adding a `Disallow` is not a
safety improvement, it defeats the gate.

**Impact:** The preview's protection now rests on a mechanism verified to work rather than on two that
cancel.

**Lessons learned:** Defence in depth is an assumption, not a law — layers can interfere. A doubled
safeguard reads as extra care, which is exactly why nobody re-examines it. And when a rule's correct
form looks like an omission, the rule has to say so explicitly, or the next reader will helpfully
restore the bug.

## 2026-07-18 — Questions that measurement dissolves

**Trigger:** ADR 0009 was merged carrying four open questions for the owner (O1–O4). The owner asked to
have them explained in detail before deciding.

**Action / method:** Before writing the explanation, the repository's actual settings were read from
the GitHub API rather than described from the ADR's own summary. Two of the four questions changed shape
immediately. **O4** — "is Private Vulnerability Reporting enabled?" — was already `enabled`, along with
secret scanning and push protection; there was nothing to decide. **O2** turned out to need no owner at
all: the agent holds admin on the repository, so tightening the action policy was two API calls, not a
request for the owner to go clicking. Only **O3** was genuinely owner-only, because GitHub exposes no
API for domain verification and the record lives at netcup.

The same pass caught an error in the opposite direction. ADR 0009 asserted twice that the sanctioned
direct-commit flip "has been used four times". `git log main --first-parent --no-merges` showed **two**;
the third such commit was the initial survey, which predates the workflow. The number had been written
from recollection in a normative document and merged.

**Impact:** O1 was answered as recommended and produced an authorised amendment to ADR 0001. O2 and the
branch protection were applied the same session. O3 became a tracked precondition of Phase 2's first
deployment. O4 became a recorded decision rather than a task. The count was corrected in the same PR
that accepted the ADR.

**Lessons learned:** An open question is a claim that something is unknown, and that claim deserves the
same check as any other. Two of these four were not decisions waiting on the owner — one was already
true and one was the agent's own to make — and asking anyway spends the owner's attention, which is the
scarcest thing in a project run this way. Measure first, then ask about what is left. The "four times"
slip is the same failure wearing different clothes: a countable fact, one command away, asserted from
memory. The rule that follows is not "be careful with numbers" but a structural one — **if a claim is
checkable by a command, the command runs before the claim is written**, and that holds hardest in the
documents that are meant to be binding.

## 2026-07-19 — A rule changed in two places and stayed wrong in three

**Trigger:** Invoking the `adr-author` skill to write ADR 0004. Its step 6 still instructed:

> Sync `main`, then flip **`Proposed → Accepted`** in both the ADR header and the index, as a direct
> follow-up commit on `main`. This is the one workflow-sanctioned non-PR commit (ADR 0001).

That exception had been withdrawn the previous day, and `main` is now branch-protected against
administrators, so following the skill would simply have failed.

**Action / method:** A grep for the old wording found it in **three** places — the `adr-author`,
`feierabend` and `weiterimtext` skills — all corrected, and all three are session rituals an agent
reads *before* doing anything else. The amendment PR had updated `CLAUDE.md` and ADR 0001 and stopped
there, because those were the documents in view. Rather than only fixing the copies, `check-docs.mjs`
gained a sixth check: a small table of **withdrawn rules**, asserted by pattern across every Markdown
file, with blockquoted lines exempt so that ADR 0001's *Amendments* section can keep quoting the old
wording verbatim. The check was verified in both directions — it passes on the corrected repository
and fails on a deliberately reintroduced sentence.

**Impact:** The three skills now match the rule they teach. A future withdrawal gets one row in the
table instead of a search nobody remembers to run.

**Lessons learned:** This project's central thesis — a fact duplicated away from its authority
degrades into an assertion — was written about prices, and it applies just as exactly to process
rules. The failure was not carelessness in the amendment PR; it was that "where else does this rule
live?" is a question no one thinks to ask, because the copies are invisible from inside the document
being changed. The durable answer is not more diligence but the same move the project already makes
everywhere else: when a rule is reversed, leave behind a check that fails if any copy still teaches
the old one. Note also which documents were missed — not the ADRs, but the **procedural** files. Those
are read by an agent that is about to act, which makes them the most expensive place for a stale rule
to survive and the least likely place to be looked at when the rule changes.

## 2026-08-05 — The way of working gets a name, and a declaration

**Trigger:** The owner reported that the method this project had been worked by now exists as a
project of its own and is called `agent-project-rules`, and asked that this repository be brought in
line with it.

**Action / method:** The first finding was that the premise did not hold here: the old name appeared
**nowhere** in this repository, and there was no `method.json`. Nothing had to be renamed. What was
actually true is that this project had followed the method for three weeks without ever declaring it —
so this was a first adoption, not a migration, and saying so changed the work from a search-and-replace
into a review.

All 32 rules of catalogue 0.5 were read against the repository. Every one of them was already in
force — the four roles were already bound to real files, `Accepted` already meant decided rather than
built, the gate was already zero-approvals-on-purpose. So `method.json` declares **no adaptations**,
which is a claim rather than a shrug: the coherence check verifies that every rule is either in force
or recorded as changed, and it now passes with 32 in force and 136 references resolved.

Two things had to be told apart carefully. Where the repository names *grimora*, it usually means
grimora-the-project — a different stack with a different risk profile, cited in ADR 0002 and ADR 0009
as a comparison. Those references are still true and were left alone. Only the sentence that credited
grimora with the **method** was rewritten, because the method has an address of its own now.

**Impact:** `method.json` at the root, the five session procedures re-based on the plugin's 0.5.0
versions under the names the owner types, `.claude/skills/README.md` recording what was deliberately
changed in them, and `CLAUDE.md` naming the method and the four role bindings.

**Lessons learned:** "Adapt the project to the rename" was a reasonable description of the task and
the wrong one, and checking it cost one `grep`. An instruction that names the change to make is worth
one minute of testing against the repository before it is carried out — the answer here turned a
mechanical edit into the discovery that the project had never declared what it follows.

## 2026-08-05 — A check counter-tested against its own wording

**Trigger:** Reading the entry of 2026-07-19 above while re-basing the session procedures. It records
that the withdrawn-rule check "was verified in both directions — it passes on the corrected repository
and fails on a deliberately reintroduced sentence". That is true, and it is not the same as working.

**Action / method:** A search found the retired rule still asserted in **two** live documents:
`.claude/skills/moin/SKILL.md` and this file's own preamble. Both dated from `b302d25` on 2026-07-18;
the check arrived in `35e0f3b` on 2026-07-19, **after** them. It had been added to a repository that
already contained two copies of the rule it existed to catch, and had reported success ever since.

Two independent causes, each sufficient on its own:

1. **The pattern was built from the wording the rule happened to have**, so the counter-test —
   reintroducing that wording — proved only that the pattern matches itself. Both survivors were
   *paraphrases*, which is what a document produces when it restates a rule in its own words. Re-run
   against the old pattern afterwards: the literal wording is caught, all three paraphrases are missed.
2. **The scan matched line by line**, and `moin` split the claim across a line wrap. No pattern could
   have matched it, correct or not.

Both are fixed: paragraphs are folded before matching, and the pattern now looks for the *claim* — a
phrase asserting an exception exists, near a phrase naming the status flip or a commit to `main`, in
either order. The counter-test this time used four rephrasings including one nobody has written yet,
plus five legitimate near-misses: the correct statement of the rule, "without exception", the same
claim inside a blockquote, the same claim inside a fenced block, and `one` as a substring of `none`
next to the flip. Four caught, five clean, and the check found one real finding in the new text before
it found nothing.

**Impact:** The check decides something now. `tools/check-docs.mjs` check 6 fires on a rephrasing of a
withdrawn rule rather than on a recitation of it.

**Lessons learned:** A check written at the same moment as the fix inherits the fix's vocabulary, and a
counter-test drawn from the same moment inherits it twice. The useful question is not *does it fail on
a violation* but **would it fail on a violation somebody else wrote** — so the deliberate violations
have to be phrased by someone who is not looking at the pattern. Second: a green check is evidence
only about what it can see. This one was green for three weeks over two documents it could not read,
and nothing about the output said so.

## 2026-08-05 — `agent-ready` is a label, not a reading

**Trigger:** With the merge queue cleared, the owner asked what to work next. I recommended #17 (issue
forms) as decision-free — from its labels, `priority:medium` and `agent-ready`, and from its title. The
owner said yes. The ticket then turned out to carry a section headed **"Decision needed from the
owner"**: which language the forms are written in, proposing a third exception to `CLAUDE.md`'s
language rule for the two forms aimed at non-developers.

**Action / method:** The question went to the owner before any file was written, with the ticket's own
recommendation offered first; the owner chose English throughout, so no exception was added and
`CLAUDE.md` stayed as it was. Afterwards the two remaining Phase 0 tickets were **read** before being
characterised again — and both had been described wrongly in the same session. #18 (`SECURITY.md`) had
been called owner-gated over its response-time promise, which its own constraints already settle:
state best-effort honestly rather than copying a service-level promise across. #19, never flagged, says
plainly that the code of conduct's enforcement contact "is a question for the owner, not a detail to
fill in". Both carry `agent-ready`.

**Impact:** One question to the owner instead of a wrong premise baked into five files, at a cost of
about a minute. `docs/STATUS.md`'s list of available work now separates decision-free from owner-gated
per ticket and names the sentence that makes each one so — including #39, which that same file had
listed as work an agent could pick up and, thirty lines later, as something the owner owes the
repository.

**Lessons learned:** `agent-ready` records that a ticket is ready to be *worked*, not that working it
needs no answers — three of the four open Phase 0 tickets carry the label and two of them contain an
owner question. Labels and titles are an index; the ticket is the content, and this project writes long
tickets precisely because the constraints do not fit in a title. The asymmetry settles it: reading the
ticket costs one tool call, whereas recommending it wrongly spends the owner's decision on a premise
that is not true — and had the work simply started, the language would have surfaced in review, after
five files were written in the wrong one.

## 2026-08-05 — Where an answered question goes

**Trigger:** #64 proposed adopting the method's consolidated pull-request shape, and was blocked on
[agent-project-rules#13](https://github.com/nanatsusaya/agent-project-rules/issues/13) with the
constraint that the shape is not decided here — *"a second answer in this repository is the defect
this ticket is about"*. The owner asked whether to pull it forward anyway. The answer was no, on those
grounds, until #13 closed.

**Action / method:** The handbook now fixes five sections — What · Why · Verified · Open questions ·
Follow-ups — plus **exactly one** project addition, which here is *Content sources*, because a fact
with no source does not ship. *Which issue / ADR it follows* folds into Why and *Merge-order caveats*
into Follow-ups; both were argued for in #64 and both were answered upstream, so neither was
re-litigated here. `CLAUDE.md` stopped enumerating the shape and now points at the template instead.

**Impact:** The part that changes how work is done is not the headings. **An answer to an open
question arrives as a comment naming its `O`-number, and nothing already written in the description is
rewritten.** Before this, every answer the owner gave arrived as a chat message and survived only as
whatever an agent afterwards chose to write down — the code-of-conduct enforcement contact decided on
2026-08-05 exists as one row in `STATUS.md` and nowhere else, with no permalink and no timestamp but
the one typed into it.

**Lessons learned:** This repository had the disease the ticket describes, and its own pull requests
are the evidence: #58 put the language question under an invented heading, #65 invented another for
two overridable judgements, and #60 records a commit pushed onto #59's branch while the owner was
merging it — the editing race, already paid once. A shape is not ceremony when the drift is
measurable in your own last ten descriptions. Worth noting for the next adoption of something from
upstream: the reason to check the local evidence first is not to decide whether the rule is right, but
to know whether it is *needed here*, which is what makes an agent apply it rather than perform it.

## 2026-08-05 — Moving a file is not amending the decision that links to it

**Trigger:** #11 renamed the German `docs/` paths to English — `analyse/` → `analysis/`, `inhalte/` →
`content/`, `seiten/` → `pages/`. Fifteen of the relative links that would break live in **four
`Accepted` ADRs** (0002, 0003, 0004, 0009), and `CLAUDE.md` says an `Accepted` ADR is immutable
*"except with explicit owner authorisation, recorded in that ADR's Amendments section"*. There was no
version of the rename that left those files untouched: `tools/check-docs.mjs` check 4 fails on a
relative link that does not resolve, so leaving them alone was not an option either.

**Action / method:** The work stopped before it started and the choice went to the owner as three
options — treat it as maintenance, treat it as a real amendment with four *Amendments* entries, or
drop #11 and keep the German paths. The recommendation was the first, on the grounds that the
decision text changes by not one word: what moved is a link target, and a link to a file that no
longer exists is a defect rather than a new decision. The owner chose it.

**Impact:** The four ADRs carry no *Amendments* entry for this. The authorisation is instead one row
in `STATUS.md`'s *Decisions taken*, which is what makes it a record rather than an agent's private
reading — the row is deliberately worded as the authorisation itself, so a future session finds the
permission rather than the conclusion.

**Lessons learned:** The immutability rule protects the *decision*, and the test that separates the
two cases is whether a reader who had already acted on the ADR would now act differently. A moved link
fails that test; a changed constraint passes it. Keeping the distinction matters in both directions —
four *Amendments* entries about a directory rename would devalue the section where genuine changes to
a decision are recorded, which is exactly the C2 dilution the immutability rule exists to prevent. The
gate was still worth tripping: it cost one question, and the alternative was an agent quietly editing
four `Accepted` ADRs and calling it a path fix.

## 2026-08-05 — "Merged" is a claim about the remote, not a fact

**Trigger:** The session's rhythm all day was *the owner merges, names the next ticket, work
continues*. On the fourth of those the message said #68 was merged and asked for #67. It was not:
`git ls-remote origin refs/heads/main` still pointed at the previous merge commit, the branch still
existed with both its commits, and `gh pr view 68` reported `OPEN` with `mergeCommit: null`. Both
sources agreed. A second message came a minute later, and then it really had merged.

**Action / method:** Nothing was started. The evidence was reported as three lines of actual command
output rather than as "it looks like it did not merge", together with the concrete cost of proceeding
anyway — #67 edits `.gitignore`, whose line 9 #68 had already rewritten, so branching from the
unchanged `main` would have either re-fixed the old path or produced a conflict against work already
finished.

**Impact:** One round trip, and the next task began on the right base.

**Lessons learned:** `weiterimtext` already required re-verifying the external state, and the failure
this repository had recorded was a **stale API** believed over the git data. This one inverts that:
the API and git agreed, and the mistaken source was the instruction that started the task. So the
rule is better stated without naming a culprit — **the shared state has exactly one authority, the
remote refs, and everything else is a claim about it**, including a tool's cache and including a
person's report. Checking is not distrust; it is that the costs are asymmetric. One command against
an afternoon of work built on the wrong base, and a conflict discovered at push time is discovered in
the worst possible place: after the reasoning has been written down as though it were true.
