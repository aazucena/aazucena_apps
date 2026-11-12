/**
 * Story files with play() interaction tests, relative to apps/storybook.
 *
 * Single source for both .storybook/main.ts (which stories Storybook loads when
 * STORYBOOK_VITEST=1) and vitest.config.ts (which files Vitest opens). Loading
 * all 300+ story files in one Chrome process runs out of memory, so only these
 * run under Vitest; the rest are covered by Argos screenshots.
 *
 * Adding a play() test to a new story file? Add the file here too.
 */
export const INTERACTION_TEST_STORIES = [
  'stories/components/accordion.stories.tsx',
  'stories/components/alert-dialog.stories.tsx',
  'stories/components/app-loader.stories.tsx',
  'stories/components/arrow-link.stories.tsx',
  'stories/components/assistant-trigger.stories.tsx',
  'stories/components/back-to-top.stories.tsx',
  'stories/components/button.stories.tsx',
  'stories/components/checkbox.stories.tsx',
  'stories/components/collapsible.stories.tsx',
  'stories/components/combobox.stories.tsx',
  'stories/components/data-list.stories.tsx',
  'stories/components/dialog.stories.tsx',
  'stories/components/drawer.stories.tsx',
  'stories/components/floating-label.stories.tsx',
  'stories/components/hover-card.stories.tsx',
  'stories/components/inplace.stories.tsx',
  'stories/components/input.stories.tsx',
  'stories/components/lightbox.stories.tsx',
  'stories/components/number-input.stories.tsx',
  'stories/components/panel.stories.tsx',
  'stories/design-tokens/vibes-matrix.stories.tsx',
  'stories/components/popover.stories.tsx',
  'stories/components/radio-group.stories.tsx',
  'stories/components/search-input.stories.tsx',
  'stories/components/select.stories.tsx',
  'stories/components/sheet.stories.tsx',
  'stories/components/slider.stories.tsx',
  'stories/components/spoiler.stories.tsx',
  'stories/components/switch.stories.tsx',
  'stories/components/tabs.stories.tsx',
  'stories/components/tags-input.stories.tsx',
  'stories/components/textarea.stories.tsx',
  'stories/components/toggle.stories.tsx',
  'stories/components/tooltip.stories.tsx',
  'stories/recipes/auth-card.stories.tsx',
  'stories/recipes/contact-form.stories.tsx',
];

/**
 * Story globs screenshotted for Argos by the `visual` Vitest project
 * (STORYBOOK_VISUAL=1). Stories tagged `no-visual` (time-, network- or
 * animation-dependent output) are skipped. ~1,300 stories per run against the
 * Hobby plan's 5,000 screenshots/month, so widen this list deliberately.
 */
export const VISUAL_TEST_STORIES = [
  'stories/components/**/*.stories.tsx',
  'stories/recipes/**/*.stories.tsx',
];
