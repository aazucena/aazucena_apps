---
'@aazucena/ui': minor
---

Fourteen components that only worked with a mouse now work from the keyboard. `SortableList` handles are tab stops that move their item with Arrow Up/Down, Home and End and announce the new position (new `getHandleLabel` prop). `ReactWheelPicker` is a `spinbutton` with arrow, Page, Home and End keys. `MegaMenu` is a disclosure navigation: parents are `aria-expanded` buttons, Arrow Down enters the panel and Escape closes it. `TieredMenu` follows the menu pattern, with Arrow Right and Left for submenus. `DataTable` sorts through buttons inside the header cells, which carry `aria-sort`, and clickable rows respond to Enter. `SchemaDisplay` and `FileTree` rows, `Gantt` bars, `Dock` items, `ChatImage` and `HoldToConfirm` are buttons. `CardStack` has a "Next card" button (`nextLabel`). `ImageCrop` moves and resizes with the arrow keys. `SignaturePad` accepts a typed name (`allowTyped`, `typedLabel`, `label`).
