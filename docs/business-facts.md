# Business facts — identity and contact

> **These facts now live in the content model.** The authority is
> **[`src/content/business.yaml`](../src/content/business.yaml)**, read through
> [`src/content/query.ts`](../src/content/query.ts). This file is a pointer and an explanation; it holds
> no values.
>
> Until 2026-07-19 the table lived here, under an explicit *"interim location"* notice, because
> [ADR 0003](adr/0003-content-model.md) had not been taken and the alternative — leaving the studio's
> address in a chat log — was not a location at all. ADR 0003 §9 redeemed that note.

## Why this file still exists

Two things did not move, because they are reasoning rather than data.

### Why these details may be published at all

They are the business's own, and **§ 5 TMG requires a German commercial website to state them
publicly.** `CLAUDE.md` draws the line accordingly: the business's own contact details are fine, third
parties' are not. Nothing in the model belongs to anyone else — the WordPress export's 2,216
contact-form submissions were removed before anything was committed.

### Why two of the rows have an unusual source

Every value came from the extract of the old site except two, and both exceptions are worth keeping
written down because they look like errors otherwise.

**The e-mail address** could not come from the extract. The PII cleaning replaced **every** e-mail
address with a placeholder under `example.invalid` and did not distinguish a customer's address from the
studio's own, so `inhalte/seiten/impressum.md` and `inhalte/seiten/kontakt.md` both show
`studio@example.invalid`. That is a redaction artefact, **not a value to copy.** The blanket rule was
right — a rule with an exception is a rule that gets applied wrongly under time pressure — and the
studio's own address was collateral. It comes from the owner instead.

**The trading name's apostrophe** is the owner's decision, not the extract's. The old site spelled the
name both ways (`analyse/04-design-system.md` records a straight `'` in the header and a typographic `’`
in the hero), and the 2026 design draft reproduced exactly that split, 39 times one way and 18 the
other. The owner settled it on 2026-07-19 ([ADR 0004](adr/0004-styling-and-design-tokens.md) R5) on the
typographic form, and `tools/check-docs.mjs` asserts it — because a brand name spelled two ways is
precisely the kind of small inconsistency that reappears the moment nobody is looking. It already did,
twice, across nine years and one complete redesign.

## The rule all of this serves

**A fact has exactly one definition.** The old site carried the same price in an Elementor block, a
pricing-table widget and a text paragraph, and over nine years they drifted apart
(`analyse/05-maengelliste.md`). Contact details are the same class of fact: a business moves, changes its
number, switches mail provider — and every copy made by hand is a copy that will be missed.

So the test for adding anything to the model is not "is it true?" but **"is this the only place it is
written?"**

## What is deliberately not in the model yet

**Confirmed prices and opening hours.** The model holds the *shape* of both and, at present, invented
placeholder values that the `live` build refuses to publish (ADR 0003 §8, R1). The real figures come
from the owner. `analyse/03-leistungen-und-preise.md` remains a record of the **old** site, undated and
unconfirmed by its own header.

**Anything not yet confirmed by the owner.** An empty field is recoverable; a plausible guess that gets
rendered onto a live page is not.
