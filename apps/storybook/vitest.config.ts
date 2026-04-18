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
            // Only run stories tagged 'interaction-test' — stories with play()
            // functions that verify DOM interaction. Pure render stories (the majority)
            // belong in Chromatic for visual regression, not in vitest which runs a
            // single sequential Chrome process (fileParallelism:false) that OOMs when
            // asked to render 260+ story files.
            tags: { include: ['interaction-test'], exclude: ['no-vitest'] },
          }),
        ],
        test: {
          name: 'storybook',
          fileParallelism: false,
          // Generous timeouts for headless browser: 34 interaction-test stories × DOM + animation overhead.
          testTimeout: 30000,
          hookTimeout: 30000,
          // Retry once on browser crash/connection drop — covers transient OOM kills.
          retry: 1,
          browser: {
            enabled: true,
            provider: playwright({
              launchOptions: {
                // Running 300+ story files sequentially accumulates memory in a
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
