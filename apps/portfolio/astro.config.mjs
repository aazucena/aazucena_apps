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

      // CJS virtual stubs — intercept pure-CJS package imports at the resolveId level,
      // before @rollup/plugin-commonjs ever loads them. The transform approach (replacing
      // import statements) runs AFTER Rollup's resolution phase, so CJS packages were
      // already included in the module graph. Using resolveId + load intercepts at
      // resolution time: Rollup never loads the real CJS package.
      //
      // Virtual module convention: '\0' prefix signals to other plugins (e.g. commonjs)
      // that this is a virtual module and should not be treated as a file path.
      {
        name: "cjs-virtual-stubs",
        enforce: "pre",
        resolveId(id) {
          if (id === "handlebars") return "\0handlebars-stub";
          if (id === "leaflet") return "\0leaflet-stub";
          if (id === "d3-cloud") return "\0d3-cloud-stub";
        },
        load(id) {
          if (id === "\0handlebars-stub") {
            return `const Handlebars = { compile: () => () => '', registerHelper: () => {}, registerPartial: () => {} }; export default Handlebars;`;
          }
          if (id === "\0leaflet-stub") {
            return `
const L = {
  DivIcon: class DivIcon { constructor() {} },
  divIcon: () => ({}),
  icon: () => ({}),
  marker: () => ({}),
  map: () => ({}),
  tileLayer: () => ({}),
};
export default L;
`;
          }
          if (id === "\0d3-cloud-stub") {
            return `
const noop = () => api;
const api = { size: noop, words: noop, padding: noop, rotate: noop, font: noop, fontSize: noop, on: noop, start: noop };
const cloud = () => api;
export default cloud;
`;
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
