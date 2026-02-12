import type { SystemThemeConfig, ThemeVibe } from '@aazucena/types';
import { getColor } from '../tokens/colors.js';

const light: SystemThemeConfig = {
  colors: {
    primary: getColor('green', 700),
    primaryForeground: getColor('zinc', 50),
    secondary: getColor('amber', 600),
    secondaryForeground: getColor('zinc', 50),
    success: getColor('green', 600),
    successForeground: getColor('zinc', 50),
    error: getColor('red', 600),
    errorForeground: getColor('zinc', 50),
    background: getColor('green', 50),
    base: getColor('green', 50),
    elevated: getColor('zinc', 50),
    floating: getColor('green', 50, 0.9),
    cardBackground: getColor('zinc', 50),
    overlayBackground: getColor('green', 50, 0.9),
    foreground: getColor('green', 900),
    mutedForeground: getColor('green', 700),
    accent: getColor('amber', 500),
    accentForeground: getColor('green', 900),
    border: getColor('green', 200),
  },
  effects: {
    backdropBlur: 'blur(8px)',
    shadow: `0 4px 6px -1px ${getColor('green', 700, 0.1)}`,
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
    titleWeight: '700',
    subtitleSize: '0.875rem',
    headingFont: 'sans',
    bodyFont: 'sans',
  },
};

const dark: SystemThemeConfig = {
  colors: {
    primary: getColor('green', 500),
    primaryForeground: getColor('green', 950),
    secondary: getColor('amber', 500),
    secondaryForeground: getColor('amber', 950),
    success: getColor('green', 400),
    successForeground: getColor('green', 950),
    error: getColor('rose', 400),
    errorForeground: getColor('zinc', 50),
    background: getColor('green', 950),
    base: getColor('green', 950),
    elevated: getColor('green', 900, 0.5),
    floating: getColor('green', 950, 0.95),
    cardBackground: getColor('green', 900, 0.5),
    overlayBackground: getColor('green', 950, 0.95),
    foreground: getColor('green', 100),
    mutedForeground: getColor('green', 300),
    accent: getColor('amber', 400),
    accentForeground: getColor('green', 950),
    border: getColor('green', 500, 0.3),
  },
  effects: {
    backdropBlur: 'blur(12px)',
    shadow: `0 0 20px ${getColor('green', 500, 0.3)}`,
    glowColor: getColor('amber', 500, 0.4),
    borderRadius: {
      card: '1rem',
      button: '0.5rem',
      badge: '9999px',
      progress: '9999px',
    },
    animationSpeed: 1.1,
    animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  typography: {
    titleSize: '1.625rem',
    titleWeight: '800',
    subtitleSize: '0.875rem',
    headingFont: 'sans',
    bodyFont: 'sans',
  },
};

export const stPatricksVibe: ThemeVibe = {
  id: 'st-patricks',
  name: "St. Patrick's Day",
  type: 'holiday',
  light,
  dark,
};
