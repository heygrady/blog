import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://heygrady.com',
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			// https://github.com/shikijs/shiki/blob/main/docs/themes.md
			theme: 'github-dark',
			// https://github.com/shikijs/shiki/blob/main/docs/languages.md
			langs: ['astro', 'js', 'jsx', 'ts', 'tsx', 'sh'],
			wrap: true,
		},
	},
});
