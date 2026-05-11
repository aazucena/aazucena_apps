# Incident: ESLint Flat Config + Bundler Conflicts Block All Vercel Deployments

**Date:** 2026-04-07  
**Branch:** `phase-4/developer-experience`  
**Root Cause Commit:** `640bb9146d5b740300a2d4cc3fe7c08fe611473e`  
**Severity:** All Vercel deployments failing (20+ consecutive ERROR states)  
**Resolution:** Reverted to last known good state (`5e0f443`), selectively cherry-picked clean commits; later confirmed `astro-no-client-minify` as the permanent bundler fix (2026-04-17)

---

## Files

| File               | Contents                                                    |
| ------------------ | ----------------------------------------------------------- |
| `README.md`        | This file — incident summary, root cause, resolution, rules |
| `debug-log.md`     | Step-by-step debug session (17 tests across two sessions)   |
| `post-incident.md` | Gemini CLI follow-up session + remaining technical debt     |

---

## What Happened

Two independent breaking changes landed in a single commit (`640bb91`) to
`packages/config/src/eslint/nextjs.js`, fatally breaking `next build` inside `apps/analytics`
and cascading through `turbo build` to fail every Vercel deployment.

A separate, pre-existing bundler conflict (`Expected ":" but found ")"`) was also present — caused
by Astro 6 hardcoding `minify: true` for the Vite client environment, causing esbuild to process
`@rollup/plugin-commonjs` async-module wrappers it cannot parse.

---

## Breaking Change 1 — Phantom ESLint Rule Names

```js
// Added to rules block — these rules DO NOT EXIST in eslint-plugin-react-hooks@7.x
'react-hooks/set-state-in-effect': 'off',
'react-hooks/refs': 'off',
```

`eslint-plugin-react-hooks` v7 only ships two rules: `rules-of-hooks` and `exhaustive-deps`.
ESLint 9 flat config throws a fatal error at config load time for unknown rule names. ESLint 8
silently ignored them — the upgrade made this visible.

---

## Breaking Change 2 — `**/*.mjs` as a Global Ignore

```js
{
  ignores: ['**/*.mjs'];
} // standalone object = global ignore in ESLint 9
```

In ESLint 9 flat config, a config object with **only** an `ignores` key applies globally to
every file in the entire config. `apps/analytics/eslint.config.mjs` is itself a `.mjs` file —
ESLint silently excluded its own config entry point.

| Pattern                                                               | Behavior                       |
| --------------------------------------------------------------------- | ------------------------------ |
| `{ ignores: ['**/*.mjs'] }` — standalone                              | **Global** — affects all files |
| `{ files: ['**/*.ts'], ignores: ['**/*.mjs'], rules: {...} }` — mixed | **Scoped** — only within block |

---

## Bundler Root Cause — Astro 6 Environment Override

`astro/dist/core/build/static-build.js:284` hardcodes `minify: true` for
`vite.environments.client`, bypassing the root-level `vite.build.minify: false`. esbuild's
render-chunk pass then runs on all client chunks and fails to parse
`@rollup/plugin-commonjs` async-module wrappers.

**Fix:** `astro-no-client-minify` integration in `astro.config.mjs` hooks into
`astro:build:setup` and calls `updateConfig({ environments: { client: { build: { minify: false } } } })`,
overriding `minify: true` after Astro assembles environments config.

**Confirmed permanent** (2026-04-17): sanity-check deployment without the integration
reproduced the error deterministically.

---

## Why It Was Hard to Debug

`@aazucena/icons` re-exports `export *` from both `@mynaui/icons-react` and
`@icons-pack/react-simple-icons`, generating 40+ "Ambiguous external namespace resolution"
warnings per build. These consumed the Vercel 200-event log API cap on every fetch, making
the actual fatal error invisible. All fix attempts were effectively blind.

---

## Resolution

1. Hard reset `phase-4/developer-experience` to `5e0f443` (last known good state)
2. Cherry-picked only verified clean commits:
   - `eb4904e` — docs: update pnpm version references
   - `ffaeda2` — fix(ci): correct Turborepo filter name for Storybook build job
   - `6bb35cc` — ci: restrict verify_changesets job to main branch only
   - `89d9f7e` — fix(analytics): resolve 25 lint errors blocking CI pipeline
3. Added `astro-no-client-minify` integration — confirmed permanent fix 2026-04-17

---

## Rules Going Forward

### 1. Never add ESLint rules without verifying they exist

```bash
node -e "console.log(Object.keys(require('eslint-plugin-react-hooks').rules))"
# Output: [ 'rules-of-hooks', 'exhaustive-deps' ]
```

### 2. Understand ESLint 9 flat config global vs. scoped ignores

To safely ignore `.mjs` files from TS type-checking only:

```js
{ files: ['**/*.mjs'], languageOptions: { parserOptions: { project: false } } }
```

### 3. Run ESLint locally before pushing shared config changes

`@aazucena/config` affects every app. Always validate:

```bash
cd apps/analytics && pnpm exec eslint --print-config src/app/page.tsx
cd apps/portfolio && pnpm exec eslint --print-config src/pages/index.astro
```

### 4. When Vercel logs are truncated, bisect instead of guessing

```bash
git checkout -b debug <last-good-sha>
git cherry-pick <suspect-sha>
git push origin debug
# Fail = confirmed root cause
```

### 5. Suppress `@aazucena/icons` namespace warning noise

Add to `apps/portfolio/astro.config.mjs`:

```js
build: {
  rollupOptions: {
    onwarn(warning, warn) {
      if (warning.code === 'AMBIGUOUS_EXTERNAL_NAMESPACE') return;
      warn(warning);
    },
  },
},
```

---

## Affected Files

| File                                                  | Change                               | Safe to reintroduce?                        |
| ----------------------------------------------------- | ------------------------------------ | ------------------------------------------- |
| `packages/config/src/eslint/nextjs.js`                | Phantom rules + global `.mjs` ignore | Yes, with correct patterns                  |
| `apps/portfolio/astro.config.mjs`                     | `astro-no-client-minify` integration | Yes — confirmed permanent fix               |
| `packages/ui/src/components/ui/markdown-renderer.tsx` | Shiki lazy-init restored             | Yes — no top-level await                    |
| `packages/hooks/src/data/useHandlebars.ts`            | Lazy `import('handlebars')`          | Yes — keeps handlebars out of client bundle |
| Multiple `package.json` files                         | `sideEffects: false`                 | Yes — enables tree-shaking                  |
