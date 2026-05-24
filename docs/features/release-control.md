# RELEASE_CONTROL — Feature Flag System

**Status:** Planned (post-Phase 5)
**Dashboard name:** `RELEASE_CONTROL`
**Location:** AZUCENA_LYTICS (`apps/analytics/`) + portfolio consumer (`apps/portfolio/`)

---

## Overview

A lightweight feature flag system built natively into AZUCENA_LYTICS. Flags are stored as a
Strapi content type, evaluated through a public AZUCENA_LYTICS API route, and consumed by the
portfolio with a 60-second cache and env-var fallback. The AZUCENA_LYTICS dashboard provides
a terminal-style management UI wired to the existing `SocketProvider` for real-time toggle
feedback.

---

## Motivation

| Today                                                                      | After                                            |
| -------------------------------------------------------------------------- | ------------------------------------------------ |
| `MAINTENANCE_MODE=false` in `.env` — requires Vercel env change + redeploy | Flip from AZUCENA_LYTICS dashboard, live in ≤60s |
| `PUBLIC_USE_BRAIN_ENDPOINT` controls Rin routing — same deploy cost        | Toggle Rin's LangGraph endpoint live             |
| `PUBLIC_RIN_CHARACTER_SRC` hardcoded at build time                         | Swap Rive file URL without touching Vercel       |
| No global override for `capabilities.canUseHeavyAnimations`                | Kill heavy animations for all visitors instantly |

Additionally: the `FeatureFlagForm` in `@aazucena/forms` currently has no backend. This closes
that loop — the form becomes functional, not decorative.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Strapi CMS (Railway)                               │
│  Content type: feature-flag                         │
│  Fields: key, displayName, environment, enabled,    │
│          rolloutPct, targetGroups, expiresAt        │
└────────────────────┬────────────────────────────────┘
                     │ Strapi REST API (@aazucena/api)
                     ▼
┌─────────────────────────────────────────────────────┐
│  AZUCENA_LYTICS (Vercel / Railway)                  │
│                                                     │
│  GET  /api/flags         ← public, cached 60s       │
│  GET  /api/flags/[key]   ← public, cached 60s       │
│  POST /api/flags         ← AuthGate (az_session)    │
│  PATCH /api/flags/[key]  ← AuthGate (az_session)    │
│  DELETE /api/flags/[key] ← AuthGate (az_session)    │
│                                                     │
│  Dashboard: /(dashboard)/releases                   │
│  Socket emit: flag:updated → dashboard refresh      │
└────────────────────┬────────────────────────────────┘
                     │ fetch /api/flags, revalidate:60
                     ▼
┌─────────────────────────────────────────────────────┐
│  Portfolio (Astro / Vercel)                         │
│  src/lib/flags.ts — typed evaluation + fallback     │
│  Falls back to env vars if AZUCENA_LYTICS unreachable│
└─────────────────────────────────────────────────────┘
```

**Why Strapi for storage (not direct PostgreSQL):**
Strapi is already running, already has the analytics app wired to it via `@aazucena/api`,
already has auth, and its admin panel gives a backup management UI. Adding a content type costs
nothing. Direct PostgreSQL access would require a new DB client and migration tooling in the
analytics app.

---

## 1. Strapi Content Type — `feature-flag`

**Collection:** `feature-flags` (REST: `/api/feature-flags`)

| Field          | Type                     | Notes                                                    |
| -------------- | ------------------------ | -------------------------------------------------------- |
| `key`          | UID (from `displayName`) | `rin.enabled`, `maintenance.enabled` — slugified, unique |
| `displayName`  | String (required)        | Human label shown in dashboard                           |
| `environment`  | Enum                     | `dev` \| `staging` \| `prod` — default `prod`            |
| `enabled`      | Boolean                  | Default `false`                                          |
| `rolloutPct`   | Integer (0–100)          | Default `100` — reserved for future % rollouts           |
| `targetGroups` | JSON (string[])          | `internal` \| `beta_users` \| `all` — reserved           |
| `expiresAt`    | DateTime (optional)      | Auto-disable after this timestamp                        |
| `notes`        | Text (optional)          | Internal notes — not exposed to portfolio                |

**Strapi permissions:**

- `find` + `findOne` → Public (unauthenticated) — portfolio reads without a token
- `create` + `update` + `delete` → Authenticated (AZUCENA_LYTICS uses `STRAPI_API_TOKEN`)

---

## 2. AZUCENA_LYTICS API Routes

**Strapi helpers used in these routes:**

The analytics app has two separate Strapi access paths — use the right one per operation:

| Helper              | Import                                      | Use for                                            |
| ------------------- | ------------------------------------------- | -------------------------------------------------- |
| `fetchStrapi`       | `@/lib/services/strapi`                     | All GET reads (raw REST, used by `forms/route.ts`) |
| `updateStrapiEntry` | `@/lib/strapi` (re-exports `@aazucena/api`) | PATCH/PUT updates (used by `lib/api/prompts.ts`)   |

> ⚠️ `getStrapiData` does not exist anywhere in the analytics app. Do not use it.

### `GET /api/flags` — public evaluation endpoint

```ts
// apps/analytics/src/app/api/flags/route.ts
import { NextResponse } from 'next/server';
import { fetchStrapi } from '@/lib/services/strapi';
import { cookies } from 'next/headers';

export const revalidate = 60; // Next.js route-level cache

export async function GET() {
  try {
    const data = await fetchStrapi('feature-flags', {
      query: { pagination: { pageSize: 100 }, sort: ['key:asc'] },
    });
    const flags = (data?.data ?? []).reduce((acc: Record<string, boolean>, f: any) => {
      const { key, enabled, expiresAt } = f.attributes ?? f;
      const expired = expiresAt ? new Date(expiresAt) < new Date() : false;
      acc[key] = enabled && !expired;
      return acc;
    }, {});
    return NextResponse.json(
      { flags },
      { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=30' } },
    );
  } catch {
    return NextResponse.json({ flags: {} }, { status: 200 }); // never 500 — portfolio must not break
  }
}

export async function POST(req: Request) {
  await requireAuth();
  try {
    const body = await req.json();
    const data = await fetchStrapi('feature-flags', {
      method: 'POST',
      body: JSON.stringify({ data: body }),
    });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

async function requireAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('az_session')?.value;
  const ok = !!process.env.ADMIN_SECRET && session === process.env.ADMIN_SECRET;
  if (!ok) throw new Response('Unauthorized', { status: 401 });
}
```

The route **never returns 5xx to the portfolio.** If Strapi is unreachable the response is
`{ flags: {} }` — the portfolio's fallback layer handles the empty map.

### `GET /api/flags/[key]`

```ts
// apps/analytics/src/app/api/flags/[key]/route.ts
import { NextResponse } from 'next/server';
import { fetchStrapi } from '@/lib/services/strapi';
import { updateStrapiEntry } from '@/lib/strapi'; // from @aazucena/api via barrel
import { cookies } from 'next/headers';

export const revalidate = 60;

export async function GET(_req: Request, { params }: { params: { key: string } }) {
  try {
    const data = await fetchStrapi('feature-flags', {
      query: { filters: { key: { $eq: params.key } }, pagination: { pageSize: 1 } },
    });
    const f = data?.data?.[0];
    if (!f) return NextResponse.json({ enabled: false });
    const { enabled, expiresAt } = f.attributes ?? f;
    const expired = expiresAt ? new Date(expiresAt) < new Date() : false;
    return NextResponse.json({ enabled: enabled && !expired });
  } catch {
    return NextResponse.json({ enabled: false });
  }
}

export async function PATCH(req: Request, { params }: { params: { key: string } }) {
  await requireAuth();
  try {
    // Resolve Strapi numeric id from the key slug first
    const lookup = await fetchStrapi('feature-flags', {
      query: { filters: { key: { $eq: params.key } }, pagination: { pageSize: 1 } },
    });
    const entry = lookup?.data?.[0];
    if (!entry) return NextResponse.json({ message: 'Flag not found' }, { status: 404 });

    const body = await req.json();
    const updated = await updateStrapiEntry('feature-flags', String(entry.id), body);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { key: string } }) {
  await requireAuth();
  try {
    const lookup = await fetchStrapi('feature-flags', {
      query: { filters: { key: { $eq: params.key } }, pagination: { pageSize: 1 } },
    });
    const entry = lookup?.data?.[0];
    if (!entry) return NextResponse.json({ message: 'Flag not found' }, { status: 404 });

    await fetchStrapi(`feature-flags/${entry.id}`, { method: 'DELETE' });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

async function requireAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('az_session')?.value;
  const ok = !!process.env.ADMIN_SECRET && session === process.env.ADMIN_SECRET;
  if (!ok) throw new Response('Unauthorized', { status: 401 });
}
```

> **Note on PATCH:** Strapi requires a numeric `id` for updates — not the `key` slug. The PATCH
> and DELETE handlers therefore do a one-query slug→id lookup before the write. This costs one
> extra Strapi round-trip but keeps the dashboard API surface clean (key-based, not id-based).

---

## 3. Redux Slice — `flagsSlice`

**Important:** `flagsSlice` is local to the analytics app — do **not** add it to
`packages/stores`. The stores package is shared across apps; feature flags are
AZUCENA_LYTICS-specific and must not leak into the portfolio or other consumers.

`store/slices/index.ts` currently does `export * from '@aazucena/stores'` and then adds local
aliases. Export `flagsReducer` **below** that line, following the same pattern as the existing
backwards-compat aliases.

```ts
// apps/analytics/src/store/slices/flagsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FlagRecord {
  id: number;
  key: string;
  displayName: string;
  environment: 'dev' | 'staging' | 'prod';
  enabled: boolean;
  rolloutPct: number;
  targetGroups: string[];
  expiresAt: string | null;
  notes: string | null;
}

interface FlagsState {
  items: FlagRecord[];
  filter: 'all' | 'enabled' | 'disabled';
  search: string;
}

const initialState: FlagsState = { items: [], filter: 'all', search: '' };

export const flagsSlice = createSlice({
  name: 'flags',
  initialState,
  reducers: {
    setFlags: (state, action: PayloadAction<FlagRecord[]>) => {
      state.items = action.payload;
    },
    setFilter: (state, action: PayloadAction<FlagsState['filter']>) => {
      state.filter = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    upsertFlag: (state, action: PayloadAction<FlagRecord>) => {
      const idx = state.items.findIndex((f) => f.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.unshift(action.payload);
    },
    removeFlag: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((f) => f.id !== action.payload);
    },
  },
});

export const { setFlags, setFilter, setSearch, upsertFlag, removeFlag } = flagsSlice.actions;
export const flagsReducer = flagsSlice.reducer;
```

Register in `src/store/slices/index.ts` (below the existing `export * from '@aazucena/stores'`):

```ts
// Local-only — analytics app only, not in @aazucena/stores
export { flagsReducer } from './flagsSlice';
```

Register in `src/store/index.ts`:

```ts
import { flagsReducer } from './slices';
// add to configureStore reducer map:
flags: flagsReducer,
```

---

## 4. TanStack Query Hook — `useFlags`

Follows the thin wrapper pattern (`usePerformance.ts`, `useForms.ts`):

```ts
// apps/analytics/src/hooks/useFlags.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const BASE = '/api/flags';

export function useFlags() {
  const isLive = useSelector((s: RootState) => s.dashboard.status.isLive);
  return useQuery({
    queryKey: ['flags'],
    queryFn: () => fetch(BASE + '?full=1').then((r) => r.json()),
    refetchInterval: isLive ? 30_000 : false,
  });
}

export function useToggleFlag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) =>
      fetch(`${BASE}/${key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['flags'] }),
  });
}

export function useCreateFlag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['flags'] }),
  });
}

export function useDeleteFlag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (key: string) =>
      fetch(`${BASE}/${key}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['flags'] }),
  });
}
```

---

## 5. Dashboard Page — `/(dashboard)/releases`

**Route:** `apps/analytics/src/app/(dashboard)/releases/page.tsx`

> ⚠️ **Prerequisite:** `setCategoryPreset('RELEASES')` will throw a TypeScript error until
> `RELEASES` is added to `CATEGORY_PRESETS` in `packages/stores/src/slices/dashboard.ts`.
> This must be done in Step 0 of the build sequence and the package rebuilt before this page
> compiles. See Section 8.

> ⚠️ **Nav entry:** Add to `SYSTEM_NAV` in `apps/analytics/src/components/common/Sidebar.tsx`
> (not in `layout.tsx`). Nav arrays are hardcoded — there is no auto-discovery. Pick an icon
> from `@aazucena/icons` (e.g. `ToggleRight`, `Flag`, or `Sliders`).

Visual pattern matches existing pages exactly:

- Header: `RELEASE_CONTROL` + mono subtitle + live pulse badge
- `setCategoryPreset('RELEASES')` on mount
- Three-column KPI strip: Total Flags / Active / Expiring Soon
- Filter tabs: All / Enabled / Disabled
- Search input
- Flag table (key, environment pill, enabled toggle, rollout %, expiry, actions)
- Slide-in drawer: `FeatureFlagForm` (from `@aazucena/forms`) for create / edit
- Socket listener: `flag:updated` → `upsertFlag` dispatch + toast (optional — see below)

**Color conventions (matching existing dashboards):**

```ts
const ENV_COLORS = {
  dev: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  staging: 'bg-amber-500/10  text-amber-500  border-amber-500/20',
  prod: 'bg-red-500/10    text-red-500    border-red-500/20',
};

const STATUS_COLORS = {
  enabled: 'bg-emerald-500/10 text-emerald-400',
  disabled: 'bg-zinc-500/10   text-zinc-500',
  expired: 'bg-red-500/10    text-red-400',
};
```

**Socket integration — optional (Step 7, deferred)** (same pattern as `TelemetryFeed.tsx`):

`NEXT_PUBLIC_WS_SERVER` is already optional in `SocketProvider` — if unset the provider skips
connection entirely. The page works fully without it: TanStack Query `refetchInterval: 30_000`
covers the live-mode polling path. Build Steps 1–6 first, ship, then add socket as polish.

```ts
const socket = useSocket();
useEffect(() => {
  if (!socket) return; // safe no-op when WS server is not configured
  socket.on('flag:updated', (flag: FlagRecord) => {
    dispatch(upsertFlag(flag));
    toast.success(`Flag ${flag.key} → ${flag.enabled ? 'ON' : 'OFF'}`);
  });
  return () => {
    socket.off('flag:updated');
  };
}, [socket, dispatch]);
```

---

## 6. Portfolio Consumer — `src/lib/flags.ts`

```ts
// apps/portfolio/src/lib/flags.ts

export interface FlagMap {
  'rin.enabled': boolean;
  'rin.use_brain': boolean;
  'rin.character_src': string | null;
  'maintenance.enabled': boolean;
  'animations.heavy': boolean;
  [key: string]: boolean | string | null;
}

/** Env-var fallbacks — system works identically if AZUCENA_LYTICS is unreachable */
const FALLBACKS: FlagMap = {
  'rin.enabled': true,
  'rin.use_brain': import.meta.env.PUBLIC_USE_BRAIN_ENDPOINT === 'true',
  'rin.character_src': import.meta.env.PUBLIC_RIN_CHARACTER_SRC ?? null,
  'maintenance.enabled': import.meta.env.MAINTENANCE_MODE === 'true',
  'animations.heavy': true,
};

let _cache: { flags: FlagMap; at: number } | null = null;
const TTL_MS = 60_000;

export async function getFlags(): Promise<FlagMap> {
  if (_cache && Date.now() - _cache.at < TTL_MS) return _cache.flags;

  const analyticsUrl = import.meta.env.ANALYTICS_URL;
  if (!analyticsUrl) return FALLBACKS;

  try {
    const res = await fetch(`${analyticsUrl}/api/flags`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return FALLBACKS;
    const { flags } = await res.json();
    const merged: FlagMap = { ...FALLBACKS, ...flags };
    _cache = { flags: merged, at: Date.now() };
    return merged;
  } catch {
    return FALLBACKS;
  }
}

/** Convenience — evaluate a single flag by key */
export async function flag<K extends keyof FlagMap>(key: K): Promise<FlagMap[K]> {
  const flags = await getFlags();
  return (flags[key] ?? FALLBACKS[key]) as FlagMap[K];
}
```

**Env var — `ANALYTICS_URL` (new, private):**

`flags.ts` runs server-side inside Astro frontmatter (Node.js context), so it does not need
a `PUBLIC_` prefix and must not use one. The portfolio already has `PUBLIC_ANALYTICS_API_URL`
(browser-exposed dashboard URL) and `ANALYTICS_INGEST_URL` (private server-side ingest URL).
`ANALYTICS_URL` follows the same private pattern as `ANALYTICS_INGEST_URL`.

Add to `apps/portfolio/.env.example`:

```
# ANALYTICS_URL — private base URL for AZUCENA_LYTICS (server-side only, no PUBLIC_ prefix)
# Used by src/lib/flags.ts to evaluate feature flags at SSR time.
# Leave empty to disable remote flags and fall back to env var defaults.
ANALYTICS_URL=
```

**Usage in Astro pages (server-side):**

```ts
// apps/portfolio/src/pages/index.astro
import { getFlags } from '~/lib/flags';
const flags = await getFlags();
// flags['rin.enabled'], flags['maintenance.enabled'], etc.
```

**Usage in React components:**
Because React components run client-side (or in Astro islands), flags need to be passed down
as props from the Astro page — not fetched inside React. The Astro frontmatter fetches once,
passes as `initialFlags` prop.

---

## 7. Seed Flags

These are the first flags to create in Strapi after the content type is set up:

| Key                   | Display Name              | Environment | Default | Replaces                    |
| --------------------- | ------------------------- | ----------- | ------- | --------------------------- |
| `rin.enabled`         | Rin Assistant             | prod        | `true`  | — (new kill-switch)         |
| `rin.use_brain`       | Rin → LangGraph Brain     | prod        | `false` | `PUBLIC_USE_BRAIN_ENDPOINT` |
| `rin.character_src`   | Rin Rive Character URL    | prod        | `null`  | `PUBLIC_RIN_CHARACTER_SRC`  |
| `maintenance.enabled` | Maintenance Mode          | prod        | `false` | `MAINTENANCE_MODE`          |
| `animations.heavy`    | Heavy Animations (global) | prod        | `true`  | — (new global override)     |

**Migration plan for existing env vars:** Keep the env vars as fallbacks indefinitely. Do not
remove them. The `flags.ts` consumer layer merges flag API response over env var defaults —
the portfolio degrades gracefully if AZUCENA_LYTICS is down, not deploy-blocked.

---

## 8. Build Sequence

```
Step 0 — Package prereq: add RELEASES category preset (30min)
  ⚠️ Must be done before Step 5 or the dashboard page will not compile.
  - packages/stores/src/slices/dashboard.ts
      Add RELEASES: ['Flag Toggle', 'Flag Create', 'Flag Delete'] to CATEGORY_PRESETS
  - Rebuild @aazucena/stores so analytics app picks it up

Step 1 — Strapi content type (2–3h)
  - Add feature-flag collection in Strapi admin
  - Set public find/findOne permissions
  - Seed the 5 initial flags

Step 2 — AZUCENA_LYTICS API routes (2–3h)
  - apps/analytics/src/app/api/flags/route.ts
      GET (public, fetchStrapi) + POST (auth-gated, fetchStrapi)
  - apps/analytics/src/app/api/flags/[key]/route.ts
      GET (public, fetchStrapi) + PATCH (auth-gated, slug→id lookup then updateStrapiEntry)
      + DELETE (auth-gated, slug→id lookup then fetchStrapi DELETE)

Step 3 — Redux slice + store registration (1h)
  - apps/analytics/src/store/slices/flagsSlice.ts  ← local, not in @aazucena/stores
  - apps/analytics/src/store/slices/index.ts       ← export flagsReducer below @aazucena/stores line
  - apps/analytics/src/store/index.ts              ← add flags: flagsReducer

Step 4 — TanStack Query hooks (1h)
  - apps/analytics/src/hooks/useFlags.ts

Step 5 — Dashboard page (4–6h)
  - apps/analytics/src/app/(dashboard)/releases/page.tsx
  - apps/analytics/src/components/common/Sidebar.tsx  ← add nav entry to SYSTEM_NAV
  ⚠️ Requires Step 0 complete before this compiles (RELEASES in CATEGORY_PRESETS)
  ⚠️ Rin assistant changes must be committed + stable before wiring flags into it

Step 6 — Portfolio consumer (2h)
  - apps/portfolio/src/lib/flags.ts
  - apps/portfolio/.env.example  ← add ANALYTICS_URL (private, server-side only)
  - Wire flags into: middleware.ts (maintenance.enabled), AnimationCanvas.tsx (animations.heavy)
  - Wire into Rin components only after assistant branch is stable (see Step 5 note)

Step 7 — Socket emit on flag toggle (optional, deferred) (1h)
  ⚠️ Requires NEXT_PUBLIC_WS_SERVER to be configured and WS server running.
  ⚠️ Build and ship Steps 1–6 first. The page works without this via TanStack Query polling.
  - Emit flag:updated from PATCH handler after successful Strapi write
  - Socket listener already in releases/page.tsx (guarded by if (!socket) return)

Total estimate (Steps 0–6): ~11–14h
Total estimate (Steps 0–7): ~12–15h
```

---

## 9. Files to Create / Modify

| File                                                         | Action     | Notes                                                                 |
| ------------------------------------------------------------ | ---------- | --------------------------------------------------------------------- |
| `packages/stores/src/slices/dashboard.ts`                    | **Modify** | Add `RELEASES` to `CATEGORY_PRESETS` — Step 0                         |
| `apps/analytics/src/app/api/flags/route.ts`                  | **Create** | `GET` + `POST`                                                        |
| `apps/analytics/src/app/api/flags/[key]/route.ts`            | **Create** | `GET` + `PATCH` + `DELETE`                                            |
| `apps/analytics/src/store/slices/flagsSlice.ts`              | **Create** | Local to analytics only                                               |
| `apps/analytics/src/store/slices/index.ts`                   | **Modify** | Export `flagsReducer` below `@aazucena/stores` line                   |
| `apps/analytics/src/store/index.ts`                          | **Modify** | Add `flags: flagsReducer` to store                                    |
| `apps/analytics/src/hooks/useFlags.ts`                       | **Create** |                                                                       |
| `apps/analytics/src/app/(dashboard)/releases/page.tsx`       | **Create** |                                                                       |
| `apps/analytics/src/components/common/Sidebar.tsx`           | **Modify** | Add nav entry to `SYSTEM_NAV` array                                   |
| `apps/portfolio/src/lib/flags.ts`                            | **Create** |                                                                       |
| `apps/portfolio/.env.example`                                | **Modify** | Add `ANALYTICS_URL` (private, server-side)                            |
| `apps/portfolio/src/middleware.ts`                           | **Modify** | Replace `MAINTENANCE_MODE` env var with `flag('maintenance.enabled')` |
| `apps/portfolio/src/components/homepage/AnimationCanvas.tsx` | **Modify** | Gate on `flags['animations.heavy']`                                   |
| `apps/portfolio/src/components/assistant/AssistantChat.tsx`  | **Modify** | Gate on `flags['rin.enabled']` — only after Rin branch is stable      |

**Files that do NOT need changes:**

- `apps/analytics/src/app/(dashboard)/layout.tsx` — nav is in `Sidebar.tsx`, not here
- `apps/analytics/src/config/sentinel.ts` — only re-exports from `@aazucena/constants`; `RELEASES` goes in `packages/stores`

---

## 10. Out of Scope (for this iteration)

- **% rollouts to real users** — `rolloutPct` field exists but portfolio has no user identity.
  Reserved for a future visitor-token or session-hash bucketing layer.
- **Target group segmentation** — same reason; `targetGroups` field persisted but not evaluated.
- **Flag history / audit log** — could be a ClickHouse append-only table in a future iteration
  (flag key, previous value, new value, changed_at). Fits AZUCENA_LYTICS's existing ClickHouse
  pattern perfectly.
- **Portfolio-side real-time push** — 60s cache TTL is sufficient for a portfolio. Real-time is
  dashboard-only (AZUCENA_LYTICS UI reflects toggles instantly via socket).
- **Removing env vars** — env vars stay as permanent fallbacks. Never hard-depend on the flag
  service being reachable.

---

## Known Risks

| Risk                                 | Mitigation                                                                              |
| ------------------------------------ | --------------------------------------------------------------------------------------- |
| AZUCENA_LYTICS unreachable           | `flags.ts` catches all errors, returns `FALLBACKS`                                      |
| Strapi down                          | `/api/flags` returns `{ flags: {} }` (never 5xx to portfolio)                           |
| Flag fetch adds latency to Astro SSR | `AbortSignal.timeout(3000)` caps it at 3s; in-memory cache prevents re-fetch within 60s |
| Expired flag still active            | `expiresAt` check in both `/api/flags` route and `flags.ts` consumer                    |
| Accidental public write to Strapi    | Strapi public role has `find`/`findOne` only; writes require bearer token               |
