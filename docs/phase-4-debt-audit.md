# Phase 4: Technical Debt & Duplication Audit

📍 **Parent Document:** [Phase 4: DX Plan](../phase-4-developer-experience.md)

This audit establishes the baseline for the **565 lines of code elimination** goal. It identifies redundant components, utilities, and configurations currently existing in multiple locations.

---

## 🛑 Identified Duplication

### 1. UI Components
| Component | Locations | Current Total Lines | Status |
|-----------|-----------|--------------------|--------|
| `StatusBadge` | `analytics/common/StatusBadge.tsx`, `portfolio/ui/StatusBadge.tsx` | ~150 lines | 🚩 REDUNDANT |
| `ThemeToggle` | `analytics/common/ThemeToggle.tsx`, `portfolio/ui/ThemeToggle.tsx` | ~240 lines | 🚩 REDUNDANT |
| `IntegrityBadge`| `analytics/common/IntegrityBadge.tsx`, `portfolio/telemetry/IntegrityBadge.tsx` | ~120 lines | 🚩 REDUNDANT |

### 2. Utility Functions
| Utility | Locations | Description | Status |
|---------|-----------|-------------|--------|
| `cn` (base) | `analytics/lib/utils/base.ts`, `portfolio/lib/utils/base.ts` | Tailwind merging logic | 🚩 DUPLICATED |
| `strapi` client | `analytics/lib/strapi.ts`, `portfolio/lib/strapi.ts` | Base API configuration | 🚩 DUPLICATED |
| `text` utils | `analytics/lib/utils/text.ts`, `portfolio/lib/utils/text.ts` | String formatting | 🚩 DUPLICATED |

### 3. Zod Schemas & Validators
| Schema | Locations | Description | Status |
|--------|-----------|-------------|--------|
| `shared-components` | `analytics/lib/validators/components.ts`, `portfolio/lib/validators/components.ts` | Strapi shared blocks | 🚩 DUPLICATED |
| `enums` | `analytics/lib/validators/enums.ts`, `portfolio/lib/validators/enums.ts` | Global enums | 🚩 DUPLICATED |

---

## 📊 Line Count Baseline (Pre-Migration)

| Category | Estimated Total Lines | Target Savings (52%) | Final Goal |
|----------|----------------------|----------------------|------------|
| Composed Components | 510 lines | -250 lines | 260 lines |
| Utility Functions | 280 lines | -140 lines | 140 lines |
| Validators/Schemas | 300 lines | -175 lines | 125 lines |
| **TOTAL** | **1,090 lines** | **-565 lines** | **525 lines** |

---

## 🛠️ Refactoring Plan

1. **Extract `cn` and base utils** to `@aazucena/utils`.
2. **Move all Zod schemas** to `@aazucena/api/validators`.
3. **Consolidate `StatusBadge` and `ThemeToggle`** into `@aazucena/ui/composed`.
4. **Delete original files** in `apps/` after verifying new imports work.

---

**Last Updated:** 2026-02-05
**Status:** 📊 AUDIT COMPLETE (Baseline Established)
