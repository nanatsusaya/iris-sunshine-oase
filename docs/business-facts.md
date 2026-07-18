# Business facts — identity and contact

The studio's identity and contact details, with the source of each. **This file is the authority for
these values.** Anything that needs them — a template, the Impressum page, the licence file — reads
them from here rather than restating them.

> **Interim location.** These facts belong in the content model, which [ADR 0003](adr/README.md) will
> decide. Until it exists there is no typed data file to hold them, and the alternative — leaving them
> in a chat log — is not a location at all. When ADR 0003 lands, this file's contents move into the
> content model and this file becomes a pointer to it or disappears.

## Why this file exists at all

The rule it serves is the one the whole rebuild is built on: **a fact has exactly one definition.** The
old site carried the same price in an Elementor block, a pricing-table widget and a text paragraph, and
over nine years they drifted apart (`analyse/05-maengelliste.md`). Contact details are the same class of
fact — a business moves, changes its number, switches mail provider, and every copy that was made by
hand is a copy that will be missed.

So the test for adding anything below is not "is it true?" but "is this the only place it is written?"

## The facts

| Fact | Value | Source |
|---|---|---|
| Trading name | Kosmetik- & Sonnenstudio Iris’ Sunshine Oase | `inhalte/seiten/impressum.md`; apostrophe **owner, 2026-07-19** — see below |
| Proprietor | Iris Zellner | `inhalte/seiten/impressum.md` |
| Street | Offenbacher Str. 2 | `inhalte/seiten/impressum.md` |
| Postcode and town | 76863 Herxheim bei Landau (Pfalz) | `inhalte/seiten/impressum.md` |
| Telephone | +49 (0)7276 50 50 550 | `inhalte/seiten/impressum.md` |
| E-mail | IrisSunshineOase@online.de | **owner, 2026-07-18** — see below |
| VAT identification number | DE276633210 | `inhalte/seiten/impressum.md` |

### Why the e-mail address has a different source

Every other value above was read from the extract of the old site. The e-mail address could not be:
the PII cleaning of the WordPress export replaced **every** e-mail address with a placeholder under
`example.invalid`, and it did not distinguish between a customer's address and the studio's own. So
`inhalte/seiten/impressum.md` and `inhalte/seiten/kontakt.md` both show `studio@example.invalid`, which
is a redaction artefact and **not** a value to be copied.

The blanket cleaning was right — the export held 2,216 contact-form submissions with third parties'
addresses, and a rule with an exception is a rule that gets applied wrongly under time pressure. The
studio's own address was collateral, and it comes from the owner instead.

### Why the trading name's apostrophe has a second source

The words come from the extract; the **apostrophe** does not. The old site spelled the name both ways —
`docs/analyse/04-design-system.md` recorded a straight `'` in the header and a typographic `’` in the
hero — and the owner's design draft reproduced exactly that inconsistency, 39 times one way and 18 the
other.

The owner settled it on **2026-07-19** ([ADR 0004](adr/0004-styling-and-design-tokens.md) R5): the
typographic `’`, everywhere. So this row is the extract's wording with one deliberate typographic
correction, and that is why its source cell names two authorities rather than one.

`tools/check-docs.mjs` asserts it, because a brand name spelled two ways is precisely the kind of small
inconsistency that reappears the moment nobody is looking — it already did, twice, across nine years and
one complete redesign.

### Why these details may be published here

They are the business's own, and § 5 TMG requires a German commercial website to state them publicly.
`CLAUDE.md` draws the line accordingly: the business's own contact details are fine, third parties'
are not. Nothing here belongs to anyone else.

## What is deliberately not in this file

**Prices and opening hours.** They are a larger, more structured dataset and they live in
[`analyse/03-leistungen-und-preise.md`](analyse/03-leistungen-und-preise.md) as a record of the old
site until ADR 0003 gives them a home. Adding them here would turn a short list of stable facts into a
second content model competing with the real one.

**Anything not yet confirmed by the owner.** An empty row is recoverable; a plausible guess that gets
rendered onto a live page is not.
