import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import remarkGfm from 'remark-gfm';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
// When running under vitest (STORYBOOK_VITEST=1 set explicitly in test:ci script),
// the 34 files with play() interaction tests. storybookTest plugin reads this list
// directly and passes it to vitest as the file include — it ignores vitest's own
// test.include config (cleared at plugin init). All other stories run in Storybook
// UI (dev/build) and Chromatic for visual regression.
const INTERACTION_TEST_STORIES = [
  '../stories/components/accordion.stories.tsx',
  '../stories/components/alert-dialog.stories.tsx',
  '../stories/components/app-loader.stories.tsx',
  '../stories/components/arrow-link.stories.tsx',
  '../stories/components/assistant-trigger.stories.tsx',
  '../stories/components/back-to-top.stories.tsx',
  '../stories/components/button.stories.tsx',
  '../stories/components/checkbox.stories.tsx',
  '../stories/components/collapsible.stories.tsx',
  '../stories/components/combobox.stories.tsx',
  '../stories/components/data-list.stories.tsx',
  '../stories/components/dialog.stories.tsx',
  '../stories/components/drawer.stories.tsx',
  '../stories/components/floating-label.stories.tsx',
  '../stories/components/hover-card.stories.tsx',
  '../stories/components/inplace.stories.tsx',
  '../stories/components/input.stories.tsx',
  '../stories/components/lightbox.stories.tsx',
  '../stories/components/number-input.stories.tsx',
  '../stories/components/popover.stories.tsx',
  '../stories/components/radio-group.stories.tsx',
  '../stories/components/search-input.stories.tsx',
  '../stories/components/select.stories.tsx',
  '../stories/components/sheet.stories.tsx',
  '../stories/components/slider.stories.tsx',
  '../stories/components/spoiler.stories.tsx',
  '../stories/components/switch.stories.tsx',
  '../stories/components/tabs.stories.tsx',
  '../stories/components/tags-input.stories.tsx',
  '../stories/components/textarea.stories.tsx',
  '../stories/components/toggle.stories.tsx',
  '../stories/components/tooltip.stories.tsx',
  '../stories/recipes/auth-card.stories.tsx',
  '../stories/recipes/contact-form.stories.tsx',
];

const config: StorybookConfig = {
  stories: process.env.STORYBOOK_VITEST
    ? INTERACTION_TEST_STORIES
    : [
        '../stories/docs/**/*.mdx',
        '../stories/**/*.mdx',
        '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
      ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  addons: [
    getAbsolutePath('@storybook/addon-a11y'),
    {
      name: getAbsolutePath('@storybook/addon-docs'),
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-designs'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
  ],
  async viteFinal(config) {
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss() as any);

    // Define environment variables for browser compatibility
    config.define = config.define || {};
    config.define['process.env.STRAPI_URL'] = JSON.stringify(
      process.env.STRAPI_URL || 'http://localhost:1337',
    );
    config.define['process.env.NODE_ENV'] = JSON.stringify(process.env.NODE_ENV || 'development');

    // Vite 7 promotes MODULE_LEVEL_DIRECTIVE to a build error. Suppress it so
    // 'use client' in @aazucena/ui components and upstream libs (radix-ui,
    // tanstack/react-query) don't break the Storybook build.
    config.build = config.build ?? {};
    config.build.rollupOptions = config.build.rollupOptions ?? {};
    const existingOnwarn = config.build.rollupOptions.onwarn;
    config.build.rollupOptions.onwarn = (warning, warn) => {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
      if (existingOnwarn) existingOnwarn(warning, warn);
      else warn(warning);
    };

    return config;
  },

  staticDirs: ['../public'],
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
