#!/usr/bin/env node
/**
 * Asserts the self-hosted webfonts (ADR 0004 §4, ADR 0009 §6).
 *
 * The failure this exists for is quiet by nature. A font file that is missing, corrupted, replaced by
 * a different cut, or shipped without the subset a page needs does not produce an error anywhere — the
 * browser falls back, the page renders, the build says `Complete!`, and one word on one page is set in
 * a different typeface than the rest. Nobody notices until somebody does.
 *
 * Six checks:
 *   1. every declared `src` is same-origin and the file exists  (ADR 0009 §6)
 *   2. each file's SHA-256 matches what docs/fonts.md records
 *   3. every character the built pages render lies inside a shipped `unicode-range`
 *   4. no stylesheet asks a family for a weight its `@font-face` does not cover
 *   5. every shipped font has its licence file beside it        (the OFL requires it)
 *   6. the layout imports fonts.css and preloads both files
 *
 * Check 3 is the one that earns its keep. `latin` covers everything the site renders today, and the
 * moment it does not — one Polish name, one Turkish `ı`, one Croatian `č` — this fails instead of
 * letting the page ship with a hole in it.
 *
 * Run: node tools/check-fonts.mjs   (needs a build first — it reads dist/)
 */

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const FONTS_CSS = join(ROOT, 'src', 'styles', 'fonts.css');
const TOKENS_CSS = join(ROOT, 'src', 'styles', 'tokens.css');
const LAYOUT = join(ROOT, 'src', 'layouts', 'BaseLayout.astro');
const DOC = join(ROOT, 'docs', 'fonts.md');
const PUBLIC = join(ROOT, 'public');
const DIST = join(ROOT, 'dist');

const problems = [];
const rel = (p) => relative(ROOT, p).replaceAll('\\', '/');

// --- parse the @font-face rules --------------------------------------------
const css = readFileSync(FONTS_CSS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const faces = [];

for (const block of css.split('@font-face').slice(1)) {
  const body = block.slice(block.indexOf('{') + 1, block.indexOf('}'));
  const family = body.match(/font-family:\s*"([^"]+)"/)?.[1];
  const weight = body.match(/font-weight:\s*([^;]+);/)?.[1].trim();
  const url = body.match(/url\("([^"]+)"\)/)?.[1];
  const range = body.match(/unicode-range:\s*([^;]+);/)?.[1];
  if (!family || !weight || !url || !range) {
    problems.push(
      `${rel(FONTS_CSS)}: an @font-face is missing font-family, font-weight, src or unicode-range. ` +
        'All four are load-bearing here — the range decides which characters this file is asked for ' +
        'at all, and an omitted one silently means "everything".',
    );
    continue;
  }
  faces.push({ family, weight, url, range });
}

if (faces.length === 0) {
  console.error(`check-fonts: no @font-face rules in ${rel(FONTS_CSS)}.`);
  process.exit(1);
}

// --- 1: same-origin, and the file is actually there -------------------------
// ADR 0009 §6's invariant is that a visitor never contacts a third party. `check-external-resources`
// asserts that against the built HTML; this asserts it at the point the URL is written, where the
// mistake would be made.
for (const face of faces) {
  if (!face.url.startsWith('/')) {
    problems.push(
      `${rel(FONTS_CSS)}: src "${face.url}" is not a root-relative path. A webfont fetched from ` +
        "another origin sends every visitor's IP address there before a word is drawn, which is " +
        'exactly what ADR 0009 §6 forbids and what self-hosting these files was for.',
    );
    continue;
  }
  const file = join(PUBLIC, face.url.replace(/^\//, ''));
  if (!existsSync(file)) {
    problems.push(
      `${rel(FONTS_CSS)}: src "${face.url}" does not exist at ${rel(file)}. The browser would fall ` +
        'back silently and the page would simply be set in the wrong typeface.',
    );
  }
}

// --- 2: the bytes are the bytes docs/fonts.md vouched for -------------------
// A checksum is the only thing that distinguishes "the file we verified the licence of" from "a file
// with the same name". Re-downloading upstream is a manual step; this is what makes it a checked one.
const doc = readFileSync(DOC, 'utf8');
const recorded = new Map(
  [...doc.matchAll(/`public\/(fonts\/[^`]+\.woff2)`[^\n]*?`([0-9a-f]{64})`/g)].map((m) => [
    m[1],
    m[2],
  ]),
);

const shipped = existsSync(join(PUBLIC, 'fonts'))
  ? readdirSync(join(PUBLIC, 'fonts')).filter((f) => f.endsWith('.woff2'))
  : [];

for (const name of shipped) {
  const key = `fonts/${name}`;
  const actual = createHash('sha256')
    .update(readFileSync(join(PUBLIC, 'fonts', name)))
    .digest('hex');
  const expected = recorded.get(key);
  if (!expected) {
    problems.push(
      `public/${key} ships but is not recorded in ${rel(DOC)}. Every asset in this repository needs ` +
        'its source, licence and evidence written down (CLAUDE.md) — a font file is not an exception, ' +
        'and an unrecorded one is a licence question nobody can answer later.',
    );
  } else if (actual !== expected) {
    problems.push(
      `public/${key}: SHA-256 is ${actual}, but ${rel(DOC)} records ${expected}. Either the file was ` +
        'replaced without updating its record, or the record was updated without the file. Both mean ' +
        'the documented licence no longer provably applies to these bytes.',
    );
  }
}

// --- 3: every rendered character is covered ---------------------------------
// The check this file exists for. See the header.
function parseRanges(spec) {
  return spec
    .split(',')
    .map((r) => r.trim().replace(/^U\+/i, ''))
    .filter(Boolean)
    .map((r) => {
      const [a, b] = r.split('-');
      return [Number.parseInt(a, 16), Number.parseInt(b ?? a, 16)];
    });
}

const covered = faces.flatMap((f) => parseRanges(f.range));
const inCovered = (cp) => covered.some(([a, b]) => cp >= a && cp <= b);

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(p));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error(
    'check-fonts: dist/ does not exist. This check reads the *built* pages, because the question is ' +
      'which characters a visitor is actually shown — which no source file answers on its own, since ' +
      'most of the text comes from the content model. Run `npm run build` first.',
  );
  process.exit(1);
}

const uncovered = new Map(); // character → files it appears in

for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  const text = html
    // Style and script contents are never drawn with a webfont.
    .replace(/<(style|script)[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(Number.parseInt(h, 16)));

  for (const ch of new Set(text)) {
    const cp = ch.codePointAt(0);
    if (cp <= 31) continue; // control characters and whitespace are never drawn
    if (inCovered(cp)) continue;
    if (!uncovered.has(ch)) uncovered.set(ch, new Set());
    uncovered.get(ch).add(rel(file));
  }
}

for (const [ch, files] of uncovered) {
  const cp = ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
  problems.push(
    `"${ch}" (U+${cp}) is rendered in ${[...files].join(', ')} but lies outside every shipped ` +
      'unicode-range, so a visitor sees that one character in a system font while everything around ' +
      'it is set in the webfont. Ship the subset that covers it — `latin-ext` is the usual answer — ' +
      'and record the new file in docs/fonts.md (ADR 0004 §4).',
  );
}

// --- 4: no weight is requested that no face provides ------------------------
// A weight outside a face's range makes the browser *synthesise* one: it smears the glyphs to fake a
// bold. It looks like a slightly wrong font rather than like an error, which is why it survives review.
const tokens = readFileSync(TOKENS_CSS, 'utf8');
const weightTokens = new Map(
  [...tokens.matchAll(/--weight-([\w-]+):\s*(\d+)/g)].map((m) => [
    `--weight-${m[1]}`,
    Number(m[2]),
  ]),
);

const provides = new Map();
for (const face of faces) {
  const bounds = face.weight.split(/\s+/).map(Number);
  provides.set(face.family, [bounds[0], bounds[1] ?? bounds[0]]);
}

/** Which token each family's rules use, read from the stylesheets that set both together. */
const styled = [];
function collectStyles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.astro'].includes(entry.name)) continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) collectStyles(p);
    else if (/\.(astro|css)$/.test(entry.name)) styled.push(p);
  }
}
collectStyles(join(ROOT, 'src'));

for (const file of styled) {
  if (file === FONTS_CSS) continue;
  const text = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  // A rule that sets the heading family and a weight in the same block is the pairing to judge.
  for (const block of text.split('}')) {
    if (!/font-family:\s*var\(--font-heading\)/.test(block)) continue;
    const w = block.match(/font-weight:\s*var\((--weight-[\w-]+)\)/)?.[1];
    if (!w) continue;
    const value = weightTokens.get(w);
    const [lo, hi] = provides.get('Cormorant Garamond') ?? [];
    if (value !== undefined && (value < lo || value > hi)) {
      problems.push(
        `${rel(file)}: sets --font-heading at ${w} (${value}), but the shipped Cormorant Garamond ` +
          `face covers only ${lo}–${hi}. The browser would synthesise that weight by smearing the ` +
          'glyphs, which reads as a slightly wrong typeface rather than as an error. Ship the ' +
          'weight, or use one that is shipped (docs/fonts.md).',
      );
    }
  }
}

// --- 5: the licence travels with the file -----------------------------------
// The OFL requires it, and serving a font file from this site is redistribution.
for (const name of shipped) {
  const family = name.replace(/-\d+-latin\.woff2$/, '').replace(/-variable-latin\.woff2$/, '');
  const licence = `LICENCE-${family}-OFL.txt`;
  if (!existsSync(join(PUBLIC, 'fonts', licence))) {
    problems.push(
      `public/fonts/${licence} is missing for public/fonts/${name}. The SIL Open Font License ` +
        'requires its text to accompany the font software when redistributed, and serving this file ' +
        'from the site is redistribution. It sits in public/ rather than docs/ for that reason.',
    );
  }
}

// --- 6: the fonts are actually delivered ------------------------------------
// A stylesheet nothing imports declares fonts nobody downloads — it passes every check above and
// styles nothing. The same insurance tools/check-tokens.mjs takes on the token layer.
const layout = readFileSync(LAYOUT, 'utf8');
if (!/styles\/fonts\.css/.test(layout)) {
  problems.push(
    `${rel(LAYOUT)} does not import src/styles/fonts.css — the @font-face rules would be written ` +
      'and never delivered, and the site would render in fallbacks with the files sitting unused.',
  );
}
for (const face of faces) {
  if (!layout.includes(`href="${face.url}"`)) {
    problems.push(
      `${rel(LAYOUT)} does not preload ${face.url}. A @font-face inside a stylesheet is discovered ` +
        'only after that stylesheet is fetched and parsed, so the download starts late and ' +
        '`font-display: swap` repaints the page under the reader.',
    );
  }
}

// --- report ------------------------------------------------------------------
if (problems.length) {
  console.error(`Font check failed — ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

const bytes = shipped.reduce((n, f) => n + readFileSync(join(PUBLIC, 'fonts', f)).byteLength, 0);
console.log(
  `Font check passed (${faces.length} face(s), ${shipped.length} file(s), ` +
    `${(bytes / 1024).toFixed(1)} kB total; every rendered character covered, checksums match).`,
);
