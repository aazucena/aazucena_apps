# Post-Incident Notes

**Incident:** `2026-04-07-eslint-flat-config-build-failure`

---

## Gemini CLI Follow-Up Session (2026-04-10)

A follow-up investigation using Gemini CLI attempted to re-apply stability fixes lost during
the hard reset. The session resulted in a second hard reset (`git reset --hard 4190c2e`) due
to the following sequence of mistakes:

1. **Gemini ran `git checkout .`** — intended to clean working directory, but silently reverted
   intentional Strapi 5.42 and React 19 dependency upgrades that had not yet been committed.
2. **Gemini ran `git reset --hard` + `git clean -fd`** — to recover from the corrupted state,
   but this permanently deleted in-progress work (visualizations, registry files).
3. **CMS upgrades were recovered** from a `lint-staged` temporary stash (`cb31983`) and
   committed as `8343063`. Vercel deployment succeeded without re-applying the ESLint
   phantom-rule suppressions.

**Key lesson:** `git checkout .` and `git reset --hard` are destructive. Never run them without
explicitly listing specific files to restore. The lint-staged stash backup
(`✔ Backed up original state in git stash`) is a recoverable safety net — check `git reflog`
before concluding work is lost.

---

## Known Remaining Technical Debt

### `packages/config/src/eslint/astro.js` — phantom rule survives

Line 26 of `astro.js` still contains:

```js
"react-hooks/set-state-in-effect": "off",
```

This rule does not exist in `eslint-plugin-react-hooks` (only `rules-of-hooks` and
`exhaustive-deps` are real). It predates the incident and survived both hard resets.

**Why it hasn't been removed:**

- It is set to `"off"` — zero linting impact, nothing enforced or suppressed.
- The portfolio's Astro ESLint path does not appear to surface this as a fatal config error
  (unlike `apps/analytics` which triggered the original incident).
- Modifying `packages/config/` ESLint files carries incident-level risk.

**Planned resolution:** Phase 5 ESLint audit. Before removing, validate:

```bash
node -e "console.log(Object.keys(require('eslint-plugin-react-hooks').rules))"
# Expected: [ 'rules-of-hooks', 'exhaustive-deps' ]

cd apps/portfolio && pnpm exec eslint --print-config src/pages/index.astro
cd apps/analytics && pnpm exec eslint --print-config src/app/page.tsx
```

### `@aazucena/icons` namespace warning noise

`@aazucena/icons` re-exports `export *` from both `@mynaui/icons-react` and
`@icons-pack/react-simple-icons`, generating 40+ "Ambiguous external namespace" warnings per
build. These consume the Vercel 200-event log API cap, making real errors invisible.

**Planned fix (not yet applied):**

```js
// apps/portfolio/astro.config.mjs
build: {
  rollupOptions: {
    onwarn(warning, warn) {
      if (warning.code === 'AMBIGUOUS_EXTERNAL_NAMESPACE') return;
      warn(warning);
    },
  },
},
```
