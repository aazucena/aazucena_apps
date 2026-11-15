# Accessibility audit: the Avra library

**Date:** 2026-11-13 · **Standard:** WCAG 2.2 Level AA, with the WAI-ARIA Authoring Practices (APG) for custom widgets · **Scope:** every story in Storybook (1,832 stories, 376 components across `@aazucena/ui`, `@aazucena/forms`, `@aazucena/layouts`, recipes, charts and animations) · **Status:** P0 and P1 fixed on 2026-11-14; see [Results after the fixes](#results-after-the-fixes). The findings below describe the library as audited.

## Summary

**Accessibility score: 2 of 4 (partial).** The Radix-based primitives (dialog, select, tabs, menus, checkbox, switch, slider) are sound. The problems are concentrated in three places: text dimmed below the contrast minimum, controls with no accessible name, and hand-built widgets that only work with a mouse.

| Severity | Meaning                    | Findings                           |
| -------- | -------------------------- | ---------------------------------- |
| P0       | A task cannot be completed | 1 (keyboard access, 14 components) |
| P1       | Fails WCAG 2.2 AA          | 8                                  |
| P2       | Minor, or a best practice  | 5                                  |

- **145 of 376 components** have no automated violation in light mode; 231 have at least one.
- **268 of 1,832 stories** are fully clean in light mode.
- Contrast fails in **212 components** in at least one mode (207 light, 157 dark).

## How it was measured

| Layer                                              | Coverage                                                                                  | Tool                                                               |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Automated rules                                    | 1,832 stories, light mode, all WCAG A/AA rules plus best practice; contrast rerun in dark | axe-core 4.14 in Chromium                                          |
| Keyboard, focus, target size, reflow, text spacing | 749 stories (the first two of each component)                                             | Playwright script                                                  |
| Lint                                               | 413 files in ui, forms, layouts                                                           | `eslint-plugin-jsx-a11y`, every rule on                            |
| Source searches                                    | Same files                                                                                | Patterns for unnamed icon buttons, `outline-none`, unlinked errors |
| Manual review                                      | 90 hand-built and layout components, read against the APG                                 | Source reading, with 8 confirmed by keyboard in the browser        |

The first "no visible focus" pass flagged 49 components. A recheck with transitions disabled cut that to 17; the other 32 were false positives caused by focus rings that fade in. Raw results are in the session scratchpad (`a11y/axe/*.jsonl`, `a11y/kbd/kbd.jsonl`, `a11y/recheck.jsonl`, `a11y/probes.json`) and are not committed.

**Not tested:** real screen readers (NVDA, JAWS, VoiceOver, TalkBack), physical touch devices, 200% browser zoom, the portfolio and analytics apps, and vibes other than the default. Nine Three.js object-viewer stories failed to load in the dark contrast run. Automated rules catch roughly a third of real accessibility problems, so a clean result is not proof of conformance.

---

## P0: blocks a task

### 1. Components that cannot be used with a keyboard (WCAG 2.1.1, 2.5.7)

Confirmed in the browser:

| Component          | What happens                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| `SortableList`     | Reordering is HTML drag only. No focusable element, no buttons, no key handling.                   |
| `ReactWheelPicker` | Nothing is focusable and no role is exposed. The value cannot be changed.                          |
| `MegaMenu`         | Submenus open on mouse hover only. Enter and Arrow Down on a top-level item do nothing.            |
| `DataTable`        | Sortable headers are `th` elements with a click handler: not focusable, no button, no `aria-sort`. |

Found by the pointer-cursor check (clickable but not keyboard reachable): `SchemaDisplay`, `FileTree`, `Gantt` bars, `Dock`, `FilterBar`, `ChatImage`, `CardStack`, `HoldToConfirm`.

From source, not yet confirmed in the browser: `ImageCrop` (mouse handlers only, no touch or keys), `TieredMenu` nested submenus (hover only; the top level does open with Enter), `SignaturePad` (drawing has no alternative such as a typed name).

**Fix:** use real buttons; add "move up / move down" controls to `SortableList` and `Gantt`; open menus on focus and Enter with arrow-key movement; make the wheel picker a `listbox` or `spinbutton`; sort buttons inside `th` with `aria-sort`; arrow-key nudging on crop handles.

---

## P1: fails WCAG 2.2 AA

### 2. Text contrast (1.4.3)

605 stories in light mode and 373 in dark, 212 components in total. About 2,400 failing text elements trace to a few source patterns:

| Cause                                                                                                                        | Failing elements | Typical ratio             |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------- |
| Opacity on the text itself (`opacity-40` is the largest, also `opacity-20/30/50/60`, `text-foreground/40`, `text-signal/40`) | 1,326            | 1.5 to 3.3:1              |
| Dimming or colour inherited from a parent                                                                                    | 803              | varies                    |
| `bg-primary/10 text-primary` (signal text on its own tint)                                                                   | 164 uses         | 4.11:1 light              |
| `text-muted-foreground` on a tinted surface                                                                                  | 82               | 4.21:1 light, 3.69:1 dark |
| Code block syntax colours in dark mode (`#032f62` on `#112027`)                                                              | 40               | 1.25:1                    |

In source: 187 opacity-dimmed text uses and 108 signal-on-tint uses in `packages/ui` alone. The object viewer's HUD text (`#17819d` on `#f4fafd`, 4.27:1) accounts for another 138.

**Fix:** replace opacity dimming with `text-muted-foreground`, which passes on base surfaces; darken signal text on its tint (or lighten the tint) by one step, as a token change; give code blocks a dark-mode syntax palette; add a guard test against `opacity-*` on text elements. This also closes the open backlog item "Token contrast pass, then make a11y blocking".

### 3. Controls and images with no accessible name (4.1.2, 1.1.1, 2.4.4)

| Rule                       | Stories | Components                                                                                                                                                                                                                                  |
| -------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Buttons with no name       | 104     | 39: TokenInput, NumberField, Pagination, KeyValue, ChatAttachments, AudioEmbed, Playback, TreeTable, ChatInput, FilePreview, MusicPlayer, Chat, ChatModelSelector, SpeechInput, SplitButton, Table, BottomNavigation, ActionBar and 21 more |
| Inputs with no label       | 36      | 10: Transfer, MusicPlayer, Datepicker, ColorPicker, InputOTP, FeatureFlagForm, MarkdownRenderer, Field, MaskInput                                                                                                                           |
| Selects with no label      | 10      | ConditionRules, SecurityQuestionsForm, FilterBar                                                                                                                                                                                            |
| Progress bars with no name | 11      | Progress, Distribution, Poll                                                                                                                                                                                                                |
| Images with no `alt`       | 10      | Showcase, Avatar, Identity, Testimonial, Item, ContentCard                                                                                                                                                                                  |
| Links with no name         | 5       | ChatAttachments, Share                                                                                                                                                                                                                      |
| Other                      | 19      | QrCode (`svg` with `role="img"` and no title), Editor (textbox), Map markers (from Leaflet)                                                                                                                                                 |

Almost all the buttons are icon-only. The source search found 14 of them directly, for example `number-field.tsx:79`, `token-input.tsx:179`, `chat/chat-input.tsx:193`.

**Fix:** `aria-label` on icon-only controls; a required `label` or `aria-label` prop on `Progress`; `alt` passed through on `Avatar` and the image components; turn on the `control-has-associated-label` lint rule so new ones fail the build.

### 4. Keyboard focus is not visible (2.4.7)

17 components, after the recheck:

Gallery thumbnails, Sidebar menu buttons, Timepicker selects, Command and CommandMenu inputs, PhoneInput, InteractiveCard, NavigationMenu, InputOTP, Reveal, ScrollDown, Combobox trigger, Datepicker trigger, NumberInput, SearchInput, TagsInput, Transfer search.

The cause is `outline-none` with no replacement: 30 places in source. Several are inputs inside a styled wrapper where the wrapper should show the ring (`focus-within`) and doesn't.

**Fix:** a `focus-visible:ring` on each, or `focus-within:ring` on the wrapper; a guard test that fails on `outline-none` without a focus style in the same class string.

### 5. Custom widgets that don't follow their ARIA pattern (4.1.2, 1.3.1)

| Component                                     | Problem                                                                                                                                                                                                    |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Combobox`, `AutoComplete`                    | Arrow keys don't move through options and Escape doesn't close (both confirmed). The search input sits inside the `listbox`, and options are buttons with `role="option"`. Usable with Tab and Enter only. |
| `Tree`                                        | Every item is a tab stop (9 in the basic story) and arrow keys do nothing (confirmed). Needs a roving tab stop and arrow, Home and End keys.                                                               |
| `SegmentedControl`                            | Marked as `tablist`/`tab` but has no tab panels and no arrow keys. It is a radio group or a set of toggle buttons.                                                                                         |
| `Tour`                                        | Has `role="dialog"` but focus stays on the page behind it, and step changes aren't announced.                                                                                                              |
| `Cascader`, `PanelMenu`, `Spoiler`            | Toggle buttons with no `aria-expanded`.                                                                                                                                                                    |
| `Meter`, `Gauge`                              | No role or value exposed.                                                                                                                                                                                  |
| `Command`, `CommandMenu`, `Item`, `Preloader` | Invalid ARIA parent/child structure (axe: `aria-required-children`, `aria-required-parent`).                                                                                                               |
| `ChatImage`, `Chat`                           | A disallowed ARIA attribute; an interactive element nested inside another.                                                                                                                                 |
| `Calendar`, `RangeCalendar`                   | Day buttons whose accessible name doesn't contain their visible text (385 elements; the names come from `react-day-picker`). Affects voice control (2.5.3).                                                |

### 6. Form errors are not linked to their fields (3.3.1, 1.3.1)

Seven files show an error message with no `aria-invalid` or `aria-describedby`: `ui/import.tsx` and six form templates (AccountDeletion, SecurityQuestions, MFASetup, OTPVerification, TokenAuth, BiometricAuth). A screen reader user hears nothing when validation fails. The other templates go through the shared `Field` components, which do link errors.

### 7. Status changes are not announced (4.1.3)

Only 11 files in the library use a live region, and they are the preloader, `Alert`, `Spinner`, `Announcement` and `Field`. Nothing announces: streamed chat messages, `NotificationCenter` items, `Countdown` and `Timer`, `Validator` results, upload progress in `FileUpload` and `Dropzone`, copy confirmation in `Clipboard`.

### 8. Targets smaller than 24 by 24 px (2.5.8)

axe confirms six components once the spacing exception is applied: Rating stars, ChatAttachments remove buttons, Pagination dots (8 by 8 px), TokenAuthForm, KeyValue, Sidebar. A further 73 components have controls under 24 px that pass only because of spacing around them; the densest are the form templates' checkboxes and the Footer links.

### 9. Scrollable regions that can't be reached by keyboard (2.1.1)

`VirtualList`, `ScrollArea`, `DataExplorer` and `Gantt` scroll with the mouse only when their content has nothing focusable. Fix: `tabIndex={0}` with a label on the scroll container.

---

## P2: minor and best practice

10. **Landmarks, headings and skip link.** In `packages/layouts`, only `DashboardLayout` renders `main`; `MainContainer`, `SectionLayout` and `PageTransition` render none, and `PageTransition` doesn't move focus on navigation. There is no `SkipLink` component although the `--z-skip-link` tier exists. `Sidebar` and `DashboardLayout` stories render two `main` elements; `Sidebar`, `Footer`, `Banner` and `BottomNavigation` have unlabelled duplicate landmarks; `Dashboard` jumps from `h1` to `h3`.
11. **Reflow at 320 px is mostly untestable today.** 162 components overflow at 320 px, but in about 127 the cause is the story's own fixed-width wrapper (`w-[800px]`, `w-[600px]`), not the component. Removing those wrappers is needed before reflow can be judged; 35 components have a fixed width in package source and are worth a look.
12. **Text spacing.** Eight components clip text with WCAG text spacing applied: ChatWebPreview, Carousel, Sidebar, Breadcrumb, Pagination, Collapsible, Tooltip, Timer.
13. **Lint.** 43 places set an ARIA role where a native element exists (`prefer-tag-over-role`), 20 heading components can render empty, and 39 click handlers sit on non-interactive elements, which overlaps finding 1.
14. **List markup.** `InfiniteScroller` puts `div` children directly inside `ul`.

---

## What is already in good shape

- Radix-based components pass their keyboard and focus checks: no stuck focus, no positive `tabindex` anywhere, focus rings present on buttons, checkboxes, switches, tabs and radio groups.
- Reduced motion is handled library-wide and guarded by a test.
- Status never relies on colour alone (● info, OK, ◆ warning, ▲ alert).
- Token contrast is tested for every vibe in both modes; the failures above come from how components dim text, not from the base tokens.

## Proposed fix order

1. Keyboard access for the 14 components in finding 1.
2. Contrast: the opacity pattern and the signal-on-tint token, with a guard test.
3. Accessible names, with the lint rule turned on.
4. Focus visibility, with a guard test.
5. Widget patterns (Combobox, Tree, SegmentedControl, Tour), then form errors, live regions, target size and scroll regions.
6. Switch Storybook's `a11y.test` from `'todo'` to `'error'` once the interaction-test stories are clean.

P2 items go to `docs/next-release-backlog.md`.

---

## Results after the fixes

**Date:** 2026-11-14. Every P0 and P1 finding was fixed in `@aazucena/ui`, `@aazucena/forms` and `@aazucena/design-system`, with tests that fail if the cause returns.

### Re-measurement

The full sweep was not repeated. A sample was: one story per component plus every story that had failed contrast (465 stories, all rules, light mode), and one contrast-failing story per component in dark mode (157 stories).

| Measure (same stories, before → after) | Before | After |
| -------------------------------------- | ------ | ----- |
| Stories with no violation, light       | 227    | 422   |
| Components failing contrast, light     | 207    | 19    |
| Components failing contrast, dark      | 157    | 28    |
| Buttons with no name (stories)         | 31     | 2     |
| Targets under 24px (stories)           | 4      | 0     |
| Progress bars with no name (stories)   | 4      | 0     |

What still fails is listed in `docs/next-release-backlog.md` ("Accessibility leftovers"): story markup, disabled states that axe cannot recognise, dependency markup (cmdk, react-day-picker, Leaflet, TipTap), and a few dark-mode pairs that depend on locked colours.

### What changed, by finding

1. **Keyboard access.** All 14 components work from the keyboard. `FilterBar` was a false positive: the flagged element is a `label` for its input.
2. **Contrast.** Five light-mode primitives are darker (signal 700 `#006584`, coral 700 `#ac2f00`, mint 700 `#006b53`, amber 700 `#7d5700`, ink 600 `#49626e`); hue and dark mode are unchanged. Dimmed text became `text-muted-foreground` (about 110 lines in packages, 400 in stories). Tints under role-coloured text stop at 10%. Code blocks use a high-contrast light palette and now switch palette in dark mode. Status text no longer pulses.
3. **Names.** 45 controls in the packages and 26 story buttons are named; `Progress` has a fallback name.
4. **Focus.** The 17 components show a signal outline, on the control or its wrapper.
5. **Widget patterns.** Combobox, AutoComplete, Tree, SegmentedControl, Tour, Cascader, PanelMenu, Spoiler, Meter and Gauge. Not done: Command and CommandMenu (cmdk markup), Calendar day names (react-day-picker), Item and Preloader list structure.
6. **Form errors.** The seven files link errors to fields and announce them.
7. **Status announcements.** Chat feed, clipboard, timers, notifications, validator, file upload.
8. **Target size.** The six components pass.
9. **Scroll regions.** VirtualList, ScrollArea and Gantt are tab stops.

### Guards

- `packages/design-system/src/utils/generate-css.test.ts`: role text on a 15% tint and muted text on a signal tint stay at 4.5:1.
- `packages/design-system/src/utils/ui-token-usage.test.ts`: no dimmed or translucent text, tints under role text at 10% or lighter, accent fills carry accent text, a removed outline has a replacement.
- 18 keyboard play tests in Storybook; `a11y.test` is `'error'`, so an axe violation in an interaction-test story fails the run (298 tests pass).
- `@aazucena/config/eslint/a11y.js`: unnamed controls, missing `alt`, invalid ARIA and positive `tabindex` are lint errors in ui, forms and layouts.

### Second pass (2026-11-14)

Done after the results above and not yet re-measured in the browser, apart from the 298 interaction tests, which pass with axe blocking.

- **Vibes.** The tint rule now holds for all 17 vibes in both modes. Fifteen needed changes; light-mode `success` had been 2 to 3.5:1 on the plain background in ten of them. The vibe matrix story checks contrast again.
- **Stories.** Dimmed placeholders, missing `alt`, unlabelled inputs and selects, and nine images from a dead host (now an inline SVG helper).
- **Components.** `aria-disabled` on DownloadTrigger, Transfer, Chip and Editor; names for the Editor textbox and InputOTP; `ItemGroup` and InfiniteScroller no longer claim list semantics they don't have.
- **Forms.** Status colours in 16 templates use role tokens instead of stock green, blue, amber and red.
- **Layouts (P2, finding 10).** `SkipLink`; `DashboardLayout` renders it and makes `main` a focus target; `PageTransition` can move focus on route change; `DashboardTitle` is an `h2`.

### Full re-measurement (2026-11-15)

Every story was measured again after both passes: all rules in light mode and contrast in dark mode, with the same script as the audit. There are 1,851 stories now (19 test stories were added). Two Three.js stories could not be measured in dark mode. The landmark `region` rule is left out of every figure here, as in the component counts of the audit; with it left out the audit's baseline is 1,075 clean stories, not the 268 quoted in the summary, which counted that rule.

| Measure                              | Audit | Now   |
| ------------------------------------ | ----- | ----- |
| Stories with no violation, light     | 1,075 | 1,749 |
| Components with no violation, light  | 145   | 320   |
| Stories failing contrast, light      | 605   | 53    |
| Components failing contrast, light   | 207   | 34    |
| Stories failing contrast, dark       | 373   | 73    |
| Components failing contrast, dark    | 157   | 44    |
| Stories with an unnamed button       | 104   | 8     |
| Stories with an unlabelled input     | 36    | 4     |
| Stories with a target under 24px     | 16    | 0     |
| Stories with an unreachable scroller | 13    | 0     |
| Stories with an unnamed progress bar | 11    | 0     |
| Stories with an unnamed select       | 10    | 0     |

**What still fails, and why**

- **Contrast, forms (16 stories per mode).** IntegrationSetup, DeploymentTrigger, FeatureFlag and VulnerabilityDisclosure forms keep decorative stock palette classes.
- **Contrast, single stories (about 30 components, one or two stories each).** Mostly story markup: text dimmed through a parent's opacity, disabled states that axe cannot recognise, and demo colours. In dark mode also StatusPages (5), Announcement (3), the charts package and signal text on a tint inside a glass panel.
- **Names (8 stories).** Icon-only buttons in the Playback, EngineeringPrimitives, InputGroup, BottomNavigation and Field stories; a chat thread delete button.
- **Markup from dependencies.** react-day-picker day names (12 stories, 388 elements), Leaflet markers (6), cmdk's list (3).
- **Structure.** A button nested in a button in the chat thread list, `role="listitem"` on a button in ListGroup, duplicate landmarks in Footer and Sidebar stories, three heading-order skips in stories.

Two regressions the sweep caught were fixed the same day: a Meter with an empty label got an empty name, and the ChatImage button's name did not contain its visible text.
