---
'@aazucena/ui': patch
'@aazucena/forms': patch
---

Second pass on the 2026-11-13 accessibility audit. DownloadTrigger, Transfer, Chip and Editor set `aria-disabled` when disabled. The Editor textbox takes an `aria-label` (falls back to its placeholder) and InputOTP is named "One-time code". `ItemGroup` no longer claims `role="list"` and InfiniteScroller renders a `div`, since neither holds list items. Form templates use `text-success`, `text-signal`, `text-warning` and `text-alert` where they used stock green, blue, amber and red, which measured 2.9 to 3.3:1.
