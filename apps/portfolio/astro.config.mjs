// @ts-check

import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import react from '@astrojs/react';
import sentry from '@sentry/astro';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      // @ts-ignore: Astro v6 is expected to ship with a compatible version of tailwindcss/vite
      tailwindcss()
    ],
  },

  integrations: [
    react(),
    sentry({
      project: process.env.PUBLIC_SENTRY_PROJECT,
      org: process.env.PUBLIC_SENTRY_ORG,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourceMapsUploadOptions: {
        enabled: process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production',
      },
    })
  ],

  adapter: vercel(),
});