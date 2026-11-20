# Avra distribution plan: using the design system outside this repo

> Status: planned 2026-11-19, not started. Build after Phase 4 (the analytics app adopting `@aazucena/ui`); the P0 habits apply now. Implementation plans: [P1 cleanup and ui 0.3.0](../superpowers/plans/2026-11-19-avra-p1-cleanup-and-0.3.0.md); P2 to P6 are written just before each phase runs.

## Context

Storybook is the general catalog of the library. The owner wants to use the Avra packages in their other projects, which may be React, Vue, Svelte, plain HTML or something not chosen yet. Owner decisions (2026-11-16 to 19):

| Decision                | Choice                                                                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Channels (v1)           | Low-cost core, $0/month: shadcn registry; theme and 17 vibes as registry theme items; `llms.txt`, `llms-full.txt` and per-component markdown; an Avra skill; shadcn's own MCP server. npm and a custom MCP server are deferred. |
| License                 | MIT. Root `LICENSE` already reads "MIT, © 2026 Aldrin Azucena" and every package says MIT. `NOTICE` credits two Apache-2.0 dependencies: cva and flexsearch.                                                                    |
| Timing                  | Build after Phase 4 (the analytics app adopts `@aazucena/ui`). Prep habits apply meanwhile.                                                                                                                                     |
| Non-React projects      | Tokens and theme CSS (framework-agnostic). Components stay React-only, delivered through the registry.                                                                                                                          |
| Vibes                   | Seed variables, the 17 vibes as registry items, and a static vibe builder page.                                                                                                                                                 |
| Attribution             | A header in every generated file, `--avra-version` in the theme CSS, and registry `author`/`docs`/`meta`. No generator meta tag and no AI attribution.                                                                          |
| Icons                   | Plain icons come from `@mynaui/icons-react` (npm dependency). The custom icons components use ship as registry items.                                                                                                           |
| Versions                | `/r/{name}.json` is always latest. Each release also keeps `/r/<version>/` and `/avra/<version>/`, as Storybook does with `/storybooks/<version>/`.                                                                             |
| App-specific components | Excluded from the registry with an exclusion list; no code moves.                                                                                                                                                               |
| First release           | Theme, fonts, and about 11 core components.                                                                                                                                                                                     |

Facts verified against the code and the shadcn docs:

- **The schema has what we need.** `registry-item.json` supports `author`, `docs`, `meta`, `cssVars` (theme, light, dark), a `css` block (`@utility`, `@layer`, arbitrary selectors) and `registry:font` items.
- **shadcn's MCP server reads `components.json` `registries`.** One line in a consumer project, `"@aazucena": "https://avra.aazucena.com/r/{name}.json"`, enables both `shadcn add @aazucena/panel` and agent access.
- **Every derived token is a baked literal.** For example, `--signal-subtle: color-mix(in oklch, #006584 15%, transparent)`. So overriding `--signal` changes nothing downstream. `aliases.ts:5-6` explains the literals: a `var()` declared on `:root` resolves there, so it can't follow vibes applied to a container element.
- **The ui package is close to ready, with one blocker.** 133 ui components import only `cn`. `cn` is `twMerge(clsx())`, the same as shadcn's `utils` item. 103 components import the private `@aazucena/icons`.
- **Existing setup to replace.** `packages/ui/components.json` and `scripts/build-registry.ts` already exist, but the script is stale: it uses the old format and ignores `@aazucena/*` imports. There is no `registry.json` and no `public/r`.
- **Fonts are never loaded by a shared package.** `core.css` reads `--font-sans`, which nothing defines.
- **Undeclared dependencies.** `framer-motion` is only a devDependency of ui although 15 files import it. `@radix-ui/react-direction` is imported but undeclared.
- **avra deploys on Vercel with no build hook in the repo.** The generator must run inside the `build:storybook` script. `.claude/` is gitignored, so the skill source must live elsewhere.

## Architecture: one generator, every channel

New private workspace package `packages/avra-build`. `generate({ outDir, baseUrl, version, dryRun })` is pure and returns `Map<path, content>`. A thin tsx CLI writes it to `apps/storybook/public`. Tests use `dryRun`, so no Storybook build is needed (the machine has 11 GB RAM).

**Inputs:**

- ui component sources, plus ui and `@aazucena/hooks` hooks
- `packages/ui/package.json` (dependency versions, Avra version)
- the usage scan (`.storybook/usage/scan.ts`)
- story metas (descriptions, argTypes)
- design-system vibes and derivation
- `content/rules.md` (new, hand-written)
- the skill source

**Outputs:**

| Output             | Path on avra                                                                                          | Committed?                          |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Registry (latest)  | `/r/registry.json`, `/r/<name>.json`                                                                  | No (built)                          |
| Registry (release) | `/r/<version>/…`                                                                                      | Yes (immutable)                     |
| CSS bundles        | `/avra/<version>/{tokens,vibes,fonts,base,tailwind,avra}.css` + `avra-theme.js`; `/avra/latest/` copy | Versioned: yes; latest: no          |
| LLM files          | `/llms.txt`, `/llms-full.txt`, `/docs/<name>.md`                                                      | No                                  |
| Skill              | `/skills/avra/SKILL.md`                                                                               | No (source committed in avra-build) |
| Licence            | `/LICENSE.txt`, `/NOTICE.txt`                                                                         | No                                  |

**Writer:** a custom writer, not `shadcn build`. `shadcn build` doesn't rewrite imports, inject headers or derive dependency versions. Every item is validated against the vendored `registry-item.json` schema, and the fixture's real `shadcn add` is the final conformance check.

**Build hook:** `"build:storybook": "pnpm --filter @aazucena/avra-build generate && storybook build"`. It works whether Vercel runs turbo or not.

## Import rewriting (registry items)

| Source                                    | Rewritten to                   | Item metadata                                                                                                         |
| ----------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `cn` from `@aazucena/utils`               | `@/lib/utils`                  | `registryDependencies: ["utils"]` (shadcn built-in). A guard test fails if `cn` gains a custom tailwind-merge config. |
| other utils helpers                       | `@/registry/avra/lib/<helper>` | one `registry:lib` item per helper                                                                                    |
| relative `./button`                       | `@/registry/avra/ui/button`    | full URL of the dependency, versioned inside versioned items                                                          |
| plain Myna icons                          | `@mynaui/icons-react`          | npm `dependencies`                                                                                                    |
| custom icons                              | `@/registry/avra/icons/<name>` | one item per icon                                                                                                     |
| hooks (`@aazucena/hooks`, ui `src/hooks`) | `@/registry/avra/hooks/use-x`  | `registry:hook`                                                                                                       |
| `@aazucena/types`                         | inlined                        | —                                                                                                                     |

Other rules:

- **Icon classification:** if a name is exported by `@mynaui/icons-react`, it's Myna. Otherwise it's a custom icon file. If neither matches, the build fails.
- **Dependencies:** versions come from ui's `package.json`. An undeclared import fails the build.
- **Exclusions** (`config.ts`, each with a reason; a test checks every path exists): rin-character, preloader/** and preloader-overlay, logo, brand-logo, tech-stack, github-star, persona, assistant-trigger, icon-renderer, code-block and markdown-renderer (shiki, wave 3), chat/* (wave 3), code-block-command (until `storageKey` is a prop).
- **Allow-list per wave** (`waves.ts`), so nothing ships by accident.
- **Guard tests:**
  - no `@aazucena/` and no relative imports in any published file
  - every `@/registry/avra/*` reference has a matching registry dependency
  - every bare import is in `dependencies`
  - every item passes the schema
  - names are unique and kebab-case

## Design-system refactor: derive through var()

**One derivation table, two renderers:**

- `src/color/derive.ts` holds the `DERIVATIONS` table (`signal-subtle → mix(signal, 15)`, `ring → signal`, `card → panel`, `chart-1 → series-1`, `success-subtle`, `warning-subtle`, and so on), plus `deriveTokens(seeds, 'var' | 'literal')` and `resolveSeeds(colors)`.
- **Static CSS:** seeds stay literals and derived tokens become `var()` expressions.
- **Runtime and old callers:** `deriveAliases`, `deriveInstrumentRoles` and `writeThemeConfig` keep getting literals, so the runtime is unchanged in v1.
- `resolveSeeds` applies the legacy fallbacks (signal ← primary and so on) at build time. A vibe that only sets `primary` still emits a literal `--signal`, which avoids pinning to the default.

**Selector strategy (the scoping fix).** Derived declarations go on `:root, .dark, [data-vibe], [data-avra-scope]`. Both `applyVibe` and `ThemeManager` already set `data-vibe`. Vibe CSS:

- `[data-vibe="x"] { light seeds }`
- `.dark[data-vibe="x"], .dark [data-vibe="x"], [data-vibe="x"] .dark { dark seeds }`

**`applySeeds(target, seeds, mode)`** is new, for the builder. It writes seeds only and sets `data-avra-scope`. `resolveVibeId` stays strict.

**Seed contract** (documented in `tokens.css`, the llms files and the skill):

| Group    | Seeds                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------ |
| Accent   | `--signal`, `--signal-foreground`                                                                                        |
| Status   | `--alert`, `--success`, `--warning`                                                                                      |
| Surfaces | `--background`, `--foreground`, `--muted-foreground`, `--panel`, `--panel-raised`, `--state`, `--scrim`, `--panel-glass` |
| Lines    | `--rule`, `--rule-strong`                                                                                                |
| Data     | `--series-1..4`, `--chart-grid`, `--chart-axis`                                                                          |
| Shape    | `--radius`                                                                                                               |
| Type     | `--font-sans`, `--font-mono` (new; also fixes `core.css`)                                                                |

Overriding `--signal`, `--background` and `--panel` is enough for a coherent result.

**Shared modules:**

- `src/color/contrast.ts`: the tint and contrast helpers, plus an `AA_CHECKS` table moved out of `generate-css.test.ts` so tests and the builder share one list.
- `src/color/resolve-css.ts`: a cascade resolver for the tests. It resolves `var()` and evaluates `color-mix` with culori.
- `src/color/serialize.ts`: `toCss` and `toRegistryTheme`, used by both the builder and the generator.

**Tests:**

- The 17-vibe AA loops read resolved values.
- New `derive.test.ts`: the resolved CSS equals the literal `deriveTokens` output for every vibe and mode.
- A guard checks that the derived selector list includes `[data-vibe]` and `.dark`.
- Re-run `ds:structure`.

## Theme items

- **`avra-theme`** (`registry:theme`):
  - `cssVars.theme`: the `@theme inline` mappings from `globals.css`, plus the missing `chart-seq-*`, `chart-div-*` and fonts.
  - `cssVars.light` / `dark`: seeds, derived `var()` tokens, structural tokens, and `avra-version`.
  - `css` block:
    - `@custom-variant dark (&:is(.dark *))`
    - `@utility micro-label` and `@utility glass`
    - base styles (body font, scrollbar)
    - reduced motion
    - a `[data-vibe], [data-avra-scope]` rule with the derived tokens, because shadcn only writes `:root` and `.dark`
  - `registryDependencies`: the two font items.
- **`avra-font-sans` / `avra-font-mono`** (`registry:font`): Fira Sans and Fira Code from Google, `--font-sans` and `--font-mono`.
- **17 `avra-vibe-<id>` items** (`registry:theme`): they depend on `avra-theme` and contain only the seeds that differ from default. A test checks that no vibe item contains a derived token.

## CSS for non-React projects

**Files in `/avra/<version>/`:**

- `tokens.css`: plain CSS with no Tailwind.
- `vibes.css`: the 17 `[data-vibe]` blocks.
- `fonts.css`: Google Fonts plus the `--font-*` variables.
- `base.css`: resets, `.micro-label`, `.glass`, and helper classes (`.bg-panel`, `.text-muted`, `.border-rule`), for projects without Tailwind.
- `tailwind.css`: Tailwind 4 source (`@theme inline`, `@utility`, dark variant).
- `avra.css`: one file combining tokens, vibes, fonts and base.
- `avra-theme.js`: framework-free `setVibe` and `setMode`, saved in `localStorage`.

**How projects consume it:**

- **Plain HTML / Vue / Svelte without Tailwind:** `<link href=".../avra/<v>/avra.css">`, `<html class="dark" data-vibe="ember">`, then `var(--panel)` or the helper classes.
- **Any Tailwind 4 project:** download `tailwind.css` and `tokens.css`, then `@import "./avra/tailwind.css"`. Tailwind doesn't resolve remote `@import url()`.

**Guards:**

- `tokens.css` and `base.css` contain no `@apply` or `@theme`.
- `tailwind.css` compiles with `@tailwindcss/node` and yields `.bg-panel` and `.micro-label`.
- The committed `/avra/<v>/` equals a fresh generation.

## Vibe builder (Storybook page `Docs/Vibe Builder`)

How it works:

1. Pick a starting vibe.
2. Edit its seeds, light and dark, with colour inputs and an oklch slider.
3. `applySeeds` updates a `[data-avra-scope]` preview, and CSS derives everything else.
4. The preview shows the wave-1 components and the charts.
5. An AA table runs `AA_CHECKS` on `deriveTokens(seeds, 'literal')`. A "nudge" button adjusts a failing seed until it passes.

It outputs a CSS snippet (`:root`/`.dark` or `[data-vibe="custom"]`), a downloadable `registry:theme` JSON (`npx shadcn add ./avra-vibe-custom.json`), and a shareable `?seeds=` link. It's a single story: no new addon, nothing hosted.

## LLM files and the Avra skill

- **`content/rules.md`** (committed, hand-written, short) draws on the Instrument Language sections, the CONTEXT rules, and the guard-test rules:
  - AA 4.5 and 3
  - role tokens only, no stock palette
  - coral only for alerts, with ▲
  - 30/36/44 controls, 6 and 4 px radii
  - chart colours from `chartTheme`, never tweened
  - named icon buttons
  - reduced motion

  A test checks that every Instrument Language heading has a section in `rules.md`.

- **`/llms.txt`** (llms.txt spec): a title, a summary, the attribution line, then links under Getting started (the `registries` snippet, the CSS link snippet), Components, and Themes.
- **`/llms-full.txt`:** the rules, the seed contract, and every component's markdown.
- **`/docs/<name>.md`:** header, description, install command, props from argTypes, variants from CVA, usage rules, a11y notes, and links to the Storybook page and the JSON.
- **Skill:** the source is `packages/avra-build/content/skill/SKILL.md` (`name: avra`, "Use when building UI with the Avra design system or its tokens"). It covers setup for each stack, the tokens and seeds, the rules and the catalog. It's published to `/skills/avra/SKILL.md`, and `pnpm avra:skill:local` copies it into the gitignored `.claude/skills/avra/`.

## Attribution

- **`attribution.ts`:** `header({ name, version, docsPath, syntax })` produces a block comment: name, "Avra Design System v<version>", "© 2026 Aldrin Azucena. MIT License.", and the docs URL. It goes before `'use client'`; in markdown it's a blockquote after the H1.
- **`--avra-version`** goes in `tokens.css` and in the theme item's `light` block.
- **Registry metadata:** `author: "Aldrin Azucena <https://aazucena.com>"`, `docs`, and `meta: { avraVersion, license: "MIT", source }`.
- **Licence files:** `LICENSE` and `NOTICE` are published as `/LICENSE.txt` and `/NOTICE.txt`.
- **`attribution.test.ts`:** every output, including every `files[].content`, carries the header with the current version, and none contains "Claude", "Generated with" or "Co-Authored".

## Phase plan

| Phase | Work                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Effort          |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| P0    | **Habits during Phase 4:** semantic tokens, `data-slot`, sibling imports via `./x`, plain Myna icons; no new `@aazucena/*` helper imports in ui; story descriptions on touched stories; no new glass/cyber variants.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | ongoing         |
| P1    | **Cleanup prerequisites, one commit each:**<br>• declare `framer-motion` and `@radix-ui/react-direction`, drop unused deps, and add a guard that every bare import is declared<br>• switch to `tw-animate-css` (D5)<br>• **ui 0.3.0 removals (D3):** delete glass, cyber, gradient, card `dashboard` and the preloader-overlay `hoyoverse` variant (about 230 files), done by category with a guard test that no `glass:`/`cyber:`/`gradient:` variant keys remain; update stories and docs<br>• fix `components.json` (`iconLibrary`, the Tailwind 3 config)<br>• delete `scripts/build-registry.ts`<br>• make the `code-block-command` storage key a prop<br>• changesets (ui 0.3.0) | 3–4 d           |
| P2    | **Design-system:** `derive.ts`, `contrast.ts`, `resolve-css.ts`, `serialize.ts`; selector strategy; `applySeeds`; test migration; `--font-sans/mono`; changeset.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 2–3 d           |
| P3    | **avra-build core:** attribution, `avra-theme`, font items, 17 vibe items, CSS bundles, committed `/avra/<v>/`, `build:storybook` hook. Value: the theme works in any project.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 2 d             |
| P4    | **Registry wave 1:** Button, Badge, Input, Label, Card, Panel, Tabs, Tooltip, Switch, Dialog, Separator (Dialog's icon is plain Myna). Import rewriter, versioned `/r/<v>/`, fixture scripts, CI job, and an Install block next to "Used in" on docs pages.                                                                                                                                                                                                                                                                                                                                                                                                                            | 2–3 d           |
| P5    | **LLM files and skill:** `rules.md`, `llms.txt`, `llms-full.txt`, per-component markdown, the skill.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 1–1.5 d         |
| P6    | **Vibe builder page.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 2–3 d           |
| P7    | **Waves 2 and 3:** textarea, skeleton, progress, kbd, stat, meter, table, popover, slider…; then hooks-heavy components, chat/*, code-block (shiki); custom icon items as needed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 1–2 d per batch |

**Release step** (`pnpm avra:release`, after `version-packages`): generate the versioned `/r/<v>/` and `/avra/<v>/` with versioned dependency URLs, commit them, and add the version to `versions.json`. A test checks the committed folders equal a fresh generation.

**Deferred:** npm publishing, a custom MCP server, Figma Code Connect, a `registry:style` init item, a skill zip or plugin, versioned LLM files.

## Verification

- **Unit tests** (`packages/avra-build`, tsx, no Storybook): schema, imports, attribution, exclusions, the theme item and vibe items, CSS guards, and committed equals generated. The design-system resolver, derive and AA tests pass.
- **Fixture consumer** (`scripts/fixture.sh`, outside the workspace):
  1. Generate with `--baseUrl http://localhost:4123` and serve `public/`.
  2. In a temp dir, create a pinned Vite + React-TS app with Tailwind 4 and `shadcn init`, using `registries: {"@aazucena": "http://localhost:4123/r/{name}.json"}`.
  3. `shadcn add` the theme, the fonts and every allow-listed item.
  4. Generate an `App.tsx` that imports them all.
  5. `tsc --noEmit`, `vite build`, and `grep -r "@aazucena/" src` must be empty.

  It runs once against `/r/<version>/` too.

- **Plain HTML fixture:** links `/avra/<v>/avra.css`. A Playwright check confirms `--signal-subtle` inside `[data-vibe=ember]` differs from `:root`, which proves the scoping fix.
- **CI:** a `verify_avra` job on main only, after `build_packages`, on a small resource class (about 3 min). It skips when `packages/ui`, `design-system` and `avra-build` are unchanged since `HEAD~1`.
- **Manual:** in a real side project, add `@aazucena` to `components.json`, run `shadcn add @aazucena/panel`, and check that the shadcn MCP lists the items.

## Decisions (resolved 2026-11-19)

|     | Decision                                                                                | Effect on the plan                                                                                                                                                                                                                                                       |
| --- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D1  | **The Avra version is `@aazucena/ui`'s version**                                        | It's stamped in headers, `--avra-version` and `/r/<version>/`, and matches the Storybook switcher.                                                                                                                                                                       |
| D3  | **Remove the legacy variants in ui 0.3.0 before wave 1**                                | Adds a step to P1: remove glass, cyber, gradient, card `dashboard` and the preloader-overlay `hoyoverse` variant from ui (about 230 files), with a changeset (ui major-in-0.x, 0.3.0). Update the stories and the Figma variant notes. Wave 1 ships clean variants only. |
| D4  | **Registry `meta.source` links to the public GitHub repo**                              | —                                                                                                                                                                                                                                                                        |
| D5  | **Copies use `tw-animate-css`**                                                         | It's an npm dependency of `avra-theme`. P1 also switches the library from `tailwindcss-animate` to `tw-animate-css`, so copies and library match.                                                                                                                        |
| D7  | **Manual `pnpm avra:release`**, run after `version-packages`                            | —                                                                                                                                                                                                                                                                        |
| D6  | **Still open:** confirm avra's Vercel build command in the dashboard at the start of P3 | It decides whether the generator hook belongs in `build:storybook` (the default assumption).                                                                                                                                                                             |
