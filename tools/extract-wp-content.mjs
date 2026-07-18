/**
 * Extrahiert alle Inhalte des alten WordPress-Exports als Markdown nach docs/inhalte/.
 *
 * Hintergrund: Der Ordner Archive/ ist per .gitignore vom Repository ausgeschlossen
 * (ungeklaerte Bildrechte, personenbezogene Daten). Damit die Texte trotzdem
 * verfuegbar bleiben, werden sie einmalig hierher extrahiert und versioniert.
 *
 * Aufruf (lokal, mit vorhandenem Archiv):
 *   node tools/extract-wp-content.mjs
 *
 * Quelle ist die BEREINIGTE Export-Datei, nicht die Fassung mit dem Suffix
 * ORIGINAL-MIT-PII.
 */

import fs from 'node:fs';
import path from 'node:path';

const XML_PATH = 'Archive/iris-sujnshine-oase-backup/iris039sunshineoase.WordPress.2026-07-18.xml';
const OUT = 'docs/inhalte';

if (!fs.existsSync(XML_PATH)) {
  console.error(`Export nicht gefunden: ${XML_PATH}`);
  console.error('Das Archiv liegt nicht im Repository. Lokal bereitstellen und erneut ausfuehren.');
  process.exit(1);
}

const xml = fs.readFileSync(XML_PATH, 'utf8');
const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

// ---------------------------------------------------------------- Hilfsmittel

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
    .replace(/​/g, ''); // Zero-Width-Space entfernen (siehe Maengelliste M-06)
}

/** HTML aus dem Editor in schlichtes Markdown ueberfuehren. */
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
  // Ueberschriften brauchen eine Leerzeile davor, sonst verschmelzen sie mit dem Absatz.
  return s.replace(/([^\n])\n(#{1,6} )/g, '$1\n\n$2');
}

/** Elementor-JSON in Dokumentreihenfolge durchlaufen und Markdown erzeugen. */
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
          // Eine Ebene unter der zuletzt gesetzten Ueberschrift einhaengen.
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
          if (s.image?.url) out.push(`\n> Bild: \`${path.basename(s.image.url)}\`\n`);
          break;
        case 'image-carousel': {
          const names = (s.carousel || []).map((c) => path.basename(c.url || '')).filter(Boolean);
          if (names.length) out.push(`\n> Bildergalerie: ${names.map((n) => `\`${n}\``).join(', ')}\n`);
          break;
        }
        case 'google_maps':
          out.push('\n> Eingebettete Google-Maps-Karte\n');
          break;
        case 'content_form_contact':
          out.push('\n> Kontaktformular\n');
          break;
        case 'obfx-posts-grid':
          out.push('\n> Automatisches Beitrags-Grid (zeigte Blogbeitraege)\n');
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

  // Widgets mit Leerzeile trennen, sonst klebt eine Ueberschrift am vorigen Absatz.
  const body = out.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
  return { body, anchors: seenAnchors };
}

function slugify(s) {
  return s.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Minimaler Parser fuer PHP-serialisierte Daten (Oeffnungszeiten-Plugin). */
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
    throw new Error('Unbekannter Typ an Position ' + i + ': ' + type);
  }
  try { return parse(); } catch { return null; }
}

const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

// ---------------------------------------------------------------- Einsammeln

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

const GENERATED = '<!-- Automatisch erzeugt von tools/extract-wp-content.mjs. Nicht von Hand bearbeiten. -->\n';

// ---------------------------------------------------------------- 1. Seiten

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
    else body = '_(Elementor-Daten konnten nicht gelesen werden.)_';
  } else {
    body = htmlToMd(tag(it, 'content:encoded'));
  }

  const parentTitle = parent && parent !== '0'
    ? decode(tag(pages.find((p) => tag(p, 'wp:post_id') === parent) || '', 'title')) : '';

  const fileSlug = slug && slug !== '/' ? slugify(slug) : slugify(title);
  const rel = `seiten/${fileSlug}.md`;

  // null = optionale Zeile, die entfaellt. Leerstrings sind gewollte Leerzeilen.
  const head = [
    GENERATED,
    `# ${title}`,
    '',
    '| | |',
    '|---|---|',
    `| Pfad | \`/${slug}\` |`,
    `| Status | ${status} |`,
    `| WordPress-ID | ${id} |`,
    parentTitle ? `| Unterseite von | ${parentTitle} |` : null,
    `| Aufbau | ${M._elementor_data ? 'Elementor' : 'klassischer Editor'} |`,
    anchors.length ? `| Sprungmarken | ${anchors.map((a) => '`#' + a + '`').join(', ')} |` : null,
    '',
    '---',
    '',
  ].filter((l) => l !== null).join('\n');

  write(rel, head + '\n' + body + '\n');
  pageIndex.push({ title, slug, status, rel, parentTitle, len: body.length });
}

// ---------------------------------------------------------------- 2. Beitraege

const posts = (byType.post || []).sort((a, b) => tag(a, 'wp:post_date').localeCompare(tag(b, 'wp:post_date')));
let postsMd = GENERATED + '\n# Blogbeiträge der Altseite\n\n' +
  'Alle 19 Beiträge, chronologisch. Sie sind **inhaltlich abgelaufen** ' +
  '(abgelaufene Aktionen, Corona-Meldungen) und sollen laut Inhaltsinventar nicht ' +
  'übernommen werden. Hier gesichert, damit nichts verloren geht.\n\n---\n';

for (const it of posts) {
  postsMd += `\n## ${decode(tag(it, 'title'))}\n\n`;
  postsMd += `\`/${tag(it, 'wp:post_name')}\` · ${tag(it, 'wp:post_date').slice(0, 10)}\n\n`;
  const M = metaOf(it);
  postsMd += (M._elementor_data ? (elementorToMd(M._elementor_data)?.body ?? '') : htmlToMd(tag(it, 'content:encoded'))) + '\n';
}
write('beitraege.md', postsMd);

// ---------------------------------------------------------------- 3. Oeffnungszeiten

const sets = byType['op-set'] || [];
let ozMd = GENERATED + '\n# Öffnungszeiten-Datensätze\n\n' +
  'Alle im alten System hinterlegten Saison-Sätze, aus den PHP-serialisierten ' +
  'Plugin-Daten dekodiert. Der jüngste Satz stammt aus 2024.\n\n' +
  '> **Vor Übernahme mit dem Betreiber abgleichen.** Es existieren zwei Sommer-Sätze ' +
  'für 2024 mit abweichenden Zeiten; welcher zuletzt aktiv war, geht aus dem Export ' +
  'nicht hervor.\n';

for (const it of sets.sort((a, b) => tag(a, 'wp:post_date').localeCompare(tag(b, 'wp:post_date')))) {
  const M = metaOf(it);
  ozMd += `\n## ${decode(tag(it, 'title'))}\n\n`;
  const desc = M._op_meta_box_set_details_description;
  if (desc) ozMd += `Zeitraum: **${decode(desc).trim()}**\n\n`;
  const periods = phpUnserialize(M._op_set_periods || '');
  if (periods && typeof periods === 'object') {
    const byDay = {};
    for (const p of Object.values(periods)) {
      if (!p || typeof p !== 'object') continue;
      (byDay[p.weekday] ||= []).push(`${p.timeStart}–${p.timeEnd}`);
    }
    ozMd += '| Tag | Zeiten |\n|---|---|\n';
    for (let d = 1; d <= 7; d++) {
      const idx = d % 7;
      if (byDay[idx]) ozMd += `| ${WEEKDAYS[idx]} | ${byDay[idx].join(' und ')} |\n`;
    }
  } else {
    ozMd += '_(keine Zeiten hinterlegt)_\n';
  }
  const hol = phpUnserialize(M._op_set_holidays || '');
  if (hol && Object.keys(hol).length) {
    const names = Object.values(hol).map((h) => h?.name).filter(Boolean);
    if (names.length) ozMd += `\nFeiertage: ${names.join(', ')}\n`;
  }
}
write('oeffnungszeiten.md', ozMd);

// ---------------------------------------------------------------- 4. URL-Liste

let urlMd = GENERATED + '\n# URL-Bestand der Altseite\n\n' +
  'Alle öffentlich erreichbaren Adressen. Grundlage für die Weiterleitungen beim ' +
  'Relaunch — bestehende Links und Suchmaschinen-Treffer sollen nicht ins Leere laufen.\n\n' +
  '| Alte URL | Titel | Typ | Neue URL |\n|---|---|---|---|\n';

const published = [];
for (const t of ['page', 'post']) {
  for (const it of byType[t] || []) {
    if (tag(it, 'wp:status') !== 'publish') continue;
    published.push({ slug: tag(it, 'wp:post_name'), title: decode(tag(it, 'title')), type: t });
  }
}
published.sort((a, b) => a.type.localeCompare(b.type) || a.slug.localeCompare(b.slug));
for (const p of published) {
  urlMd += `| \`/${p.slug}/\` | ${p.title} | ${p.type === 'page' ? 'Seite' : 'Beitrag'} | _offen_ |\n`;
}
urlMd += `\n**${published.length} veröffentlichte Adressen.**\n`;
write('urls-und-redirects.md', urlMd);

// ---------------------------------------------------------------- 5. Medien

const attachments = byType.attachment || [];
const usage = new Map(); // Dateiname -> Set von Seitentiteln

for (const t of ['page', 'post']) {
  for (const it of byType[t] || []) {
    const title = decode(tag(it, 'title'));
    const hay = (metaOf(it)._elementor_data || '') + tag(it, 'content:encoded');
    for (const m of hay.matchAll(/uploads\\?\/\d{4}\\?\/\d{2}\\?\/([A-Za-z0-9._%-]+\.(?:jpe?g|png|gif|svg))/gi)) {
      const f = m[1].replace(/-\d{2,4}x\d{2,4}(?=\.)/, ''); // Groessenvariante auf Original zurueckfuehren
      if (!usage.has(f)) usage.set(f, new Set());
      usage.get(f).add(title);
    }
  }
}

let medMd = GENERATED + '\n# Verwendete Bilddateien\n\n' +
  'Zuordnung Bilddatei → Seite, aus dem Export ermittelt. Die Dateien selbst liegen ' +
  'im ausgelagerten Archiv (siehe [Medien-Inventar](../analyse/06-medien-inventar.md)) ' +
  'und sind **nicht** Teil dieses Repositorys.\n\n' +
  '> **Bildrechte sind nicht dokumentiert.** Vor Wiederverwendung klären — siehe ' +
  'Mängel M-15.\n\n' +
  `Insgesamt ${attachments.length} Medien in der alten Mediathek, davon ${usage.size} ` +
  'nachweislich auf Seiten oder in Beiträgen eingebunden.\n\n' +
  '| Datei | Verwendet auf |\n|---|---|\n';

for (const [file, pagesSet] of [...usage].sort((a, b) => a[0].localeCompare(b[0]))) {
  medMd += `| \`${file}\` | ${[...pagesSet].join(', ')} |\n`;
}
write('medien-verwendung.md', medMd);

// ---------------------------------------------------------------- 6. Index

let idx = GENERATED + '\n# Inhalte der Altseite\n\n' +
  'Vollständige Sicherung aller Texte des alten WordPress-Auftritts. Erzeugt aus dem ' +
  'bereinigten Export mit `tools/extract-wp-content.mjs`.\n\n' +
  'Dieser Ordner existiert, weil `Archive/` nicht Teil des Repositorys ist. Er ist ' +
  'damit die **einzige** versionierte Quelle der Alt-Inhalte.\n\n' +
  '## Seiten\n\n| Seite | Pfad | Status | Datei |\n|---|---|---|---|\n';

for (const p of pageIndex.sort((a, b) => a.title.localeCompare(b.title))) {
  idx += `| ${p.title}${p.parentTitle ? ` <br><small>unter ${p.parentTitle}</small>` : ''} | \`/${p.slug}\` | ${p.status} | [${path.basename(p.rel)}](${p.rel}) |\n`;
}

idx += '\n## Weitere Sicherungen\n\n' +
  '| Datei | Inhalt |\n|---|---|\n' +
  '| [beitraege.md](beitraege.md) | Alle 19 Blogbeiträge (abgelaufen, nicht zur Übernahme) |\n' +
  '| [oeffnungszeiten.md](oeffnungszeiten.md) | Alle Saison-Datensätze, dekodiert |\n' +
  '| [urls-und-redirects.md](urls-und-redirects.md) | URL-Bestand als Grundlage für Weiterleitungen |\n' +
  '| [medien-verwendung.md](medien-verwendung.md) | Welches Bild lag auf welcher Seite |\n\n' +
  '## Hinweise\n\n' +
  '- Texte sind **unverändert** übernommen, inklusive der in der Mängelliste ' +
  'vermerkten Tipp- und Grammatikfehler. Sie sind beim Übertragen zu korrigieren, ' +
  'nicht hier.\n' +
  '- Blindtext (Lorem ipsum) ist bewusst mitgesichert, damit erkennbar bleibt, ' +
  'welche Stellen redaktionell zu füllen sind.\n' +
  '- Unsichtbare Zero-Width-Spaces (U+200B) aus dem Original wurden beim Extrahieren ' +
  'entfernt.\n' +
  '- **Links in den Texten zeigen auf die alte Seitenstruktur** (`/kontakt`, ' +
  '`/leistungen-und-preise#solarium` und so weiter) und sind bewusst unverändert. ' +
  'Sie sind keine Verweise innerhalb dieser Dokumentation. Ein Teil von ihnen war ' +
  'schon auf der Altseite defekt — siehe Mängel M-05 und M-28.\n';

write('README.md', idx);

// ---------------------------------------------------------------- Bericht

console.log(`Geschrieben nach ${OUT}/:`);
for (const w of written.sort()) console.log('  ' + w);
console.log(`\n${written.length} Dateien, ${pageIndex.length} Seiten, ${posts.length} Beiträge, ` +
  `${sets.length} Öffnungszeiten-Sätze, ${published.length} URLs, ${usage.size} Bildzuordnungen.`);
