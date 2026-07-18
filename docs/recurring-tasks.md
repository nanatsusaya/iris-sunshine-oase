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
