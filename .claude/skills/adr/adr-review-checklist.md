# ADR self-review checklist

Run this before opening the ADR PR, and when reviewing one.

- [ ] It is a **decision**, not research — every section commits to something.
- [ ] **Consistent** with every Accepted ADR it touches; no contradiction; overlaps *cite* rather than
      re-decide another ADR's subject matter.
- [ ] **Negative consequences and costs** are named honestly, not glossed over.
- [ ] Owner-domain choices are in **Open questions** with a recommended default, not silently decided —
      business content, cost, hosting, legal exposure, third-party services.
- [ ] Enforceable rules are flagged as candidates for `tools/check-docs.mjs`, so they survive as a check
      rather than as a convention nobody re-reads.
- [ ] **Content correctness**: every business fact quoted has a source in `docs/inhalte/` or from the
      owner. No invented price, opening time, address or Impressum detail.
- [ ] **Privacy and legal** considered, or explicitly N/A — no personal data of third parties anywhere;
      German legal obligations (Impressum, privacy, cookie consent) framed as a project checklist
      needing owner or legal review, **never as legal advice**.
- [ ] **Outward-facing impact** considered: anything that publishes, indexes, calls an external service,
      adds tracking or an embed, or touches the still-live site at netcup is an owner decision, and the
      preview's `noindex` gate is not weakened as a side effect.
- [ ] **Image provenance**: if the decision implies using images, it states that none enters the
      repository without documented source, licence and evidence.
- [ ] **Phase gate** stated: what this unblocks, and whether it depends on a still-`Planned` decision.
      It does not implement ahead of one.
- [ ] `docs/adr/README.md` index updated — status **and** link; **`node tools/check-docs.mjs` green**.
- [ ] `docs/STATUS.md` updated if the roadmap or phase state changes — `Accepted` means **designed**,
      not built.
- [ ] Cross-references use `ADR 000X §Y`, old-site defects use `M-NN`, and all links resolve.
- [ ] **English, British spelling**; header (`Status` / `Date`, plus `Depends on` / `Supersedes` where
      real) and section order: Context → Decision → Consequences → Alternatives → Open questions →
      References.
