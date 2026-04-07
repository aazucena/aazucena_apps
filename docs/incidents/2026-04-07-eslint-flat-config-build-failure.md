# Incident: ESLint Flat Config Breaks Vercel Build Pipeline

**Date:** 2026-04-07
**Branch:** `phase-4/developer-experience`
**Root Cause Commit:** `640bb9146d5b740300a2d4cc3fe7c08fe611473e`
**Severity:** All Vercel deployments failing (20+ consecutive ERROR states)
**Resolution:** Reverted to last known good state (`5e0f443`), selectively cherry-picked clean commits

---

## What Happened

A single commit (`640bb91`) to `packages/config/src/eslint/nextjs.js` introduced two independent
breaking changes. Both were fatal to `next build` inside `apps/analytics`, which cascades through
`turbo build` to fail every Vercel deployment.

### Breaking Change 1 — Phantom ESLint Rule Names

```js
// Added to rules block — these rules DO NOT EXIST in eslint-plugin-react-hooks@7.x
'react-hooks/set-state-in-effect': 'off',
'react-hooks/refs': 'off',
```

**Why it fails:** `eslint-plugin-react-hooks` v7 (and all prior versions) only ships two rules:

- `react-hooks/rules-of-hooks`
- `react-hooks/exhaustive-deps`

`set-state-in-effect` and `refs` were proposed/discussed rules that were **never released**.

**ESLint 9 flat config is strict:** unknown rule names throw a fatal error at config load time:

```
Definition for rule 'react-hooks/set-state-in-effect' was not found.
```

ESLint 8 would silently ignore unknown rules. ESLint 9 does not.

### Breaking Change 2 — `**/*.mjs` as a Global Ignore

```js
// Added to the standalone ignores object at the bottom of createNextConfig()
{
  ignores: [
    '.next/**',
    'out/**',
    // ...
    '**/*.mjs',   // ← THIS
  ],
}
```

**Why it fails:** In ESLint 9 flat config, a config object with **only** an `ignores` key is treated
as a **global ignore** — it applies to every file across the entire config, not just the block it
appears near. This differs entirely from ESLint 8's `.eslintignore` file behavior.

Since `apps/analytics/eslint.config.mjs` is itself a `.mjs` file, ESLint silently excluded its own
config entry point, causing `next build`'s ESLint pass to fail with an unresolvable configuration.

---

## Why It Was Hard to Debug

**The Vercel build log API caps at 200 events.** The `@aazucena/icons` package re-exports
`export *` from both `@mynaui/icons-react` and `@icons-pack/react-simple-icons`, generating 40+
"Ambiguous external namespace resolution" warnings per build. These warnings consumed the entire
200-event budget on every log fetch, making the actual ESLint fatal error invisible.

Every fix attempt was effectively flying blind. This led to 60+ commits chasing symptoms in
unrelated files (`astro.config.mjs`, `markdown-renderer.tsx`, `useHandlebars.ts`, etc.) while
the real error in `nextjs.js` went undetected.

---

## How It Was Found

The user created a `debug` branch based on the last successful deployment (`5e0f443`), then
cherry-picked `640bb91` in isolation. The deployment failed deterministically — proving a single
commit was the root cause without needing to read the actual error log.

---

## Resolution

1. Hard reset `phase-4/developer-experience` to `5e0f443` (last known good state)
2. Cherry-picked only the clean, verified commits:
   - `eb4904e` — docs: update pnpm version references
   - `ffaeda2` — fix(ci): correct Turborepo filter name for Storybook build job
   - `6bb35cc` — ci: restrict verify_changesets job to main branch only
   - `89d9f7e` — fix(analytics): resolve 25 lint errors blocking CI pipeline

---

## Rules Going Forward

### 1. Never add ESLint rules you haven't verified exist

Before disabling a rule, confirm it is real:

```bash
# Check what rules a plugin actually exposes
node -e "import('@aazucena/config/eslint/nextjs.js').then(m => console.log(Object.keys(require('eslint-plugin-react-hooks').rules)))"

# Or inspect the plugin directly
node -e "console.log(Object.keys(require('eslint-plugin-react-hooks').rules))"
# Output: [ 'rules-of-hooks', 'exhaustive-deps' ]
```

### 2. Understand ESLint 9 flat config global vs. scoped ignores

| Pattern                                                                      | Behavior                                                   |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `{ ignores: ['**/*.mjs'] }` — standalone object                              | **Global ignore** — affects all files in the entire config |
| `{ files: ['**/*.ts'], ignores: ['**/*.mjs'], rules: {...} }` — mixed object | **Scoped ignore** — applies only within that config block  |

To safely ignore `.mjs` files from TypeScript type-checking only, use scoped config:

```js
// Correct — only prevents TS parser from type-checking .mjs files
{
  files: ['**/*.mjs'],
  languageOptions: {
    parserOptions: { project: false },
  },
},
```

### 3. Run ESLint locally before pushing shared config changes

The `@aazucena/config` shared ESLint configs affect every app in the monorepo. Always validate
before pushing:

```bash
# Validate the analytics app's ESLint config loads without errors
cd apps/analytics && pnpm exec eslint --print-config src/app/page.tsx

# Validate the portfolio app
cd apps/portfolio && pnpm exec eslint --print-config src/pages/index.astro
```

A zero-exit means the config loaded — it does not mean linting passes, but it confirms no fatal
config errors exist.

### 4. When Vercel logs are truncated, bisect instead of guessing

If build logs are consumed by noise (e.g., icon namespace warnings), do not iterate fixes blindly.
Use git bisect or the manual cherry-pick-to-clean-branch technique:

```bash
# Create a branch at the last known good commit
git checkout -b debug <last-good-sha>

# Cherry-pick the suspect commit
git cherry-pick <suspect-sha>

# Push and watch Vercel — fail = confirmed root cause
git push origin debug
```

This is faster and more reliable than reading truncated logs.

### 5. Suppress the `@aazucena/icons` namespace warning noise

The 40+ "Ambiguous external namespace" warnings from `@aazucena/icons` are harmless but
they poison build logs by consuming the Vercel 200-event API cap. Add `@aazucena/icons` to
`vite.ssr.external` in `apps/portfolio/astro.config.mjs` to remove it from the SSR bundle pass
where the warnings originate:

```js
// astro.config.mjs — already present from c344ad7 (kept after revert? verify)
ssr: {
  external: [
    // ... other entries
  ],
}
```

Or suppress at the Vite level with `build.rollupOptions.onwarn`:

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

| File                                                  | Change                                                | Safe to reintroduce?                                        |
| ----------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| `packages/config/src/eslint/nextjs.js`                | Phantom rules + global `.mjs` ignore                  | Yes, with correct patterns (see above)                      |
| `apps/portfolio/astro.config.mjs`                     | `ssr.external` list, `build.target`, `build.minify`   | Yes — valid improvements                                    |
| `packages/ui/src/components/ui/markdown-renderer.tsx` | Replaced `marked` with inline parser, removed `shiki` | Evaluate — inline parser works, shiki can return in Phase 5 |
| `packages/hooks/src/data/useHandlebars.ts`            | Lazy `import('handlebars')`                           | Yes — keeps handlebars out of client bundle                 |
| Multiple `package.json` files                         | `sideEffects: false`                                  | Yes — enables tree-shaking                                  |
