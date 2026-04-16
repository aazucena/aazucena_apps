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

### Next step — TEST 2

**Question:** Which of Preloader's deps is CJS?

**Plan:** Re-enable the `<Preloader client:only="react">` island. Inside `InteractivePreloader.tsx`, comment out the `@aazucena/hooks` import block and replace hook calls with hardcoded stubs.

- **PASS** → `@aazucena/hooks` (or its dep `@aazucena/design-system`) is pulling in CJS
- **FAIL** → the CJS package is somewhere else in the Preloader tree
