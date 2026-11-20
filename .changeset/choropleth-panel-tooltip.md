---
'@aazucena/visualizations': patch
---

`ChoroplethMap` takes `hideHeader` so a surrounding Panel can carry the label, and `unit` for the hover tooltip. The hover tooltip is now the shared `chartTooltip` (region, value and share of total) instead of the browser's native title.
