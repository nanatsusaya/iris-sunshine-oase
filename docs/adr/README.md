# Architecture Decision Records

One file per significant decision, numbered `NNNN-title.md`. ADRs are immutable once `Accepted`
**unless the owner authorises an amendment** (recorded in that ADR's *Amendments* section); otherwise
a later ADR supersedes an earlier one. See [ADR 0001](0001-record-architecture-decisions.md) for the
rules and the per-ADR workflow.

Every ADR file must appear in this table with a status.

| ADR | Title | Status |
| --- | --- | --- |
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions | Accepted |
| [0002](0002-tech-stack-and-tooling.md) | Tech stack and tooling | Accepted |
| 0003 | Content model — structured data and where authority lives | Planned |
| 0004 | Styling and design tokens | Planned |
| 0005 | Internationalisation — German default, English secondary | Planned |
| [0006](0006-deployment-preview-hosting.md) | Deployment, preview and hosting | Accepted |
| 0007 | Legal, privacy and third-party services | Planned |
| 0008 | URL migration and redirects from the old site | Planned |
| [0009](0009-security-by-design.md) | Security by design | Accepted |

Status values: `Proposed` · `Accepted` · `Superseded` · `Planned` (ticketed, not yet written).

> **`Accepted` means the *decision* is recorded and binding — NOT that it is *implemented*.**
> Implementation progress is tracked in [`docs/STATUS.md`](../STATUS.md).

## The planned set, and why it is short

Eight ADRs is the whole expected architecture surface for this project. The list was derived from the
analysis of the old site (`docs/analyse/`) — each entry corresponds to something that either went
wrong there or is irreversible once chosen:

- **0002 / 0004** — the old site carried WordPress, Hestia, Elementor, Orbit Fox, two competing SEO
  plugins and a page builder whose layout blocks *were* the content. The replacement stack and its
  styling model are the decisions that keep that from recurring.
- **0003** — the old site's prices existed in three places at once and drifted. Where a fact lives,
  and which copy is authoritative, is the single most load-bearing decision here.
- **0005** — locale routing and `hreflang` are hard to retrofit once URLs are public and indexed.
- **0006** — public preview, indexing, hosting and the cutover from netcup: outward-facing, and the
  indexing question in particular is easy to get wrong in a way that harms a live business.
- **0007** — a real German business: Impressum obligations, and the question of whether any
  third-party service (fonts, maps, analytics, embeds) is loaded at all, which decides whether a
  consent banner is needed.
- **0008** — the old site's 32 URLs are indexed today. Breaking them silently loses the search
  ranking a nine-year-old local business has accumulated.

Anything beyond this list should be questioned before it is written. A site of 14 pages does not need
a large decision log; it needs a *correct* one.

## 0009, and why it was added to a closed list

The list above was meant to be complete, so an addition has to earn itself. **0009 — security by
design** was added on the owner's instruction (2026-07-18) and survives that test on the criteria in
ADR 0001: it is outward-facing, it has legal consequences, and it decides constraints that a later
change would otherwise reverse without noticing.

What it is *not* is a port of the equivalent ADR from the sibling project *grimora*. That one models a
multi-tenant service with accounts, a plugin sandbox and an event log; almost none of its content
applies to a static site with no server, no login and no user data. The threats here are different and
mostly sit **around** the site rather than in it: the npm supply chain, the CI workflow's privileges,
the DNS records the site's identity rests on, and a maintenance pipeline in which an AI agent acts on
publicly filed issues. Same rigour, different subject.
