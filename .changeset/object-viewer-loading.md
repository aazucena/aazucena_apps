---
'@aazucena/animations': patch
---

`ObjectViewer` no longer throws `Failed to execute 'removeChild'` while its scene loads. The loading skeleton was a drei `<Html>` Suspense fallback with its own React root; `ObjectViewerLoading` is now plain DOM over the canvas, shown while the asset loader is active.
