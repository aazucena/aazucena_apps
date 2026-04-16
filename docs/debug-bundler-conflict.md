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

### Next step

Binary search inside Preloader's dependency tree.

**Hypothesis to test:** Comment out the Preloader import/usage, replace with a `<div>` placeholder → does the build pass?
If yes → the Preloader's transitive deps are the cause.
Next: comment out one dep at a time inside the Preloader component tree.
