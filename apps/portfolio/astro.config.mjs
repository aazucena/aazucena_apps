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
      // Use terser instead of esbuild for chunk minification.
      // esbuild fails with "Expected ':' but found ')'" on the JourneyDashboard
      // chunk — a parse error triggered by code patterns @rollup/plugin-commonjs
      // generates for CJS modules. Terser's parser handles these edge cases
      // correctly and produces an equivalent minified output.
      minify: "terser",
      // Disable modulePreload polyfill injection — the __vitePreload function
      // contains ternary operators that @rollup/plugin-commonjs mangles into
      // invalid JS, causing esbuild parse errors on chunks with dynamic imports.
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
      include: ["@mynaui/icons-react"],
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
      // prop-types is a pure CJS package (no ESM build). @rollup/plugin-commonjs
      // converts it and generates { default: X } patterns that esbuild's
      // render-chunk plugin can't parse. Intercept here with resolveId (runs
      // before @rollup/plugin-commonjs) and redirect to an ESM no-op shim.
      // resolve.alias is not reliable for node_modules imports in this pipeline.
      {
        name: "prop-types-shim",
        enforce: "pre",
        resolveId(id) {
          if (id === "prop-types") {
            return resolve(__dirname, "src/lib/prop-types-shim.mjs");
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
