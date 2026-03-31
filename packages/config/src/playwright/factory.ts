import { defineConfig, type PlaywrightTestConfig } from '@playwright/test';
import { baseConfig } from './base';

/**
 * Playwright Config Factory
 * @param options - Custom options for the specific application
 */
export function createPlaywrightConfig(
  options: Partial<PlaywrightTestConfig> = {},
): PlaywrightTestConfig {
  return defineConfig({
    ...baseConfig,
    ...options,
    use: {
      ...baseConfig.use,
      ...options.use,
    },
  });
}
