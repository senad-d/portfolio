/// <reference types="node" />
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const repositoryName = 'portfolio';
const useCustomDomain = process.env.PUBLIC_USE_CUSTOM_DOMAIN === 'true';

const site = useCustomDomain
  ? (process.env.PUBLIC_SITE_URL ?? 'https://example.com/')
  : 'https://senad-d.github.io/';

// https://astro.build/config
export default defineConfig({
  site,
  base: useCustomDomain ? '/' : `/${repositoryName}/`,
  integrations: [sitemap()],
});
