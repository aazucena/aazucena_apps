# Avra P1: Cleanup and ui 0.3.0 Removals, Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `@aazucena/ui` ready to be copied into other projects. Declare its real dependencies, move to `tw-animate-css`, and remove the legacy `glass`/`cyber`/`gradient` variants (plus card `dashboard` and preloader-overlay `hoyoverse`) as the 0.3.0 breaking release.

**Architecture:** Two guard tests sit next to the existing ui guards in `packages/design-system/src/utils/`: declared dependencies, and no legacy variants. A tested one-off ts-morph codemod (`packages/ui/scripts/remove-legacy-variants.ts`) strips the variants from the component sources and from the stories. The type-checker then finds the leftovers, which are fixed by hand.

**Tech Stack:** pnpm workspaces, TypeScript 5.9, ts-morph 26 (already installed), vitest (design-system tests), `tsx --test` (node test runner, for the codemod), Tailwind 4, `tw-animate-css`, Changesets.

**Spec:** `docs/features/avra-distribution.md`. This plan is phase P1 and implements decisions D3 and D5.

## Global Constraints

- **When:** after Phase 4 (analytics app adoption), per the spec. Do not start before.
- **Prerequisite (owner action):** `@aazucena/ui` is at 0.1.0, with 21 changesets pending (7 ui minors) that announce the deprecations. Release 0.2.0 first (`GITHUB_TOKEN=$(gh auth token) pnpm version-packages` on main, per `docs/CONTEXT.md`). If you skip this, the deprecations and the removals ship in the same version.
- **Remove these variant names:**
  - from ui: `glass`, `cyber`, `gradient`, `cyber-gradient`
  - also card `dashboard` and preloader-overlay `hoyoverse`
- **Keep:**
  - the **glass vibe** (`packages/design-system/src/themes/glass.ts`)
  - the `--panel-glass` token and `--color-panel-glass` (a vibe role, not a variant)
- **Replacements at call sites:** Button/Toggle `cyber` → `outline`; anything else `cyber`/`glass`/`gradient` → its default variant (`default` or `primary`); card `dashboard` → `Panel`.
- **Commits:** one per concern, with `git add <path>` (no `-A`); conventional commit with emoji; body lines ≤ 100 chars; no AI attribution; never push or branch. The pre-commit hook regenerates `CHANGELOG.md`. Let it.
- **Quality gates** (Storybook builds OOM locally; never run `storybook build`):
  - `pnpm --filter @aazucena/design-system test`
  - `cd <pkg> && npx tsc --noEmit` for ui, layouts, animations, forms, visualizations and storybook
  - `pnpm --filter portfolio type-check`
  - `pnpm --filter analytics type-check`

## Review Focus

1. **Non-variant objects with a `glass` or `cyber` key** (theme maps, style tables) must not be stripped. The codemod only touches object literals inside a `cva(...)` call, `Record<…Variant…>` maps, or arrays of variant names. Test: `keeps glass keys outside cva and variant maps` (Task 3).
2. **`defaultVariants` pointing at a removed key** would silently render nothing. Test: `rewrites a defaultVariants legacy value to default` (Task 3), plus the guard in Task 4.
3. **A legacy value arriving at runtime** (`variant={config.variant}`, from CMS or props typed `string`) falls back to the default variant without crashing, because CVA ignores unknown keys. Verified in Task 5, step 4, by rendering Button with `variant={'cyber' as any}`.
4. **Storybook pages referencing a removed story** (`<Canvas of={X.Glass}>`) would break indexing. Test: the Task 6 guard asserts there are no `of={…(Glass|Cyber|Gradient)…}` in `stories/**/*.mdx`.
5. **Animations after the `tw-animate-css` switch:** Dialog/Popover enter animations must still run. Verified in Task 2, step 5, by checking the computed `animation-name` on an open Dialog.

---

## File Structure

| File                                                                                                                                     | Responsibility                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `packages/design-system/src/utils/ui-dependencies.test.ts` (create)                                                                      | Guard: every bare import in ui `src` is declared; no unused runtime deps; no `tailwindcss-animate` plugin in the app CSS |
| `packages/design-system/src/utils/ui-token-usage.test.ts` (modify)                                                                       | Guard: no legacy variant names in ui sources; update the gradient-stops list (lines 106–109)                             |
| `packages/ui/scripts/remove-legacy-variants.ts` (create)                                                                                 | ts-morph codemod: `removeLegacyVariants(sourceText, mode)`                                                               |
| `packages/ui/scripts/remove-legacy-variants.test.ts` (create)                                                                            | Node-runner tests for the codemod                                                                                        |
| `packages/ui/package.json`                                                                                                               | dependencies, peers, scripts                                                                                             |
| `packages/ui/src/styles/globals.css`, `apps/analytics/src/styles/globals.css`, `apps/portfolio/src/styles/globals.css`                   | `tw-animate-css` import                                                                                                  |
| `packages/ui/src/components/**` (about 230 files)                                                                                        | variant removal (codemod plus manual)                                                                                    |
| `packages/ui/src/styles/core.css`                                                                                                        | drop `@utility glass` once unused                                                                                        |
| `packages/animations/src/three/viewer/*`, `packages/layouts/src/SectionLayout.tsx`, `apps/portfolio/src/components/ui/SettingsPanel.tsx` | call-site fixes                                                                                                          |
| `apps/storybook/stories/**` (about 325 files)                                                                                            | story removals (codemod)                                                                                                 |
| `packages/ui/components.json`, `packages/ui/scripts/build-registry.ts` (delete), `code-block-command.tsx`                                | registry prep                                                                                                            |
| `packages/ui/MIGRATION-0.3.md` (create), `.changeset/*.md`, `docs/next-release-backlog.md`, `docs/features/avra-distribution.md`         | release notes and docs                                                                                                   |

---

### Task 1: Declare ui's real dependencies

**Files:**

- Create: `packages/design-system/src/utils/ui-dependencies.test.ts`
- Modify: `packages/ui/package.json`, `pnpm-lock.yaml`

**Interfaces:**

- Produces: `bareImports(dir: string): Map<string, Set<string>>` in the test file (package name → files). Task 2 reuses the file.

**Facts (measured 2026-11-19):**

- **Undeclared runtime imports:**
  - `framer-motion` (15 files, devDependency only)
  - `@aazucena/types` (7 files, type imports, devDependency only)
  - `@radix-ui/react-direction` (1 file, undeclared)
  - CSS imports `tailwindcss` and `@tailwindcss/typography` (globals.css, devDependencies only)
- **Unused dependencies:** `@aazucena/context`, `@mynaui/icons-react`, `@strapi/blocks-react-renderer`, `@types/d3`, `@types/d3-sankey`, `canvas-confetti`, `d3`, `d3-sankey`, `date-fns`, `lucide-react`, `react-countup`, `zod`.
- **Keep:** `@tailwindcss/postcss` (used by the exported `postcss.config.js`) and `tw-animate-css` (used from Task 2).
- **Peers:** react and react-dom are not peers; `gsap` is a peer but is never imported.

- [ ] **Step 1: Write the failing tests** in `ui-dependencies.test.ts`. File-level constants: `ROOT = join(__dirname, '../../../..')`, `UI_SRC = join(ROOT, 'packages/ui/src')`, `pkg = JSON.parse(readFileSync(join(ROOT, 'packages/ui/package.json'), 'utf8'))`.

  `bareImports` walks `packages/ui/src` for `.ts`, `.tsx` and `.css` files. It matches only statement-anchored forms: `^\s*import … from '<x>'`, `import('<x>')`, `^\s*export … from '<x>'`, `^\s*@import '<x>'`, `^\s*@plugin '<x>'`. Comment lines are skipped (`mask-input.tsx:45` mentions `'definitions'` in a comment). It normalises `@scope/name/sub` → `@scope/name` and `name/sub` → `name`, and skips `node:*` and relative paths.

  ```ts
  it('declares every package ui imports (deps or peers)', () => {
    const declared = { ...pkg.dependencies, ...pkg.peerDependencies };
    const missing = [...bareImports(UI_SRC).keys()].filter((n) => !declared[n]);
    expect(missing).toEqual([]);
  });
  it('lists no runtime dependency ui never imports', () => {
    const used = bareImports(UI_SRC);
    const KEEP = ['@tailwindcss/postcss']; // exported postcss.config.js
    const unused = Object.keys(pkg.dependencies).filter((n) => !used.has(n) && !KEEP.includes(n));
    expect(unused).toEqual([]);
  });
  it('declares react and react-dom as peers, not dependencies', () => {
    expect(pkg.peerDependencies).toMatchObject({ react: '^19.0.0', 'react-dom': '^19.0.0' });
    expect(pkg.dependencies.react).toBeUndefined();
  });
  ```

- [ ] **Step 2: Run the tests and watch them fail**

  Run: `pnpm --filter @aazucena/design-system exec vitest run src/utils/ui-dependencies.test.ts`

  Expected: 3 failures. `missing` lists `framer-motion`, `@aazucena/types`, `@radix-ui/react-direction`, `tailwindcss`, `tailwindcss-animate`, `@tailwindcss/typography`, `react`, `react-dom`; `unused` lists the 12 packages above plus `tw-animate-css`.

- [ ] **Step 3: Edit `packages/ui/package.json`**
  - Move into `dependencies`: `framer-motion`, `@aazucena/types` and `@tailwindcss/typography`, at the versions currently in devDependencies.
  - Add `@radix-ui/react-direction` at the version in `pnpm-lock.yaml`.
  - Set `peerDependencies` to `{ "react": "^19.0.0", "react-dom": "^19.0.0", "tailwindcss": "^4.0.0" }`, dropping `gsap`.
  - Delete the 12 unused dependencies.
  - Leave `tailwindcss-animate` alone (Task 2 handles it). In this task, allow it in the `missing` assertion with a `// removed in Task 2` filter.
  - Then run `pnpm install`.

- [ ] **Step 4: Run the tests and the type-check**

  Run: `pnpm --filter @aazucena/design-system exec vitest run src/utils/ui-dependencies.test.ts && cd packages/ui && npx tsc --noEmit`

  Expected: 3 passed, and `tsc` exits 0.

- [ ] **Step 5: Commit**

  ```bash
  git add packages/design-system/src/utils/ui-dependencies.test.ts packages/ui/package.json pnpm-lock.yaml
  git commit -m "📦 fix(ui): declare the packages ui imports and drop the unused ones"
  ```

### Task 2: Switch to tw-animate-css

**Files:**

- Modify: `packages/ui/src/styles/globals.css:6`, `apps/analytics/src/styles/globals.css:10`, `apps/portfolio/src/styles/globals.css:13`
- Modify: `packages/ui/package.json`, `apps/analytics/package.json`, `apps/portfolio/package.json` (remove `tailwindcss-animate`)
- Modify: `packages/design-system/src/utils/ui-dependencies.test.ts`

**Interfaces:**

- Consumes: `bareImports` (Task 1).

`packages/design-system/src/tailwind.ts` (the Tailwind 3 preset) and `packages/config` keep `tailwindcss-animate`. That preset is out of scope.

- [ ] **Step 1: Add the failing test**

  ```ts
  it.each([
    'packages/ui/src/styles/globals.css',
    'apps/analytics/src/styles/globals.css',
    'apps/portfolio/src/styles/globals.css',
  ])('%s animates with tw-animate-css', (file) => {
    const css = readFileSync(join(ROOT, file), 'utf8');
    expect(css).not.toMatch(/@plugin\s+['"]tailwindcss-animate['"]/);
    expect(css).toMatch(/@import\s+['"]tw-animate-css['"]/);
  });
  ```

  Remove the Task 1 `tailwindcss-animate` allowance.

- [ ] **Step 2: Run the test and watch it fail**

  Run: `pnpm --filter @aazucena/design-system exec vitest run src/utils/ui-dependencies.test.ts`

  Expected: 3 failures (the `it.each` cases).

- [ ] **Step 3: Replace the plugin line in each of the three CSS files**

  Replace `@plugin 'tailwindcss-animate';` with `@import 'tw-animate-css';`, placed directly after `@import 'tailwindcss'`. Remove `tailwindcss-animate` from the three package.json files, then run `pnpm install`.

- [ ] **Step 4: Run the tests and the type-checks**

  Run: `pnpm --filter @aazucena/design-system test && pnpm --filter analytics type-check && pnpm --filter portfolio type-check`

  Expected: all pass.

- [ ] **Step 5: Check that animations still run**

  Start Storybook with `NODE_OPTIONS=--max-old-space-size=1536 pnpm --filter @aazucena/storybook dev`. With Playwright, open the Dialog story iframe and click the trigger. Then:

  ```js
  getComputedStyle(document.querySelector('[role=dialog]')).animationName;
  ```

  Expected: not `'none'`. Stop the server by its port PID.

- [ ] **Step 6: Commit**

  ```bash
  git add packages/ui/src/styles/globals.css apps/analytics/src/styles/globals.css apps/portfolio/src/styles/globals.css \
    packages/ui/package.json apps/analytics/package.json apps/portfolio/package.json pnpm-lock.yaml \
    packages/design-system/src/utils/ui-dependencies.test.ts
  git commit -m "♻️ refactor(ui): animate with tw-animate-css instead of the tailwindcss-animate plugin"
  ```

### Task 3: Legacy-variant codemod (tool only, not applied yet)

**Files:**

- Create: `packages/ui/scripts/remove-legacy-variants.ts`
- Test: `packages/ui/scripts/remove-legacy-variants.test.ts`

**Interfaces:**

- Produces, for Tasks 4 and 6:
  - `export const LEGACY = ['glass', 'cyber', 'gradient', 'cyber-gradient'] as const`
  - `export function removeLegacyVariants(text: string, mode: 'component' | 'story', names?: readonly string[]): { text: string; changed: boolean }`
  - CLI: `npx tsx packages/ui/scripts/remove-legacy-variants.ts <component|story> <glob…> [--names a,b]` rewrites the files in place and prints `changed N / M files`.

**Transforms in `component` mode** (ts-morph, in-memory `Project({ useInMemoryFileSystem: true })`):

| Pattern                                                                                                                         | Becomes                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A property whose key is in `names`, inside an object that is an argument of `cva(...)` or a value inside its `variants` object  | removed                                                                                                                                                              |
| A key in `names` inside an object literal typed or annotated with a `Record<…, …>` whose first type argument mentions `Variant` | removed                                                                                                                                                              |
| A union type member that is a string literal in `names`                                                                         | removed                                                                                                                                                              |
| An array literal of only string literals that contains `'default'` or `'primary'` plus a name in `names`                        | name removed                                                                                                                                                         |
| A `compoundVariants` array element with `variant: '<name>'`                                                                     | element removed                                                                                                                                                      |
| `defaultVariants.variant: '<name>'`                                                                                             | `'default'`                                                                                                                                                          |
| `X === '<name>'`                                                                                                                | `false`, then simplified: `false && e` as a call argument → argument removed; elsewhere → `false`. `false ? a : b` → `b`. `e \|\| false` → `e`. Repeat until stable. |

**Additional transforms in `story` mode:**

| Pattern                                                                    | Becomes                                           |
| -------------------------------------------------------------------------- | ------------------------------------------------- |
| `export const <Name>` where `<Name>` matches `/(Glass\|Cyber\|Gradient)/`  | the whole statement and its leading JSDoc removed |
| A story object whose `args.variant` is in `names`                          | removed                                           |
| A JSX element with an attribute `variant="<name>"` or `variant={'<name>'}` | removed (with a trailing JSX newline)             |
| `options: [...]` arrays                                                    | names removed                                     |

- [ ] **Step 1: Write the failing tests** with `node:test` and `node:assert/strict`. Helpers at the top of the file: `run = (s) => removeLegacyVariants(s, 'component').text`, `runStory = (s) => removeLegacyVariants(s, 'story').text`, `norm = (s) => s.replace(/\s+/g, ' ').trim()`. Each test passes a small source string and asserts on the output text after collapsing whitespace.

  ```ts
  test('drops legacy keys from cva variants', () => {
    const src = `const v = cva('b', { variants: { variant: { default: 'a', glass: 'g', cyber: 'c' } } });`;
    assert.equal(norm(run(src)), norm(`const v = cva('b', { variants: { variant: { default: 'a' } } });`));
  });
  test('removes legacy members from union types', () => {
    assert.equal(norm(run(`type P = { variant?: 'default' | 'glass' | 'cyber' };`)),
      norm(`type P = { variant?: 'default' };`));
  });
  test('removes cn arguments guarded by a legacy comparison', () => {
    assert.equal(norm(run(`cn('a', variant === 'cyber' && 'text-signal', variant === 'glass' && 'x')`)),
      norm(`cn('a')`));
  });
  test('takes the else branch of a legacy ternary', () => {
    assert.equal(norm(run(`const c = v === 'cyber' ? 'x' : v === 'glass' ? 'y' : 'z';`)), norm(`const c = 'z';`));
  });
  test('drops compoundVariants entries for legacy variants', () => { /* entry with variant:'glass' gone, others kept */ });
  test('rewrites a defaultVariants legacy value to default', () => { /* defaultVariants: { variant: 'cyber' } → 'default' */ });
  test('keeps glass keys outside cva and variant maps', () => {
    const src = `const themes = { glass: { bg: 'x' }, cyber: { bg: 'y' } };`;
    assert.equal(run(src), src);
  });
  test('strips legacy names from option arrays', () => {
    assert.equal(norm(run(`const o = ['default', 'cyber', 'glass', 'gradient'];`)), norm(`const o = ['default'];`));
  });
  test('story mode removes Glass/Cyber story exports with their JSDoc', () => { /* /** Glass */ export const Glass = {…} gone */ });
  test('story mode removes JSX elements with a legacy variant', () => {
    assert.equal(norm(runStory(`<div><Button variant="default"/><Button variant="cyber"/></div>`)),
      norm(`<div><Button variant="default"/></div>`));
  });
  test('story mode removes stories whose args use a legacy variant', () => { /* export const Neon = { args: { variant: 'cyber' } } gone */ });
  test('honours custom names (dashboard, hoyoverse)', () => {
    assert.equal(norm(removeLegacyVariants(`cva('', { variants: { variant: { default: 'a', dashboard: 'd' } } })`,
      'component', ['dashboard']).text), norm(`cva('', { variants: { variant: { default: 'a' } } })`));
  });
  ```

  Fill in the four elided bodies with the same shape: input string → expected string.

- [ ] **Step 2: Run the tests and watch them fail**

  Run: `npx tsx --test packages/ui/scripts/remove-legacy-variants.test.ts`

  Expected: all 12 fail with "Cannot find module" or "is not a function".

- [ ] **Step 3: Implement `removeLegacyVariants` and the CLI** in `remove-legacy-variants.ts`.

  Use ts-morph's `forEachDescendant` over `ObjectLiteralExpression`, `UnionTypeNode`, `BinaryExpression`, `ConditionalExpression` and `JsxElement`/`JsxSelfClosingElement`. Collect the removals, then apply them from the deepest nodes outward (`node.remove()`, `replaceWithText`). Run the boolean simplification as a fixed-point loop (at most 5 passes). Return `{ text: sourceFile.getFullText(), changed }`. Keep the formatting; Prettier runs afterwards.

- [ ] **Step 4: Run the tests and confirm they pass**

  Run: `npx tsx --test packages/ui/scripts/remove-legacy-variants.test.ts`

  Expected: 12 passed, 0 failed.

- [ ] **Step 5: Commit**

  ```bash
  git add packages/ui/scripts/remove-legacy-variants.ts packages/ui/scripts/remove-legacy-variants.test.ts
  git commit -m "🔧 chore(ui): codemod that removes the legacy glass, cyber and gradient variants"
  ```

### Task 4: Remove the legacy variants from ui

**Files:**

- Modify: `packages/design-system/src/utils/ui-token-usage.test.ts` (add a guard; edit the list at lines 106–109)
- Modify: `packages/ui/src/components/**` (codemod output, about 230 files)
- Modify: `packages/ui/src/components/ui/card.tsx` (`dashboard`) and `packages/ui/src/components/ui/preloader-overlay.tsx` (`hoyoverse`)
- Modify: `packages/ui/src/styles/core.css` (drop `@utility glass` if unused)

**Interfaces:**

- Consumes: `removeLegacyVariants`, `LEGACY` and the CLI (Task 3).
- Produces: a ui package with no legacy variants; Task 5 fixes its consumers.

**Baseline (2026-11-19):** keys `glass` in 214 files, `cyber` in 234, `gradient` in 5, `dashboard` in 2, `hoyoverse` in 1. There are 93 files with `=== '<legacy>'`, 15 files with union literals and 13 with `compoundVariants`. The `preloader/**` theme maps have no legacy keys.

- [ ] **Step 1: Add the failing guard** to `ui-token-usage.test.ts`. It reuses the file's `tsxFiles(UI_DIR)` and `LITERALS`.

  ```ts
  it('has no legacy variants (glass, cyber, gradient, card dashboard, overlay hoyoverse)', () => {
    const offenders: string[] = [];
    const KEY = /^\s+['"]?(glass|cyber|gradient|cyber-gradient)['"]?\s*:/m;
    const LITERAL = /['"](glass|cyber|gradient|cyber-gradient)['"]/;
    for (const file of tsxFiles(UI_DIR)) {
      const src = readFileSync(file, 'utf8');
      if (KEY.test(src) || LITERAL.test(src)) offenders.push(file.split('src/components/')[1]!);
    }
    expect(offenders).toEqual([]);
  });
  it('card has no dashboard variant and preloader-overlay no hoyoverse variant', () => {
    expect(read('ui/card.tsx')).not.toMatch(/\bdashboard\s*:/);
    expect(read('ui/preloader-overlay.tsx')).not.toMatch(/\bhoyoverse\s*:/);
  });
  ```

  In the gradient-stops list at lines 106–109, drop `'cyber'`, `'glass'`, `'gradient'` and `'cyber-gradient'` from the expected variant arrays. Remove a row entirely if nothing is left in it.

- [ ] **Step 2: Run the guard and watch it fail**

  Run: `pnpm --filter @aazucena/design-system exec vitest run src/utils/ui-token-usage.test.ts`

  Expected: FAIL. `offenders` has about 230 entries.

- [ ] **Step 3: Apply the codemod**

  ```bash
  npx tsx packages/ui/scripts/remove-legacy-variants.ts component 'packages/ui/src/components/ui/**/*.tsx'
  npx tsx packages/ui/scripts/remove-legacy-variants.ts component packages/ui/src/components/ui/card.tsx --names dashboard
  npx tsx packages/ui/scripts/remove-legacy-variants.ts component packages/ui/src/components/ui/preloader-overlay.tsx --names hoyoverse
  npx prettier --write 'packages/ui/src/components/**/*.tsx'
  ```

  Expected output: `changed ~230 / 296 files`.

- [ ] **Step 4: Fix the leftovers until the type-check is clean**

  Run: `cd packages/ui && npx tsc --noEmit`

  Fix each error by hand. The usual causes are a prop type that listed a legacy name alongside other values, or a variable that only fed a removed branch. Then run `pnpm --filter @aazucena/ui lint` and fix any unused-variable warnings the removal created.

  Repeat until `tsc` exits 0 and `rg -n "['\"](glass|cyber|gradient)['\"]" packages/ui/src/components` prints nothing.

- [ ] **Step 5: Drop `@utility glass` from `core.css`** if `rg -n "\bglass\b" packages/ui/src --glob '*.tsx'` prints nothing. Keep `--color-panel-glass` in `globals.css`, because the glass vibe still sets `--panel-glass`.

- [ ] **Step 6: Run the guards and the design-system suite**

  Run: `pnpm --filter @aazucena/design-system test`

  Expected: all pass, including both new guards.

- [ ] **Step 7: Commit**

  ```bash
  git add packages/ui/src packages/design-system/src/utils/ui-token-usage.test.ts
  git commit -m "💥 feat(ui)!: remove the glass, cyber and gradient variants (0.3.0)"
  ```

### Task 5: Update the packages and apps that used legacy variants

**Files:**

- Modify: `packages/animations/src/three/viewer/ObjectViewerLoading.tsx:24` and `ObjectViewerControls.tsx` (lines 62, 80, 94, 102 and the rest of the file's 14 hits)
- Modify: `packages/layouts/src/SectionLayout.tsx` (prop union at line 15, JSDoc example at line 31)
- Modify: `apps/portfolio/src/components/ui/SettingsPanel.tsx:51`

**Interfaces:**

- Consumes: the ui prop types from Task 4. The removed names are now type errors at these call sites.

**Mapping:**

- Button and Toggle `cyber` → `outline`; a `variant={x ? 'cyber' : 'ghost'}` toggle becomes `x ? 'outline' : 'ghost'`.
- Skeleton and TooltipContent `cyber` → no `variant` prop (the default).
- `SectionLayout` variant union becomes `'default'`. Remove the prop if nothing else uses it. The JSDoc example drops `variant="glass"`.

- [ ] **Step 1: List the errors**

  Run: `for p in animations layouts forms visualizations; do (cd packages/$p && npx tsc --noEmit); done; pnpm --filter portfolio type-check; pnpm --filter analytics type-check`

  Expected: errors only at the call sites listed above.

- [ ] **Step 2: Apply the mapping** at each error site.

- [ ] **Step 3: Re-run the same command.** Expected: every package exits 0.

- [ ] **Step 4: Check the runtime fallback (Review Focus 3)**

  Add a test to `packages/design-system/src/utils/ui-token-usage.test.ts` that imports `buttonVariants` from `../../../ui/src/components/ui/button`:

  ```ts
  expect(buttonVariants({ variant: 'cyber' as never })).toBe(buttonVariants({}));
  ```

  Run: `pnpm --filter @aazucena/design-system exec vitest run src/utils/ui-token-usage.test.ts`. Expected: PASS.

- [ ] **Step 5: Commit**, one per package:

  ```bash
  git add packages/animations/src/three/viewer && git commit -m "🐛 fix(animations): use the outline and default variants after the ui 0.3.0 removals"
  git add packages/layouts/src/SectionLayout.tsx && git commit -m "🐛 fix(layouts): drop the glass and cyber SectionLayout variants"
  git add apps/portfolio/src/components/ui/SettingsPanel.tsx && git commit -m "🐛 fix(portfolio): settings panel uses the outline button"
  git add packages/design-system/src/utils/ui-token-usage.test.ts && git commit -m "✅ test(ui): an unknown variant falls back to the default style"
  ```

### Task 6: Remove the legacy stories

**Files:**

- Modify: `apps/storybook/stories/**/*.stories.tsx` (about 325 files)
- Modify: `apps/storybook/stories/forms/overview.mdx`, `apps/storybook/stories/docs/changelog.mdx` (prose mentions only; reword or keep as history)
- Create: `apps/storybook/stories/legacy-variants.test.ts`, a guard run with `npx tsx --test`

**Interfaces:**

- Consumes: `removeLegacyVariants(text, 'story')` and the CLI (Task 3).

**Baseline (2026-11-19):**

- 617 story exports named `*Glass*`, `*Cyber*` or `*Gradient*`, in 325 files
- 555 `variant: '<legacy>'` args
- 293 option arrays
- 336 JSX `variant="<legacy>"` uses

- [ ] **Step 1: Write the failing guard** in `legacy-variants.test.ts`. It walks `apps/storybook/stories`.

  ```ts
  test('no story uses a legacy variant', () => {
    const hits = files('.stories.tsx').filter((f) =>
      /export const \w*(Glass|Cyber|Gradient)\w*|variant[:=]\s*[{]?['"](glass|cyber|gradient)['"]/.test(
        read(f),
      ),
    );
    assert.deepEqual(hits, []);
  });
  test('no MDX page embeds a removed story', () => {
    const hits = files('.mdx').filter((f) => /of=\{[^}]*(Glass|Cyber|Gradient)/.test(read(f)));
    assert.deepEqual(hits, []);
  });
  ```

- [ ] **Step 2: Run the guard and watch it fail**

  Run: `npx tsx --test apps/storybook/stories/legacy-variants.test.ts`

  Expected: the first test fails with about 325 hits; the second passes.

- [ ] **Step 3: Apply the codemod and format**

  ```bash
  npx tsx packages/ui/scripts/remove-legacy-variants.ts story 'apps/storybook/stories/**/*.stories.tsx'
  npx prettier --write 'apps/storybook/stories/**/*.stories.tsx'
  ```

  Expected output: `changed ~325 / 376 files`.

- [ ] **Step 4: Fix the leftovers until the type-check is clean**

  Run: `cd apps/storybook && npx tsc --noEmit`

  Typical leftovers: an emptied showcase `render` whose wrapper still exists, and unused imports. Fix them by hand until `tsc` exits 0 and the guard passes.

- [ ] **Step 5: Run the interaction tests**

  Run: `pnpm --filter @aazucena/storybook test:ci`

  Expected: green. This runs the 34 interaction-test files with axe; nothing loads the full story index.

- [ ] **Step 6: Commit**

  ```bash
  git add apps/storybook/stories
  git commit -m "📝 docs(storybook): remove the glass, cyber and gradient stories"
  ```

### Task 7: Registry preparation

**Files:**

- Modify: `packages/ui/components.json`, `packages/ui/package.json` (`scripts`)
- Delete: `packages/ui/scripts/build-registry.ts`
- Modify: `packages/ui/src/components/ui/code-block-command.tsx:140`

**Changes:**

- **`components.json`:** delete `tailwind.iconLibrary` (`"@aazucena/icons"`). Keep one top-level `"iconLibrary"`. Set `tailwind.config` to `""`, because Tailwind 4 has no config file; the CSS lives in `src/styles/globals.css`.
- **Registry script:** delete `build-registry.ts` and the `"build:registry"` script. The spec replaces both with `packages/avra-build`.
- **Storage key:** `CodeBlockCommand`'s default `storageKey` becomes `'avra-command-preference'`. The prop already exists (`code-block-command.tsx:33`), so no API change is needed.

- [ ] **Step 1: Make the three edits.**

- [ ] **Step 2: Verify**

  Run: `node -e "JSON.parse(require('fs').readFileSync('packages/ui/components.json','utf8'))" && cd packages/ui && npx tsc --noEmit && rg -n "build-registry|aazucena-command-preference" packages apps --glob '!**/node_modules/**' --glob '!**/CHANGELOG.md'`

  Expected: the JSON parses, `tsc` exits 0, and `rg` prints nothing.

- [ ] **Step 3: Commit**, one per concern:

  ```bash
  git add packages/ui/components.json && git commit -m "🔧 chore(ui): one icon library and no Tailwind 3 config in components.json"
  git add packages/ui/scripts/build-registry.ts packages/ui/package.json && git commit -m "🔥 chore(ui): remove the stale registry build script"
  git add packages/ui/src/components/ui/code-block-command.tsx && git commit -m "♻️ refactor(ui): neutral default storage key for CodeBlockCommand"
  ```

### Task 8: Release notes, migration guide and docs

**Files:**

- Create: `packages/ui/MIGRATION-0.3.md`
- Create: `.changeset/ui-0-3-removals.md`, `.changeset/ui-deps-and-animate.md`, `.changeset/layouts-animations-0-3.md`
- Modify: `docs/next-release-backlog.md` (line 41), `docs/features/avra-distribution.md` (status line and the P1 row)

**Interfaces:**

- Consumes: the removal list and mapping from Tasks 4 and 5.

- [ ] **Step 1: Write `MIGRATION-0.3.md`**: a heading, then a table with Removed, Replace with and Notes.

  | Removed                                | Replace with                              | Notes                                  |
  | -------------------------------------- | ----------------------------------------- | -------------------------------------- |
  | `variant="glass"`                      | default variant, or `Panel` for surfaces  | The glass _vibe_ still exists.         |
  | `variant="cyber"`                      | `outline` (Button, Toggle) or the default |                                        |
  | `variant="gradient"`                   | default                                   | Already rendered as default since 0.2. |
  | Card `variant="dashboard"`             | `Panel`                                   |                                        |
  | PreloaderOverlay `variant="hoyoverse"` | default                                   |                                        |
  | `@utility glass`                       | `bg-panel-glass`                          | Only if Task 4, step 5 removed it.     |
  | `tailwindcss-animate`                  | `@import 'tw-animate-css'`                |                                        |

  End with one line: "Unknown variant values fall back to the default style; nothing throws."

- [ ] **Step 2: Write the changesets**
  - `'@aazucena/ui': minor`: removals plus a link to `MIGRATION-0.3.md`. In 0.x, a minor bump is the breaking release, so this becomes 0.3.0 once 0.2.0 is out.
  - `'@aazucena/ui': patch`: dependency declarations and `tw-animate-css`.
  - `'@aazucena/layouts': patch` and `'@aazucena/animations': patch`: call sites.

  Run: `pnpm changeset status --since=main`. Expected: lists ui minor, plus layouts and animations patch.

- [ ] **Step 3: Update the docs**
  - **Backlog:** line 41's note "Glass/cyber/gradient variants … are not in Figma yet" becomes "Glass/cyber/gradient variants removed in ui 0.3.0 (never added to Figma)".
  - **Distribution spec:** change the status line to "P1 done <date>" and tick the P1 row.

- [ ] **Step 4: Full verification run**

  ```bash
  pnpm --filter @aazucena/design-system test
  npx tsx --test packages/ui/scripts/remove-legacy-variants.test.ts apps/storybook/stories/legacy-variants.test.ts
  for p in ui layouts animations forms visualizations; do (cd packages/$p && npx tsc --noEmit) || echo "FAIL $p"; done
  (cd apps/storybook && npx tsc --noEmit); pnpm --filter portfolio type-check; pnpm --filter analytics type-check
  git log --format=%B main..HEAD | grep -ciE "co-authored|generated with"   # expect 0
  ```

  Expected: every suite passes, no `FAIL` lines, and the last command prints `0`.

- [ ] **Step 5: Commit**, one per concern:

  ```bash
  git add packages/ui/MIGRATION-0.3.md && git commit -m "📝 docs(ui): migration guide for the 0.3.0 variant removals"
  git add .changeset/ui-0-3-removals.md .changeset/ui-deps-and-animate.md .changeset/layouts-animations-0-3.md && git commit -m "🔖 chore: changesets for ui 0.3.0"
  git add docs/next-release-backlog.md docs/features/avra-distribution.md && git commit -m "📝 docs: P1 of the Avra distribution plan is done"
  ```
