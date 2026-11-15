---
'@aazucena/layouts': minor
'@aazucena/ui': patch
---

New `SkipLink` component: a "Skip to main content" link that is hidden until focused and sits on the `--z-skip-link` tier. `DashboardLayout` renders it by default and gives its `main` region an id and `tabIndex={-1}` so the link can move focus there (new `mainId`, `mainLabel` and `skipLink` props). `MainContainer` takes an `id` and is focusable when rendered `as="main"`. `PageTransition` has `focusOnMount` for client-side route changes. In ui, `DashboardTitle` is an `h2` (it was an `h3` directly under the page `h1`).
