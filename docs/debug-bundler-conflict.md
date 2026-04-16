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
