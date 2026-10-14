import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Mirrors the COOP/COEP rules in public/_headers for `astro dev`: the multithreaded
// wasm runtime (SharedArrayBuffer) needs crossOriginIsolated.
const coopCoep = {
  name: 'gcdr-coop-coep',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = (req.url ?? '').split('?')[0];
      if (url.startsWith('/gcdr/') || /^\/(en\/)?simdgcdrnet\/playground(\/index\.html|\/)?$/.test(url)) {
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      }
      next();
    });
  },
};

export default defineConfig({
  site: 'https://sdcb.ai',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: { zh: 'zh-CN', en: 'en-US' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss(), coopCoep],
  },
});
