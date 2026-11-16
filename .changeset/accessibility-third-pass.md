---
'@aazucena/ui': patch
'@aazucena/forms': patch
'@aazucena/visualizations': patch
---

Fixes found by the full accessibility re-sweep. `ChatThread` renders a `ChatThreadAction` beside its button instead of inside it (a button cannot contain a button) and marks each thread as a list item. `ListGroupItem` with `asButton` puts the button inside a list item rather than giving the button `role="listitem"`. Solid status fills in the form templates use their role foreground colour; they had kept `text-white`, which measured 1.7 to 2.7:1 on the role colours. The SpiderChart year slider and ForceDirectedGraph sliders are named.
