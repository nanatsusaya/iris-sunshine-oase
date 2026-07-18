#!/usr/bin/env node
/**
 * Asserts ADR 0009 §6: **the built site loads nothing from a third party.**
 *
 * No CDN, no web fonts, no maps, no analytics, no embeds. Every byte a visitor's browser fetches
 * comes from this repository's own build output.
 *
 * This is written as a check rather than left to discipline because ADR 0002's own experience is
 * that a convention drifts within hours, and because the rule pays three ways at once — security
 * (third-party code you did not review, changeable by someone else without notice), privacy (a
 * third-party fetch discloses the visitor's IP address and the page they are on, which is the
 * mechanism behind the German rulings on embedded web fonts), and legal simplicity (with no
 * third-party processing, the consent-banner question never arises).
 *
 * Adding a third-party resource therefore requires deleting an assertion, which is a conversation
 * rather than an oversight.
 *
 * **What is checked is fetching, not linking.** An `<a href>` to another site is a link a visitor
 * chooses to follow; it discloses nothing on page load and is allowed. What is rejected is anything
 * the browser fetches on its own: `src`, `srcset`, `<link href>`, and CSS `url()` / `@import`.
 */

import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

/** Schemes that never cause a network fetch to a third party. */
const INERT = /^(#|\/|\.|data:|mailto:|tel:|sms:|blob:|about:)/i;

/** Origins this site is allowed to name absolutely — its own, in either state (ADR 0006 §5). */
const OWN_ORIGINS = new Set([
  'https://iris-sunshine-oase.de',
  'https://preview.iris-sunshine-oase.de',
]);

/**
 * Attributes the browser fetches without being asked. `<link href>` is included because that is
 * how stylesheets, preconnects and icons arrive; `<a href>` is deliberately not.
 */
const FETCHING = [
  { what: 'src', re: /\ssrc\s*=\s*["']([^"']+)["']/gi },
  { what: 'srcset', re: /\ssrcset\s*=\s*["']([^"']+)["']/gi },
  { what: 'link href', re: /<link\b[^>]*?\shref\s*=\s*["']([^"']+)["']/gi },
  { what: 'css url()', re: /url\(\s*["']?([^"')]+)["']?\s*\)/gi },
  { what: 'css @import', re: /@import\s+(?:url\(\s*)?["']([^"')]+)["']/gi },
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

/** A `srcset` holds a comma-separated list of `url descriptor` pairs. */
function candidates(what, raw) {
  if (what !== 'srcset') return [raw];
  return raw.split(',').map((part) => part.trim().split(/\s+/)[0]);
}

function isExternal(url) {
  const value = url.trim();
  if (!value || INERT.test(value)) return false;
  // Protocol-relative (`//example.com/x`) reads as a path but is a third-party fetch.
  if (value.startsWith('//')) return true;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(value)) return false; // a bare relative path
  try {
    return !OWN_ORIGINS.has(new URL(value).origin);
  } catch {
    return false;
  }
}

const findings = [];
let scanned = 0;

let files;
try {
  files = [];
  for await (const file of walk(DIST)) files.push(file);
} catch {
  console.error(
    'check-external-resources: no dist/ directory. Run `npm run build` first — this check reads the\n' +
      'built output, not the source, because that is where a third-party URL would actually appear.',
  );
  process.exit(1);
}

for (const file of files) {
  if (!/\.(html|css)$/i.test(file)) continue;
  scanned++;
  const text = readFileSync(file, 'utf8');
  const relative = path.relative(DIST, file).replaceAll('\\', '/');

  for (const { what, re } of FETCHING) {
    for (const match of text.matchAll(re)) {
      for (const candidate of candidates(what, match[1])) {
        if (isExternal(candidate)) {
          const line = text.slice(0, match.index).split('\n').length;
          findings.push({ file: relative, line, what, url: candidate.trim() });
        }
      }
    }
  }
}

if (findings.length > 0) {
  console.error(`\nExternal resources found in the built output — ADR 0009 §6 forbids them.\n`);
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line}  (${f.what})  ${f.url}`);
  }
  console.error(
    '\nThe site must load nothing from a third party. Self-host the asset instead — fonts, icons and\n' +
      'images all belong in this repository, subject to the provenance rule in CLAUDE.md.\n' +
      '\nIf a third-party resource is genuinely wanted, that is an owner decision and a superseding\n' +
      'ADR, not an edit to this check.\n',
  );
  process.exit(1);
}

console.log(`External-resource check passed (${scanned} built file(s), no third-party fetches).`);
