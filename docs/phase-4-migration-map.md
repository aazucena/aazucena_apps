# Phase 4: Migration Mapping Manifest

📍 **Parent Document:** [Phase 4: DX Plan](../phase-4-developer-experience.md)

This manifest maps the current monolithic structure of `apps/portfolio` and `apps/analytics` to the new **13 specialized packages** in `packages/`. This ensures zero orphaned code and clean separation of concerns.

---

## 🗺️ Source-to-Destination Map

### 1. `@aazucena/config` (Renamed from shared)
| Source | Type | Destination |
|--------|------|-------------|
| `packages/shared/eslint/*` | Build Config | `packages/config/eslint/*` |
| `packages/shared/typescript/*` | Build Config | `packages/config/typescript/*` |
| `packages/shared/tailwind/*` | Build Config | `packages/config/tailwind/*` |

### 2. `@aazucena/design-system` (New)
| Source | Type | Destination |
|--------|------|-------------|
| `apps/portfolio/tailwind.config.ts` (colors) | Tokens | `packages/design-system/tokens/colors.ts` |
| `apps/analytics/tailwind.config.ts` (colors) | Tokens | `packages/design-system/tokens/colors.ts` |
| `apps/portfolio/src/lib/utils/tagColors.ts` | Tokens | `packages/design-system/tokens/colors.ts` |
| `apps/portfolio/src/lib/utils/scene/phaseColors.ts` | Tokens | `packages/design-system/tokens/colors.ts` |

### 3. `@aazucena/ui` (Existing + Expansion)
| Source | Type | Destination |
|--------|------|-------------|
| `apps/analytics/src/components/common/StatusBadge.tsx` | Component | `packages/ui/composed/StatusBadge.tsx` |
| `apps/analytics/src/components/common/ThemeToggle.tsx` | Component | `packages/ui/composed/ThemeToggle.tsx` |
| `apps/analytics/src/components/common/IntegrityBadge.tsx`| Component | `packages/ui/composed/IntegrityBadge.tsx` |
| `apps/analytics/src/components/common/MarkdownRenderer.tsx`| Component | `packages/ui/composed/MarkdownRenderer.tsx` |

### 4. `@aazucena/hooks` (New)
| Source | Type | Destination |
|--------|------|-------------|
| `apps/portfolio/src/hooks/animations/useDeviceCapabilities.ts` | Hook | `packages/hooks/device/useDeviceCapabilities.ts` |
| `apps/portfolio/src/hooks/animations/useLocalStorage.ts` | Hook | `packages/hooks/state/useLocalStorage.ts` |
| `apps/analytics/src/hooks/useTelemetry.ts` | Hook | `packages/hooks/data/useTelemetry.ts` |
| `apps/analytics/src/hooks/useSocketListener.ts` | Hook | `packages/hooks/data/useSocketListener.ts` |

### 5. `@aazucena/utils` (New)
| Source | Type | Destination |
|--------|------|-------------|
| `apps/portfolio/src/lib/utils/base.ts` | Util | `packages/utils/base.ts` |
| `apps/portfolio/src/lib/utils/text.ts` | Util | `packages/utils/string/text.ts` |
| `apps/portfolio/src/lib/utils/url.ts` | Util | `packages/utils/dom/url.ts` |
| `apps/portfolio/src/lib/utils/debounce.ts` | Util | `packages/utils/function/debounce.ts` |

### 6. `@aazucena/types` (New)
| Source | Type | Destination |
|--------|------|-------------|
| `apps/portfolio/src/types/*` | Types | `packages/types/*` |
| `apps/analytics/src/types/*` | Types | `packages/types/*` |
| `apps/portfolio/src/lib/transformers/*.ts` (Interfaces) | Types | `packages/types/api/transformers.ts` |

### 7. `@aazucena/constants` (New)
| Source | Type | Destination |
|--------|------|-------------|
| `apps/portfolio/src/config/animations/constants.ts` | Const | `packages/constants/animations.ts` |
| `apps/analytics/src/config/sentinel.ts` | Const | `packages/constants/sentinel.ts` |

### 8. `@aazucena/animations` (New)
| Source | Type | Destination |
|--------|------|-------------|
| `apps/portfolio/src/lib/utils/animations/*` | Helpers | `packages/animations/utils/*` |
| `apps/portfolio/src/lib/utils/scene/*` | Helpers | `packages/animations/three/*` |

### 9. `@aazucena/api` (New)
| Source | Type | Destination |
|--------|------|-------------|
| `apps/portfolio/src/lib/api/*` | API Client | `packages/api/clients/portfolio/*` |
| `apps/analytics/src/lib/api/*` | API Client | `packages/api/clients/analytics/*` |
| `apps/portfolio/src/lib/validators/*` | Zod | `packages/api/validators/portfolio/*` |
| `apps/portfolio/src/lib/transformers/*` | Transformer | `packages/api/transformers/portfolio/*` |

### 10. `@aazucena/forms` (New)
| Source | Type | Destination |
|--------|------|-------------|
| `apps/portfolio/src/lib/utils/contact-form.ts` | Form Util | `packages/forms/utils/contact.ts` |
| `apps/portfolio/src/lib/validators/contact-form.ts` | Schema | `packages/forms/validators/contact.ts` |

### 11. `@aazucena/layouts` (New)
| Source | Type | Destination |
|--------|------|-------------|
| `apps/portfolio/src/layouts/BaseLayout.astro` | Layout | `packages/layouts/astro/BaseLayout.astro` |
| `apps/portfolio/src/components/sections/layouts/*` | Layout | `packages/layouts/react/SectionLayout.tsx` |

### 12. `@aazucena/icons` (New)
| Source | Type | Destination |
|--------|------|-------------|
| `apps/portfolio/src/lib/utils/icons.ts` | Icon Util | `packages/icons/registry.ts` |

### 13. `@aazucena/analytics` (New)
| Source | Type | Destination |
|--------|------|-------------|
| `apps/portfolio/src/lib/services/telemetry.ts` | Service | `packages/analytics/services/telemetry.ts` |
| `apps/portfolio/src/lib/services/performance.ts` | Service | `packages/analytics/services/performance.ts` |

---

## 📋 Orphaned Code Check (Pre-Migration)
*List of files that will be DELETED after migration:*
- [ ] `apps/portfolio/src/lib/utils.ts` (Consolidated into packages)
- [ ] `apps/analytics/src/lib/utils/base.ts` (Duplicate of portfolio base)
- [ ] `apps/analytics/src/components/common/StatusBadge.tsx` (Duplicate)
- [ ] `apps/analytics/src/components/common/ThemeToggle.tsx` (Duplicate)

---

## 🚦 Migration Priority
1. **Level 0 (Foundation):** `config`, `types`, `constants`
2. **Level 1 (Core Logic):** `utils`, `design-system`, `api`
3. **Level 2 (Capabilities):** `hooks`, `icons`, `analytics`, `animations`
4. **Level 3 (UI/UX):** `ui`, `forms`, `layouts`

---

**Last Updated:** 2026-02-05
**Status:** 🗺️ MAPPING COMPLETE
