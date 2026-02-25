import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import tailwindcss from '@tailwindcss/vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// No vite.config.ts in this project — Vite config lives in .storybook/main.ts
// viteFinal. Tailwind is inlined here at the root level so it's inherited by
// the storybook project via `extends: true`.
export default defineConfig({
  plugins: [tailwindcss() as any],
  // Polyfill Node.js `global` → `globalThis` for packages like @aazucena/api/clickhouse
  // that use the Next.js singleton-cache pattern (global as unknown as {...}).
  define: { global: 'globalThis' },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            // Skip stories tagged 'no-vitest' — GPU-dependent (Three.js, PixiJS)
            // stories that require WebGL crash headless Chromium. Visual correctness
            // for these is covered by Chromatic on-demand, not vitest.
            tags: { exclude: ['no-vitest'] },
          }),
        ],
        test: {
          name: 'storybook',
          // Run story files sequentially — 373 concurrent pages exceed Chrome's
          // per-process resource limits, causing exactly 1 random page crash per run.
          fileParallelism: false,
          browser: {
            enabled: true,
            provider: playwright({
              launchOptions: {
                // Running 300+ story files sequentially accumulates memory in a
                // single Chrome process. These flags reduce the footprint:
                //  --disable-dev-shm-usage  → use /tmp instead of capped /dev/shm
                //  --disable-gpu            → skip GPU compositing (headless anyway)
                //  --single-process         → no separate renderer/GPU processes
                //  --disable-extensions     → skip extension subsystem
                //  --no-sandbox             → avoid sandbox overhead (CI containers)
                args: [
                  '--disable-dev-shm-usage',
                  '--disable-gpu',
                  '--single-process',
                  '--disable-extensions',
                  '--no-sandbox',
                ],
              },
            }),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
