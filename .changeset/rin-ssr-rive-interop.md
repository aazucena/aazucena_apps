---
'@aazucena/ui': patch
---

`RinCharacter` no longer breaks server rendering: it reads `@rive-app/react-webgl2`'s re-exported names from the CommonJS default export when Node can't detect them.
