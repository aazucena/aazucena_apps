import type { SystemThemeConfig, ThemeVibe, PreloaderTheme } from '@aazucena/types';

import { defaultVibe } from './default';
import { minimalVibe } from './minimal';
import { natureVibe } from './nature';
import { cyberpunkVibe } from './cyberpunk';
import { hoyoverseVibe } from './hoyoverse';
import { glassVibe } from './glass';
import { canadaDayVibe } from './canada-day';
import { autumnVibe } from './autumn';
import { northernLightsVibe } from './northern-lights';
import { valentinesVibe } from './valentines';
import { halloweenVibe } from './halloween';
import { stPatricksVibe } from './st-patricks';
import { easterVibe } from './easter';
import { christmasVibe } from './christmas';
import { birthdayVibe } from './birthday';
import { newYearsVibe } from './new-years';
import { lunarNewYearVibe } from './lunar-new-year';

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
export type ThemeVibeRegistry = typeof vibes;

/**
 * Get a specific theme configuration based on vibe and mode.
 */
export function getThemeConfig(
  vibeName: string = 'default',
  mode: 'dark' | 'light' = 'dark',
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
