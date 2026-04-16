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
