---
'@aazucena/ui': minor
---

State changes run on the motion token and transition only what changes. Durations of 300ms and under, and 500ms on color, opacity and transform changes, are now `duration-(--motion-base)` (200ms). `transition-all` is gone from every component: interactive elements name their properties (`transition-colors`, `transition-transform`, `transition-[width]`…), and containers with no state of their own no longer have a transition, so they don't fade when the theme toggles. If you added hover classes to such a container through `className`, add a `transition-*` class alongside them.
