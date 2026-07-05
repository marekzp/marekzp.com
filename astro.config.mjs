import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://marekzp.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
