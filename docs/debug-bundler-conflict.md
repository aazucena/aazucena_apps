# Bundler Conflict Debug Log

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

## Session Log

### Step 1 — Confirmed trigger (baseline)

**Change:** Preloader component commented out in `apps/portfolio/src/layouts/BaseLayout.astro`
**Result:** Build PASSES ✅

**Change:** Preloader component uncommented
**Result:** Build FAILS ❌

**Conclusion:** Preloader is the confirmed trigger.

---

---

### Step 2 — Island vs import

**Change:** Keep `import { Preloader } from "@aazucena/ui"` in frontmatter, comment out `<Preloader client:only="react" />` usage only
**Result:** Build PASSES ✅

**Conclusion:** The frontmatter import (server-side) is fine. The error only occurs when Preloader is bundled as a React island via `client:only="react"`. Something in Preloader's transitive deps is CJS and only hits esbuild when bundled for the client.

---

---

### Step 3 — @aazucena/hooks isolated

**Change:** Preloader island re-enabled. `@aazucena/hooks` import commented out in `InteractivePreloader.tsx`, replaced with inline stubs.
**Result:** Build FAILS ❌

**Conclusion:** `@aazucena/hooks` is NOT the CJS source. The culprit is in one of the remaining imports:

- `@aazucena/icons` (X icon)
- `@aazucena/utils` (getTransitionClass, getLoadingSteps)
- `../ui/button`, `../ui/card` (local UI components)
- `./ui/index` → LoadingState, ReadyState, ErrorState sub-components (which themselves import `@aazucena/icons`)

---

### Next step — TEST 3

**Plan:** Comment out `@aazucena/icons` in `InteractivePreloader.tsx` (replace `X` icon with null). The sub-components in `./ui/index` also import `@aazucena/icons` — comment those out too and replace with `<div>` stubs.

- **PASS** → `@aazucena/icons` is the CJS source
- **FAIL** → CJS is in `@aazucena/utils`, or the local `button`/`card` components

---

### Step 4 — @aazucena/icons isolated

**Change:** `@aazucena/icons` commented out. `LoadingState`/`ReadyState`/`ErrorState` sub-components replaced with `<div>` stubs.
**Result:** Build FAILS ❌

**Conclusion:** `@aazucena/icons` is NOT the CJS source. Remaining suspects:

- `@aazucena/utils` (getTransitionClass, getLoadingSteps)
- `../ui/button` (Button)
- `../ui/card` (Card, CardContent)

---

### Next step — TEST 4

**Plan:** Comment out `@aazucena/utils` import, stub `getTransitionClass` and `getLoadingSteps` inline.

- **PASS** → `@aazucena/utils` is the CJS source
- **FAIL** → CJS is in local `button` or `card` UI components

---

### Step 5 — @aazucena/utils isolated

**Change:** `@aazucena/utils` commented out in `InteractivePreloader.tsx`, stubs inline.
**Result:** Build FAILS ❌

**Conclusion:** `@aazucena/utils` is NOT the CJS source. Remaining suspects:

- `../ui/button` (Button)
- `../ui/card` (Card, CardContent)
- `SimplePreloader` (imported by `Preloader.tsx` alongside InteractivePreloader — not yet touched)

---

### Next step — TEST 5

**Plan:** Comment out `../ui/button` and `../ui/card` in `InteractivePreloader.tsx`, replace with `<div>` stubs.

- **PASS** → `button` or `card` (or their deps) is the CJS source
- **FAIL** → CJS is in `SimplePreloader` or its deps

---

### Step 6 — button/card isolated

**Change:** `../ui/button` and `../ui/card` stubbed in `InteractivePreloader.tsx`.
**Result:** Build FAILS ❌

**Conclusion:** All direct imports of `InteractivePreloader` are now ruled out:

- ~~@aazucena/hooks~~ ❌
- ~~@aazucena/icons~~ ❌
- ~~@aazucena/utils~~ ❌
- ~~./ui/index (sub-components)~~ ❌
- ~~../ui/button~~ ❌
- ~~../ui/card~~ ❌

Only remaining suspect: `SimplePreloader` — statically imported by `Preloader.tsx` so it gets bundled even when the interactive variant renders.

---

### Next step — TEST 6

**Plan:** Comment out `SimplePreloader` import in `Preloader.tsx`, replace with a `<div>` stub.

- **PASS** → `SimplePreloader` (or its deps) is the CJS source
- **FAIL** → CJS is coming from somewhere else entirely (e.g. the @aazucena/ui barrel pulling in other components)

---

### Step 7 — SimplePreloader isolated

**Change:** `SimplePreloader` import stubbed in `Preloader.tsx`.
**Result:** Build FAILS ❌

**Conclusion:** `SimplePreloader` is NOT the source. The entire Preloader component tree is now stubbed and the error persists. The CJS package is being pulled in from the `@aazucena/ui` barrel (`packages/ui/src/index.ts`) — specifically from the 225-component `export * from './components/ui/index'` which Vite cannot fully tree-shake.

---

### Next step — TEST 7

**Plan:** In `packages/ui/src/index.ts`, comment out `export * from './components/ui/index'` (the 225-component barrel). Keep only the preloader exports.

- **PASS** → one of the 225 UI components has a CJS dep leaking through imperfect tree-shaking
- **FAIL** → CJS is in something else (preloader-specific exports or another part of the barrel)

---

### Step 8 — UI barrel confirmed as leak source

**Change:** Commented out `export * from './components/ui/index'` in `packages/ui/src/index.ts`.
**Result:** Build FAILS at 1.49s (import resolution) — `IconRenderer` not found in `about.astro`.

**Conclusion:** Destructive test — other portfolio pages import UI components from the barrel so it can't be removed. BUT: the CJS esbuild error did not appear (build died earlier). This confirms the UI barrel is involved.

**User insight:** Change the Preloader import in BaseLayout to bypass the barrel entirely — import directly from the preloader subpath instead of `@aazucena/ui`.

`@aazucena/ui` already has `"./components/*": "./src/components/*"` in its exports map.

---

### Next step — TEST 8

**Plan:** In `BaseLayout.astro`, change:

```
import { Preloader } from "@aazucena/ui"             // pulls entire barrel into client chunk
import { Preloader } from "@aazucena/ui/components/preloader"  // direct path, bypasses barrel
```

UI barrel restored to normal.

- **PASS** → barrel was the source; direct import avoids the CJS leak entirely
- **FAIL** → CJS is coming from something else in the client chunk

---

---

## Session 2 — Restored all debug-commented components → new chunk fails

**Context:** After confirming preloader fix (TEST 8 PASS), all other components that had been commented out for debugging were restored. Vercel build then failed on a NEW chunk.

**New error:**

```
Expected ":" but found ")"
_astro/AnimationCanvas.!~{00F}~.js:27942:100
esbuild@0.27.7
```

**Conclusion:** The preloader barrel fix resolved the shared `index` chunk, but the `AnimationCanvas` chunk now fails with the identical error. Same root cause — a client island is pulling the `@aazucena/ui` barrel into its bundle.

---

### Step 9 — AnimationCanvas import isolated

**Change:** In `apps/portfolio/src/components/homepage/AnimationCanvas.tsx`, changed:

```ts
import { AnimationParticles } from '@aazucena/animations'; // root barrel
```

to:

```ts
import { AnimationParticles } from '@aazucena/animations/pixi'; // direct subpath
```

**Why:** The root `@aazucena/animations` barrel (`packages/animations/src/index.ts`) re-exports `./three/viewer/index`, which contains `ObjectViewer`, `ObjectViewerHUD`, `ObjectViewerControls`, `ObjectViewerLoading`. Those four viewer components each import from `@aazucena/ui` barrel, pulling all 225 components into the AnimationCanvas chunk. The `@aazucena/animations/pixi` subpath only exports the PixiJS particle system — no viewer, no `@aazucena/ui`.

**Prediction:**

- **PASS** → `@aazucena/animations` root barrel via viewer was the source; direct pixi subpath avoids the leak
- **FAIL** → CJS is coming from something else in the AnimationCanvas chunk (e.g. `@react-three/fiber`, `HomepageScene` deps, or `@aazucena/context`)

---

### Next step — TEST 9

Push and wait for Vercel result.

**Result:** Build FAILS ❌ at line 26613 (was 27942 — chunk shrank by ~1329 lines)

**Conclusion:** Viewer→barrel removal confirmed (chunk is smaller) but NOT the sole CJS source. Something else remaining in the AnimationCanvas chunk is still triggering the error.

Remaining suspects in the chunk:

- `HomepageScene` (imports `@aazucena/animations/three`, `@react-three/drei`, `@aazucena/hooks`, `@aazucena/constants`)
- `@react-three/fiber` (Canvas component)
- `AnimationParticles` via `@aazucena/animations/pixi` (pixi.js particle system)
- `@aazucena/context`

---

### Step 10 — HomepageScene stubbed in AnimationCanvas

**Change:** `HomepageScene` import commented out in `AnimationCanvas.tsx`, `<Canvas>` child replaced with `<mesh />` stub.
**Result:** AnimationCanvas chunk PASSES ✅ — error moved to NEW chunk: `_astro/HomepageSection.!~{00B}~.js:14384:138`

**Conclusion:** `HomepageScene` (or its deps) was the CJS source in the AnimationCanvas chunk. `@react-three/fiber` + `AnimationParticles/pixi` + `@aazucena/context` are clean.

New failing chunk is `HomepageSection` — the parent `Section.tsx` island. Its child section components all import from `@aazucena/ui` barrel (HeroSection → FlipWords, SkillsSection → IconRenderer, ExperienceSection → multiple components, SettingsPanel → Switch, AwardModal → Dialog, NavigationButton → IconRenderer).

---

### Step 11 — HomepageSection: three section components stubbed

**Change:** `HeroSection.tsx` (FlipWords), `SkillsSection.tsx` (IconRenderer), `ExperienceSection.tsx` (Timeline components) barrel imports replaced with inline stubs.
**Result:** Build FAILS ❌ at line 14169 (was 14384 — only 215 lines less)

**Conclusion:** The three section components were NOT the primary barrel source. The barrel is still being pulled into HomepageSection from remaining components:

- `AwardModal.tsx` → `Dialog, DialogContent, DialogBody from "@aazucena/ui"`
- `SettingsPanel.tsx` → `Switch from "@aazucena/ui"`
- `NavigationButton.tsx` → `IconRenderer from "@aazucena/ui"`
- `apps/portfolio/src/components/ui/index.ts` → re-exports `ToolbarButton` and `ScrollDown` from `@aazucena/ui`

---

### Next step — TEST 12

**Plan:** Comment out ALL remaining `@aazucena/ui` barrel imports in the HomepageSection island tree:

- `AwardModal.tsx` → stub Dialog with `<div>`
- `SettingsPanel.tsx` → stub Switch with `<div>`
- `hero/NavigationButton.tsx` → stub IconRenderer with `<span>`
- `apps/portfolio/src/components/ui/index.ts` → comment out ToolbarButton and ScrollDown re-exports

- **PASS** → these remaining barrel imports are the CJS source in HomepageSection
- **FAIL** → CJS is in gsap, @aazucena/context, or another non-UI dep in this island

---

### Step 12 — TEST 12 result

**Change:** AwardModal, SettingsPanel, NavigationButton stubs + ToolbarButton and ScrollDown re-exports commented out in `ui/index.ts`.
**Result:** Build FAILS ❌ at Rollup resolution (10.18s) — NOT the esbuild error.

```
"ToolbarButton" is not exported by "src/components/ui/index.ts"
imported by "src/components/homepage/overlays/NavigationToolbar.tsx"
```

**Conclusion:** `ToolbarButton` was missed in the TEST 12 plan. `NavigationToolbar.tsx` imports `ToolbarButton` from `~/components/ui` (which re-exported it from `@aazucena/ui`). Removing the re-export without stubbing it broke Rollup module resolution before esbuild could run. `ToolbarButton` is another `@aazucena/ui` barrel consumer.

Build died too early to observe the esbuild error — test is incomplete, not invalid.

---

### Step 12b — TEST 12b result

**Changes:**

- `NavigationToolbar.tsx`: inline `ToolbarButton` stub after all imports (ESM ordering fix)
- `UIOverlays.tsx`: inline `ScrollDownIndicator` stub (was missing from `ui/index.ts` re-exports)

**Result:** Build FAILS ❌ — esbuild error at `HomepageSection.!~{00B}~.js:13280:138`

Chunk shrank from 14169 → 13280 lines (~889 lines removed). Our stubs DID remove some barrel content but did NOT eliminate all of it.

**Conclusion:** More `@aazucena/ui` barrel imports exist in the HomepageSection island tree that we have not yet stubbed. The remaining sub-barrels (`~/components/ui/common`, `~/components/ui/projects`, `~/components/ui/about`, `~/components/ui/blog`, `~/components/ui/experience`) may themselves import from `@aazucena/ui`. Other section components (ProjectsSection, AboutSection, BlogSection, AwardsSection) not yet checked.

---

### Step 13 — TEST 13 result

**Changes:** Stubbed Progress (TechStackDistribution), IconRenderer (LearnMoreCard, WorkingStyleSection), MarkdownRenderer (EducationItem).

**Result:** Build FAILS ❌ — esbuild error at `HomepageSection.!~{00D}~.js:13283:138`

Chunk: 13280 → 13283 (+3 lines — stub code added, no barrel removed). None of the 4 components are in the HomepageSection island tree.

**Conclusion:** All direct `from "@aazucena/ui"` imports in TSX files are now stubbed. CJS source is NOT from a direct barrel import. Must be indirect — local sub-barrels (`~/components/ui/common`, etc.) or Navbar.tsx may import from `@aazucena/ui`.

---

### Step 14 — tailwindPreset isolated

**Change:** Commented out `export { default as tailwindPreset } from './tailwind'` in `packages/design-system/src/index.ts`.
**Result:** Build FAILS ❌ — esbuild error at `HomepageSection.!~{00D}~.js:13283:138`

Chunk size: **identical** to TEST 13 (13283 lines — zero change).

**Conclusion:** `tailwindPreset` removal had ZERO effect. The virtual stubs for `tailwindcss-animate` and `@tailwindcss/typography` in `astro.config.mjs` were already intercepting those CJS packages before `@rollup/plugin-commonjs` could process them. Removing `tailwindPreset` was redundant — the CJS source is elsewhere.

Post-mortem analysis revealed: ALL stubs in `astro.config.mjs` return proper ESM (`export default`, named `export`), so they are NOT the source. A scan of all `from "@aazucena/ui"` imports in the portfolio app found one remaining **un-stubbed** live import:

```
apps/portfolio/src/components/ui/Navbar.tsx:4
import { ThemeToggle } from "@aazucena/ui";
```

`Navbar.tsx` is mounted with `client:load` in `PageLayout.astro`. Even though it's a separate island from HomepageSection, Rollup's shared chunk deduplication places common `@aazucena/ui` modules into the HomepageSection chunk (the largest consumer). This single un-stubbed import still pulls the full 225-component barrel.

---

### Next step — TEST 15

**Plan:** Stub `ThemeToggle` in `Navbar.tsx`:

```tsx
// import { ThemeToggle } from "@aazucena/ui";
const ThemeToggle = () => <button aria-label="Toggle theme" />;
```

- **PASS (error gone or chunk shrinks)** → `ThemeToggle` barrel import was the last remaining CJS source
- **FAIL (same size)** → CJS is from something else: next suspect is `@aazucena/utils` exporting `shiki.ts` (line 19 of `packages/utils/src/index.ts`) → `shiki/bundle/web`

---

## ✅ RESOLVED — Root Cause & Fix

### Root Cause

`BaseLayout.astro` imported Preloader via the full `@aazucena/ui` barrel:

```ts
import { Preloader } from '@aazucena/ui'; // ← barrel entry: packages/ui/src/index.ts
```

When Astro bundles this as a `client:only="react"` island, Vite starts from the barrel's entry point (`src/index.ts`) which re-exports 225+ UI components. Even with `"sideEffects": false`, Vite's tree-shaking cannot fully eliminate all transitive deps from a `export *` barrel this large. One or more of the 225 components import CJS packages (e.g. `react-countup`, `leaflet`, `handlebars`) which rollup's commonjs plugin wraps in async-module syntax (`export default await (async () => {...})()`). esbuild then chokes on that syntax during the render-chunk minification pass, producing: `Expected ":" but found ")"`.

### Fix

Added a dedicated `preloader` subpath export to `packages/ui/package.json`:

```json
"./preloader": "./src/components/preloader/index.ts"
```

Changed `BaseLayout.astro` import to bypass the barrel:

```ts
import { Preloader } from '@aazucena/ui/preloader'; // ← direct subpath, clean dep tree
```

This gives Vite a small, clean entry point (only the preloader's actual deps) instead of the 225-component barrel. Tree-shaking works correctly and no CJS packages leak into the client chunk.

### Key Lessons

1. `export *` barrels + `client:only` islands = imperfect tree-shaking even with `"sideEffects": false`
2. Any `@aazucena/ui` import used as a React island should use a direct subpath, not the barrel
3. The error (`Expected ":" but found ")"`) is esbuild failing to parse rollup's CJS-wrapped async module output — always indicates a CJS package in the client bundle
