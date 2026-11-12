import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import tailwindcss from '@tailwindcss/vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { argosVitestPlugin } from '@argos-ci/storybook/vitest-plugin';
import { INTERACTION_TEST_STORIES, VISUAL_TEST_STORIES } from './.storybook/interaction-tests.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const configDir = path.join(dirname, '.storybook');

// Shared by both projects: one headless Chromium, run file by file.
const browserTest = {
  fileParallelism: false,
  // Generous timeouts for headless browser: DOM + animation overhead per story.
  testTimeout: 30000,
  hookTimeout: 30000,
  // Retry once on browser crash/connection drop — covers transient OOM kills.
  retry: 1,
  browser: {
    enabled: true,
    provider: playwright({
      launchOptions: {
        // Running many story files sequentially accumulates memory in a
        // single Chrome process. These flags reduce the footprint:
        //  --disable-dev-shm-usage  → use /tmp instead of capped /dev/shm
        //  --disable-gpu            → skip GPU compositing (headless anyway)
        //  --disable-extensions     → skip extension subsystem
        //  --no-sandbox             → avoid sandbox overhead (CI containers)
        // NOTE: --single-process intentionally omitted — it disables Chrome's
        // multi-process renderer isolation, causing the entire browser to crash
        // if any story accumulates enough memory. Without it, individual
        // renderer frames crash in isolation while the host process survives.
        args: [
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-extensions',
          '--no-sandbox',
          // Same text rendering on every machine, so screenshots don't
          // diff on subpixel antialiasing or font hinting
          '--disable-lcd-text',
          '--font-render-hinting=none',
        ],
      },
    }),
    headless: true,
    instances: [{ browser: 'chromium' as const }],
  },
  setupFiles: ['.storybook/vitest.setup.ts'],
};

// No vite.config.ts in this project — Vite config lives in .storybook/main.ts
// viteFinal. Tailwind is inlined here at the root level so it's inherited by
// both projects via `extends: true`. Run one project at a time (--project):
// main.ts picks which story files to load from STORYBOOK_VISUAL.
export default defineConfig({
  plugins: [tailwindcss() as any],
  // Polyfill Node.js `global` → `globalThis` for packages like @aazucena/api/clickhouse
  // that use the Next.js singleton-cache pattern (global as unknown as {...}).
  define: { global: 'globalThis' },
  test: {
    projects: [
      {
        // Interaction tests: stories with play() functions (test:ci).
        extends: true,
        plugins: [
          storybookTest({
            configDir,
            tags: { include: ['interaction-test'], exclude: ['no-vitest'] },
          }),
        ],
        test: {
          ...browserTest,
          name: 'storybook',
          // The tag filter drops exports, not files, so list the files too.
          include: INTERACTION_TEST_STORIES,
        },
      },
      {
        // Argos screenshots of every component and recipe story (test:visual).
        extends: true,
        plugins: [
          storybookTest({ configDir, tags: { exclude: ['no-vitest', 'no-visual'] } }),
          // Uploads only on CI so Argos compares CI captures with CI captures;
          // local runs write ./screenshots.
          argosVitestPlugin({ uploadToArgos: !!process.env.CI }),
        ],
        test: {
          ...browserTest,
          name: 'visual',
          include: VISUAL_TEST_STORIES,
        },
      },
    ],
  },
});
