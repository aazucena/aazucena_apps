---
'@aazucena/ui': minor
'@aazucena/design-system': patch
---

Page-level layers use the z-index tiers instead of raw values. Scrims sit on `--z-overlay` (1300), dialog, sheet, drawer and lightbox panels on `--z-modal` (1400), and portalled menus (popover, dropdown menu, context menu, menubar, hover card, select) on `--z-popover` (1500), so they open above modals. Tooltips use `--z-tooltip`, fixed chrome `--z-fixed`, sticky headers `--z-sticky`, in-place menus `--z-dropdown`. The design system now emits `--z-skip-link` (it was `--z-skipLink`, which `var(--z-skip-link)` couldn't find).
