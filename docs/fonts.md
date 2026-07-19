# Fonts — provenance, licence and how to reproduce them

Two webfont files are under version control. `CLAUDE.md` requires every asset in this repository to
carry its source, licence and evidence; this file is that record, and it is written so that a future
session can **verify** the files rather than trust them.

Both are asserted by [`tools/check-fonts.mjs`](../tools/check-fonts.mjs), which is part of the blocking
check chain.

## What ships

| File | Family | Weight | Bytes | SHA-256 |
|---|---|---|---|---|
| [`public/fonts/cormorant-garamond-500-latin.woff2`](../public/fonts/cormorant-garamond-500-latin.woff2) | Cormorant Garamond | 500 (static instance) | 23,312 | `8197bf53615ddc8c423f444c7f0eec63b7fa0ba093fcfbec60dfdd28429b0fc8` |
| [`public/fonts/mulish-variable-latin.woff2`](../public/fonts/mulish-variable-latin.woff2) | Mulish | 200–1000 (variable) | 29,968 | `8d1d33d6beea5a722b8f336d79c61c07405949457e37b5e65454c72dc10aba1a` |

53 kB for the site's whole typography. The `@font-face` rules are in
[`src/styles/fonts.css`](../src/styles/fonts.css).

## Licence

**Both are under the SIL Open Font License, Version 1.1.** Verified on 2026-07-19 against the primary
source — the `METADATA.pb` and `OFL.txt` in the [`google/fonts`](https://github.com/google/fonts)
repository, read at commit **`389b770410cc0b7c21c85673bfa2077420fe7f65`** — rather than against a
summary of it.

| Family | Copyright | Designer | Upstream project |
|---|---|---|---|
| Cormorant Garamond | Copyright 2015 the Cormorant Project Authors | Christian Thalmann | [CatharsisFonts/Cormorant](https://github.com/CatharsisFonts/Cormorant) |
| Mulish | Copyright 2016 The Mulish Project Authors | Vernon Adams, Cyreal, Jacques Le Bailly | [googlefonts/mulish](https://github.com/googlefonts/mulish) |

The full licence text ships beside each file, as
[`LICENCE-cormorant-garamond-OFL.txt`](../public/fonts/LICENCE-cormorant-garamond-OFL.txt) and
[`LICENCE-mulish-OFL.txt`](../public/fonts/LICENCE-mulish-OFL.txt), taken from the same pinned commit.
The OFL requires the licence to accompany the font software when it is redistributed, and serving a
font file from this site is redistribution. They sit in `public/fonts/` rather than in `docs/` for
exactly that reason: they have to travel with the files.

## Where the binaries came from, and why not from `google/fonts`

**The `.woff2` files come from `fonts.gstatic.com`; the licence and version metadata come from
`github.com/google/fonts`.** That split is deliberate and worth explaining, because the obvious
expectation is that both come from the repository.

`google/fonts` ships **TTF only** — for these two families, a 1,195,560-byte variable
`CormorantGaramond[wght].ttf` and the Mulish equivalent. Nothing in this repository can turn a TTF into
a `woff2`: that needs Brotli font compression, which means `fonttools` (Python) or an equivalent, and
this is a Node project on a machine with no Python. Shipping the TTFs instead would mean serving
roughly 1.9 MB where 53 kB does the same job.

So the binaries are the ones Google itself builds and serves, requested once, by hand, at authoring
time. **This does not weaken the rule it exists to serve.** ADR 0009 §6's invariant is that *a visitor*
never contacts a third party; a maintainer fetching a file once and committing it is the mechanism that
makes that true, not an exception to it. `tools/check-external-resources.mjs` asserts the invariant
against the built output and does not care where a committed file came from.

The trade accepted here: a `gstatic` URL is a build artefact rather than a citable upstream release, so
the SHA-256 above is what pins these files, not a version tag. That is why the checksums are recorded
and asserted rather than merely noted.

### Reproducing the download

```sh
# 1. Ask the Google Fonts API for the CSS, as a browser would. The User-Agent decides the format:
#    an unrecognised one gets TTF back instead of woff2.
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
curl -A "$UA" "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Mulish:wght@300;400;500&display=swap"

# 2. Take the URL from each block whose unicode-range begins U+0000-00FF — that is the `latin` subset.
#    Mulish returns the *same* URL for 300, 400 and 500, which is how you can tell it is variable.
# 3. Download, then check against the SHA-256 values above before committing.
```

The URLs contain a content hash and change when upstream rebuilds, so they are deliberately not
recorded here as though they were stable. The version directories at the time of writing were
`cormorantgaramond/v21` and `mulish/v18`.

## Why only the `latin` subset

Google splits each family into `latin`, `latin-ext`, `vietnamese`, `cyrillic` and `cyrillic-ext`.
Only `latin` ships, and that is a measurement rather than a guess: **all 78 distinct characters the
built page renders fall inside the `latin` `unicode-range`**, German umlauts, `ß`, the typographic
apostrophe `’`, the en and em dashes and `€` included.

**The measurement is repeated on every check run.** `tools/check-fonts.mjs` extracts the visible text
from every built page and fails if a single character falls outside the shipped ranges. Without that,
adding one page containing — say — a Polish name would produce a page that looks right to whoever
added it and renders that one word in a system font for everybody else. A missing glyph does not
announce itself; it just looks slightly wrong.

Adding `latin-ext` is a two-line change plus two files, and the check is what will tell you that you
need it.

## Why these weights

- **Cormorant Garamond: one static instance at 500.** `--weight-heading` is the only weight the
  headings ask for, and the variable file carries the whole 300–700 axis to draw one of them. The check
  asserts that no rule requests any other weight from this family, so the day that changes it fails
  rather than silently synthesising a fake bold.
- **Mulish: the variable font, 200–1000.** Body copy uses three weights — 300 (`--weight-body`),
  400 (`--weight-body-dense`) and 500 (`--weight-heading`, on labels and marks set in the body face).
  Upstream serves the identical file for all three, so one 30 kB download covers the axis where three
  static instances would be three requests.

## Fallbacks, and why the stacks are what they are

`font-display: swap` means text is painted in the fallback first and repainted when the webfont
arrives. That is the right trade — invisible text for up to three seconds is worse — but it makes the
fallback a design decision rather than a leftover:

- `--font-heading` falls through to **Georgia**, a serif with a large x-height that is present on
  effectively every desktop and most mobile platforms. The repaint from Georgia to Cormorant Garamond
  changes the width of a heading noticeably, which is the honest cost.
- `--font-body` falls through to **`system-ui`**, which is the platform's own interface face and
  therefore already loaded — nothing is fetched and nothing shifts vertically.

Both stacks live in [`src/styles/tokens.css`](../src/styles/tokens.css), not here. Until the fonts
landed, those fallbacks *were* the site, so they were chosen to look acceptable on their own rather
than to be a placeholder — which is also exactly the state a reader on a slow connection sees.

## Maintenance

A font update is manual: Dependabot does not watch `fonts.gstatic.com`, and these files are not a
dependency in any manifest. That is an accepted cost, recorded in ADR 0004's Consequences. The trigger
to revisit is a glyph the check reports as missing, or an upstream fix worth taking — not a schedule.

Re-downloading means repeating the steps above and **updating the checksums in this file**, which the
check compares against the bytes on disk. If the two disagree, the build stops.
