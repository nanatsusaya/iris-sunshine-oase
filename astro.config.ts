import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { IS_LIVE, SITE_URL } from './src/config/site';

// Astro 7, static output, no adapter (ADR 0002 §1). The build produces files; that is the whole
// point — nothing to run on a server, nothing to patch at request time.
export default defineConfig({
  site: SITE_URL,

  // Deliberately no `base`. A GitHub project page would serve from a subpath
  // (`nanatsusaya.github.io/iris-sunshine-oase/`) while the live site serves from the root, and
  // carrying that difference in the build config means the cutover changes how every asset URL
  // resolves. ADR 0006 §2 (R1) puts the preview on its own subdomain precisely to avoid that, so
  // both states are root-served and this stays empty. The Phase 2 epic still describes subpath
  // hosting; the ADR supersedes it.
  base: undefined,

  // The sitemap exists only in the live state (ADR 0006 §4). A sitemap advertises URLs, and a
  // draft has nothing to advertise — generating one would invite exactly the crawl the `noindex`
  // gate exists to make harmless. ADR 0002 §6 left this interaction open; ADR 0006 closed it.
  integrations: IS_LIVE ? [sitemap()] : [],

  build: {
    // Emit `about/index.html` rather than `about.html`, so served URLs carry no extension and the
    // redirect map in ADR 0008 has a stable shape to target.
    format: 'directory',
  },
});
