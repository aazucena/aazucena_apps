import type { SystemThemeConfig, ThemeVibe, PreloaderTheme } from '@aazucena/types';

import { defaultVibe } from './default.js';
import { minimalVibe } from './minimal.js';
import { natureVibe } from './nature.js';
import { cyberpunkVibe } from './cyberpunk.js';
import { hoyoverseVibe } from './hoyoverse.js';
import { glassVibe } from './glass.js';
import { canadaDayVibe } from './canada-day.js';
import { autumnVibe } from './autumn.js';
import { northernLightsVibe } from './northern-lights.js';
import { valentinesVibe } from './valentines.js';
import { halloweenVibe } from './halloween.js';
import { stPatricksVibe } from './st-patricks.js';
import { easterVibe } from './easter.js';
import { christmasVibe } from './christmas.js';
import { birthdayVibe } from './birthday.js';
import { newYearsVibe } from './new-years.js';
import { lunarNewYearVibe } from './lunar-new-year.js';

/**
 * Registry of all available visual "Vibes".
 * Each vibe provides a configuration for both light and dark modes.
 */
export const vibes: Record<string, ThemeVibe> = {
  default: defaultVibe,
  minimal: minimalVibe,
  nature: natureVibe,
  cyberpunk: cyberpunkVibe,
  hoyoverse: hoyoverseVibe,
  glass: glassVibe,
  'canada-day': canadaDayVibe,
  autumn: autumnVibe,
  'northern-lights': northernLightsVibe,
  valentines: valentinesVibe,
  halloween: halloweenVibe,
  'st-patricks': stPatricksVibe,
  easter: easterVibe,
  christmas: christmasVibe,
  birthday: birthdayVibe,
  'new-years': newYearsVibe,
  'lunar-new-year': lunarNewYearVibe,
};

/**
 * Get a specific theme configuration based on vibe and mode.
 */
export function getThemeConfig(
  vibeName: string = 'default',
  mode: 'light' | 'dark' = 'dark',
): SystemThemeConfig {
  const vibe = vibes[vibeName] || vibes['default'] || defaultVibe;
  return vibe[mode];
}

/**
 * Legacy support for PreloaderTheme enum mapping
 */
export function getTheme(themeName: PreloaderTheme = 'default'): SystemThemeConfig {
  return getThemeConfig(themeName, 'dark');
}

/**
 * Merge helper
 */
export function mergeTheme(
  baseConfig: SystemThemeConfig,
  customTheme?: Partial<SystemThemeConfig>,
): SystemThemeConfig {
  if (!customTheme) return baseConfig;

  return {
    colors: { ...baseConfig.colors, ...customTheme.colors },
    effects: {
      ...baseConfig.effects,
      ...customTheme.effects,
      borderRadius: {
        ...baseConfig.effects.borderRadius,
        ...customTheme.effects?.borderRadius,
      },
    },
    typography: { ...baseConfig.typography, ...customTheme.typography },
    customClass: customTheme.customClass || baseConfig.customClass,
  };
}
