# iris-sunshine-oase.de

Rebuild of the website of **Kosmetik- & Sonnenstudio Iris’ Sunshine Oase** — a tanning and cosmetics
studio in Herxheim bei Landau (Pfalz, Germany). The existing site is a WordPress installation from
2017; this repository replaces it with a statically generated site.

> ### ⚠️ This is a draft, not the studio's website
>
> The live site is **<https://iris-sunshine-oase.de>** and stays live until an explicit cutover.
> Nothing in this repository is served to customers yet.
>
> **Do not take prices or opening hours from this repository.** Some of what is here is an extract of
> the *old* site, current as of 2020, and some is work in progress. For the studio's actual prices,
> opening hours and contact details, use the live site or call the studio.

## What is in here

The site is small — 14 pages — but the correctness bar is high: the prices, opening hours and address
on it are what customers act on. A wrong price is a production defect, not a typo.

The central design decision follows from the old site's central defect. There, the same price existed
in an Elementor layout block, a pricing-table widget and a text paragraph, and over the years those
drifted apart. So here, **content is structured data rather than markup**: prices, opening hours and
services have exactly one authoritative definition each, and templates render them.

The repository currently contains **documentation only** — the survey of the old site, the decision
records, and the tooling that extracted the old content. The scaffold ships once the tech-stack
decision is recorded.

## Documentation

Start at **[`docs/README.md`](docs/README.md)** — it is the single source of truth and indexes
everything else.

| Where | Answers |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | How work is done here — the standing operating rules |
| [`docs/adr/`](docs/adr/README.md) | What was decided, and why. Normative. |
| [`docs/STATUS.md`](docs/STATUS.md) | Where the rebuild currently stands |
| [`docs/analyse/`](docs/analyse/README.md) | What the old site is, and its 28 documented defects |
| [`docs/inhalte/`](docs/inhalte/README.md) | Every text of the old site, extracted verbatim |
| [`docs/business-facts.md`](docs/business-facts.md) | The studio's address and contact details — the one authoritative copy |
| [`docs/meta/`](docs/meta/agent-collaboration-log.md) | Why the way we work looks the way it does |

Two things are deliberately *not* here. The **archive** of the old site — roughly 600 MB of image
material with undocumented usage rights, plus a database export containing third parties' personal
data — is excluded wholesale; this repository is not a backup of the old site. And no **image** enters
it without documented source, licence and evidence.

## How this project is worked

The site is built and then maintained **indirectly**: the owner files GitHub issues, and an AI agent
works them. That shapes nearly everything about this repository — an agent starting a ticket has the
repository and nothing else, no conversation history and no memory of earlier sessions, so a decision
that was never written down does not merely get forgotten, it gets re-litigated differently by the
next session.

Hence: every significant decision is an [ADR](docs/adr/README.md); every change goes through a pull
request that the owner merges; conventions are enforced by a check (`node tools/check-docs.mjs`)
rather than left to discipline; and the documentation is written to be self-supporting.

## Found a wrong price, or something broken?

Please open an [issue](https://github.com/nanatsusaya/iris-sunshine-oase/issues) — a factual
correction is more useful than almost any other contribution here.

This is a single business's website rather than a community project, so it is not looking for feature
contributions, and pull requests from outside are unlikely to be merged.

## Licence

This repository holds two different kinds of material, licensed differently. See
[`LICENSE`](LICENSE) for the exact scope.

- **The software** — code, templates, build configuration, the scripts under `tools/`, and the
  project's own process documentation — is © 2026 Daniel Wagner, under the **MIT licence**.
- **The business content** — page copy, service descriptions, prices, opening hours, the business
  name, the logo and all image material — is © 2026 Iris Zellner, Kosmetik- & Sonnenstudio Iris'
  Sunshine Oase. **All rights reserved.** It is public here because the rebuild is developed in the
  open, not to grant any right of use. [`LICENSE`](LICENSE) says where to write to ask for it.
