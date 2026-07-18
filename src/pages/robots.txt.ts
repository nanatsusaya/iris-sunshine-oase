import type { APIRoute } from 'astro';
import { IS_LIVE, SITE_URL } from '../config/site';

/**
 * `robots.txt`, generated rather than shipped as a static file, so that it follows the one gate
 * (ADR 0006 §5) instead of becoming a second thing to remember at go-live.
 *
 * **It must not disallow crawling, in either state.** That looks like a missing safeguard and is
 * the opposite: the preview's protection is the `noindex` tag in `BaseLayout.astro`, and a crawler
 * blocked by `robots.txt` never reads it — the URL can then still be indexed by name if anything
 * links to it. The two rules together are weaker than `noindex` alone. Google's documentation is
 * explicit about this and ADR 0006 §4 quotes it.
 *
 * So: **adding a `Disallow` here is not a safety improvement, it defeats the gate.**
 */
export const GET: APIRoute = () => {
  const lines = ['User-agent: *', 'Allow: /'];

  // The sitemap exists only in the live state, so it is only advertised there (ADR 0006 §4).
  if (IS_LIVE) {
    lines.push('', `Sitemap: ${new URL('/sitemap-index.xml', SITE_URL).href}`);
  }

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
