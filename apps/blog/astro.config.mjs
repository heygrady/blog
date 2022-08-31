import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://heygrady.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'solarized-light',
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: ['astro', 'js', 'jsx', 'ts', 'tsx', 'sh'],
      wrap: true,
    },
  },
  vite: {
    build: {
      assetsInlineLimit: 1024,
    },
  },
})
