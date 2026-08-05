# Contributing

This repository is the rebuild of one small business's website. The most valuable thing anyone
outside the project can do here is **tell us that a fact is wrong** — and this file exists mostly to
make that easy and to be honest about everything else.

If you are an agent working a ticket, this is not your file: the working rules are in
[`CLAUDE.md`](../CLAUDE.md) and the state of play is in [`docs/STATUS.md`](../docs/STATUS.md).

## A price, an opening time or an address is wrong

Please report it. Use the **[Wrong content](https://github.com/nanatsusaya/iris-sunshine-oase/issues/new?template=01-content-correction.yml)**
form. A wrong price is something a customer acts on, so it is treated here as a defect rather than a
detail — it takes priority over new work.

The form asks **where the correct value comes from**, and that field is required on purpose. A
corrected value with no source is not an improvement: it replaces one unverified figure with another,
and this project's entire design exists to stop exactly that. You do not need certainty — *"I am
fairly sure, but check with Iris"* is a genuinely useful answer, because a stated uncertainty can be
resolved and an unmarked guess cannot.

## Something is broken

Use the **[Bug](https://github.com/nanatsusaya/iris-sunshine-oase/issues/new?template=02-bug.yml)**
form — a page that will not load, a layout that breaks, a link that goes nowhere.

## Please do not include personal data

This repository is public and everything filed here stays readable. No names, e-mail addresses,
telephone numbers or messages belonging to anyone — yours or a customer's. No form here asks for
contact details, and none needs them. Check screenshots before attaching: a browser window carries
bookmarks, tabs and account names past anyone who only proof-read the text.

## What this project is not looking for

Being straightforward about this is more respectful than letting someone spend an evening on a change
that will not be merged:

- **Pull requests from outside are unlikely to be merged.** This is a single business's website, not a
  community project. It is not looking for features, redesigns or framework changes, and every
  decision of any weight is already recorded in an [ADR](../docs/adr/README.md) that a pull request
  would have to argue against rather than simply change.
- **The owner merges every pull request**, without exception. Nothing here is self-service.
- **Nothing is deployed yet**, and the site currently live under the studio's domain is not built from
  this repository.

If you have spotted something genuinely wrong — including in the documentation or the tooling — an
issue is welcome, and is more likely to lead somewhere than a pull request.

## If you do open a pull request

The working rules — branch naming, commit format, one concern per pull request, the Definition of
Done — are in [`CLAUDE.md`](../CLAUDE.md) and are **not repeated here**. A second copy of a rule is a
copy that drifts, which is the defect this project was started to remove; when you need the rules,
read them there.

Two things worth knowing before you start: the check chain (`npm run check`) is blocking and includes
the documentation checks, and no image enters this repository without its source, licence and evidence
written down.

## Reporting something else

- **A security problem** — do not open a public issue. See [`SECURITY.md`](SECURITY.md).
- **Someone's behaviour** — see [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
