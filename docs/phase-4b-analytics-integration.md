# Phase 4B — Analytics App Integration

## Implementation Guide for AI Agents

**Plan source:** `~/.claude/plans/mutable-riding-flurry.md` (Phase 4B section)
**Branch:** `phase-4/developer-experience`
**Pre-requisite:** Phase A is complete (commit `4acb2ab`) — all 7 packages are decoupled and behavioral coupling is fixed.

---

## Context for the Executing AI

This is a **pnpm + Turborepo monorepo** (`aazucena_apps/`). The goal of Phase B is to wire the `apps/analytics` Next.js 15 app to use the shared `@aazucena/*` packages instead of its local duplicates, eliminating ~565 lines of code duplication.

**Critical rules:**

- Always use `pnpm` (never npm/yarn)
- Working directory root: `/home/aazucena/Projects/aazucena_apps/`
- Package manager: `pnpm v10.22.0`
- TypeScript quality gate: `cd apps/analytics && pnpm tsc --noEmit` (run after each risky step)
- Commit with conventional commits + emoji prefix (see recent git log for format)
- `pnpm format` has a pre-existing failure in analytics app — format individual files directly via `npx prettier --write`

---

## Step-by-Step Implementation

### B1 — Add workspace dependencies to `apps/analytics/package.json`

**File:** `apps/analytics/package.json`

In the `"dependencies"` block, add ALL of the following. Insert them alphabetically among existing deps:

```json
"@aazucena/analytics": "workspace:*",
"@aazucena/animations": "workspace:*",
"@aazucena/api": "workspace:*",
"@aazucena/constants": "workspace:*",
"@aazucena/context": "workspace:*",
"@aazucena/design-system": "workspace:*",
"@aazucena/forms": "workspace:*",
"@aazucena/hooks": "workspace:*",
"@aazucena/icons": "workspace:*",
"@aazucena/layouts": "workspace:*",
"@aazucena/stores": "workspace:*",
"@aazucena/types": "workspace:*",
"@aazucena/ui": "workspace:*",
"@aazucena/utils": "workspace:*",
"@aazucena/visualizations": "workspace:*"
```

In `"devDependencies"`, add:

```json
"@aazucena/config": "workspace:*"
```

After editing, run from repo root:

```bash
pnpm install
```

**Verify:** `cd apps/analytics && pnpm tsc --noEmit` should still pass (new deps don't break anything).

---

### B2 — Design system CSS tokens

**File:** `apps/analytics/src/styles/globals.css`

At the very top (line 1), before `@import "tailwindcss"`:

```css
@import '@aazucena/design-system/css-vars.css';
```

**Why:** The analytics app currently defines all CSS custom properties inline in globals.css. The design system package exports canonical token values. Adding this import provides the shared token source. The existing inline `:root` block in globals.css can remain — it will override/extend the design system defaults, which is intentional for app-specific overrides.

---

### B3 — Replace local Redux slices with `@aazucena/stores`

**Phase A context:** `packages/stores/src/slices/dashboard.ts` and `chat.ts` were refactored into `createDashboardSlice()` and `createChatSlice()` factory functions with backwards-compatible default exports. The `@aazucena/stores` package now exports: `dashboardSlice`, `dashboardReducer`, `dashboardActions`, `chatSlice`, `chatReducer`, `chatActions`.

**Step 1:** Update `apps/analytics/src/store/slices/index.ts`

Replace the entire file content with:

```typescript
// Re-export from shared package — slices are now owned by @aazucena/stores.
// The local dashboard.ts and chat.ts are DELETED (see below).
export {
  dashboardReducer,
  dashboardActions,
  dashboardSlice,
  chatReducer,
  chatActions,
  chatSlice,
} from '@aazucena/stores';

// Re-export all named actions for convenience (pages import directly from @/store)
export * from '@aazucena/stores';
```

**Step 2:** Delete the local duplicates:

```bash
rm apps/analytics/src/store/slices/dashboard.ts
rm apps/analytics/src/store/slices/chat.ts
```

**Step 3:** `apps/analytics/src/store/index.ts` — no changes needed. It already imports `{ dashboardReducer, chatReducer }` from `./slices`, which now re-exports from `@aazucena/stores`.

**Verify:** `cd apps/analytics && pnpm tsc --noEmit`

> **Known issue to watch for:** If `RootState` type inference breaks because the store slice shape changed, check that `@aazucena/stores` exports the same state shape. The `navMode` type changed from `'SYSTEM' | 'INTELLIGENCE'` to `string` in Phase A — any components doing strict literal comparisons (`=== 'SYSTEM'`) will still work at runtime; TypeScript may flag them as always-true comparisons. Fix those at the call site by widening the type or using a type assertion.

---

### B4 — Replace local schemas with `@aazucena/analytics` re-exports

The `@aazucena/analytics` package already contains identical copies of all 4 schema files (verified in audit). The analytics app's `src/lib/schemas/` can become thin re-export files.

**File:** `apps/analytics/src/lib/schemas/ingest.ts`
Replace entire content with:

```typescript
export * from '@aazucena/analytics';
```

**File:** `apps/analytics/src/lib/schemas/sentryWebhook.ts`
Replace entire content with:

```typescript
export * from '@aazucena/analytics';
```

**File:** `apps/analytics/src/lib/schemas/vercelAnalyticsWebhook.ts`
Replace entire content with:

```typescript
export * from '@aazucena/analytics';
```

**File:** `apps/analytics/src/lib/schemas/financialWebhooks.ts`
Replace entire content with:

```typescript
export * from '@aazucena/analytics';
```

**Note:** `src/lib/schemas/index.ts` currently only exports `* from './ingest'`. After the above changes, the barrel still works. No changes needed to `index.ts`.

**Verify:** `cd apps/analytics && pnpm tsc --noEmit`

> **If TypeScript throws "re-exported binding" conflicts** — it means `@aazucena/analytics` exports something with the same name as a type/const imported elsewhere. Check for naming collisions and use named re-exports: `export { SpecificSchema } from '@aazucena/analytics'` instead of `export *`.

---

### B5 — Replace local telemetry hooks with `@aazucena/hooks`

**Phase A context:** The 5 telemetry hooks in `packages/hooks/src/telemetry/` were updated to read endpoints and polling intervals from `TelemetryConfig` via `useTelemetryConfig()`. The analytics app's local hooks are now duplicates.

**Local hooks to DELETE** (after migration — do not delete until pages compile):

```
apps/analytics/src/hooks/useTelemetry.ts    → useSystemSummary, useTrendAnalysis, useTelemetryStream
apps/analytics/src/hooks/useTraffic.ts      → useTrafficStats
apps/analytics/src/hooks/usePerformance.ts  → usePerformanceStats
apps/analytics/src/hooks/useFinance.ts      → useFinanceStats
apps/analytics/src/hooks/useAiStats.ts      → useAiStats → useAiIntelligence
```

**Hooks to KEEP** (not duplicated in shared packages):

```
apps/analytics/src/hooks/useSocketListener.ts  ← keep, app-specific
apps/analytics/src/hooks/useCommandSearch.ts   ← keep (has local customizations)
apps/analytics/src/hooks/usePrompts.ts         ← keep, app-specific
```

**Migration map** (find-and-replace in all consuming pages):

| Old import                                                     | New import                                              |
| -------------------------------------------------------------- | ------------------------------------------------------- |
| `import { useSystemSummary } from '@/hooks/useTelemetry'`      | `import { useSystemSummary } from '@aazucena/hooks'`    |
| `import { useTrendAnalysis } from '@/hooks/useTelemetry'`      | `import { useTrendAnalysis } from '@aazucena/hooks'`    |
| `import { useTelemetryStream } from '@/hooks/useTelemetry'`    | `import { useTelemetryStream } from '@aazucena/hooks'`  |
| `import { useTrafficStats } from '@/hooks/useTraffic'`         | `import { useTrafficStats } from '@aazucena/hooks'`     |
| `import { usePerformanceStats } from '@/hooks/usePerformance'` | `import { usePerformanceStats } from '@aazucena/hooks'` |
| `import { useFinanceStats } from '@/hooks/useFinance'`         | `import { useFinanceStats } from '@aazucena/hooks'`     |
| `import { useAiStats } from '@/hooks/useAiStats'`              | `import { useAiIntelligence } from '@aazucena/hooks'`   |

**Important API differences to handle:**

- `useAiStats` returned `json.data` directly. `useAiIntelligence` from the package returns the same shape — no transformation needed.
- `usePerformanceStats` returned `json.data`. The package hook does the same — no transformation needed.

---

> ### ⚠️ CRITICAL: `isLive` Is No Longer Read from Redux Automatically
>
> **This is the #1 regression risk in Phase B. Gemini's code review missed it.**
>
> The local hooks read `isLive` from the Redux store internally:
>
> ```typescript
> // OLD — local hook (reads Redux automatically)
> export function usePerformanceStats() {
>   const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);
>   return useQuery({ refetchInterval: isLive ? 10000 : false });
> }
> ```
>
> The shared package hooks accept `isLive` as an **explicit option parameter**, defaulting to `false`:
>
> ```typescript
> // NEW — shared hook signature (verified in packages/hooks/src/telemetry/usePerformanceTraffic.ts)
> export function usePerformanceStats(options: UsePerformanceOptions = {}) {
>   const { isLive = false, pollingInterval } = options;
>   return useQuery({ refetchInterval: isLive ? interval : false });
> }
> ```
>
> **Consequence of naive migration:** Calling `usePerformanceStats()` with no args means `isLive` is permanently `false`. The dashboard's "pause live updates" toggle continues to update Redux state visually, but data **silently stops polling forever**.
>
> **Required fix at EVERY call site:**
>
> ```typescript
> // In each page/component that calls a shared telemetry hook:
> import { useSelector } from 'react-redux';
> import { RootState } from '@/store';
> import { usePerformanceStats } from '@aazucena/hooks';
>
> // Read isLive from Redux at the call site and pass it explicitly
> const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);
> const stats = usePerformanceStats({ isLive });
> ```
>
> Apply this pattern to ALL 5 migrated hooks:
>
> - `useSystemSummary({ isLive })`
> - `useTrendAnalysis(timeRange, { isLive })`
> - `usePerformanceStats({ isLive })`
> - `useTrafficStats({ isLive })`
> - `useFinanceStats({ isLive })`
> - `useAiIntelligence({ isLive })`
>
> **Grep to find all call sites that need updating:**
>
> ```bash
> grep -r "useSystemSummary\|useTrendAnalysis\|usePerformanceStats\|useTrafficStats\|useFinanceStats\|useAiIntelligence\|useAiStats" \
>   apps/analytics/src --include="*.tsx" --include="*.ts" -n
> ```
>
> Each result that doesn't already pass `{ isLive }` needs the fix above.

---

**Process:**

1. Search for all hook import usages: `grep -r "from '@/hooks/useTelemetry\|from '@/hooks/useTraffic\|from '@/hooks/usePerformance\|from '@/hooks/useFinance\|from '@/hooks/useAiStats'" apps/analytics/src --include="*.tsx" --include="*.ts" -l`
2. For each file: update the import to `@aazucena/hooks` AND add the `isLive` pass-through (see pattern above)
3. Run `pnpm tsc --noEmit`
4. Delete the 5 local hook files once TypeScript passes

---

### B6 — Add TelemetryProvider to RootProvider

**File:** `apps/analytics/src/providers/RootProvider.tsx`

The shared telemetry hooks (B5) use `useTelemetryConfig()` internally, which requires a `TelemetryProvider` ancestor.

```typescript
'use client';
import { useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReduxStoreProvider } from '@/store';
import { SocketProvider } from './SocketProvider';
import { useSocketListener } from '@/hooks/useSocketListener';
import { TelemetryProvider } from '@aazucena/context';

function SocketListener() {
  useSocketListener();
  return null;
}

// Module-level config — stable reference, no re-renders from useMemo needed
const telemetryConfig = {
  baseUrl: process.env.NEXT_PUBLIC_ANALYTICS_API_URL ?? '',
  secretKey: process.env.ANALYTICS_SECRET_KEY,
  // All endpoints use their defaults (/api/stats/<name>) — analytics backend matches
  defaultPollingInterval: 15000,
};

export function RootProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5000,
            refetchInterval: 5000,
          },
        },
      }),
  );

  return (
    <TelemetryProvider config={telemetryConfig}>
      <ReduxStoreProvider>
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <SocketListener />
            {children}
          </SocketProvider>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
        </QueryClientProvider>
      </ReduxStoreProvider>
    </TelemetryProvider>
  );
}
```

**Note on `process.env` in module scope:** In Next.js App Router, `'use client'` files can still access `process.env.NEXT_PUBLIC_*` at the module level because they are inlined at build time. Non-public env vars (`ANALYTICS_SECRET_KEY`) will be `undefined` on the client — this is intentional; they're only used in server-side API routes.

---

### B7 — Replace icons: `@mynaui/icons-react` → `@aazucena/icons`

**Context:** `@aazucena/icons` is a superset of `@mynaui/icons-react` — all icon names are identical, with brand icons added on top. This is a safe find-and-replace.

**26 files** use `@mynaui/icons-react`. Run from repo root:

```bash
# Find all files
grep -r "from '@mynaui/icons-react'" apps/analytics/src --include="*.tsx" --include="*.ts" -l

# Bulk replace (sed)
find apps/analytics/src -type f \( -name "*.tsx" -o -name "*.ts" \) | \
  xargs sed -i "s|from '@mynaui/icons-react'|from '@aazucena/icons'|g"
```

**Verify:** `cd apps/analytics && pnpm tsc --noEmit`

> If any icon name doesn't exist in `@aazucena/icons`, TypeScript will report a named export error. Check `packages/icons/src/index.ts` to find the correct name. The icons package re-exports everything from `@mynaui/icons-react` plus custom additions — any TS error means the icon was renamed or removed upstream.

After verifying TypeScript passes, you can optionally remove `@mynaui/icons-react` from `apps/analytics/package.json` dependencies (it's now provided transitively via `@aazucena/icons`).

---

### B8 — Sentry configuration

No separate sentry config files were found in `apps/analytics/` root. Skip this step unless `sentry.client.config.ts` or `sentry.server.config.ts` are added in the future.

If they ARE added, the correct pattern is:

```typescript
// sentry.client.config.ts
import { sentryNextConfigOptions } from '@aazucena/config/sentry/nextjs';
export default sentryNextConfigOptions({
  org: process.env.SENTRY_ORG!,
  project: process.env.SENTRY_PROJECT!,
});
```

---

### B9 — ESLint and TypeScript config (optional extension)

The analytics app already has a good ESLint config (`eslint.config.mjs`) and TypeScript config (`tsconfig.json`). Extending `@aazucena/config` presets is optional since the app's existing configs are tuned for Next.js.

**If you want to extend them:**

`apps/analytics/eslint.config.mjs` — replace `eslint-config-next` direct imports with:

```javascript
import { defineConfig, globalIgnores } from 'eslint/config';
import { nextEslintConfig } from '@aazucena/config/eslint/nextjs';

const eslintConfig = defineConfig([
  ...nextEslintConfig,
  {
    rules: {
      // Keep existing overrides from current file
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
export default eslintConfig;
```

**Important:** Only do this if `packages/config/src/eslint/nextjs.ts` exists and is compiled. Verify with: `ls packages/config/src/eslint/`. If the file is TypeScript-only and not built, skip this step — the app's existing config is functionally equivalent.

---

### B10 — ClickHouse client migration (OPTIONAL — low priority)

The `apps/analytics/src/lib/services/clickhouse.ts` uses `@clickhouse/client-web` directly with 3 separate client instances (viewer, ingest, plausible). The `@aazucena/api` package has an `initClickHouseClients` utility.

**Recommendation: SKIP for now.** The local implementation has a Plausible-specific third client that the shared package doesn't support. The local file works correctly. Migrating this brings complexity with minimal benefit.

If you choose to migrate anyway, keep the `plausibleClickhouseClient` local and only migrate the `mainClickhouseClient` and `ingestClickhouseClient` to the shared factory.

---

### B11 — Visualizations migration (OPTIONAL — medium priority)

`apps/analytics/src/components/visualizations/` contains 4 files:

- `StreamGraph.tsx` — has equivalent in `@aazucena/visualizations/d3`
- `Heatmap.tsx` — has equivalent in `@aazucena/visualizations/d3`
- `NeuralMap.tsx` — has equivalent in `@aazucena/visualizations/intelligence`
- `ChoroplethMap.tsx` — check if equivalent exists in package

**Process:**

1. Read local file
2. Read package equivalent
3. Confirm they are functionally identical (Phase A added `headerOffset` prop to package versions)
4. Update import in consuming page(s)
5. Delete local file
6. Run `pnpm tsc --noEmit`

```typescript
// New imports
import { StreamGraph } from '@aazucena/visualizations';
import { Heatmap } from '@aazucena/visualizations';
import { NeuralMap, NeuralNode } from '@aazucena/visualizations';
```

---

### B12 — UI component migration (OPTIONAL — low priority)

The plan calls for replacing some local components with `@aazucena/ui` equivalents:

| Local file                             | Potential replacement                  |
| -------------------------------------- | -------------------------------------- |
| `components/common/IntegrityBadge.tsx` | `IntegrityBadge` from `@aazucena/ui`   |
| `components/common/StatusBadge.tsx`    | `Badge` from `@aazucena/ui`            |
| `components/logs/LogDetailModal.tsx`   | Wrap with `Dialog` from `@aazucena/ui` |

**Recommendation:** Only migrate if the shared component is a drop-in match. The analytics app's local components are custom-styled for the dark terminal aesthetic. Check visual parity before deleting.

---

## Verification Sequence

Run after ALL steps are complete:

```bash
# 1. TypeScript check (most important)
cd apps/analytics && pnpm tsc --noEmit

# 2. Lint check
cd apps/analytics && pnpm lint

# 3. Format individual files (not pnpm format — it has a pre-existing failure)
npx prettier --write "apps/analytics/src/**/*.{ts,tsx}"

# 4. Build (optional, confirms Next.js can tree-shake everything)
cd apps/analytics && pnpm build
```

---

## Commit

Use conventional commit format with emoji prefix (matching recent git log style):

```bash
git add apps/analytics/
git commit -m "♻️ refactor(analytics): phase B — integrate @aazucena/* workspace packages

- add 16 workspace deps to apps/analytics/package.json
- replace local Redux slices with @aazucena/stores factory exports
- replace local schemas with @aazucena/analytics re-exports
- replace 5 telemetry hooks with @aazucena/hooks equivalents
- add TelemetryProvider to RootProvider
- migrate 26 files from @mynaui/icons-react to @aazucena/icons
- import design system CSS tokens in globals.css

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Risk Assessment

| Step                 | Risk                                                                                              | Mitigation                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| B1 pnpm install      | Low — workspace:\* links, no version conflicts                                                    | Check `pnpm tsc` after                                                                     |
| B3 Delete slices     | Medium — RootState type inference may change                                                      | Run tsc before deleting                                                                    |
| B4 Re-export schemas | Low — identical schema content                                                                    | Verify re-exported names match                                                             |
| B5 Hook migration    | **HIGH** — `isLive` no longer read from Redux automatically; silent polling regression if skipped | At EVERY call site: read `isLive` from Redux and pass `{ isLive }` explicitly to each hook |
| B6 TelemetryProvider | Low — added as outer wrapper                                                                      | Check SocketProvider still works inside                                                    |
| B7 Icon swap         | Low — 1:1 name match guaranteed                                                                   | Run tsc after bulk replace                                                                 |
| B10 ClickHouse       | High — Plausible client complexity                                                                | SKIP unless explicitly requested                                                           |
| B11 Visualizations   | Medium — visual parity check needed                                                               | Compare screenshots before/after                                                           |

---

## What Phase B Does NOT Change

- `apps/analytics/src/app/**/page.tsx` — all route pages: **import path changes + `isLive` pass-through required** (see B5 warning)
- `apps/analytics/src/components/dashboard/` — all dashboard components: **zero changes**
- `apps/analytics/src/app/api/` — all API routes: **zero changes**
- `apps/analytics/src/lib/services/strapi.ts` — Strapi client: **zero changes**
- `apps/analytics/src/hooks/useSocketListener.ts` — **keep local**
- `apps/analytics/src/hooks/useCommandSearch.ts` — **keep local**
- `apps/analytics/src/hooks/usePrompts.ts` — **keep local**

---

## Phase 4 Completion Criteria

After Phase B commit, Phase 4 will be ~95% complete. Remaining:

1. **Chromatic first baseline** — run `cd apps/storybook && pnpm chromatic` to capture initial visual snapshots
2. **CircleCI Chromatic job** — add job to `.circleci/config.yml` that runs Chromatic on every PR
3. **Portfolio importing `@aazucena/*`** — `apps/portfolio` still uses all local implementations (separate phase)

See `docs/phase-4-developer-experience.md` for the full Phase 4 plan.
