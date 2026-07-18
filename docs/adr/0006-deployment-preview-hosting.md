# ADR 0006 — Deployment, preview and hosting

- **Status:** Proposed
- **Date:** 2026-07-18
- **Depends on:** [ADR 0002](0002-tech-stack-and-tooling.md) §1 (static output, nothing to run on a
  server) and §6 (which hands the sitemap's interaction with the indexing gate to this ADR)

## Context

This is the second of Phase 2's two gates (#4). ADR 0002 settled what the site is built with; nothing
can be scaffolded until it is also settled where the result goes.

Two facts about the existing setup decide most of what follows, and both were measured rather than
assumed.

**The domain carries the studio's e-mail.** A DNS query on 2026-07-18 returned:

```
A     iris-sunshine-oase.de       46.38.249.150
A     www.iris-sunshine-oase.de   46.38.249.150
NS    root-dns.netcup.net, second-dns.netcup.net, third-dns.netcup.net
MX    10  mail.iris-sunshine-oase.de
MX    50  mxf998.netcup.net
TXT   "v=spf1 mx a include:_spf.webhosting.systems ~all"
SOA   default TTL 86400, serial 2019122001
```

So the zone is not a bare pointer to a web server. It routes mail. Any decision that moves DNS
authority away from netcup puts the studio's e-mail in the blast radius of a website change, and the
zone has not been edited since December 2019 — meaning nobody currently in the project has ever
exercised it.

**The apex is the canonical host.** Both `iris-sunshine-oase.de` and `www.` resolve to the same
address, and the apex is what the business is known by. Moving the canonical form to `www` at the same
time as changing hosts would compound a ranking risk that ADR 0008 already has to manage for 32 indexed
URLs.

### A rejected assumption, recorded because it nearly became the decision

The owner was initially advised that the site could run on **Cloudflare Pages** while DNS stayed at
netcup — "keep the domain, repoint the records". That is wrong for an apex domain. Cloudflare's
documentation requires the custom domain to be a Cloudflare **zone** for apex deployment, which means
moving nameservers; the CNAME-only alternative (partial setup) is a Business-plan feature and cannot
cover an apex in any case without CNAME flattening, which netcup's record set does not offer
([Cloudflare custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/),
[partial setup](https://developers.cloudflare.com/dns/zone-setups/partial-setup/)).

The error was treating "the domain stays registered at netcup" and "DNS stays at netcup" as the same
statement. They are not, and the difference is exactly the MX records above. It is written down here
because the reasoning that produced the wrong recommendation — reversibility of the cutover — is sound
and still load-bearing; only its conclusion changed.

## Decision

### 1. GitHub Pages hosts both the preview and the live site

One provider, one repository, one deployed site.

The criterion the owner set was that an agent should be able to maintain and cut over the site easily,
at low cost. GitHub Pages meets it in the way that matters most here: **the apex domain works with
ordinary A records at any DNS provider**, so nameservers stay at netcup and the MX and SPF records are
never touched by a website change. Deployment is a push to `main`. There is no second account, no
second dashboard and no second set of credentials for a future agent to discover.

The cost is a real one and is named rather than argued away. GitHub's additional product terms state
that Pages "is not intended for or allowed to be used as a free web hosting service to run your online
business, e-commerce site, or any other website that is primarily directed at either facilitating
commercial transactions or providing commercial software as a service"
([GitHub Additional Product Terms](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features)).
A fourteen-page brochure site with no shop, no booking and no payment is not primarily directed at
facilitating transactions, and this ADR reads it as permitted. That is an interpretation, not a
guarantee, and the owner accepted it knowingly.

The documented [Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
— 1 GB published site, a soft 100 GB per month of bandwidth, a soft 10 builds per hour — are not
constraints at this size and are recorded only so a later session need not re-check them.

**Revisit trigger:** if the site ever gains a shop, a booking flow or payment, the ToS reading above
stops holding and the hosting decision must be re-opened by a superseding ADR before that feature
ships.

### 2. The domain stays at netcup; only two records change

Registration **and** DNS authority remain at netcup. At cutover the apex `A` records are repointed to
GitHub's four addresses, and `www` becomes a `CNAME`
([GitHub custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)):

| Record | Name | Value |
|---|---|---|
| A | `iris-sunshine-oase.de` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| CNAME | `www` | `nanatsusaya.github.io` |

**The apex stays canonical**, with `www` redirecting to it — GitHub creates that redirect
automatically. This is the form the site is indexed under today; changing it is a separate risk that
belongs to ADR 0008 if it is ever wanted, not a side effect of changing hosts.

**MX, SPF and every other record are not touched.** This is the property the whole arrangement is
chosen for, and it should be stated in the cutover checklist as something to verify rather than assume.
One caveat deserves naming: the SPF record is `v=spf1 mx a include:_spf.webhosting.systems ~all`, and
its `a` mechanism authorises whatever the apex `A` record points at. After the cutover that is GitHub,
not the mail server. The `mx` and `include:` mechanisms still cover the actual sender, so mail should
be unaffected — but the record is written against an assumption that will no longer hold, and it is on
the checklist to review with the owner rather than to leave to chance.

**The values above must be re-verified at cutover, not trusted from this file.** Provider addresses
change; this table records what was true on 2026-07-18 and where it came from.

### 3. Preview and live are one site in two states, not two environments

Because the same repository serves both, "going live" is not a migration between systems. It is three
steps against one site: attach the domain, flip the gate, repoint DNS.

This is deliberately smaller than the alternative. A separate staging deployment would double the
moving parts to protect a fourteen-page site whose every change is already reviewed by the owner in a
pull request before it can reach `main`.

The consequence is stated plainly because it is a genuine change of character at go-live: **after
cutover, merging a PR publishes to the live site.** Until cutover, merging publishes to a draft nobody
can find. The protection is that CI runs the full check chain (ADR 0002 §7) on every PR, so a build
that fails cannot deploy; what CI cannot catch is a change that builds correctly and looks wrong.

### 4. The indexing gate: `noindex` is the guarantee, and `robots.txt` must not defeat it

This section corrects a rule this repository already holds, and it does so on the evidence of the
primary source.

`CLAUDE.md` and the Phase 2 epic both require the preview to carry `robots.txt` `Disallow: /` **and**
a `noindex` meta tag. Taken together those two are not additive — they are **subtractive**. Google's
documentation is explicit:

> "For the `noindex` rule to be effective, the page or resource must not be blocked by a robots.txt
> file, and it has to be otherwise accessible to the crawler. If the page is blocked by a robots.txt
> file or the crawler can't access the page, the crawler will never see the `noindex` rule, and the
> page can still appear in search results."
> — [Google Search Central, *Block indexing*](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

A blanket `Disallow: /` prevents the crawl that would have discovered the `noindex`. The URL can then
still be indexed — without its content, but by name — if anything anywhere links to it. The
belt-and-braces configuration is weaker than the belt alone.

Therefore, until go-live:

- **Every page carries `<meta name="robots" content="noindex, nofollow">`.** This is the guarantee.
- **`robots.txt` does not disallow crawling.** It must not, or the guarantee cannot be read.
- **No sitemap is generated.** This is ADR 0002 §6's open interaction, decided here: a sitemap exists to
  advertise URLs, and a draft has nothing to advertise. `@astrojs/sitemap` is configured but produces
  output only in the live state.

### 5. One gate, defaulting to safe

The three preview-only behaviours above — the `noindex` tag, the absence of a sitemap, and the
canonical URL — are controlled by **one build-time flag with `preview` as its default**.

One switch, because three independent toggles are three chances to flip two of them. Defaulting to
`preview`, because the failure mode of a forgotten flag must be a draft that nobody indexes, never a
draft that everybody does. A misconfigured build should produce a site that is too hidden, not one that
competes with the live business in search results.

Flipping that flag is a **go-live gate** (`CLAUDE.md`): it happens in its own PR, at the owner's
instruction, and never as a side effect of another change. It is a candidate for a mechanical check —
if `tools/check-docs.mjs` or its successor can assert "the built output carries `noindex` unless the
live flag is set", that assertion is worth more than this paragraph.

### 6. Cutover and rollback

Recorded now, while there is no pressure, because this is the step where a live business is exposed.
Executed in Phase 5 (#7), by the owner, never by an agent.

**Before:** lower the TTL on the records to be changed and wait out the old TTL. The zone's default is
**86 400 seconds — 24 hours**. Without this step the "reversible in minutes" property that justifies
this whole arrangement does not exist, and that is the single most important line in this ADR.

**Cutover:** attach the custom domain to the Pages site and let the certificate issue; verify the site
answers on the GitHub address; flip the gate flag in its own PR; repoint the two DNS records; enable
*Enforce HTTPS* once GitHub offers it (the documentation notes this can take up to 24 hours).

**Verify, by fetching the deployed site rather than reading the source:** the live domain serves the
new site over HTTPS; `noindex` is **gone**; the sitemap is present; the old URLs redirect (ADR 0008);
and **the studio can send and receive e-mail**.

**Rollback:** set the `A` records back to `46.38.249.150`. Nothing else has changed, so nothing else
has to be undone — which is the property that made this option the right one.

### 7. What this ADR does not decide

- **Which URLs redirect where** — ADR 0008. This ADR only guarantees that the mechanism does not stand
  in the way.
- **Whether any third-party service is loaded** — ADR 0007. Nothing decided here introduces one, and the
  static output means no request-time call exists unless a later decision adds it.
- **The visual design** — ADR 0004, which is waiting on the owner's drafts. Nothing here constrains it.

## Consequences

**Positive**

- The studio's e-mail is structurally outside the blast radius of any website change. That is not a
  precaution taken by care; it follows from touching only `A` and `CNAME` records.
- Rollback is a DNS edit with a known, prepared TTL. The failure mode of go-live day is minutes long.
- One provider, one repository, one deployment. An agent that can push can deploy, with no credential
  to store and no second dashboard to learn.
- No server, no runtime, no request-time third party — consistent with ADR 0002 §1.
- The indexing gate now rests on a mechanism that has been verified to work, rather than on two
  mechanisms that cancel.

**Negative / costs**

- **The ToS reading is an interpretation.** It is defensible and the owner accepted it knowingly, but
  the clause exists, and a future commercial feature invalidates the reading.
- **After go-live, merge publishes.** There is no staging step between the owner's approval and the
  public site.
- **`CLAUDE.md` has to change.** Its `robots.txt` `Disallow: /` requirement is counter-productive on the
  evidence in §4. A standing rule that is wrong is worse than no rule, because it is followed.
- **Single-provider concentration.** Repository, CI and hosting are all GitHub; an outage is total.
  Accepted: the site is static, and a copy of the built output can be served from anywhere within
  hours.
- **The DNS values here will age.** Mitigated by requiring re-verification at cutover rather than trust.

## Alternatives considered

- **Cloudflare Pages** — rejected because apex deployment requires moving nameservers to Cloudflare,
  which puts the studio's live MX and SPF records into a website change. Genuinely attractive otherwise:
  no usage restriction and unlimited bandwidth. Reconsider if DNS ever moves for an unrelated reason.
- **Cloudflare Pages on `www` only, apex redirecting** — rejected because it changes the canonical host
  of a nine-year-old indexed site to dodge a technical limitation, which is the tail wagging the dog.
- **netcup web hosting** — rejected on the owner's maintenance criterion. It needs SFTP credentials in
  CI secrets: more moving parts, a secret to rotate, and the deployment path an agent is least able to
  diagnose. It remains the natural fallback if the GitHub ToS reading ever fails.
- **Netlify** — rejected for the same apex reason as Cloudflare: netcup's record set offers no
  `ALIAS`/`ANAME`, so an apex would again require moving DNS.
- **A separate staging deployment after go-live** — rejected as speculative for fourteen pages under
  per-PR owner review. If a visual regression ever does reach the live site, that is the evidence that
  reopens this, and it should become a ticket rather than a rule.
- **Keeping `robots.txt` `Disallow: /` alongside `noindex`** — rejected on Google's documentation; see
  §4.

## Open questions (for owner review)

- **O1 — Where does the preview live before cutover?** Default is the project URL
  `nanatsusaya.github.io/iris-sunshine-oase/`, which serves the site from a **subpath**; the live site
  will serve from the root. That difference has to be carried in the build configuration and is a
  classic source of broken asset links at exactly the wrong moment.
  **Recommendation:** attach `preview.iris-sunshine-oase.de` (one `CNAME` at netcup, the live site
  untouched) so the preview also serves from the root and the cutover changes nothing about paths. The
  trade-off is that the draft becomes reachable under the studio's own domain — behind `noindex`, but
  publicly. If that is unwelcome, the subpath is perfectly workable and the configuration difference is
  simply something Phase 2 must handle deliberately.
- **O2 — May `CLAUDE.md`'s indexing rule be corrected?** §4 contradicts a standing rule in `CLAUDE.md`.
  The evidence is Google's own documentation, but the rule protects a live business's search ranking and
  changing it is not something to do quietly.
  **Recommendation:** yes — change it to require `noindex` and to require that `robots.txt` *not* block
  the crawl, in the same PR that accepts this ADR, so the two never disagree.
- **O3 — Is "merge publishes" acceptable after go-live?** §3 accepts it.
  **Recommendation:** accept for now and revisit only if it actually bites. The alternative costs a
  second deployment target permanently to guard against a class of error that has not yet occurred once.

## References

- Issue #24 — the owning ticket
- [ADR 0001](0001-record-architecture-decisions.md) — the ADR workflow
- [ADR 0002](0002-tech-stack-and-tooling.md) — §1 static output, §6 the sitemap interaction resolved here
- [`docs/business-facts.md`](../business-facts.md) — the studio's own details, single authority
- [Google Search Central — Block indexing](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [GitHub Pages — managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages — limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [GitHub — Additional Product Terms](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features)
- [Cloudflare Pages — custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Cloudflare DNS — partial (CNAME) setup](https://developers.cloudflare.com/dns/zone-setups/partial-setup/)
