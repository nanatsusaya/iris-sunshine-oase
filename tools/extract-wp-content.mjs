/**
 * Extracts every text of the old WordPress export to Markdown under docs/inhalte/.
 *
 * Why this exists: the Archive/ folder is excluded from the repository by .gitignore
 * (undocumented image rights, third-party personal data). Extracting the texts here is
 * what makes that exclusion affordable — they stay versioned, the 600 MB does not.
 *
 * The German page text this emits is *source material*, reproduced verbatim, and must
 * stay German (CLAUDE.md records the exception). Only the framing this file generates
 * around it — headings, table headers, widget annotations — is English.
 *
 * Requires the archive to be present locally; it cannot run in CI. Correct this
 * generator and re-run it, never hand-edit its output.
 *
 * Usage (locally, with the archive in place):
 *   node tools/extract-wp-content.mjs
 *
 * The source is the CLEANED export file, not the one suffixed ORIGINAL-MIT-PII.
 */

import fs from 'node:fs';
import path from 'node:path';

const XML_PATH = 'Archive/iris-sujnshine-oase-backup/iris039sunshineoase.WordPress.2026-07-18.xml';
const OUT = 'docs/inhalte';

if (!fs.existsSync(XML_PATH)) {
  console.error(`Export not found: ${XML_PATH}`);
  console.error('The archive is not part of the repository. Provide it locally and re-run.');
  process.exit(1);
}

const xml = fs.readFileSync(XML_PATH, 'utf8');
const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

// ------------------------------------------------------------------- Helpers

function tag(it, name) {
  let m = it.match(new RegExp('<' + name + '><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></' + name + '>'));
  if (m) return m[1];
  m = it.match(new RegExp('<' + name + '>([\\s\\S]*?)</' + name + '>'));
  return m ? m[1] : '';
}

function metaOf(it) {
  const o = {};
  const re = /<wp:meta_key><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_value>/g;
  let m;
  while ((m = re.exec(it))) o[m[1]] = m[2];
  return o;
}

const ENTITIES = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'", '&#39;': "'",
  '&nbsp;': ' ', '&#8211;': '–', '&#8212;': '—', '&#8216;': '‘', '&#8217;': '’',
  '&#8220;': '„', '&#8221;': '“', '&#8222;': '„', '&#8230;': '…', '&euro;': '€',
  '&#8364;': '€', '&auml;': 'ä', '&ouml;': 'ö', '&uuml;': 'ü', '&Auml;': 'Ä',
  '&Ouml;': 'Ö', '&Uuml;': 'Ü', '&szlig;': 'ß', '&#8203;': '',
};

function decode(s) {
  return s
    .replace(/&#(\d+);/g, (m, d) => (ENTITIES[m] !== undefined ? ENTITIES[m] : String.fromCharCode(+d)))
    .replace(/&[a-zA-Z]+;/g, (m) => (ENTITIES[m] !== undefined ? ENTITIES[m] : m))
    .replace(/​/g, ''); // strip zero-width spaces (defect M-06)
}

/** Turn editor HTML into plain Markdown. */
function htmlToMd(html) {
  if (!html) return '';
  let s = html;
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<script[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (m, lvl, t) => `\n\n${'#'.repeat(Math.min(+lvl + 1, 6))} ${t.trim()}\n\n`);
  s = s.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (m, _t, t) => `**${t.trim()}**`);
  s = s.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, (m, _t, t) => `*${t.trim()}*`);
  s = s.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (m, href, t) => `[${t.trim()}](${href})`);
  s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, t) => `\n- ${t.trim()}`);
  s = s.replace(/<\/(ul|ol)>/gi, '\n');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<\/p>/gi, '\n\n');
  s = s.replace(/<\/(div|tr|td|th|table|tbody|thead|section)>/gi, '\n');
  s = s.replace(/<[^>]+>/g, '');
  s = decode(s);
  s = s.replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  // A heading needs a blank line before it, or it merges into the preceding paragraph.
  return s.replace(/([^\n])\n(#{1,6} )/g, '$1\n\n$2');
}

/** Walk the Elementor JSON in document order and emit Markdown. */
function elementorToMd(json) {
  let data;
  try {
    data = JSON.parse(json);
  } catch {
    return null;
  }
  const out = [];
  const seenAnchors = [];
  let lastHeadingLevel = 2;

  const walk = (nodes) => {
    for (const n of nodes || []) {
      const s = n.settings || {};
      switch (n.widgetType) {
        case 'heading': {
          const lvl = Math.min(+(s.header_size || 'h2').replace('h', '') + 1, 6);
          if (s.title) {
            lastHeadingLevel = lvl;
            out.push(`\n\n${'#'.repeat(lvl)} ${decode(String(s.title)).trim()}\n`);
          }
          break;
        }
        case 'text-editor':
          if (s.editor) out.push(htmlToMd(s.editor));
          break;
        case 'icon-box':
          if (s.title_text) out.push(`\n**${decode(String(s.title_text)).trim()}**\n`);
          if (s.description_text) out.push(htmlToMd(s.description_text));
          break;
        case 'accordion':
        case 'toggle': {
          // Nest one level below the most recent heading.
          const h = '#'.repeat(Math.min(lastHeadingLevel + 1, 6));
          for (const t of s.tabs || []) {
            out.push(`\n\n${h} ${decode(String(t.tab_title || '')).trim()}\n`);
            out.push(htmlToMd(t.tab_content || ''));
          }
          break;
        }
        case 'menu-anchor':
          if (s.anchor) seenAnchors.push(decode(String(s.anchor)).trim());
          break;
        case 'image':
          if (s.image?.url) out.push(`\n> Image: \`${path.basename(s.image.url)}\`\n`);
          break;
        case 'image-carousel': {
          const names = (s.carousel || []).map((c) => path.basename(c.url || '')).filter(Boolean);
          if (names.length) out.push(`\n> Image gallery: ${names.map((n) => `\`${n}\``).join(', ')}\n`);
          break;
        }
        case 'google_maps':
          out.push('\n> Embedded Google Maps\n');
          break;
        case 'content_form_contact':
          out.push('\n> Contact form\n');
          break;
        case 'obfx-posts-grid':
          out.push('\n> Automatic post grid (listed blog posts)\n');
          break;
        case 'spacer':
        case undefined:
          break;
        default:
          out.push(`\n> Widget: \`${n.widgetType}\`\n`);
      }
      if (n.elements?.length) walk(n.elements);
    }
  };
  walk(data);

  // Separate widgets with a blank line, or a heading sticks to the previous paragraph.
  const body = out.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
  return { body, anchors: seenAnchors };
}

function slugify(s) {
  return s.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Minimal parser for PHP-serialised data (the opening-hours plugin stores it that way). */
function phpUnserialize(str) {
  let i = 0;
  function parse() {
    const type = str[i];
    if (type === 'N') { i += 2; return null; }
    if (type === 'b') { i += 2; const v = str[i] === '1'; i += 2; return v; }
    if (type === 'i') { i += 2; const j = str.indexOf(';', i); const v = parseInt(str.slice(i, j), 10); i = j + 1; return v; }
    if (type === 'd') { i += 2; const j = str.indexOf(';', i); const v = parseFloat(str.slice(i, j)); i = j + 1; return v; }
    if (type === 's') {
      i += 2;
      const c = str.indexOf(':', i);
      const len = parseInt(str.slice(i, c), 10);
      const start = c + 2;
      const v = str.slice(start, start + len);
      i = start + len + 2;
      return v;
    }
    if (type === 'a') {
      i += 2;
      const c = str.indexOf(':', i);
      const n = parseInt(str.slice(i, c), 10);
      i = c + 2;
      const o = {};
      for (let k = 0; k < n; k++) { const key = parse(); o[key] = parse(); }
      i += 1;
      return o;
    }
    throw new Error('Unknown type at position ' + i + ': ' + type);
  }
  try { return parse(); } catch { return null; }
}

// Index 0 is Sunday — the plugin's own convention, kept so the numbers map straight across.
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ------------------------------------------------------------------ Collect

const byType = {};
for (const it of items) {
  const t = tag(it, 'wp:post_type');
  (byType[t] ||= []).push(it);
}

fs.mkdirSync(path.join(OUT, 'seiten'), { recursive: true });

const written = [];
function write(rel, content) {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
  written.push(rel);
}

const GENERATED = '<!-- Generated by tools/extract-wp-content.mjs. Do not edit by hand. -->\n';

// ------------------------------------------------------------------ 1. Pages

const pages = byType.page || [];
const pageIndex = [];

for (const it of pages) {
  const title = decode(tag(it, 'title'));
  const slug = tag(it, 'wp:post_name');
  const status = tag(it, 'wp:status');
  const id = tag(it, 'wp:post_id');
  const parent = tag(it, 'wp:post_parent');
  const M = metaOf(it);

  let body = '';
  let anchors = [];
  if (M._elementor_data) {
    const r = elementorToMd(M._elementor_data);
    if (r) { body = r.body; anchors = r.anchors; }
    else body = '_(Elementor data could not be parsed.)_';
  } else {
    body = htmlToMd(tag(it, 'content:encoded'));
  }

  const parentTitle = parent && parent !== '0'
    ? decode(tag(pages.find((p) => tag(p, 'wp:post_id') === parent) || '', 'title')) : '';

  const fileSlug = slug && slug !== '/' ? slugify(slug) : slugify(title);
  const rel = `seiten/${fileSlug}.md`;

  // null = an optional row that is dropped. Empty strings are intentional blank lines.
  const head = [
    GENERATED,
    `# ${title}`,
    '',
    '| | |',
    '|---|---|',
    `| Path | \`/${slug}\` |`,
    `| Status | ${status} |`,
    `| WordPress ID | ${id} |`,
    parentTitle ? `| Child page of | ${parentTitle} |` : null,
    `| Built with | ${M._elementor_data ? 'Elementor' : 'classic editor'} |`,
    anchors.length ? `| Anchors | ${anchors.map((a) => '`#' + a + '`').join(', ')} |` : null,
    '',
    '---',
    '',
  ].filter((l) => l !== null).join('\n');

  write(rel, head + '\n' + body + '\n');
  pageIndex.push({ title, slug, status, rel, parentTitle, len: body.length });
}

// ------------------------------------------------------------------ 2. Posts

const posts = (byType.post || []).sort((a, b) => tag(a, 'wp:post_date').localeCompare(tag(b, 'wp:post_date')));
let postsMd = GENERATED + '\n# Blog posts of the old site\n\n' +
  'All 19 posts, chronologically. Every one is **out of date** — expired promotions and ' +
  'pandemic-era notices — and the content inventory rates none of them for reuse. ' +
  'Kept here so nothing is lost, not because anything here is wanted.\n\n' +
  'The post text below is the original German, reproduced verbatim.\n\n---\n';

for (const it of posts) {
  postsMd += `\n## ${decode(tag(it, 'title'))}\n\n`;
  postsMd += `\`/${tag(it, 'wp:post_name')}\` · ${tag(it, 'wp:post_date').slice(0, 10)}\n\n`;
  const M = metaOf(it);
  postsMd += (M._elementor_data ? (elementorToMd(M._elementor_data)?.body ?? '') : htmlToMd(tag(it, 'content:encoded'))) + '\n';
}
write('beitraege.md', postsMd);

// --------------------------------------------------------- 3. Opening hours

const sets = byType['op-set'] || [];
let ozMd = GENERATED + '\n# Opening-hours records\n\n' +
  'Every seasonal set stored in the old system, decoded from the plugin\'s ' +
  'PHP-serialised data. The most recent set is from 2024.\n\n' +
  '> **Confirm with the owner before reuse.** Two summer sets exist for 2024 with ' +
  'differing times, and the export does not say which was active last. Do not guess ' +
  'which one is current — opening hours are a fact customers act on.\n';

for (const it of sets.sort((a, b) => tag(a, 'wp:post_date').localeCompare(tag(b, 'wp:post_date')))) {
  const M = metaOf(it);
  ozMd += `\n## ${decode(tag(it, 'title'))}\n\n`;
  const desc = M._op_meta_box_set_details_description;
  if (desc) ozMd += `Period: **${decode(desc).trim()}**\n\n`;
  const periods = phpUnserialize(M._op_set_periods || '');
  if (periods && typeof periods === 'object') {
    const byDay = {};
    for (const p of Object.values(periods)) {
      if (!p || typeof p !== 'object') continue;
      (byDay[p.weekday] ||= []).push(`${p.timeStart}–${p.timeEnd}`);
    }
    ozMd += '| Day | Hours |\n|---|---|\n';
    for (let d = 1; d <= 7; d++) {
      const idx = d % 7;
      if (byDay[idx]) ozMd += `| ${WEEKDAYS[idx]} | ${byDay[idx].join(' and ')} |\n`;
    }
  } else {
    ozMd += '_(no hours recorded)_\n';
  }
  const hol = phpUnserialize(M._op_set_holidays || '');
  if (hol && Object.keys(hol).length) {
    const names = Object.values(hol).map((h) => h?.name).filter(Boolean);
    if (names.length) ozMd += `\nHolidays: ${names.join(', ')}\n`;
  }
}
write('oeffnungszeiten.md', ozMd);

// ------------------------------------------------------------------- 4. URLs

let urlMd = GENERATED + '\n# URLs of the old site\n\n' +
  'Every publicly reachable address, and the basis for the redirects at relaunch. ' +
  'These URLs are indexed today: a nine-year-old local business has accumulated search ' +
  'ranking against them, and existing links point at them. None may silently 404.\n\n' +
  '| Old URL | Title | Type | New URL |\n|---|---|---|---|\n';

const published = [];
for (const t of ['page', 'post']) {
  for (const it of byType[t] || []) {
    if (tag(it, 'wp:status') !== 'publish') continue;
    published.push({ slug: tag(it, 'wp:post_name'), title: decode(tag(it, 'title')), type: t });
  }
}
published.sort((a, b) => a.type.localeCompare(b.type) || a.slug.localeCompare(b.slug));
for (const p of published) {
  urlMd += `| \`/${p.slug}/\` | ${p.title} | ${p.type === 'page' ? 'Page' : 'Post'} | _open_ |\n`;
}
urlMd += `\n**${published.length} published addresses.**\n`;
write('urls-und-redirects.md', urlMd);

// ------------------------------------------------------------------ 5. Media

const attachments = byType.attachment || [];
const usage = new Map(); // file name -> set of page titles

for (const t of ['page', 'post']) {
  for (const it of byType[t] || []) {
    const title = decode(tag(it, 'title'));
    const hay = (metaOf(it)._elementor_data || '') + tag(it, 'content:encoded');
    for (const m of hay.matchAll(/uploads\\?\/\d{4}\\?\/\d{2}\\?\/([A-Za-z0-9._%-]+\.(?:jpe?g|png|gif|svg))/gi)) {
      const f = m[1].replace(/-\d{2,4}x\d{2,4}(?=\.)/, ''); // map a size variant back to its original
      if (!usage.has(f)) usage.set(f, new Set());
      usage.get(f).add(title);
    }
  }
}

let medMd = GENERATED + '\n# Images in use\n\n' +
  'Which image file appeared on which page, determined from the export. The files ' +
  'themselves live in the excluded archive (see the ' +
  '[media inventory](../analyse/06-medien-inventar.md)) and are **not** part of this ' +
  'repository.\n\n' +
  '> **Image rights are undocumented.** Establish provenance before reusing any of ' +
  'these — see defect M-15. No image enters the repository without its source, licence ' +
  'and evidence recorded.\n\n' +
  `${attachments.length} media items existed in the old library; ${usage.size} of them are ` +
  'demonstrably embedded in a page or post.\n\n' +
  '| File | Used on |\n|---|---|\n';

for (const [file, pagesSet] of [...usage].sort((a, b) => a[0].localeCompare(b[0]))) {
  medMd += `| \`${file}\` | ${[...pagesSet].join(', ')} |\n`;
}
write('medien-verwendung.md', medMd);

// ------------------------------------------------------------------ 6. Index

let idx = GENERATED + '\n# Content of the old site\n\n' +
  'A complete capture of every text from the old WordPress site, generated from the ' +
  'cleaned export by `tools/extract-wp-content.mjs`.\n\n' +
  'This folder exists because `Archive/` is not part of the repository. It is therefore ' +
  'the **only** versioned source of the old content.\n\n' +
  '> **The page text below is German and stays German.** It is source material — a record ' +
  'of what the site said — not documentation. Only the framing around it is English. ' +
  'Correct the generator, never these files.\n\n' +
  '## Pages\n\n| Page | Path | Status | File |\n|---|---|---|---|\n';

for (const p of pageIndex.sort((a, b) => a.title.localeCompare(b.title))) {
  idx += `| ${p.title}${p.parentTitle ? ` <br><small>under ${p.parentTitle}</small>` : ''} | \`/${p.slug}\` | ${p.status} | [${path.basename(p.rel)}](${p.rel}) |\n`;
}

idx += '\n## Other captures\n\n' +
  '| File | Contents |\n|---|---|\n' +
  '| [beitraege.md](beitraege.md) | All 19 blog posts (expired, not for reuse) |\n' +
  '| [oeffnungszeiten.md](oeffnungszeiten.md) | Every seasonal record, decoded |\n' +
  '| [urls-und-redirects.md](urls-und-redirects.md) | The URL inventory behind the redirects |\n' +
  '| [medien-verwendung.md](medien-verwendung.md) | Which image appeared on which page |\n\n' +
  '## Notes\n\n' +
  '- Texts are reproduced **unchanged**, including the typos and grammatical errors ' +
  'recorded in the defect list. Fix them when the content is carried over, not here.\n' +
  '- Placeholder text (lorem ipsum) is captured deliberately, so it stays visible which ' +
  'passages were never actually written.\n' +
  '- Invisible zero-width spaces (U+200B) from the original were stripped during ' +
  'extraction (defect M-06).\n' +
  '- **Links inside the texts point at the old site structure** (`/kontakt`, ' +
  '`/leistungen-und-preise#solarium` and so on) and are deliberately unchanged. They are ' +
  'not cross-references within this documentation, and `tools/check-docs.mjs` skips them ' +
  'for that reason. Some were already broken on the old site — see defects M-05 and M-28.\n';

write('README.md', idx);

// ----------------------------------------------------------------- Report

console.log(`Written to ${OUT}/:`);
for (const w of written.sort()) console.log('  ' + w);
console.log(`\n${written.length} files, ${pageIndex.length} pages, ${posts.length} posts, ` +
  `${sets.length} opening-hours sets, ${published.length} URLs, ${usage.size} image mappings.`);
