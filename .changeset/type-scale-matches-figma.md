---
'@aazucena/design-system': minor
---

The Tailwind preset no longer redefines Tailwind's size keys. `fontSizes` keeps only the named sizes that match the Figma text styles (`h1`…`h6`, `body`, `caption`); `text-xs` through `text-6xl` are Tailwind's stock values again (`text-sm` is 14px, Figma's Label/Button). Consumers of the preset, such as Storybook, now render components at the same size as Figma and the apps. Removed from `fontSizes`: `xs`, `sm`, `base`, `lg`, `xl`, `2xl` to `6xl`.
