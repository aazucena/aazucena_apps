import type { SystemThemeConfig, ThemeVibe } from '@aazucena/types';
import { getColor } from '../tokens/colors';

const light: SystemThemeConfig = {
  colors: {
    primary: getColor('primary', 500),
    primaryForeground: getColor('zinc', 50),
    secondary: getColor('secondary', 500),
    secondaryForeground: getColor('zinc', 50),
    success: getColor('success', 500),
    successForeground: getColor('zinc', 50),
    destructive: getColor('destructive', 500),
    destructiveForeground: getColor('zinc', 50),
    background: getColor('zinc', 50),
    base: getColor('zinc', 50),
    elevated: getColor('zinc', 100),
    floating: getColor('zinc', 50, 0.95),
    cardBackground: getColor('zinc', 100),
    overlayBackground: getColor('zinc', 50, 0.95),
    foreground: getColor('zinc', 900),
    mutedForeground: getColor('zinc', 500),
    accent: getColor('pink', 500),
    accentForeground: getColor('zinc', 50),
    border: getColor('zinc', 200),
  },
  effects: {
    backdropBlur: 'blur(8px)',
    shadow: `0 4px 6px -1px ${getColor('zinc', 950, 0.05)}, 0 2px 4px -1px ${getColor('zinc', 950, 0.03)}`,
    borderRadius: {
      card: '1rem',
      button: '0.5rem',
      badge: '9999px',
      progress: '9999px',
    },
    animationSpeed: 1,
    animationEasing: 'ease-out',
  },
  typography: {
    titleSize: '1.5rem',
    titleWeight: '600',
    subtitleSize: '0.875rem',
    headingFont: 'sans',
    bodyFont: 'sans',
  },
};

const dark: SystemThemeConfig = {
  colors: {
    primary: getColor('primary', 500),
    primaryForeground: getColor('zinc', 50),
    secondary: getColor('secondary', 500),
    secondaryForeground: getColor('zinc', 50),
    success: getColor('success', 500),
    successForeground: getColor('zinc', 900),
    destructive: getColor('destructive', 500),
    destructiveForeground: getColor('zinc', 50),
    background: getColor('zinc', 950),
    base: getColor('zinc', 950),
    elevated: getColor('zinc', 900),
    floating: getColor('zinc', 950, 0.95),
    cardBackground: getColor('zinc', 900),
    overlayBackground: getColor('zinc', 950, 0.95),
    foreground: getColor('zinc', 50),
    mutedForeground: getColor('zinc', 400),
    accent: getColor('primary', 500),
    accentForeground: getColor('zinc', 900),
    border: getColor('primary', 100, 0.3),
  },
  effects: {
    backdropBlur: 'blur(8px)',
    shadow: `0 10px 40px ${getColor('zinc', 950, 0.1)}`,
    glowColor: getColor('emerald', 500, 0.4),
    borderRadius: {
      card: '0.75rem',
      button: '0.5rem',
      badge: '9999px',
      progress: '9999px',
    },
    animationSpeed: 1,
    animationEasing: 'ease-out',
  },
  typography: {
    titleSize: '1.5rem',
    titleWeight: '700',
    subtitleSize: '0.875rem',
    headingFont: 'sans',
    bodyFont: 'sans',
  },
};

export const defaultVibe: ThemeVibe = {
  id: 'default',
  name: 'Default',
  type: 'standard',
  light,
  dark,
};
