# Security policy

This repository holds the rebuild of the website of *Iris’ Sunshine Oase*, a tanning and cosmetics
studio in Herxheim bei Landau. It is a statically generated brochure site — the security decisions
behind it are recorded in [ADR 0009](../docs/adr/0009-security-by-design.md), and this file describes
only how to report a problem.

## Reporting a vulnerability

**Please do not open a public issue for a security problem.** A public issue discloses it to everyone
the moment you press submit, which is exactly the window a fix is supposed to close.

Use GitHub's **private vulnerability reporting** instead — the *Security* tab → *Report a
vulnerability*, or
<https://github.com/nanatsusaya/iris-sunshine-oase/security/advisories/new> directly. That opens a
private advisory visible only to you and the maintainer. The feature is enabled on this repository
(confirmed 2026-08-05), so the link goes somewhere that works rather than to a dead end.

Please include as much of this as you can:

- what the problem is, and what someone could do with it;
- how to reproduce it — the affected file, route or workflow, and any preconditions;
- the commit it applies to, and a suggested fix if you have one.

**Please do not include other people's personal data in the report**, even as evidence. If
demonstrating the problem requires it, say so and describe it instead — that is enough to act on.

## What to expect

This is one studio's website, maintained on the side by a single person. So the honest answer is
**best effort, with no committed timeframe** — no acknowledgement window, no service level. A promise
that cannot be kept is worse than no promise, and this file deliberately makes none.

What you can expect in practice:

- **Acknowledgement** as soon as the report is seen.
- **Triage** — an assessment of what is actually affected, and a plain answer if the conclusion is
  that it is not a problem here.
- **Coordinated disclosure** — the timing of any public write-up is agreed with you first.
- **Credit** in the advisory once a fix ships, if you want it; anonymity if you prefer.

## What is actually here

The surface is small. Describing it accurately is more useful to you than a generic policy, and it
saves you time on things that do not exist:

- **No accounts, no database, no server-side code.** The site is generated at build time and served
  as static files. There is no login, no session and no user data at rest.
- **No contact form, and none planned.** The studio takes enquiries by telephone and e-mail (decision
  of 2026-07-18, to be recorded in ADR 0007). The one place a brochure site usually processes visitor
  input therefore does not exist here.
- **No third-party resources.** No analytics, no fonts from a CDN, no embedded maps or videos; fonts
  are self-hosted and a build-time check fails if an external fetch appears (ADR 0009 §6).
- **The deployment path is the part with real privileges** — this repository → GitHub Actions →
  GitHub Pages. Anything that could influence what a workflow executes, or what ends up in the
  published output, is in scope and is the most valuable kind of report here.
- **The repository itself** — a leaked credential, or personal data committed by accident.

**Nothing is served to the public from this repository yet.** GitHub Pages is not enabled, the deploy
workflow's trigger is switched off, and the site that is currently live under the studio's domain is
**not built from this repository** (see *Scope*).

## Privacy findings are security findings here

The likelier finding on this project is not a classic vulnerability. This repository grew out of the
export of an existing WordPress site, and two categories of mistake matter more than any injection:

- **Personal data that should not be here** — a customer's name, an e-mail address, an IP address or
  a form submission surviving in content, fixtures, tests or history. The export was cleaned of 2,216
  contact-form submissions and every real e-mail address before anything was committed, but "we
  cleaned it" is a claim, and finding a survivor is a genuine report.
- **Material whose rights are undocumented** — an image without a recorded source and licence.

Both go through the same private channel and are treated the same way. Neither is a lesser report.

## Supported versions

There are no releases and no tags. Security fixes land on `main`, which is the only thing that exists.

| What | Supported |
|---|---|
| `main`, latest commit | ✅ |
| any older commit | ❌ |
| the site currently live under the studio's domain | ❌ — not built from this repository |

## Scope

This policy covers the source in this repository and its build and deployment path.

**The website currently served under the studio's own domain is out of scope**: it is a separate,
pre-existing installation that this project is replacing, and nothing in this repository controls it.
If you have found something there, you may still use the private channel above — the report will be
passed to the owner, who is the only person who can act on it.

**Vulnerabilities in third-party dependencies** belong upstream, with that project. If one affects
this project specifically — because of how it is used here, or because it needs pinning or patching —
report it here as well.
