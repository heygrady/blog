import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import prefetch from "@astrojs/prefetch";

// https://astro.build/config
export default defineConfig({
  site: 'https://heygrady.com',
  integrations: [mdx(), sitemap(), prefetch()],
  markdown: {
    shikiConfig: {
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'solarized-light',
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: ['astro', 'js', 'jsx', 'ts', 'tsx', 'sh'],
      wrap: true
    }
  },
  vite: {
    build: {
      assetsInlineLimit: 1024
    }
  }
});