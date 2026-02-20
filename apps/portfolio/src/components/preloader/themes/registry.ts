import type { ThemeConfig, PreloaderTheme } from "../types";
import { defaultTheme } from "./default";
import { hoyoverseTheme } from "./hoyoverse";
import { cyberpunkTheme } from "./cyberpunk";
import { minimalTheme } from "./minimal";
import { glassTheme } from "./glass";
import { darkTheme } from "./dark";
import { lightTheme } from "./light";
import { natureTheme } from "./nature";

// Theme registry
export const themes: Record<PreloaderTheme, ThemeConfig> = {
  default: defaultTheme,
  hoyoverse: hoyoverseTheme,
  cyberpunk: cyberpunkTheme,
  minimal: minimalTheme,
  glass: glassTheme,
  dark: darkTheme,
  light: lightTheme,
  nature: natureTheme,
};

// Helper to get theme config
export function getTheme(themeName: PreloaderTheme = "default"): ThemeConfig {
  return themes[themeName] || themes.default;
}

// Helper to merge custom theme with base theme
export function mergeTheme(
  baseName: PreloaderTheme,
  customTheme?: Partial<ThemeConfig>,
): ThemeConfig {
  if (!customTheme) return getTheme(baseName);

  const base = getTheme(baseName);

  return {
    colors: { ...base.colors, ...customTheme.colors },
    effects: {
      ...base.effects,
      ...customTheme.effects,
      borderRadius: {
        ...base.effects.borderRadius,
        ...customTheme.effects?.borderRadius,
      },
    },
    typography: { ...base.typography, ...customTheme.typography },
    customClass: customTheme.customClass || base.customClass,
  };
}
