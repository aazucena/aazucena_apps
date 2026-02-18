import remarkGfm from 'remark-gfm';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  stories: [
    '../stories/docs/**/*.mdx',
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  addons: [
    '@storybook/addon-a11y',{
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-themes',
    '@storybook/addon-designs',
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
  ],
  async viteFinal(config) {
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss() as any);

    // Define environment variables for browser compatibility
    config.define = config.define || {};
    config.define['process.env.STRAPI_URL'] = JSON.stringify(
      process.env.STRAPI_URL || 'http://localhost:1337'
    );
    config.define['process.env.NODE_ENV'] = JSON.stringify(
      process.env.NODE_ENV || 'development'
    );

    return config;
  },
};

export default config;
