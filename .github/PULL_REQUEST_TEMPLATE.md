<!--
The shape below comes from the method's handbook — `agent-manual/pull-request.md` in
nanatsusaya/agent-project-rules — and is the same in every project that takes it. If the shape is
wrong it is wrong for five repositories, so it is fixed there, not here.

One concern per pull request. The owner merges every one, never the author.

What, Why and Verified are always answered. Open questions and Follow-ups are deleted when there are
none — an empty heading reads as "considered and found empty".

**Content sources is this project's one declared addition**, and the handbook allows exactly one.
It earns the slot because here a fact with no source does not ship: a change touching a price, an
opening time or an address cannot be judged at all until a reviewer knows where each value came from.
Declared here so a later reader can tell a section somebody chose from one that drifted in.

Two headings this template used to carry are gone, folded in rather than dropped — the handbook
decided this, and re-adding them would be a second answer:

  * "Which issue / ADR it follows" → Why, which already asks which decision or ticket a change
    follows, and for the link.
  * "Merge-order caveats" → Follow-ups, which already covers what a change leaves undone. It stood
    empty on almost every change.
-->

## What

<!-- What this change does, concretely. -->

## Why

<!-- The problem it solves. If it follows from a decision or a ticket, say which, and link it —
     an ADR, an issue, the epic.

     To close a ticket, write `Closes #NN` here, and write it as PLAIN TEXT — never inside backticks
     or a code span, or GitHub silently will not auto-close it. This is the one place that line
     goes. -->

## Content sources

<!-- Only for changes that touch prices, opening hours, address, contact details or page copy.
     Where does each fact come from — docs/content/, an ADR, or the owner? A fact with no source
     does not ship. Write "none" if this change touches no business content. -->

## Verified

<!-- How you know it works. Name the commands you ran and what they returned — not what they would
     have returned. Anything with observable behaviour was exercised, not merely built: for anything
     with visible output that means looking at the rendered page in a browser, not trusting a green
     build. State what you did NOT verify. -->

## Open questions

<!-- Numbered O1..On, each with a recommended default. Delete if none.

     Do not answer them yourself. When the answer comes it arrives as a comment on this pull request,
     naming the O-number — and nothing already written here is rewritten. This section keeps one line
     per question: `O1 — answered: … → <link>`.

     An answer edited into this description overwrites the question it answers. It gets no permalink,
     notifies nobody, carries no timestamp except one typed by hand, and races whoever else is
     editing — this repository has already paid that cost once, in #60. The durable consequence goes
     where it belongs: the owning ADR, or docs/STATUS.md. -->

## Follow-ups

<!-- What this deliberately leaves undone, and where it is recorded.

     Merge order lives here too: what has to merge before this, and what will need a rebase
     afterwards. -->
