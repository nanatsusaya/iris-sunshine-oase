#!/usr/bin/env node
/**
 * Asserts the content model of ADR 0003 §7.
 *
 * What these checks cover is decided by what Astro does *not*. Measured against this scaffold on
 * 2026-07-19 (`astro 7.1.1`):
 *
 *   - a schema violation fails the build, exit 1 — so field types need no check here;
 *   - a **missing** id is logged `[ERROR]` and the build **exits 0**, dropping the entry;
 *   - a **duplicate** id is logged `[WARN]` and the build **exits 0**, the later entry silently
 *     overwriting the earlier one.
 *
 * The last two are why this file exists. A duplicated id means one price replaces another while the
 * build prints `Complete!` — the old site's defect reproduced inside the mechanism chosen to prevent
 * it. A warning in a build log is not a control; nobody reads a log that always scrolls past.
 *
 * Checks:
 *   0. every YAML entry begins with `id:`     (the precondition check 1 relies on)
 *   1. ids are present and unique per file    (Astro only warns)
 *   2. no price literal outside the data      (the analogue of ADR 0004 §10.1's no-raw-colour rule)
 *   3. no time-of-day literal outside the data
 *   4. `astro:content` is imported only by the accessor module
 *   5. every referenced id resolves
 *
 * Run: node tools/check-content.mjs
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const CONTENT_DIR = join(ROOT, 'src', 'content');
const ACCESSOR = 'src/content/query.ts';

const problems = [];
const rel = (p) => relative(ROOT, p).replaceAll('\\', '/');

const dataFiles = readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith('.yaml'))
  .map((f) => join(CONTENT_DIR, f));

if (dataFiles.length === 0) {
  console.error('check-content: no YAML files in src/content/ — the content model is missing.');
  process.exit(1);
}

// --- 0 + 1: ids are present, first, and unique -----------------------------
//
// These files are read as *text* rather than parsed, deliberately: the flaw being guarded against is a
// duplicate id, and any YAML parser resolves duplicates before this code could see them — which is
// exactly how Astro's own loader loses one silently.
//
// Reading text means relying on a convention, so check 0 asserts the convention rather than assuming
// it: every top-level entry must start with `- id:`. A file that drifts from that shape fails here
// instead of being silently under-scanned, which is the difference between a check and a formality.
const idsByFile = new Map();

for (const file of dataFiles) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const ids = [];
  const seen = new Map();

  for (const [i, line] of lines.entries()) {
    if (!/^-\s/.test(line)) continue; // not the start of a top-level entry
    const m = line.match(/^-\s+id:\s*(\S+)\s*$/);
    if (!m) {
      problems.push(
        `${rel(file)}:${i + 1} an entry does not begin with \`- id: …\`. ADR 0003 §7 requires \`id\` ` +
          'to be the first key of every entry, because the duplicate-id scan reads these files as ' +
          'text — Astro itself only warns and exits 0.',
      );
      continue;
    }
    const id = m[1];
    ids.push(id);
    if (seen.has(id)) {
      problems.push(
        `${rel(file)}:${i + 1} duplicate id "${id}" (first seen on line ${seen.get(id)}). ` +
          'Astro logs a warning for this and builds successfully, silently overwriting the earlier ' +
          'entry — which is one price replacing another with no error anywhere.',
      );
    } else {
      seen.set(id, i + 1);
    }
  }
  idsByFile.set(rel(file), new Set(ids));
}

// --- 2 + 3: facts do not appear outside the data ---------------------------
// The direct analogue of ADR 0004 §10.1. A price typed into a template is the old site's central defect
// in one line, and it looks entirely reasonable in review.
const SOURCE_DIRS = [join(ROOT, 'src')];
const SKIP_DIRS = new Set(['node_modules', 'dist', '.astro', 'content']);

function sourceFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(p));
    else if (/\.(astro|md)$/.test(entry.name)) out.push(p);
  }
  return out;
}

const LITERALS = [
  {
    what: 'a price',
    // A currency symbol, or a German decimal amount. Either is a fact with an authority elsewhere.
    re: /€|\b\d+,\d{2}\b/,
    fix: 'read it from the content model via src/content/query.ts and format it with formatPrice()',
  },
  {
    what: 'a time of day',
    re: /\b([01]?\d|2[0-3]):[0-5]\d\b/,
    fix: 'read it from the `hours` collection — `M-05` records the old site carrying its opening hours in two places',
  },
];

for (const file of SOURCE_DIRS.flatMap(sourceFiles)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  let fenced = false;
  for (const [i, line] of lines.entries()) {
    if (/^\s*```/.test(line)) fenced = !fenced;
    if (fenced) continue;
    // Comments explain the rule and necessarily contain examples of what it forbids.
    const code = line
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*(\/\/|\*|<!--).*$/, '')
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    for (const { what, re, fix } of LITERALS) {
      if (re.test(code)) {
        problems.push(`${rel(file)}:${i + 1} contains ${what} literal — ${fix} (ADR 0003 §7).`);
      }
    }
  }
}

// --- 4: one door to the collections ----------------------------------------
// Not because the gate would otherwise be bypassed — it sits on the schema in src/content.config.ts and
// runs for every entry regardless. This keeps the *reading* of content in one place, so that the
// placeholder marking, the hour-set selection and the ambiguity errors are not reimplemented per page,
// each subtly differently. A second door is how the third one gets built.
function allSources(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name) && entry.name !== 'content') continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...allSources(p));
    else if (/\.(astro|ts)$/.test(entry.name)) out.push(p);
  }
  return out;
}

for (const file of allSources(join(ROOT, 'src'))) {
  const r = rel(file);
  if (r === ACCESSOR || r === 'src/content.config.ts') continue;
  const text = readFileSync(file, 'utf8');
  const line = text.split('\n').findIndex((l) => /from\s+['"]astro:content['"]/.test(l));
  if (line >= 0) {
    problems.push(
      `${r}:${line + 1} imports from "astro:content" directly. Only ${ACCESSOR} may — it is where the ` +
        'confirmation gate lives, and a second door means unconfirmed content can reach a live build ' +
        '(ADR 0003 §8).',
    );
  }
}

// --- 5: references resolve --------------------------------------------------
// A teaser naming a category that does not exist is a broken page. Astro's schema validates the *type*
// of `category` — a string — not that anything answers to it.
const categoryIds = idsByFile.get('src/content/categories.yaml') ?? new Set();
const servicesFile = join(CONTENT_DIR, 'services.yaml');

for (const [i, line] of readFileSync(servicesFile, 'utf8').split('\n').entries()) {
  const m = line.match(/^\s+category:\s*(\S+)\s*$/);
  if (m && !categoryIds.has(m[1])) {
    problems.push(
      `src/content/services.yaml:${i + 1} references category "${m[1]}", which does not exist in ` +
        "categories.yaml. This is what keeps `M-28` — the old site's dead jump anchors — " +
        'unwritable: an anchor generated from an id cannot point nowhere.',
    );
  }
}

// --- report ----------------------------------------------------------------
if (problems.length) {
  console.error(`Content check failed — ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

const total = [...idsByFile.values()].reduce((n, set) => n + set.size, 0);
console.log(
  `Content check passed (${dataFiles.length} data file(s), ${total} entries, ids unique; ` +
    'no price or time literal outside the model).',
);
