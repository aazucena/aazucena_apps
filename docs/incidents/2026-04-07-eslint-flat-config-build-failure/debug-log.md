# Bundler Conflict Debug Log

**Incident:** `2026-04-07-eslint-flat-config-build-failure`  
**Error:** `Expected ":" but found ")"` — esbuild parse failure on client chunks  
**Resolution:** `astro-no-client-minify` integration (TEST 17) — confirmed permanent 2026-04-17

---

## Error

```
Expected ":" but found ")"
_astro/index.!~{008}~.js:120275:111
esbuild@0.27.7
```

## Rules

- One change at a time
- Build after every change
- Record result here before next step

---

## Session 1 — Preloader chunk (`_astro/index.js`)

### Step 1 — Confirmed trigger (baseline)

**Change:** Preloader component commented out in `apps/portfolio/src/layouts/BaseLayout.astro`  
**Result:** Build PASSES ✅

**Change:** Preloader component uncommented  
**Result:** Build FAILS ❌

**Conclusion:** Preloader is the confirmed trigger.

---

### Step 2 — Island vs import

**Change:** Keep `import { Preloader } from "@aazucena/ui"` in frontmatter, comment out `<Preloader client:only="react" />` usage only  
**Result:** Build PASSES ✅

**Conclusion:** The frontmatter import (server-side) is fine. The error only occurs when Preloader is bundled as a React island via `client:only="react"`. Something in Preloader's transitive deps is CJS and only hits esbuild when bundled for the client.

---

### Step 3 — @aazucena/hooks isolated

**Change:** Preloader island re-enabled. `@aazucena/hooks` import commented out in `InteractivePreloader.tsx`, replaced with inline stubs.  
**Result:** Build FAILS ❌

**Conclusion:** `@aazucena/hooks` is NOT the CJS source. Remaining suspects: `@aazucena/icons`, `@aazucena/utils`, `../ui/button`, `../ui/card`, `./ui/index` sub-components.

---

### Step 4 — @aazucena/icons isolated

**Change:** `@aazucena/icons` commented out. `LoadingState`/`ReadyState`/`ErrorState` sub-components replaced with `<div>` stubs.  
**Result:** Build FAILS ❌

**Conclusion:** `@aazucena/icons` is NOT the CJS source. Remaining suspects: `@aazucena/utils`, `../ui/button`, `../ui/card`.

---

### Step 5 — @aazucena/utils isolated

**Change:** `@aazucena/utils` commented out in `InteractivePreloader.tsx`, stubs inline.  
**Result:** Build FAILS ❌

**Conclusion:** `@aazucena/utils` is NOT the CJS source. Remaining suspects: `../ui/button`, `../ui/card`, `SimplePreloader`.

---

### Step 6 — button/card isolated

**Change:** `../ui/button` and `../ui/card` stubbed in `InteractivePreloader.tsx`.  
**Result:** Build FAILS ❌

**Conclusion:** All direct imports of `InteractivePreloader` ruled out. Only remaining suspect: `SimplePreloader`.

---

### Step 7 — SimplePreloader isolated

**Change:** `SimplePreloader` import stubbed in `Preloader.tsx`.  
**Result:** Build FAILS ❌

**Conclusion:** `SimplePreloader` is NOT the source. The CJS package is being pulled from the `@aazucena/ui` barrel (`packages/ui/src/index.ts`) — the 225-component `export * from './components/ui/index'` that Vite cannot fully tree-shake.

---

### Step 8 — UI barrel confirmed as leak source (TEST 8 PASS)

**Change:** `BaseLayout.astro` import changed from barrel to direct subpath:

```ts
// Before
import { Preloader } from '@aazucena/ui';
// After
import { Preloader } from '@aazucena/ui/preloader';
```

**Result:** Build PASSES ✅ — index chunk fixed

**Fix applied:** Added `"./preloader": "./src/components/preloader/index.ts"` to `packages/ui/package.json` exports map.

**Key insight:** `export *` barrels + `client:only` islands = imperfect tree-shaking even with `"sideEffects": false`. Any `@aazucena/ui` import used as a React island should use a direct subpath.

---

## Session 2 — AnimationCanvas chunk (`_astro/AnimationCanvas.js`)

After restoring all debug-commented components, Vercel build failed on a NEW chunk.

```
Expected ":" but found ")"
_astro/AnimationCanvas.!~{00F}~.js:27942:100
esbuild@0.27.7
```

---

### Step 9 — AnimationCanvas import isolated

**Change:** `@aazucena/animations` barrel → `@aazucena/animations/pixi` direct subpath in `AnimationCanvas.tsx`

**Why:** Root `@aazucena/animations` barrel re-exports `./three/viewer/index` (ObjectViewer, ObjectViewerHUD, etc.) which import from `@aazucena/ui` barrel, pulling all 225 components into the chunk.

**Result:** Build FAILS ❌ at line 26613 (was 27942 — chunk shrank ~1329 lines)

**Conclusion:** Viewer→barrel removal confirmed (chunk smaller) but NOT sole CJS source.

---

### Step 10 — HomepageScene stubbed in AnimationCanvas

**Change:** `HomepageScene` import commented out, `<Canvas>` child replaced with `<mesh />` stub.  
**Result:** AnimationCanvas PASSES ✅ — error moved to NEW chunk: `_astro/HomepageSection.!~{00B}~.js:14384:138`

**Conclusion:** `HomepageScene` (or its deps) was the CJS source in AnimationCanvas chunk. `@react-three/fiber` + `AnimationParticles/pixi` + `@aazucena/context` are clean. HomepageSection is the new failing chunk — all section components import from `@aazucena/ui` barrel.

---

### Step 11 — HomepageSection: three section components stubbed

**Change:** `HeroSection.tsx`, `SkillsSection.tsx`, `ExperienceSection.tsx` barrel imports replaced with inline stubs.  
**Result:** Build FAILS ❌ at line 14169 (was 14384 — only 215 lines less)

**Conclusion:** Three section components were NOT the primary barrel source. Remaining: `AwardModal.tsx`, `SettingsPanel.tsx`, `NavigationButton.tsx`, `apps/portfolio/src/components/ui/index.ts`.

---

### Step 12 — TEST 12 (incomplete)

**Change:** AwardModal, SettingsPanel, NavigationButton stubs + ToolbarButton/ScrollDown re-exports commented out from `ui/index.ts`.  
**Result:** Build FAILS ❌ at Rollup resolution — `"ToolbarButton" is not exported`

**Conclusion:** Test incomplete — `NavigationToolbar.tsx` imports `ToolbarButton` from `~/components/ui` which was removed without a stub. Rollup died before esbuild ran.

---

### Step 12b — TEST 12b result

**Changes:** `NavigationToolbar.tsx` inline `ToolbarButton` stub, `UIOverlays.tsx` inline `ScrollDownIndicator` stub.  
**Result:** Build FAILS ❌ — esbuild error at `HomepageSection.!~{00B}~.js:13280:138`

Chunk shrank from 14169 → 13280 lines (~889 removed). Stubs DID remove some barrel content but did NOT eliminate all of it.

---

### Step 13 — TEST 13 result

**Changes:** Stubbed Progress (TechStackDistribution), IconRenderer (LearnMoreCard, WorkingStyleSection), MarkdownRenderer (EducationItem).  
**Result:** Build FAILS ❌ — esbuild error at `HomepageSection.!~{00D}~.js:13283:138`

Chunk: 13280 → 13283 (+3 lines — stub code added, no barrel removed). None of the 4 components are in the HomepageSection island tree.

**Conclusion:** All direct `from "@aazucena/ui"` imports in TSX files are now stubbed. CJS source is indirect — local sub-barrels or Navbar.tsx.

---

### Step 14 — tailwindPreset isolated (TEST 14)

**Change:** Commented out `export { default as tailwindPreset } from './tailwind'` in `packages/design-system/src/index.ts`.  
**Result:** Build FAILS ❌ — chunk size **identical** (13283 lines)

**Conclusion:** `tailwindPreset` had ZERO effect. CJS stubs in `astro.config.mjs` were already intercepting those packages. Remaining un-stubbed live import found:

```
apps/portfolio/src/components/ui/Navbar.tsx:4
import { ThemeToggle } from "@aazucena/ui";
```

---

### Step 15 — ThemeToggle isolated (TEST 15)

**Change:** Stubbed `ThemeToggle` in `Navbar.tsx` — last remaining un-stubbed `@aazucena/ui` barrel import.  
**Result:** Build FAILS ❌ — chunk **identical** (13283 lines)

**Conclusion:** ThemeToggle was NOT in the HomepageSection chunk. All `@aazucena/ui` barrel imports already fully excluded. The 13283 lines are the stable core of HomepageSection WITHOUT any barrel content. CJS source is in a direct npm dependency.

Full ESM audit of npm deps in tree: gsap, @gsap/react, @strapi/blocks-react-renderer, @tanstack/react-query, flexsearch, framer-motion, clsx, luxon, tailwind-merge, react-hook-form, culori, lodash-es, shiki/bundle/web, tailwindcss/colors — all confirmed ESM via conditional exports.

---

### Step 16 — shiki barrel export isolated (TEST 16)

**Plan:** Comment out `export * from './shiki'` from `packages/utils/src/index.ts`.  
**Result:** Build FAILS ❌ — same error (this test was interrupted/incomplete)

---

## ✅ TEST 17 — Root Cause Found: Astro 6 Environments Override `minify:false`

**Date:** 2026-04-17

**Hypothesis:** The root cause of ALL persistent esbuild errors is that `vite.build.minify: false` only applies to the legacy root Vite config. Astro 6 uses Vite's Environments API and **hardcodes `minify: true` for the client environment** in `astro/dist/core/build/static-build.js:284`, bypassing our root-level setting entirely.

**Root Cause Trace:**

1. `astro/dist/core/build/static-build.js:284`: `minify: true` hardcoded for `environments.client`
2. `vite/dist/node/chunks/dep-*.js:19353`: `const minify = config.build.minify === "esbuild"`
3. With `minify: true` (→ `"esbuild"`), `resolveEsbuildTranspileOptions` does NOT return `null`
4. The `vite:esbuild-transpile` render-chunk plugin RUNS on every client chunk
5. esbuild@0.27.7 encounters `@rollup/plugin-commonjs` async-module wrappers → `Expected ":" but found ")"`

**Why tests 12b–16 all showed the same error at the same line (13283:138):**
The binary search was removing barrel imports from different chunks, not from the stable HomepageSection chunk core (hooks → utils → design-system → CJS deps). The core was untouched, and esbuild was always running because of the environment override — not because of which imports were in the bundle.

**Fix Applied:** `astro-no-client-minify` integration in `apps/portfolio/astro.config.mjs`:

```js
{
  name: "astro-no-client-minify",
  hooks: {
    "astro:build:setup": ({ updateConfig }) => {
      updateConfig({
        environments: {
          client: { build: { minify: false } }
        },
      });
    },
  },
}
```

`astro:build:setup` fires after Astro assembles the environments config. `updateConfig` calls Vite's `mergeConfig` — primitive values in the second arg overwrite the first, so `minify: false` replaces `minify: true`. This re-enables the `(target === "esnext") && !minify` skip path in `resolveEsbuildTranspileOptions`, preventing esbuild from processing client chunks.

**Sanity check (2026-04-17):** Integration commented out and deployed to Vercel — build failed with identical error. Integration restored. **Confirmed permanent fix.**
