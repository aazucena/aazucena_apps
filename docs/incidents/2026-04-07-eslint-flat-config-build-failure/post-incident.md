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

## Claude Code Follow-Up Session (2026-04-18) — `fix/bundler-conflicts` PR

The `fix/bundler-conflicts` branch was raised to fix three failing CircleCI jobs
(`type_check_packages`, `type_check_apps`, `build_storybook`). Those were resolved in a prior
session. This session focused exclusively on the fourth failing job: `test_storybook`.

### Root Cause Chain

`test_storybook` runs `pnpm --filter @aazucena/storybook test:ci` which runs vitest browser
mode via `@storybook/addon-vitest`. All 260+ story files were loaded sequentially into a single
headless Chromium process (`fileParallelism: false`), accumulating V8 heap until Chrome OOMed.
The crash manifest changed with each fix attempt — the error always named the file being loaded
when Chrome ran out of memory, not the file that caused the OOM.

**Key discoveries:**

1. **Shiki WASM was loaded for every `@aazucena/ui` barrel import.** `markdown-renderer.tsx`
   called `getHighlighter()` at module scope — since every story imports from `@aazucena/ui`,
   shiki loaded its 200+ language grammars (~100MB) for every single story file. Fixed by moving
   the call inside the `code()` renderer behind an `_highlighterInit` guard.

2. **`bundledLanguages` in `shiki.ts` loaded 200+ grammars.** Replaced with a curated
   22-language `SUPPORTED_LANGS` array. Reduces shiki's footprint from ~100MB to a few MB.

3. **`storybookTest` plugin ignores `test.include`.** The plugin explicitly clears
   `nonMutableInputConfig.test.include` on init (line 2600 of the plugin source) and builds its
   own include list from Storybook's `stories` glob in `.storybook/main.ts`. Adding a file list
   to `test.include` in vitest.config.ts has zero effect.

4. **Tag-based `include` filters at export level, not file level.** `tags: { include:
   ['interaction-test'] }` prevents non-tagged story exports from running as tests but does NOT
   prevent Chrome from loading the file. All 260+ files still loaded.

5. **`process.env.VITEST` is not available when `main.ts` is evaluated.** The storybookTest
   plugin loads Storybook via `experimental_loadStorybook()` inside a Vite config hook; this
   runs before vitest completes its own initialization sequence and sets `VITEST=true`. Using an
   explicitly set env var in the npm script (`STORYBOOK_VITEST=1 vitest run`) guarantees
   availability from process start.

6. **`href="#"` in ArrowLink play function caused WebSocket disconnect.** `userEvent.click` on
   `<a href="#">` triggers a same-page hash navigation in Playwright's browser mode, which tears
   down the test runner's WebSocket channel. Fixed by replacing with `userEvent.keyboard('{Tab}')`.

### Commits (in order)

| SHA | Description |
|-----|-------------|
| `ab28d96` | Persist `design-system/dist` to CircleCI workspace for `test_storybook` |
| `bea8934` | Make `build:storybook` depend on `^build` in turbo pipeline |
| `f9d0702` | Fix Storybook build failures (Leaflet, HoverCard, chart no-vitest) |
| `2dfd6bd` | Defer shiki WASM to first code block render (markdown-renderer lazy-init) |
| `c3310cc` | Replace `bundledLanguages` with curated 22-lang subset in `shiki.ts` |
| `2d88505` | Tag `editor` + `mic-selector` as `no-vitest` (TipTap heap, getUserMedia) |
| `26b591f` | Add `interaction-test` tag to 34 stories with `play()` functions |
| `1284960` | Explicit `test.include` list (ineffective — plugin ignores it, for docs only) |
| `47d3a8a` | Gate `stories` glob on `STORYBOOK_VITEST` env in `.storybook/main.ts` |
| `9a32224` | Set `STORYBOOK_VITEST=1` explicitly in `test:ci` script |
| `0884dda` | Replace `click` with `Tab` in ArrowLink play (prevent hash navigation crash) |

### Outcome

- CI `test_storybook`: 158 tests pass, 54s runtime (was: OOM crash after 20 minutes)
- Only 34 story files load in vitest (the ones with `play()` interaction tests)
- All 260+ stories still visible in Storybook dev/build (gate is vitest-only)

### Rules Learned

1. **`storybookTest` ignores `test.include`.** The only way to restrict which story files load
   into Chrome is to change the `stories` glob in `.storybook/main.ts`.

2. **Use `STORYBOOK_VITEST=1` (shell-set) not `process.env.VITEST` (vitest-set).** Shell env
   vars are available from process start; vitest's own `VITEST` flag may not be set when Storybook
   config is evaluated.

3. **Tag-gating strategy:** Stories with `play()` functions get `'interaction-test'` tag and go
   in the `main.ts` `INTERACTION_TEST_STORIES` list. All others are Chromatic-only visual tests.

4. **Never `userEvent.click` on `<a href="...">` in vitest browser play functions.** Same-page
   hash navigation (`#`) closes the Playwright WebSocket. Use `Tab` or `keyboard('{Enter}')` on
   non-link elements instead.

5. **Shiki `bundledLanguages` is a memory bomb.** Loading all 200+ grammars consumes ~100MB in
   Chrome. Always use a curated language list.

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
