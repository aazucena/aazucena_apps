# Maintenance Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clear the security backlog, bring every workspace to current dependency versions (including majors), and remove config drift before the analytics port and Phase 5 tests start.

**Architecture:** Lowest risk first: config hygiene → minor/patch + security → majors in independent batches → docs. Each task ends green (install, type-check, lint, build/test where it fits in RAM) and is committed on its own. A batch that can't be made green is reverted and logged in the backlog; work continues.

**Tech Stack:** pnpm 10.33.4 workspaces + Turborepo; Astro 6 (portfolio), Next 16 (analytics), Strapi 5 (cms), Storybook 10 + Vitest (storybook), Node 22 LTS target.

**Spec:** No separate spec. The scan results below (2026-11-10, read-only `pnpm audit` + `pnpm outdated -r`) are the requirements. Raw reports: scratchpad `audit.json`, `o.json`.

### Scan findings (the spec)

- `pnpm audit`: **29 critical / 171 high / 229 moderate / 40 low**. Main sources: `next` 16.2.6 (4 highs, fixed ≥16.2.11), Strapi 5.45 transitive `axios`/`undici`/`lodash`/`sharp`, `liquidjs` RCE via `strapi-liquid-templates`, `@vitest/browser` critical via `@storybook/addon-vitest`, `tar` via `@astrojs/vercel`, `shell-quote`, `ws`, `socket.io-parser`, `brace-expansion`, `js-yaml`, `@xmldom/xmldom` via `pixi.js`, `hono`/`ip-address` via `shadcn`.
- `pnpm outdated -r`: 216 packages — 153 minor/patch, 60 major, 4 deprecated `@types` stubs.
- `pnpm.overrides` in `apps/analytics/package.json` and `apps/cms/package.json` are ignored (warning on every pnpm command).
- Root `pnpm.overrides`: ~70 CVE floors, many duplicated (`tar` ×6, `undici` ×5, `hono` ×3).
- Drift: `vitest` ^3.2.4 (hooks, utils, ui, portfolio) vs ^4.1.2 (storybook); `@vitest/browser` 3.2.4 in ui; `typescript` in 5 ranges; `eslint` in 3; one package peers `react ^18`.
- Node: `engines >=18`; `services/websocket/Dockerfile` `node:20-alpine` (EOL); CircleCI `cimg/node:22.14.0`; cms Dockerfiles `node:22-alpine`.
- Docs say Next 15 / Astro 5; actual Next 16.2 / Astro 6.3.

## Global Constraints

- pnpm only. Node baseline **22 LTS**.
- One commit per concern; stage paths explicitly (`git add <path>`); emoji conventional messages; **no `Co-Authored-By` or AI attribution**; commit locally, **never push**.
- Portfolio: verify with `pnpm --filter portfolio type-check` — local `build` OOMs (11.6GB RAM machine).
- Storybook build needs `NODE_OPTIONS="--max-old-space-size=8192"`; prefer `test:ci` + type-check.
- Strapi stays on 5.x; React stays on 19.x (root override pins `react`/`react-dom` — bump the pin with the minor/patch task, not past 19).
- A major batch that can't go green within its task: `git restore` its files, add a backlog line with the blocker, move on.

## Review Focus

1. **Pre-commit hook after lint/commit tooling majors** — `git commit` must still run git-cliff + lint-staged and succeed. Owner: Task 6 (verification commit step).
2. **Zod 4 error shape in forms** — fields render `String(field.state.meta.errors[0])`; Zod 4 issue objects must still render a message, not `[object Object]`. Owner: Task 8 (test).
3. **Rin chat streaming on AI SDK 7** — `useChat` + `set_emotion` tool call must still stream and fire. Owner: Task 9 (smoke step).
4. **Strapi admin after 5.61** — admin panel must load and plugins (navigation, ckeditor, config-sync) register. Owner: Task 4 (start step).
5. **Portfolio on Vercel after Astro 7** — can't build locally; `astro check` + `type-check` are the gate, and the backlog notes a Vercel preview is required before merging. Owner: Task 10.

---

### Task 1: Config hygiene

**Files:** Modify `apps/analytics/package.json`, `apps/cms/package.json`, root `package.json`, `packages/{api,ui}/package.json`, `apps/{analytics,portfolio}/package.json`, `services/websocket/Dockerfile`, `.circleci/config.yml`; Create `.nvmrc`.

- [ ] **Step 1:** Delete the `pnpm` block from `apps/analytics/package.json` and `apps/cms/package.json` (root already pins `@types/react ^19` and `@strapi/design-system 2.2.0`).
- [ ] **Step 2:** Remove deprecated stubs: `@types/marked` (analytics), `@types/pixi.js` (portfolio), `@types/socket.io-client` (api), `@types/eslint__js` (ui).
- [ ] **Step 3:** Root `engines.node` → `">=22"`; `.nvmrc` → `22`; websocket Dockerfile → `node:22-alpine`; CircleCI both executors → latest `cimg/node:22.x` tag (check `https://circleci.com/developer/images/image/cimg/node` for the current 22 tag).
- [ ] **Step 4:** Run `pnpm install`. Expected: no `pnpm.overrides ... will not take effect` warnings.
- [ ] **Step 5:** Run `pnpm turbo type-check`. Expected: same pass/fail set as before the task (record baseline first with `git stash; pnpm turbo type-check; git stash pop` if anything fails).
- [ ] **Step 6:** Commit as three: `🔧 chore(deps): drop ignored workspace pnpm overrides`, `🔥 chore(deps): remove deprecated @types stubs`, `⬆️ chore: set Node 22 LTS baseline`.

### Task 2: Align shared tool ranges

**Files:** every `package.json` declaring `typescript`, `eslint`, `vitest`, `@vitest/*`, `react` peer.

- [ ] **Step 1:** Set `typescript` → `^5.9.3`, `eslint` → `^9.39.4` everywhere (majors come later in their own tasks).
- [ ] **Step 2:** Find the `react ^18` declaration (`grep -rn '"react": "\^18' packages apps`) and change to `^19.2.4`.
- [ ] **Step 3:** `pnpm install && pnpm turbo type-check lint`. Expected: no new failures vs Task 1 baseline.
- [ ] **Step 4:** Commit `🔧 chore(deps): align typescript, eslint, react ranges across workspaces`.

### Task 3: Minor/patch — root tooling + packages

**Files:** root `package.json`, `packages/*/package.json`, `pnpm-lock.yaml`.

- [ ] **Step 1:** `pnpm up -r --filter "./packages/*" --filter . ` (no `--latest`: stays in range) then raise ranges to latest minor for the outdated list's non-major entries (Radix, TanStack, Tiptap, d3*, turbo, prettier, git-cliff, typescript-eslint, `@types/*`).
- [ ] **Step 2:** Bump root override pins `react`/`react-dom` → `19.3.1`.
- [ ] **Step 3:** `pnpm install && pnpm turbo type-check lint --filter="./packages/*" && pnpm --filter @aazucena/hooks test && pnpm --filter @aazucena/utils test`. Expected: pass.
- [ ] **Step 4:** Commit `⬆️ chore(deps): update package minors and patches`.

### Task 4: Minor/patch — cms (Strapi 5.61)

**Files:** `apps/cms/package.json`, lockfile.

- [ ] **Step 1:** Bump `@strapi/*` → `5.61.1` (all to the same version), Strapi community plugins and `strapi-liquid-templates` → latest minor, `sharp` → `^0.35.5`, `pg` → `^8.23.1`, `axios` → latest 1.x.
- [ ] **Step 2:** `pnpm install && pnpm --filter cms type-check && pnpm --filter cms build`. Expected: build succeeds.
- [ ] **Step 3:** `pnpm cms:dev` against local Postgres; open `http://localhost:1337/admin`. Expected: admin loads; Content Manager lists navigation, ckeditor field renders, config-sync page opens. Stop server.
- [ ] **Step 4:** Commit `⬆️ chore(cms): update Strapi to 5.61 and plugins`.

### Task 5: Minor/patch — apps (analytics, portfolio, storybook, websocket)

**Files:** `apps/{analytics,portfolio,storybook}/package.json`, `services/websocket/package.json`, lockfile.

- [ ] **Step 1:** analytics: `next` + `eslint-config-next` → `16.4.6`, `socket.io-client` → `4.8.4`, other non-major. Commit `⬆️ chore(analytics): update Next.js to 16.4 and minors`.
- [ ] **Step 2:** portfolio: `@astrojs/*` minors, `pixi.js` → `^8.22.0`, `three`/`@types/three` → `0.187`, `gsap`, `@rive-app/react-webgl2`, `fast-xml-parser`, rest non-major. Commit `⬆️ chore(portfolio): update minors and patches`.
- [ ] **Step 3:** storybook: `storybook` + all `@storybook/*` → `10.6.7`, `@chromatic-com/storybook` → `5.6.0`. Commit `⬆️ chore(storybook): update Storybook to 10.6`.
- [ ] **Step 4:** websocket: `socket.io` → `4.8.4`. Commit `⬆️ chore(websocket): update socket.io`.
- [ ] **Step 5 (before each commit above):** `pnpm install`, then that workspace's `type-check` + `lint`; analytics also `pnpm --filter analytics build`; storybook also `pnpm --filter @aazucena/storybook test:ci`; websocket `pnpm --filter websocket-bridge build`. Expected: pass.

### Task 6: Prune overrides + re-audit

**Files:** root `package.json`, lockfile, `docs/next-release-backlog.md`.

- [ ] **Step 1:** Remove each root override whose floor is now met by the resolved tree (check with `pnpm why <pkg>`); collapse duplicates to one entry per package at the highest floor.
- [ ] **Step 2:** `pnpm audit --json`; for each remaining critical/high with a patched version, add one override `"<pkg>@<vuln-range>": ">=<patched>"`.
- [ ] **Step 3:** `pnpm install && pnpm turbo type-check && pnpm audit --audit-level=high`. Expected: **0 critical**; any remaining high has no upstream fix — list each in the backlog Maintenance section with package, path, advisory.
- [ ] **Step 4:** Commit `🔒 fix(deps): prune and refresh security overrides`.

### Task 7: Majors — test tooling

**Files:** `packages/{hooks,utils,ui}/package.json`, `apps/{portfolio,storybook}/package.json`, their `vitest.config.ts`.

- [ ] **Step 1:** Set `vitest`, `@vitest/browser`, `@vitest/browser-playwright`, `@vitest/coverage-v8`, `@vitest/ui` → `^5.1.0` everywhere; `happy-dom` → `^21`; `@testing-library/jest-dom` → `^7`; `@vitejs/plugin-react` → `^6`; `vite` → `^8`.
- [ ] **Step 2:** Read Vitest 5 + Vite 8 migration guides (`node_modules/vitest/` docs or vitest.dev/guide/migration); apply config changes in the 4 `vitest.config.ts` files.
- [ ] **Step 3:** `pnpm install && pnpm --filter @aazucena/hooks test && pnpm --filter @aazucena/utils test && pnpm --filter @aazucena/storybook test:ci && pnpm turbo type-check`. Expected: pass.
- [ ] **Step 4:** Commit `⬆️ chore(test): upgrade to Vitest 5 and Vite 8`.

### Task 8: Majors — Zod 4

**Files:** all `zod` dependents (analytics, portfolio, api, forms, types, ui); `packages/forms/src/schemas/index.ts`; Create `packages/forms/src/schemas/index.test.ts` (+ vitest config if forms has none: copy `packages/utils/vitest.config.ts`, add `"test": "vitest run"`).

- [ ] **Step 1:** Write failing-first test `zod v4 error renders as message`: parse `{ email: 'nope' }` with the login schema; assert `String(result.error.issues[0].message)` is a non-empty string not containing `[object`. Also assert one `.refine()` schema still rejects its invalid case.
- [ ] **Step 2:** Bump `zod` → `^4.6.7` everywhere; `@hookform/resolvers` → `^7`.
- [ ] **Step 3:** `pnpm install && pnpm turbo type-check`; fix breakages (`z.string().email()` → `z.email()`, `errorMap` → `error`, `.flatten()`/`.format()` → `z.treeifyError`, `ZodEffects` gone — `.refine()` now returns the same schema type).
- [ ] **Step 4:** `pnpm --filter @aazucena/forms test`. Expected: PASS.
- [ ] **Step 5:** Commit `⬆️ chore(deps): migrate to Zod 4`.

### Task 9: Majors — AI SDK 7

**Files:** `apps/{analytics,portfolio}/package.json`, `packages/api/package.json`; `apps/portfolio/src/components/assistant/useAssistantChat.ts`, `apps/portfolio/src/lib/utils/chat/tools/set-emotion.ts`, the portfolio chat API route, analytics AI terminal route.

- [ ] **Step 1:** Read `node_modules/ai/docs/` migration guide (v6 → v7) after bumping `ai` → `^7`, `@ai-sdk/react` → `^4`, `@ai-sdk/gateway` → `^4`.
- [ ] **Step 2:** Apply API changes to `useChat`, `streamText`, tool definitions (tool `inputSchema` uses Zod 4 from Task 8).
- [ ] **Step 3:** `pnpm install && pnpm turbo type-check`. Expected: pass.
- [ ] **Step 4 (smoke):** `pnpm web:dev`, open Rin, send "hi". Expected: streamed reply; character emotion changes (set_emotion fired). Requires AI Gateway key in `apps/portfolio/.env`; if absent, note it and rely on type-check.
- [ ] **Step 5:** Commit `⬆️ chore(ai): upgrade to AI SDK 7`.

### Task 10: Majors — Astro 7

**Files:** `apps/portfolio/package.json`, `astro.config.mjs`, `packages/config` (eslint-plugin-astro, astro-eslint-parser, prettier-plugin-astro).

- [ ] **Step 1:** Bump `astro` → `^7`, `@astrojs/react` → `^7`, `@astrojs/mdx` → `^8`, `@astrojs/vercel` → `^11`; read the Astro 7 upgrade guide and apply config changes.
- [ ] **Step 2:** `pnpm install && pnpm --filter portfolio type-check` (runs `astro check`). Expected: 0 errors.
- [ ] **Step 3:** `pnpm web:dev`; load `/`, `/journey`, a blog post, the 500 page. Expected: render, no console errors, D3 charts non-empty (`client:only` still honored).
- [ ] **Step 4:** Add backlog line: "Vercel preview of portfolio required before merging (Astro 7 can't be built locally)".
- [ ] **Step 5:** Commit `⬆️ chore(portfolio): upgrade to Astro 7`.

### Task 11: Majors — lint/commit tooling

**Files:** root `package.json`, `packages/config/package.json` + ESLint configs, `eslint.config.js`, `commitlint.config.mjs`.

- [ ] **Step 1:** Bump `eslint` → `^10` everywhere, `eslint-plugin-astro` 3, `astro-eslint-parser` 3, `eslint-config-prettier` 10, `eslint-plugin-security` 4, `globals` 17, `prettier-plugin-astro` 1, `@commitlint/*` 21, `lint-staged` 17, `@changesets/cli` 3 + `changelog-github` 1. Delete legacy `.eslintrc.js` if ESLint 10 no longer reads it (flat config only).
- [ ] **Step 2:** `pnpm install && pnpm turbo lint`. Expected: no new errors vs baseline.
- [ ] **Step 3:** Commit `⬆️ chore(lint): upgrade to ESLint 10 and commit tooling`. Expected: hook runs git-cliff + lint-staged and the commit succeeds (Review Focus 1).

### Task 12: Majors — observability + leaf UI

**Files:** `apps/{analytics,portfolio}/package.json`, `packages/{config,ui,utils,visualizations}/package.json`, `apps/storybook/package.json`.

- [ ] **Step 1:** `@sentry/*` → `^11` (read migration guide; check `sentry.*.config.ts` + `instrumentation.ts`), `@vercel/analytics` 2, `@vercel/speed-insights` 2, `web-vitals` 6. Verify type-check + analytics build. Commit `⬆️ chore(observability): upgrade Sentry 11 and Vercel analytics 2`.
- [ ] **Step 2:** Leaf UI: `lucide-react` 1, `framer-motion` 14, `tailwind-merge` 3, `shiki` 4, `react-day-picker` 10, `react-dropzone` 20, `nanostores` 1 + `@nanostores/react` 2, `chromatic` 18, `d3-cloud` 2, `marked` 18, `dotenv` 18, `lottie-react` 3, `path-to-regexp` 9, `js-yaml` 5, `tsup` 9, `@types/node` 26, `@storybook/addon-designs` 12. Verify `pnpm turbo type-check` + storybook `test:ci`. Commit `⬆️ chore(ui): upgrade leaf UI library majors`.

### Task 13: Majors — TypeScript 7 (gated)

- [ ] **Step 1:** Check peer ranges: `pnpm view typescript-eslint peerDependencies`, same for `@astrojs/check`, `next`, `tsup`. If any excludes 7.x → skip to Step 4.
- [ ] **Step 2:** Bump `typescript` → `^7` everywhere; `pnpm install && pnpm turbo type-check lint`. Expected: pass.
- [ ] **Step 3:** Commit `⬆️ chore(deps): upgrade to TypeScript 7`.
- [ ] **Step 4 (if gated):** Add backlog line naming the blocking package; no commit for TS.

### Task 14: Docs

**Files:** `docs/CONTEXT.md`, `README.md`, `ROADMAP.md`, `docs/architecture.md`, `docs/next-release-backlog.md`.

- [ ] **Step 1:** Replace stale versions (Next 15 → 16, Astro 5 → actual, Node ≥18 → 22, Strapi 5.x note) — `grep -rn "Next.js 15\|Astro 5\|>=18" README.md docs/CONTEXT.md docs/architecture.md ROADMAP.md`.
- [ ] **Step 2:** Backlog Maintenance: add a checked "Dependency maintenance pass (2026-11)" item with audit before/after counts and any deferred majors.
- [ ] **Step 3:** Commit `📝 docs: record dependency maintenance pass and current versions`.
- [ ] **Step 4:** New subscriptions (user, 2026-11-10): **Rive Cadet**, **Figma Starter (full seat)**. In `docs/next-release-backlog.md`:
  - Carried over → change "Host Rin's `.riv` asset" to note it's unblocked: author and export Rin's `.riv` in Rive (EmotionSM with 22 emotions + MovementSM with 5 behaviors, input names per `docs/features/rin.md`), host it, set `PUBLIC_RIN_CHARACTER_SRC`.
  - Analytics UI → add "Mirror the locked analytics tokens (ink/panel/rule/text/muted/signal/alert + categorical order) as Figma variables" so later design work starts in Figma, not HTML prototypes.
  - ROADMAP Phase 4 "⏳ Figma Design System — deferred" → "unblocked (Figma seat 2026-11), scheduled next release".
  - Storybook (Avra, `apps/storybook`) → add:
    - "Link Figma frames to stories": `@storybook/addon-designs` is already registered in `.storybook/main.ts:73` (bumped to v12 in Task 12) but **no story sets `parameters.design`**. Once the Figma design system exists, add `design: { type: 'figma', url }` to the Avra component stories, starting with the analytics `Panel`/`PageHeader`.
    - "Rin character story": add `stories/components/rin-character.stories.tsx` with two stories, the SVG fallback (no src) and the `.riv` (once hosted), plus an `emotion` control over the 22 EmotionSM values. Rive animations get a visual home and a regression check in `test:ci`.
    - Note: Figma's Storybook Connect plugin needs a Chromatic-published Storybook, and Chromatic is still deferred (paid). `addon-designs` works without it.
  - Commit separately: `📝 docs: unblock Rin .riv, Figma design system, and Storybook links`.
- [ ] **Step 5:** Save memory `project_tool_subscriptions.md` (Rive Cadet + Figma Starter full seat, bought 2026-11; check plan limits before promising features like Dev Mode or Rive runtime extras) and index it in `MEMORY.md`.

## Final verification

- `pnpm install` clean; `pnpm audit --audit-level=high` (0 critical); `pnpm turbo type-check lint`; analytics + cms builds; hooks/utils/forms/storybook tests; portfolio + analytics dev smoke.
- `git log --format=%B main..HEAD | grep -ci co-authored` → `0`.
