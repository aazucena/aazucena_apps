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
      // esbuild cannot parse the async-module wrapper patterns that
      // @rollup/plugin-commonjs generates for CJS packages (handlebars, leaflet,
      // d3-cloud). The vite:esbuild-transpile render-chunk plugin fails with
      // "Expected ':' but found ')'" in the shared island chunk.
      //
      // Fix: target:esnext + minify:false → Vite's resolveEsbuildTranspileOptions
      // returns null (skips esbuild) when target==="esnext" && !minify.
      // The CJS stubs (resolveId+load virtual modules) replace the real CJS
      // packages with pure ESM, so runtime behaviour is correct.
      //
      // NOTE: This only affects the root/legacy Vite config. Astro 6 uses Vite
      // Environments API and hardcodes minify:true for the client environment in
      // astro/dist/core/build/static-build.js. The astro-no-client-minify integration
      // below overrides that via astro:build:setup → updateConfig.
      //
      // modulePreload:false — __vitePreload ternary patterns trigger the same error
      // if minify were ever re-enabled.
      target: "esnext",
      minify: false,
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
      include: [],
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
      // [DISABLED] prop-types shim — was needed when IconRenderer with client:load
      // dragged prop-types (CJS) into client chunks, causing esbuild parse errors.
      // Root cause fixed (removed client directives from static IconRenderer usages).
      // Leaving commented out to restore React dev-mode prop warnings from @mynaui.
      // {
      //   name: "prop-types-shim",
      //   ...
      // },

      // @ts-ignore: Astro v6 is expected to ship with a compatible version of tailwindcss/vite
      tailwindcss(),
      ,
      visualizer({ open: false, filename: "dist/stats.html", gzipSize: true }),
    ],
  },

  integrations: [
    // Astro 6 uses Vite Environments API and hardcodes minify:true for the client
    // environment (astro/dist/core/build/static-build.js:284). This overrides the
    // root-level vite.build.minify:false above and causes esbuild to run on client
    // chunks — where @rollup/plugin-commonjs async-module wrappers fail to parse.
    //
    // The astro:build:setup hook runs after Astro assembles the environments config
    // and calls updateConfig (Vite's mergeConfig) to override minify:false, which
    // re-enables the (target==="esnext" && !minify) skip path in Vite's
    // resolveEsbuildTranspileOptions, preventing esbuild from processing client chunks.
    {
      name: "astro-no-client-minify",
      hooks: {
        "astro:build:setup": ({ updateConfig }) => {
          updateConfig({
            environments: {
              client: {
                build: {
                  minify: false,
                },
              },
            },
          });
        },
      },
    },
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
