import type { SystemThemeConfig, ThemeVibe } from '@aazucena/types';
import { getColor } from '../tokens/colors.js';
import { defaultVibe } from './default.js';

const light: SystemThemeConfig = {
  colors: {
    primary: getColor('zinc', 900),
    primaryForeground: getColor('zinc', 50),
    secondary: getColor('zinc', 500),
    secondaryForeground: getColor('zinc', 50),
    success: getColor('zinc', 900),
    successForeground: getColor('zinc', 50),
    error: getColor('zinc', 500),
    errorForeground: getColor('zinc', 50),
    background: getColor('zinc', 50),
    base: getColor('zinc', 50),
    elevated: getColor('zinc', 100),
    floating: getColor('zinc', 50, 0.95),
    cardBackground: getColor('zinc', 100),
    overlayBackground: getColor('zinc', 50, 0.95),
    foreground: getColor('zinc', 900),
    mutedForeground: getColor('zinc', 500),
    accent: getColor('zinc', 700),
    accentForeground: getColor('zinc', 50),
    border: getColor('zinc', 200),
  },
  effects: {
    backdropBlur: 'blur(4px)',
    shadow: `0 1px 3px ${getColor('zinc', 950, 0.05)}`,
    borderRadius: {
      card: '0.5rem',
      button: '0.375rem',
      badge: '0.25rem',
      progress: '0.25rem',
    },
    animationSpeed: 0.9,
    animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  typography: {
    titleSize: '1.25rem',
    titleWeight: '600',
    subtitleSize: '0.8125rem',
    headingFont: 'sans',
    bodyFont: 'sans',
  },
  customClass: 'font-sans',
};

export const minimalVibe: ThemeVibe = {
  id: 'minimal',
  name: 'Minimal',
  type: 'standard',
  light,
  dark: defaultVibe.dark,
};
