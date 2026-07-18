/**
 * The single build-time gate that separates the preview from the live site (ADR 0006 §5).
 *
 * Three preview-only behaviours hang off this one flag: the `noindex` tag, the absence of a
 * sitemap, and which URL is canonical. One switch rather than three, because three independent
 * toggles are three chances to flip two of them and ship the third by accident.
 *
 * It defaults to `preview` deliberately. The failure mode of a forgotten flag must be a draft that
 * nobody indexes, never a draft that everybody does — a misconfigured build should produce a site
 * that is too hidden, not one that competes with the live business in search results.
 *
 * Flipping this to `live` is a **go-live gate** (`CLAUDE.md`, ADR 0006 §5): it happens in its own
 * pull request, at the owner's instruction, and never as a side effect of another change.
 */

/** `live` only when explicitly asked for; anything else — including unset — means `preview`. */
export const SITE_STATE: 'preview' | 'live' =
  process.env.SITE_STATE === 'live' ? 'live' : 'preview';

export const IS_LIVE = SITE_STATE === 'live';

/**
 * The canonical origin for the current state.
 *
 * The preview lives on its own subdomain rather than on the default GitHub project page, so that
 * both states serve from the **root** and the cutover changes nothing about how asset URLs resolve
 * (ADR 0006 §2, R1). That is also why `astro.config.ts` sets no `base`.
 */
export const SITE_URL = IS_LIVE
  ? 'https://iris-sunshine-oase.de'
  : 'https://preview.iris-sunshine-oase.de';
