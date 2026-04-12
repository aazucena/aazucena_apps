// @ts-check

import { defineConfig } from "astro/config";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import { createRequire } from "module";

const _require = createRequire(import.meta.url);

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sentry from "@sentry/astro";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

import { visualizer } from "rollup-plugin-visualizer";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  // Set site URL for sitemap and RSS feed generation
  site: process.env.PUBLIC_SITE_URL || "https://aazucena.com",

  vite: {
    build: {
      // Terser replaces esbuild's render-chunk minification step.
      minify: "terser",
      // target:esnext disables Vite's vite:esbuild-transpile render-chunk plugin,
      // which runs a SEPARATE esbuild pass for build.target syntax lowering even
      // when minify:"terser" is set. That pass chokes on @rollup/plugin-commonjs
      // CJS interop patterns (handlebars, leaflet, d3-cloud) from @aazucena/*
      // barrel exports. esnext = no syntax lowering needed = esbuild is a no-op.
      target: "esnext",
      // Disable modulePreload — __vitePreload ternary patterns trigger the same
      // esbuild parse error when any CJS interop is present in the chunk.
      modulePreload: false,
    },
    resolve: {
      alias: {
        "@lib": resolve(__dirname, "src/lib"),
        "@config": resolve(__dirname, "src/config"),
        "@data": resolve(__dirname, "src/data"),
        "@hooks": resolve(__dirname, "src/hooks"),
        "@contexts": resolve(__dirname, "src/contexts"),
        "@templates": resolve(__dirname, "src/templates"),
        "@types": resolve(__dirname, "src/types"),
        "@components": resolve(__dirname, "src/components"),
        "@styles": resolve(__dirname, "src/styles"),
        "@layouts": resolve(__dirname, "src/layouts"),
        "@assets": resolve(__dirname, "src/assets"),
      },
    },
    optimizeDeps: {
      // Pre-bundle with esbuild before Rollup runs — produces clean ESM so
      // @rollup/plugin-commonjs never processes the individual .js icon sub-files
      // (which lack type:module and would otherwise generate invalid default-export
      // interop patterns that esbuild's render-chunk plugin can't parse).
      include: [
        "@mynaui/icons-react",
        // handlebars: pure CJS. Pulled via @aazucena/hooks barrel → useHandlebars.
        "handlebars",
        // leaflet: pure CJS (no type:module, no exports map). Pulled via
        // @aazucena/ui barrel → map.impl.tsx.
        "leaflet",
        // d3-cloud: pure CJS. Pulled via @aazucena/ui barrel → D3 visualizations.
        "d3-cloud",
      ],
      exclude: [
        "astro/toolbar",
        "astro:toolbar:internal",
        "astro:toolbar",
        "astro:xray",
        "astro:audit",
        "astro/runtime/client/dev-toolbar/entrypoint.js",
        "/@id/astro/runtime/client/dev-toolbar/astro_runtime_client_dev-toolbar_entrypoint__js.js.map",
      ],
    },
    ssr: {
      // Process @aazucena/* workspace packages from TypeScript source
      // (Astro/Vite equivalent of Next.js transpilePackages)
      noExternal: [/@aazucena\//],
    },
    plugins: [
      // Restore Vite 7's @vite/env resolution lost in Astro's config merge
      {
        name: "vite-env-resolve",
        enforce: "pre",
        resolveId(id) {
          if (id === "@vite/env")
            return _require.resolve("vite/dist/client/env.mjs");
        },
        transform(code, id) {
          if (id.endsWith("env.mjs") && code.includes("__DEFINES__")) {
            return { code: code.replace(/__DEFINES__/g, "{}"), map: null };
          }
        },
      },
      // [DISABLED] prop-types shim — was needed when IconRenderer with client:load
      // dragged prop-types (CJS) into client chunks, causing esbuild parse errors.
      // Root cause fixed (removed client directives from static IconRenderer usages).
      // Leaving commented out to restore React dev-mode prop warnings from @mynaui.
      // {
      //   name: "prop-types-shim",
      //   ...
      // },

      // CJS shims — intercept pure-CJS package imports before @rollup/plugin-commonjs
      // generates interop wrappers that esbuild can't parse. Each shim targets the
      // exact source file that imports the CJS package, replacing it with an ESM
      // no-op or minimal stub so the module graph resolves without CJS interop code.
      {
        name: "handlebars-shim",
        enforce: "pre",
        transform(code, id) {
          if (id.includes("useHandlebars") && code.includes("'handlebars'")) {
            return {
              code: code.replace(
                /import Handlebars from ['"]handlebars['"]/,
                `const Handlebars = { compile: () => () => '', registerHelper: () => {}, registerPartial: () => {} }`,
              ),
              map: null,
            };
          }
        },
      },
      {
        name: "leaflet-shim",
        enforce: "pre",
        transform(code, id) {
          if (id.includes("map.impl") && code.includes("'leaflet'")) {
            return {
              code: code.replace(
                /import L from ['"]leaflet['"]/,
                `const L = {}`,
              ),
              map: null,
            };
          }
        },
      },
      {
        name: "d3-cloud-shim",
        enforce: "pre",
        transform(code, id) {
          if (id.includes("useWordCloud") && code.includes("'d3-cloud'")) {
            return {
              code: code.replace(
                /import cloud from ['"]d3-cloud['"]/,
                `const cloud = () => ({ size: () => ({}), words: () => ({}), padding: () => ({}), rotate: () => ({}), font: () => ({}), fontSize: () => ({}), on: () => ({}), start: () => ({}) })`,
              ),
              map: null,
            };
          }
        },
      },
      // @ts-ignore: Astro v6 is expected to ship with a compatible version of tailwindcss/vite
      tailwindcss(),
      ,
      visualizer({ open: false, filename: "dist/stats.html", gzipSize: true }),
    ],
  },

  integrations: [
    react(),
    sitemap({
      // Exclude admin routes, API routes, and draft content
      filter: (page) =>
        !page.includes("/admin") &&
        !page.includes("/api/") &&
        !page.includes("/draft"),
      // Customize sitemap entries
      customPages: [],
      // Change frequency hints for search engines
      changefreq: "weekly",
      priority: 0.7,
      // Last modification time
      lastmod: new Date(),
    }),
    sentry({
      project: process.env.PUBLIC_SENTRY_PROJECT,
      org: process.env.PUBLIC_SENTRY_ORG,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourceMapsUploadOptions: {
        enabled:
          process.env.VERCEL_ENV === "production" ||
          process.env.NODE_ENV === "production",
      },
    }),
  ],

  adapter: vercel(),
});
