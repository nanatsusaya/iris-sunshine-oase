/**
 * Documentation conformance check.
 *
 * The documentation is this project's single source of truth, and it is maintained by agents that
 * have no context beyond the repository. A broken cross-reference or an ADR missing from the index
 * therefore misleads silently and indefinitely — so the rules that keep it coherent are asserted
 * here rather than left to review discipline.
 *
 * Checks:
 *   1. every ADR file is listed in docs/adr/README.md
 *   2. every indexed ADR that links to a file — that file exists
 *   3. the Status inside an ADR matches the status the index claims for it
 *   4. every relative Markdown link in the repository resolves to an existing file
 *   5. no American spelling in prose (CLAUDE.md fixes British spelling for this repository)
 *   6. no document still asserts a rule that has been withdrawn
 *
 * Run: node tools/check-docs.mjs
 * Exits non-zero on the first failing category, listing every violation found.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const ADR_DIR = join(ROOT, 'docs', 'adr');
const problems = [];

const rel = (p) => relative(ROOT, p).replace(/\\/g, '/');

// --- collect every tracked Markdown file ----------------------------------
// node_modules and the excluded archive are not ours to validate.
const SKIP = new Set(['node_modules', '.git', 'Archive', 'dist', '.astro']);
function markdownFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...markdownFiles(p));
    else if (entry.name.endsWith('.md')) out.push(p);
  }
  return out;
}

// --- 1–3: ADR index conformance -------------------------------------------
const indexPath = join(ADR_DIR, 'README.md');
const index = readFileSync(indexPath, 'utf8');

const adrFiles = readdirSync(ADR_DIR)
  .filter((f) => /^\d{4}-.*\.md$/.test(f))
  .sort();

// Table rows look like: | [0001](0001-slug.md) | Title | Accepted |
//                  or:  | 0002 | Title | Planned |
const rows = new Map(); // number -> { file, status }
for (const line of index.split('\n')) {
  const m = line.match(/^\|\s*(?:\[(\d{4})\]\(([^)]+)\)|(\d{4}))\s*\|[^|]*\|\s*([^|]+?)\s*\|/);
  if (!m) continue;
  rows.set(m[1] ?? m[3], { file: m[2] ?? null, status: m[4] });
}

for (const file of adrFiles) {
  const number = file.slice(0, 4);
  const row = rows.get(number);
  if (!row) {
    problems.push(`ADR ${file} exists but is not listed in docs/adr/README.md`);
    continue;
  }
  if (row.file !== file) {
    problems.push(`ADR ${number} is indexed as "${row.file ?? 'no link'}" but the file is ${file}`);
  }
  // The status inside the ADR is authoritative for itself; the index must agree.
  const body = readFileSync(join(ADR_DIR, file), 'utf8');
  const own = body.match(/^-\s*\*\*Status:\*\*\s*(\S+)/m);
  if (!own) {
    problems.push(`ADR ${file} has no "- **Status:** …" line`);
  } else if (own[1] !== row.status) {
    problems.push(`ADR ${file} says Status: ${own[1]}, the index says ${row.status}`);
  }
}

for (const [number, row] of rows) {
  if (row.file && !existsSync(join(ADR_DIR, row.file))) {
    problems.push(`docs/adr/README.md links ADR ${number} to ${row.file}, which does not exist`);
  }
}

// --- 4: relative links resolve --------------------------------------------
for (const file of markdownFiles(ROOT)) {
  // docs/inhalte/ is a verbatim extract of the old website. Its links are that site's own URLs
  // (/kontakt, tel:…), not repository cross-references — resolving them against the filesystem
  // would be a category error. Dead links *within* the old site are a content finding and are
  // tracked in docs/analyse/05-maengelliste.md (M-28), not here.
  if (rel(file).startsWith('docs/inhalte/')) continue;

  const body = readFileSync(file, 'utf8');
  // Strip fenced code blocks so example links inside them are not validated.
  const prose = body.replace(/```[\s\S]*?```/g, '');
  for (const m of prose.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    // Any URI scheme (https:, mailto:, tel:, …) and any site-absolute path is out of scope:
    // only repository-relative links are ours to verify.
    if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('/') || target.startsWith('#'))
      continue;
    const [path] = target.split('#');
    if (!path) continue; // pure anchor
    const resolved = resolve(dirname(file), path);
    if (!existsSync(resolved)) {
      problems.push(`${rel(file)} links to ${target}, which does not exist`);
    } else if (statSync(resolved).isDirectory() && !existsSync(join(resolved, 'README.md'))) {
      problems.push(`${rel(file)} links to directory ${target}, which has no README.md`);
    }
  }
}

// --- 5: British spelling ---------------------------------------------------
// CLAUDE.md fixes British spelling. Left to discipline alone it erodes: a document written
// months apart by different agents drifts between both, and the result reads as though
// nobody owned it. The check is deliberately narrow — it looks for the handful of forms that
// actually showed up, not for every Americanism in the language.

const IRREGULAR = {
  color: 'colour',
  colors: 'colours',
  center: 'centre',
  centers: 'centres',
  analyze: 'analyse',
  analyzed: 'analysed',
  analyzing: 'analysing',
  behavior: 'behaviour',
  behaviors: 'behaviours',
  catalog: 'catalogue',
  defense: 'defence',
  fulfill: 'fulfil',
  modeling: 'modelling',
  labeled: 'labelled',
};
// -ize is American here, but a few English words legitimately end that way.
const IZE_ALLOWED = new Set([
  'size',
  'sizes',
  'sized',
  'sizing',
  'resize',
  'resizes',
  'resized',
  'resizing',
  'seize',
  'seizes',
  'seized',
  'prize',
  'prizes',
  'capsize',
  'maize',
]);

for (const file of markdownFiles(ROOT)) {
  // docs/inhalte/ is verbatim German source material; CLAUDE.md is where the rule is stated,
  // so it necessarily contains examples of what it forbids.
  const r = rel(file);
  if (r.startsWith('docs/inhalte/') || r === 'CLAUDE.md') continue;

  // Strip everything that is not prose before judging spelling.
  //
  // Code spans and fenced blocks: identifiers mirror their API's spelling, not ours.
  //
  // URLs: a link target is an address, not a word — it cannot be respelt without breaking it.
  // Astro's own documentation lives at /guides/internationalization/, and citing a primary source
  // is required by CLAUDE.md, so a check that forbids the citation would be a rule fighting a rule.
  // The link *text* is prose and stays in scope; only the target is removed.
  const prose = readFileSync(file, 'utf8')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]*`/g, '')
    .replace(/\]\([^)\s]*\)/g, ']')
    .replace(/<https?:\/\/[^>\s]*>/g, '')
    .replace(/https?:\/\/\S+/g, '');

  for (const m of prose.matchAll(/\b[A-Za-z]{3,}\b/g)) {
    const word = m[0];
    const lower = word.toLowerCase();
    if (IRREGULAR[lower]) {
      problems.push(`${r}: "${word}" is American — use "${IRREGULAR[lower]}"`);
    } else if (/iz(e|es|ed|ing|ation|ations)$/.test(lower) && !IZE_ALLOWED.has(lower)) {
      problems.push(`${r}: "${word}" is American — use the -ise form`);
    }
  }
}

// --- 6: withdrawn rules stay withdrawn -------------------------------------
// When a rule changes, its *copies* are what go stale. ADR 0001's direct-commit exception was
// withdrawn on 2026-07-18, and CLAUDE.md and the ADR were updated in that change — but three
// session skills still instructed a future agent to commit straight to `main`, which branch
// protection now refuses. Nobody would have noticed until an agent followed the instruction and
// failed.
//
// So each retired rule gets an assertion here rather than a note somewhere. The list is expected to
// grow slowly and to stay short: a rule earns an entry only once it has actually been reversed.
//
// **Quotations are exempt.** A blockquote is how this repository records superseded wording — ADR
// 0001's own *Amendments* section quotes the old rule verbatim so the audit trail survives the
// edit. Preserving history is the opposite of asserting the rule, so `>` lines are skipped.
const WITHDRAWN = [
  {
    pattern:
      /single documented exception|one workflow-sanctioned non-PR commit|flip\b[^.]*\bas a direct follow-up commit/i,
    what: 'the ADR status-flip exception to the never-commit-to-`main` rule',
    since: 'withdrawn 2026-07-18 (ADR 0001 Amendments, arising from ADR 0009 §4)',
    instead: 'the flip goes through a pull request; `main` is protected against administrators too',
  },
];

for (const file of markdownFiles(ROOT)) {
  const r = rel(file);
  if (r.startsWith('docs/inhalte/')) continue;

  const lines = readFileSync(file, 'utf8').split('\n');
  let fenced = false;
  for (const [i, line] of lines.entries()) {
    if (/^\s*```/.test(line)) fenced = !fenced;
    if (fenced) continue;
    // A quoted line is a record of what the rule used to say, not a claim that it still holds.
    if (/^\s*>/.test(line)) continue;

    for (const rule of WITHDRAWN) {
      if (rule.pattern.test(line)) {
        problems.push(
          `${r}:${i + 1} still asserts ${rule.what} — ${rule.since}. Instead: ${rule.instead}. ` +
            '(If this line is quoting the old rule for the record, make it a "> " blockquote.)',
        );
      }
    }
  }
}

// --- 7: the brand name is spelled one way ----------------------------------
// The studio's name carries an apostrophe, and it has been written both ways for nine years: the old
// site used a straight `'` in its header and a typographic `’` in its hero
// (docs/analyse/04-design-system.md), and the 2026 design draft reproduced the same split, 39 times
// one way and 18 the other. The owner settled it on 2026-07-19 (ADR 0004 R5) on the typographic form.
//
// A brand name spelled two ways reads as carelessness, and it is the kind of difference that survives
// review because both forms look correct in isolation. So it is asserted rather than remembered.
//
// Excluded: docs/inhalte/ and docs/analyse/ are *records of the old site*, where the straight form is
// the historical fact and correcting it would destroy the evidence. Code spans, fenced blocks and
// blockquotes are excluded for the same reason everywhere else — they quote rather than assert.
const STRAIGHT_BRAND = /Iris'\s*Sunshine/;

for (const file of markdownFiles(ROOT)) {
  const r = rel(file);
  if (r.startsWith('docs/inhalte/') || r.startsWith('docs/analyse/')) continue;

  const lines = readFileSync(file, 'utf8').split('\n');
  let fenced = false;
  for (const [i, line] of lines.entries()) {
    if (/^\s*```/.test(line)) fenced = !fenced;
    if (fenced || /^\s*>/.test(line)) continue;
    if (STRAIGHT_BRAND.test(line.replace(/`[^`\n]*`/g, ''))) {
      problems.push(
        `${r}:${i + 1} spells the brand name with a straight apostrophe — ADR 0004 R5 fixes the ` +
          'typographic form: Iris’ Sunshine Oase.',
      );
    }
  }
}

// --- report ----------------------------------------------------------------
if (problems.length) {
  console.error(`Documentation check failed — ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(
  `Documentation check passed (${adrFiles.length} ADR(s), ${markdownFiles(ROOT).length} Markdown files).`,
);
