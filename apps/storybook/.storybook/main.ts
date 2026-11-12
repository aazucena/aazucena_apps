import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import remarkGfm from 'remark-gfm';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { INTERACTION_TEST_STORIES, VISUAL_TEST_STORIES } from './interaction-tests.ts';

// Under Vitest only the files a project runs are loaded (all 300+ at once OOMs):
// STORYBOOK_VISUAL=1 → Argos screenshot set, otherwise the interaction tests.
const vitestStories = process.env.STORYBOOK_VISUAL ? VISUAL_TEST_STORIES : INTERACTION_TEST_STORIES;

const config: StorybookConfig = {
  stories: process.env.STORYBOOK_VITEST
    ? vitestStories.map((p) => `../${p}`)
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
    // Version switcher: reads /root/versions.json, links to /storybooks/<version>/
    // (served by rewrites in vercel.json)
    getAbsolutePath('storybook-addon-semantic-version'),
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
  managerHead: '<link rel="icon" type="image/svg+xml" href="/favicon.svg">',
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
