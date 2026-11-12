---
'@aazucena/ui': minor
---

Instrument pass on every component:

- Hover rows use the `state` tone instead of a solid accent fill.
- Cyber secondary text uses muted foreground instead of translucent signal, so it reaches AA.
- Labels, chips and toolbars are square, not pills.
- The preloader and the former allowlist (brand logo, device mockup, map, color picker, QR code) use the instrument tokens.

`Panel` now defaults to `status="none"` (no indicator); pass `status="live"` for stream-fed panels. Destructive badges render their own ▲ marker, and select items use the control radius. Layout fixes cover the meter label gap, hexagon card text, avatar group rings, the mic selector error and the wheel picker's fade mask.
