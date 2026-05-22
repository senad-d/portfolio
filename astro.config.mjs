/// <reference types="node" />
// @ts-check
import { defineConfig } from 'astro/config';

const repositoryName = 'portfolio';
const useCustomDomain = process.env.PUBLIC_USE_CUSTOM_DOMAIN === 'true';

const site = useCustomDomain
  ? (process.env.PUBLIC_SITE_URL ?? 'https://example.com/')
  : 'https://senad.github.io/';

// https://astro.build/config
export default defineConfig({
  site,
  base: useCustomDomain ? '/' : `/${repositoryName}/`,
});
