---
'@aazucena/ui': minor
'@aazucena/forms': patch
'@aazucena/utils': patch
---

Fixes from the 2026-11-13 accessibility audit (WCAG 2.2 AA).

- **Contrast.** Text is no longer dimmed with `opacity-*` or a translucent text colour; quiet text is `text-muted-foreground`. Tints under signal and status text stop at 10%. Glass surfaces in dark mode sit on `panel-raised`, where muted text passes. Code blocks use `github-light-high-contrast` in light mode and now switch to their dark palette in dark mode.
- **Names.** Icon-only buttons, selects, range inputs and the notification bell have accessible names. `Progress` falls back to the name "Progress"; pass `aria-label` to say what is loading.
- **Focus.** Every control that removed the browser outline shows a signal outline on keyboard focus, on the control or on its wrapper.
- **Widget patterns.** `Combobox` and `AutoComplete` move through options with the arrow keys and close with Escape. `Tree` has one tab stop and arrow-key movement. `SegmentedControl` is a radio group (was a tab list with no panels). `Tour` steps take focus, trap Tab and close with Escape. `Cascader`, `PanelMenu` and `Spoiler` report `aria-expanded`. `Meter` and `Gauge` have `role="meter"` with their value.
- **Forms.** Six templates link their error text to the field with `aria-invalid` and `aria-describedby`, and the error is announced.
- **Status.** The chat feed is a `log`; clipboard, timers, notifications, validator and file upload announce changes.
- **Targets and scrolling.** Rating stars, attachment actions and the copy and show buttons are at least 24px; pagination dots are spaced 16px apart. `ScrollArea`, `VirtualList` and `Gantt` can be scrolled from the keyboard.
