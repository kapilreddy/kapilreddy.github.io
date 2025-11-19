// @ts-check

import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://kapilreddy.github.io',

	integrations: [mdx(), sitemap()],

	redirects: {
		// Redirect existing published posts to new URL structure
		'/blog/webgl-core-async-kordova-drop': '/blog/2014/09/28/webgl-core-async-kordova-drop',
		'/blog/building-clojure-slm-part-1': '/notes/2024/11/17/building-clojure-slm-part-1',
	},
});
