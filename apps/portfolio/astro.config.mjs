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
      //
      // Global stubs — leaflet is stubbed globally because react-leaflet and
      // @react-leaflet/core are in the shared React island bundle and import
      // from 'leaflet' at runtime. All named exports used across both packages
      // are listed here (identified by grepping compiled lib/*.js output).
      {
        name: "cjs-virtual-stubs",
        enforce: "pre",
        resolveId(id) {
          if (id === "handlebars") return "\0handlebars-stub";
          if (id === "leaflet") return "\0leaflet-stub";
          if (id === "d3-cloud") return "\0d3-cloud-stub";
          // tailwindcss/colors.js uses an explicit .js extension which bypasses
          // the exports map, hitting the CJS dist/colors.js directly.
          // Redirect to a virtual ESM proxy so @rollup/plugin-commonjs never sees it.
          if (id === "tailwindcss/colors.js")
            return "\0tailwindcss-colors-redirect";
        },
        load(id) {
          if (id === "\0handlebars-stub") {
            return `const Handlebars = { compile: () => () => '', registerHelper: () => {}, registerPartial: () => {} }; export default Handlebars;`;
          }
          if (id === "\0leaflet-stub") {
            return `
const noop = () => {};
// Base stub class — all Leaflet layer/control classes extend this
class S {
  constructor() {}
  on() { return this; } off() { return this; } once() { return this; }
  addTo() { return this; } remove() {} fire() { return this; }
  setZIndex() { return this; } setOpacity() { return this; }
  setLatLng() { return this; } setIcon() { return this; }
  bindPopup() { return this; } bindTooltip() { return this; }
  openPopup() { return this; } closePopup() { return this; }
  setContent() { return this; }
}
export class Circle extends S {}
export class CircleMarker extends S {}
export class FeatureGroup extends S {}
export class GeoJSON extends S {}
export class ImageOverlay extends S {}
export class LayerGroup extends S {}
export class Marker extends S {}
export class Polygon extends S {}
export class Polyline extends S {}
export class Popup extends S {}
export class Rectangle extends S {}
export class SVGOverlay extends S {}
export class Tooltip extends S {}
export class VideoOverlay extends S {}
export class Map extends S {
  setView() { return this; } fitBounds() { return this; }
  getCenter() { return { lat: 0, lng: 0 }; }
  getZoom() { return 0; } getBounds() { return new LatLngBounds(); }
  getSize() { return { x: 0, y: 0 }; } getPixelBounds() { return {}; }
  latLngToContainerPoint() { return { x: 0, y: 0 }; }
  containerPointToLatLng() { return { lat: 0, lng: 0 }; }
}
export class TileLayer extends S {
  static WMS = class extends S {}
}
// Control is an object with sub-classes, not a plain constructor
export const Control = Object.assign(class Control extends S {}, {
  Attribution: class extends S {},
  Zoom: class extends S {},
  Scale: class extends S {},
  Layers: class extends S {},
});
export const DomUtil = {
  addClass: noop, removeClass: noop, hasClass: () => false,
  create: () => (typeof document !== 'undefined' ? document.createElement('div') : {}),
  remove: noop, empty: noop, toFront: noop, toBack: noop,
  setOpacity: noop, getStyle: () => null, testProp: () => null,
  TRANSFORM: '', TRANSITION: '', TRANSITION_END: '',
};
export class LatLngBounds {
  constructor() {}
  isValid() { return false; } equals() { return false; }
  contains() { return false; } intersects() { return false; }
  getCenter() { return { lat: 0, lng: 0 }; }
  getSouthWest() { return { lat: 0, lng: 0 }; }
  getNorthEast() { return { lat: 0, lng: 0 }; }
  toBBoxString() { return ''; } extend() { return this; } pad() { return this; }
}
const L = {
  Circle, CircleMarker, Control, DomUtil, FeatureGroup, GeoJSON,
  ImageOverlay, LatLngBounds, LayerGroup, Map, Marker, Polygon,
  Polyline, Popup, Rectangle, SVGOverlay, TileLayer, Tooltip, VideoOverlay,
  DivIcon: class DivIcon extends S {},
  divIcon: () => ({}), icon: () => ({}), marker: () => ({}),
  map: () => ({}), tileLayer: () => ({}),
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
          if (id === "\0tailwindcss-colors-redirect") {
            // Redirect explicit tailwindcss/colors.js (CJS) to the ESM version via
            // the exports map. The explicit .js extension bypasses the exports map,
            // causing @rollup/plugin-commonjs to wrap the CJS file. This re-export
            // ensures Vite resolves via the exports map (import → dist/colors.mjs).
            return `export { default } from 'tailwindcss/colors';`;
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
