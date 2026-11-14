---
'@aazucena/design-system': minor
---

Light-mode role colours are darker so they pass WCAG AA as text on their own tint. A component that sets `bg-primary/10 text-primary`, or a status badge on its 15% tint, measured 3.9 to 4.2:1 on the page background; it now measures 4.6:1 or more. Changed primitives: signal 700 `#007493` → `#006584`, coral 700 `#c14319` → `#ac2f00`, mint 700 `#00735b` → `#006b53`, amber 700 `#855e00` → `#7d5700`, ink 600 (muted text) `#536d79` → `#49626e`. Hues are unchanged and dark mode is untouched. A test holds the rule: role text on a 15% tint, and muted text on a signal tint, stay at 4.5:1.
