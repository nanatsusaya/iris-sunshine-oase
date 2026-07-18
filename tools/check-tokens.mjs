#!/usr/bin/env node
/**
 * Asserts the design-token system of ADR 0004.
 *
 * ADR 0002 §5's finding — a convention left to discipline drifts within hours — applies to a token
 * system more than to most things, because the failure mode is a single hard-coded value that nobody
 * notices. `#6E1015` typed into one component looks exactly like `var(--colour-brand)` in review, and
 * it stops tracking the token the moment the token changes. That is the old site's central defect
 * (the same price in three places, drifting apart) transposed onto styling.
 *
 * ADR 0004 §10 names three assertions; two more turned out to be checkable, and enforce rules the
 * same ADR already states rather than adding any:
 *
 *   1. no raw colour outside `src/styles/tokens.css`                      (§10.1)
 *   2. no spacing value outside the 4px scale                             (§10.2)
 *   3. every text token clears WCAG 2.2 AA against the surfaces it is used on   (§10.3)
 *   4. `--colour-accent` is never text                                    (§3 — it cannot carry any)
 *   5. only the two sanctioned breakpoints, and no `max-width` query      (§7 — mobile-first)
 *
 * Check 3 is the one worth more than the paragraph it replaces: it is the rule most likely to be
 * broken by a well-meant colour tweak, and it is arithmetic, so a machine should do it.
 *
 * Run: node tools/check-tokens.mjs
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const TOKENS_FILE = join(ROOT, 'src', 'styles', 'tokens.css');
const TOKENS_REL = 'src/styles/tokens.css';

const problems = [];
const rel = (p) => relative(ROOT, p).replaceAll('\\', '/');

// --- gather the styled sources --------------------------------------------
const SKIP = new Set(['node_modules', '.git', 'Archive', 'dist', '.astro']);

function sourceFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(p));
    else if (/\.(astro|css)$/.test(entry.name)) out.push(p);
  }
  return out;
}

/**
 * The CSS a file actually contains, with the line number each fragment starts on.
 *
 * A `.astro` file is mostly not CSS, and treating it as if it were produces false positives that
 * teach people to distrust the check — `href="#kontakt"` is an anchor, not a colour. So only the
 * places CSS can legally live are read: `<style>` blocks and `style="…"` attributes.
 */
function cssFragments(file) {
  const text = readFileSync(file, 'utf8');
  const lineOf = (index) => text.slice(0, index).split('\n').length;

  if (file.endsWith('.css')) return [{ css: text, line: 1 }];

  const out = [];
  for (const m of text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    out.push({ css: m[1], line: lineOf(m.index + m[0].indexOf('>') + 1) });
  }
  // Inline style attributes would otherwise be an unchecked back door into every rule below.
  for (const m of text.matchAll(/\sstyle\s*=\s*"([^"]*)"/gi)) {
    out.push({ css: `x{${m[1]}}`, line: lineOf(m.index) });
  }
  return out;
}

/** CSS comments carry examples and rationale; judging them would forbid explaining the rule. */
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

/** Every `property: value` in a fragment, with the line it sits on. */
function* declarations(fragment) {
  const css = stripComments(fragment.css);
  for (const m of css.matchAll(/([-\w]+)\s*:\s*([^;{}]+)/g)) {
    // A selector like `a:hover` also matches; a declaration is always inside braces, and the
    // pseudo-class case is excluded because its "value" runs straight into a `{`.
    const value = m[2].trim();
    if (!value) continue;
    yield {
      property: m[1].toLowerCase(),
      value,
      line: fragment.line + css.slice(0, m.index).split('\n').length - 1,
    };
  }
}

const files = sourceFiles(join(ROOT, 'src'));

// --- 1: no raw colour outside the token file -------------------------------
// The escape hatch for a value that genuinely is not a token is to *add* a token, never an exception
// here (ADR 0004, Consequences: "the no-raw-colour check will be annoying at least once").
const RAW_COLOUR = [
  { what: 'a hex colour', re: /#[0-9a-f]{3,8}\b/i },
  { what: 'an rgb()/hsl() literal', re: /\b(?:rgba?|hsla?)\s*\(/i },
];
// Named colours are the same defect in friendlier clothing. `transparent` and `currentColor` name a
// relationship rather than a colour, so they stay allowed.
const NAMED_COLOURS =
  /\b(?:white|black|red|blue|green|gr[ae]y|silver|orange|yellow|purple|pink|brown|navy|teal|gold|beige|ivory|tan|maroon|olive|lime|aqua|cyan|magenta)\b/i;

for (const file of files) {
  if (rel(file) === TOKENS_REL) continue; // this is the file that is allowed to hold values
  for (const fragment of cssFragments(file)) {
    for (const { property, value, line } of declarations(fragment)) {
      for (const { what, re } of RAW_COLOUR) {
        if (re.test(value)) {
          problems.push(
            `${rel(file)}:${line}  ${property}: ${value} — ${what} outside ${TOKENS_REL}. ` +
              'Use var(--colour-…) (ADR 0004 §10.1).',
          );
        }
      }
      if (NAMED_COLOURS.test(value)) {
        problems.push(
          `${rel(file)}:${line}  ${property}: ${value} — a named colour outside ${TOKENS_REL}. ` +
            'Use var(--colour-…) (ADR 0004 §10.1).',
        );
      }
    }
  }
}

// --- 2: no spacing value outside the scale ---------------------------------
const SPACING_PROPERTY =
  /^(padding|margin|gap|row-gap|column-gap)(-(top|right|bottom|left|inline|block)(-(start|end))?)?$/;
/** `--gutter` is an alias of `--space-5`, declared once in the token file. */
const SPACING_VALUE =
  /^(0|auto|inherit|initial|unset|revert|-?\d+(\.\d+)?%|var\(--space-[1-9]\)|var\(--gutter\))$/;

for (const file of files) {
  if (rel(file) === TOKENS_REL) continue;
  for (const fragment of cssFragments(file)) {
    for (const { property, value, line } of declarations(fragment)) {
      if (!SPACING_PROPERTY.test(property)) continue;
      // A shorthand carries up to four values; each one has to be on the scale.
      for (const part of value.split(/\s+/)) {
        if (!SPACING_VALUE.test(part)) {
          problems.push(
            `${rel(file)}:${line}  ${property}: ${value} — "${part}" is not on the spacing scale. ` +
              'Use var(--space-1…9), 0, auto or a percentage (ADR 0004 §10.2). ' +
              'The scale is deliberately not exhaustive; if a step is genuinely missing, that is an ' +
              'ADR question, not a one-off value.',
          );
        }
      }
    }
  }
}

// --- 2b: the root font size is never overridden ----------------------------
// `html { font-size: 15px }` would render the design exactly as drawn and silently discard the text
// size a reader chose in their own browser. It is the single most common way a site becomes unusable
// for someone who needs larger text, and it looks identical in review — which is why ADR 0004 §4
// pins body copy in `rem` and puts the size on `body` instead. R2 makes this load-bearing rather than
// theoretical: body text is 15px at weight 300, so the reader's own setting is the mitigation.
for (const file of files) {
  for (const fragment of cssFragments(file)) {
    const css = stripComments(fragment.css);
    for (const m of css.matchAll(/(?:^|[\s,{}])(?::global\(\s*)?html\b[^{}]*\{([^{}]*)\}/g)) {
      if (/(?:^|[\s;])font-size\s*:/.test(m[1])) {
        problems.push(
          `${rel(file)}:${fragment.line + css.slice(0, m.index).split('\n').length - 1}  ` +
            "a font-size on `html` overrides the reader's own browser text size (ADR 0004 §4). " +
            'Set it on `body` — `rem` must stay anchored to the browser default.',
        );
      }
    }
  }
}

// --- 4: --colour-accent is never text --------------------------------------
// #FFC000 scores 1.64 against white and cannot carry text at any size against anything in this
// palette. Check 3 below cannot catch this, because it only measures the pairings declared here —
// this catches the pairing being *created*.
const COLOUR_PROPERTY = /^(color|-webkit-text-fill-color)$/;
const USES_ACCENT = /var\(\s*--colour-accent\s*[,)]/;

for (const file of files) {
  for (const fragment of cssFragments(file)) {
    for (const { property, value, line } of declarations(fragment)) {
      if (COLOUR_PROPERTY.test(property) && USES_ACCENT.test(value)) {
        problems.push(
          `${rel(file)}:${line}  color: ${value} — --colour-accent is a surface colour and never ` +
            'text (ADR 0004 §3). It scores 1.64 against white. Use --colour-brand or --colour-text.',
        );
      }
    }
  }
}

// --- 5: two breakpoints, mobile-first --------------------------------------
// This is the check that makes `M-09` — the old site's two-column layout that never wrapped on
// mobile — unexpressible rather than merely discouraged. A `max-width` query is a desktop-first
// layout being retrofitted for small screens, which is precisely how M-09 happened.
const ALLOWED_BREAKPOINTS = new Set(['48rem', '64rem']);

for (const file of files) {
  for (const fragment of cssFragments(file)) {
    const css = stripComments(fragment.css);
    for (const m of css.matchAll(/@media\b([^{]*)\{/g)) {
      const condition = m[1].trim();
      const line = fragment.line + css.slice(0, m.index).split('\n').length - 1;

      if (/max-width/i.test(condition)) {
        problems.push(
          `${rel(file)}:${line}  @media ${condition} — mobile-first means \`min-width\` only ` +
            '(ADR 0004 §7). The unprefixed rules *are* the small-screen case.',
        );
      }
      for (const w of condition.matchAll(/min-width\s*:\s*([^)\s]+)/gi)) {
        if (!ALLOWED_BREAKPOINTS.has(w[1].toLowerCase())) {
          problems.push(
            `${rel(file)}:${line}  @media ${condition} — ${w[1]} is not a sanctioned breakpoint. ` +
              'ADR 0004 §7 has two: 48rem (--bp-wide) and 64rem (--bp-full). A third is a decision ' +
              'made in the pull request that needs it, recorded in the ADR — not an ad-hoc width.',
          );
        }
      }
    }
  }
}

// --- 3: contrast holds ------------------------------------------------------
// The point of doing this in code rather than once by hand: ADR 0004 R1 records that the draft's own
// accessibility fix stopped 0.4 short because it was measured against a card instead of against the
// gradient. A contrast figure is meaningless without naming the background it was measured against,
// so this names all of them.
const tokensCss = readFileSync(TOKENS_FILE, 'utf8');

function tokenValue(name) {
  const m = tokensCss.match(new RegExp(`^\\s*${name}\\s*:\\s*([^;]+);`, 'm'));
  if (!m) {
    problems.push(`${TOKENS_REL}: token ${name} is missing — the contrast check cannot run.`);
    return null;
  }
  return m[1].trim();
}

const toRgb = (hex) => {
  const s = hex.replace('#', '');
  const full =
    s.length === 3
      ? s
          .split('')
          .map((c) => c + c)
          .join('')
      : s;
  return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16));
};
const channel = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
/** A translucent panel has no colour of its own — only one composited over what it sits on. */
const composite = (fg, alpha, bg) => fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));

const AA = 4.5;

const gradient = tokenValue('--page-background');
const stops = gradient ? [...gradient.matchAll(/#[0-9a-f]{3,6}\b/gi)].map((m) => m[0]) : [];
if (stops.length !== 5) {
  problems.push(
    `${TOKENS_REL}: --page-background should have 5 colour stops, found ${stops.length}. ` +
      'The contrast check reads them; if the gradient changed shape, this check needs to know.',
  );
}

/**
 * The surfaces text is placed on, and which text tokens may sit on each.
 *
 * This matrix is a decision, not a measurement: it says where each colour is *used*. The arithmetic
 * below then holds it to 4.5:1. The one restriction worth reading twice is `--colour-accent` — as a
 * surface it admits only the two darkest text tokens, because the muted and cool-blue tokens land at
 * 4.28 and 4.26 on it. ADR 0004 §3 constrains accent as *text*; this is the other direction.
 */
const ALL_TEXT = [
  '--colour-brand',
  '--colour-text',
  '--colour-text-muted',
  '--colour-accent-cool-text',
];
const surfaces = [];
for (const [i, stop] of stops.entries()) {
  const base = toRgb(stop);
  const where = `--page-background stop ${i + 1} (${stop})`;
  surfaces.push({ name: where, rgb: base, text: ALL_TEXT });
  for (const [token, alpha] of [
    ['--surface-card', 0.72],
    ['--surface-card-strong', 0.86],
  ]) {
    surfaces.push({
      name: `${token} over ${where}`,
      rgb: composite([255, 255, 255], alpha, base),
      text: ALL_TEXT,
    });
  }
}
const accentCool = tokenValue('--colour-accent-cool');
if (accentCool)
  surfaces.push({ name: '--colour-accent-cool', rgb: toRgb(accentCool), text: ALL_TEXT });
const accent = tokenValue('--colour-accent');
if (accent) {
  surfaces.push({
    name: '--colour-accent',
    rgb: toRgb(accent),
    text: ['--colour-brand', '--colour-text'],
  });
}

let pairings = 0;
let worst = { ratio: Number.POSITIVE_INFINITY, text: '', surface: '' };

for (const surface of surfaces) {
  for (const name of surface.text) {
    const value = tokenValue(name);
    if (!value) continue;
    const ratio = contrast(toRgb(value), surface.rgb);
    pairings++;
    if (ratio < worst.ratio) worst = { ratio, text: name, surface: surface.name };
    if (ratio < AA) {
      problems.push(
        `contrast: ${name} (${value}) on ${surface.name} is ${ratio.toFixed(2)}:1, below ` +
          `WCAG 2.2 AA's ${AA} (ADR 0004 §10.3). Darken the text token — the palette's worst case ` +
          'governs, not its average.',
      );
    }
  }
}

// --- verify the token file is actually loaded ------------------------------
// A token layer nothing imports is a file that passes every check above and styles nothing. This is
// cheap insurance against exactly that: the layout is the one place it must arrive.
const LAYOUT = join(ROOT, 'src', 'layouts', 'BaseLayout.astro');
if (!/styles\/tokens\.css/.test(readFileSync(LAYOUT, 'utf8'))) {
  problems.push(
    'src/layouts/BaseLayout.astro does not import src/styles/tokens.css — the tokens would be ' +
      'declared and never delivered.',
  );
}

// --- report ----------------------------------------------------------------
if (problems.length) {
  console.error(`Token check failed — ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(
  `Token check passed (${files.length} styled file(s); ${pairings} colour pairings, worst ` +
    `${worst.ratio.toFixed(2)}:1 — ${worst.text} on ${worst.surface}).`,
);
