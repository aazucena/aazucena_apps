---
'@aazucena/design-system': minor
---

Every vibe passes the text-on-tint contrast rule the default vibe holds. In 15 vibes, `success`, the accent (`signal` or `primary`) or `mutedForeground` moved one to three palette steps so that role-coloured text reaches 4.5:1 on its own 15% tint over the background and 10% tint over a panel, and muted text reaches 4.5:1 on the background, a panel and a signal tint. Light-mode `success` was the largest gap: it measured 2 to 3.5:1 on the plain background in ten vibes. Five seasonal vibes set a lighter `alert` or `warning` in dark mode (`coral 300`, new `avra-amber 300`), and Nature dark uses a new `forest 450` for muted text. A test covers all 17 vibes in both modes.
