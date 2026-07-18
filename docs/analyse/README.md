# Survey of the old site

A record of the existing WordPress site, as the basis for the rebuild with Astro.

## Contents

| File | Purpose |
|---|---|
| [01-ausgangslage.md](01-ausgangslage.md) | Technical state of the old site, the data in the backup, the privacy cleanup |
| [02-inhaltsinventar.md](02-inhaltsinventar.md) | Every page and post, rated: keep, rework or drop |
| [03-leistungen-und-preise.md](03-leistungen-und-preise.md) | The full price list — the most valuable content asset |
| [04-design-system.md](04-design-system.md) | Colours, typography and layout of the old site; what carries over and what does not |
| [05-maengelliste.md](05-maengelliste.md) | Concrete defects, written as work packages |
| [06-medien-inventar.md](06-medien-inventar.md) | Image inventory, volume breakdown, storage decision |

## How reliable each statement is

Two sources, with different weight — and the difference matters enough that every claim is
tagged with which one it came from.

**Read out of the WordPress export** — exact, machine-verified. This covers all page and post
listings, prices, texts, the menu structure, the opening-hours records and the anchor
analysis. Tagged **verified**.

**Read off screenshots** — a visual assessment, not a measurement. This covers colour values
(the hex codes are estimates), font sizes, spacing and every statement about appearance.
Tagged **observed**. Treat these as a starting point, not a specification.

## The archive is not part of the repository

The `Archive/` folder holding the WordPress backup is **excluded entirely** via `.gitignore` —
undocumented image rights and third parties' personal data. The reasoning and the volume
breakdown are in [06-medien-inventar.md](06-medien-inventar.md).

The texts of the old site were extracted beforehand and are versioned under
[`docs/inhalte/`](../inhalte/README.md). **That is the only versioned source of the old
content.**

If the archive is available locally, it holds two versions of the export:

- `…2026-07-18.xml` — cleaned: without the 2,216 `pf_contact` entries (contact-form
  submissions from 2017–2021 carrying third parties' e-mail and IP addresses), without two
  spam comments with sender IPs, and with every real e-mail address replaced by a placeholder
  under `example.invalid`
- `…ORIGINAL-MIT-PII.xml` — complete and unmodified. **Must not be committed, uploaded or
  passed on in any form.** Note that release assets of a public repository are public too, so
  a GitHub Release is not an exception to this.

Anyone who needs the real business e-mail address for the Impressum should take it from the
original file or ask the owner. It is deliberately nowhere in this documentation.

## State

Survey taken 2026-07-18, against the export of the same day. The live site was reachable at
that point; its content is current as of May 2020, and its opening hours were maintained
through winter 2024/25.
