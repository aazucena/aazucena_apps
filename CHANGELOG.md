# Changelog

All notable changes to this project are documented here, grouped by phase milestone.

---

## [Phase 4 ~95% Complete] — 2026-04-18

- Merged `fix/bundler-conflicts` → `phase-4/developer-experience` (PR #2)
- CI `test_storybook` fixed: 158 tests pass in 54s (was: OOM crash after 20 min)
- Shiki WASM deferred to first code block render (`markdown-renderer.tsx` lazy-init)
- Replaced `bundledLanguages` with curated 22-language list in `shiki.ts` (~100MB → few MB)
- Gated `stories` glob on `STORYBOOK_VITEST` env — only 34 interaction-test story files load in vitest
- Tagged `editor` + `mic-selector` stories as `no-vitest` (TipTap heap, getUserMedia)
- Fixed `ArrowLink` play function: replaced `userEvent.click` with `Tab` (hash nav WebSocket crash)
- Persisted `design-system/dist` to CircleCI workspace for `test_storybook` job

## [Phase 4 ~95% Complete] — 2026-04-06

- All 13 `@aazucena/*` packages integrated into portfolio
- Journey page: all interactive components switched to `client:only="react"` (fixes D3 width=0)
- Navbar: scoped CSS transitions to prevent dark-mode toggle delay
- BackToTop: default variant changed `glass` → `default` for visibility on portfolio backgrounds
- Storybook stories updated with new visualization props (hideHeader, infoPanel,
  showYearControls, showPhysicsControls, highlightIds, laneKey, hoverPopup)
- Chromatic skipped — requires paid plan; visual regression deferred to Phase 5

## [Phase 4 Documentation Updated] — 2026-02-04

- Enhanced architecture plan: 4 → 13 specialized packages
- Renamed @aazucena/design-tokens → @aazucena/design-system (expanded scope)
- Renamed @aazucena/data → @aazucena/api (more descriptive)
- Timeline refined: 16-22 days → 21 days
- Package breakdown: design-system, ui, hooks, utils, types, constants, animations, api, forms, layouts, icons, analytics, config
- Complete responsibility matrix with sizes and priorities
- All docs synchronized (ROADMAP.md, CLAUDE.md, README.md, GEMINI.md)

## [Phase 3 Complete — Performance Optimization] — 2026-02-04

- 74.3% bundle reduction (410KB → 105KB gzipped)
- Exceeded 63% target by 11.3%
- Lazy loading: AnimationCanvas (-302KB), Modals (-2.7KB), Atmospheric layers
- Demand-based rendering: Three.js frameloop='demand'
- React 19 polyfill: suspendOnActiveViewTransition workaround
- Progressive enhancement: content first, animations second
- Time to Interactive: 5-6s → 1.5-2s (67% faster)

## [IntegrityBadge Component] — 2026-02-04

- Real-time system health indicator in Footer
- 4 states: OPERATIONAL (green pulse), DEGRADED (amber), UNKNOWN (gray), LOADING (blue pulse)
- Links to AZUCENA_LYTICS status dashboard

## [Edge Runtime Ingestion] — 2026-02-04

- Vercel Edge Runtime for <50ms response times
- Native geo-headers (x-vercel-ip-country/city/lat/lon) — eliminated ip-api.com dependency

## [Phase 2 Complete — Component Architecture] — 2026-02-02

- Scene directory flattening (depth 3 → 2)
- Deleted 24 legacy files (ground/, .BACKUP.tsx files, utilities redirect)
- Moved 7 layer files from scene/layers/ → scene/
- Updated 7 files with new import paths
- Homepage restructuring (animations → homepage)
- Journey restructuring (type-first: ui/journey, visualizations/journey)
- All 8 sections now <120 lines (component extraction complete)
- Template system (3 templates)
- Utility refactoring (15 specialized modules)
- Common components (6 new reusable components)
- Site config centralization
- CMS integration (Navigation Plugin, Footer)
- Build verified: 35.89s, all 18 pages rendered, zero TypeScript errors

## [Footer CMS Implementation] — 2026-01-27

- Extended `website-configuration` with footer fields
- Dynamic tech stack with `ui.tech-stack-item` component

## [Navigation Plugin Integration] — 2026-01-27

- CMS-driven navigation with custom fields
- Performance: API calls reduced 3→2 (33% faster)
