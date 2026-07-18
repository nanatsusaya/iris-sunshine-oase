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
 *
 * Run: node tools/check-docs.mjs
 * Exits non-zero on the first failing category, listing every violation found.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

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
    if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('/') || target.startsWith('#')) continue;
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
  color: 'colour', colors: 'colours', center: 'centre', centers: 'centres',
  analyze: 'analyse', analyzed: 'analysed', analyzing: 'analysing',
  behavior: 'behaviour', behaviors: 'behaviours', catalog: 'catalogue',
  defense: 'defence', fulfill: 'fulfil', modeling: 'modelling', labeled: 'labelled',
};
// -ize is American here, but a few English words legitimately end that way.
const IZE_ALLOWED = new Set(['size', 'sizes', 'sized', 'sizing', 'resize', 'resizes', 'resized',
  'resizing', 'seize', 'seizes', 'seized', 'prize', 'prizes', 'capsize', 'maize']);

for (const file of markdownFiles(ROOT)) {
  // docs/inhalte/ is verbatim German source material; CLAUDE.md is where the rule is stated,
  // so it necessarily contains examples of what it forbids.
  const r = rel(file);
  if (r.startsWith('docs/inhalte/') || r === 'CLAUDE.md') continue;

  // Strip fenced blocks and code spans: identifiers mirror their API's spelling, not ours.
  const prose = readFileSync(file, 'utf8')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]*`/g, '');

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

// --- report ----------------------------------------------------------------
if (problems.length) {
  console.error(`Documentation check failed — ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`Documentation check passed (${adrFiles.length} ADR(s), ${markdownFiles(ROOT).length} Markdown files).`);
