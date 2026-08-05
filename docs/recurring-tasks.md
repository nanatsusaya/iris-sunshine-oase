# Recurring tasks

Maintenance that comes due on a calendar rather than in response to a change. Everything here has
the same shape: it is easy to do, invisible when skipped, and expensive once it has been skipped for
long enough.

> **Why this file exists.** An agent working a ticket has this repository and nothing else — no
> memory of earlier sessions, no sense of how long something has been sitting. A task that depends
> on somebody noticing is a task that does not happen. Dependabot covers what a bot can see; this
> file covers what it cannot.

Automated updates that need **no** entry here: npm dependencies and GitHub Actions pins, both
handled by [Dependabot](../.github/dependabot.yml).

## Node's LTS pin

| | |
|---|---|
| **What** | Bump `node-version` in `.github/workflows/ci.yml` **and** `.github/workflows/deploy.yml`, and the `engines.node` floor in `package.json`. |
| **When** | When the pinned line leaves *active LTS*. Node promotes a new line each October. |
| **Currently pinned** | **24** (Krypton), set 2026-07-19 with the scaffold. |
| **Check against** | [nodejs/Release — schedule.json](https://github.com/nodejs/Release/blob/main/schedule.json), the primary source. Not a blog post, and not memory. |
| **Owning decision** | [ADR 0002 §2](adr/0002-tech-stack-and-tooling.md) |

The pin is deliberate, not incidental: tracking `latest` would let a Node release change the build
unbidden. The cost of that choice is exactly this task — the pin ages, and nothing complains until
the line stops receiving security fixes. ADR 0002 §2 names it as the project's first genuine
recurring maintenance and the reason this file exists.

**Do not bump to a line that is not yet active LTS.** A current release is not a place to sit; the
whole point of the pin is to be on the line that still receives full support.

## TypeScript's held-back major

| | |
|---|---|
| **What** | Check whether [`@astrojs/check`](https://www.npmjs.com/package/@astrojs/check) has widened its `typescript` peer range to include `^7`. If it has, remove the `ignore` entry for `typescript` in [`.github/dependabot.yml`](../.github/dependabot.yml) and let the upgrade come through normally. |
| **When** | Every few months, and whenever `@astrojs/check` or Astro itself has a notable release. |
| **Currently pinned** | `typescript ~6.0.3`; versions `>=7` are ignored. `@astrojs/check@0.9.10` is its latest release and still peers on `^5.0.0 \|\| ^6.0.0` (checked 2026-08-05). |
| **Check against** | `npm view @astrojs/check@latest peerDependencies` — the package's own metadata, not a changelog summary. |
| **Owning decision** | [ADR 0002 §3](adr/0002-tech-stack-and-tooling.md) — `astro check` is the type checker, so its constraint is the project's constraint. |

This is a **suppressed update**, which is the kind that rots quietly: Dependabot stops mentioning it,
so nothing ever asks again. The block is deliberately narrow — `>=7`, not "no majors" — so a move to
TypeScript 6, which *is* inside the peer range, still arrives as a normal pull request. It did:
`eb551f9` took the project from 5.9.3 to 6.0.3, which is the narrow block working rather than an
oversight in it.

The situation arose in #32, where Dependabot proposed TypeScript 7.0.2 and CI refused the install on
the peer conflict. That is the check chain working as intended; the ignore entry exists so the same
refusal is not re-litigated every week.

## Domain and registrar

| | |
|---|---|
| **What** | Confirm the domain is on automatic renewal and that the netcup account carries two-factor authentication. |
| **When** | Annually, and before any go-live step. |
| **Who** | The **owner** — this is outside the repository and no agent has access. |
| **Owning decision** | [ADR 0009 §5](adr/0009-security-by-design.md) |

An expired domain is a total loss of the business's identity, and it is the failure nobody monitors
because it is silent until it is complete. It is listed here rather than assumed because ADR 0009
§5 names it as the owner's responsibility and unverified.
