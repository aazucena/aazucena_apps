import type { SystemThemeConfig, ThemeVibe } from '@aazucena/types';
import { getColor } from '../tokens/colors.js';

const light: SystemThemeConfig = {
  colors: {
    primary: getColor('teal', 600),
    primaryForeground: getColor('zinc', 50),
    secondary: getColor('violet', 600),
    secondaryForeground: getColor('zinc', 50),
    success: getColor('emerald', 600),
    successForeground: getColor('zinc', 50),
    error: getColor('red', 600),
    errorForeground: getColor('zinc', 50),
    background: getColor('teal', 50),
    base: getColor('teal', 50),
    elevated: getColor('zinc', 50),
    floating: getColor('teal', 50, 0.9),
    cardBackground: getColor('zinc', 50),
    overlayBackground: getColor('teal', 50, 0.9),
    foreground: getColor('teal', 900),
    mutedForeground: getColor('zinc', 500),
    accent: getColor('pink', 400),
    accentForeground: getColor('zinc', 50),
    border: getColor('teal', 100),
  },
  effects: {
    backdropBlur: 'blur(12px)',
    shadow: `0 4px 20px ${getColor('teal', 600, 0.1)}`,
    borderRadius: {
      card: '1.25rem',
      button: '9999px',
      badge: '9999px',
      progress: '9999px',
    },
    animationSpeed: 1.3,
    animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  typography: {
    titleSize: '1.5rem',
    titleWeight: '600',
    subtitleSize: '0.875rem',
    headingFont: 'serif',
    bodyFont: 'sans',
  },
};

const dark: SystemThemeConfig = {
  colors: {
    primary: getColor('teal', 400),
    primaryForeground: getColor('zinc', 950),
    secondary: getColor('violet', 400),
    secondaryForeground: getColor('zinc', 50),
    success: getColor('emerald', 400),
    successForeground: getColor('zinc', 950),
    error: getColor('rose', 400),
    errorForeground: getColor('zinc', 50),
    background: getColor('zinc', 950),
    backgroundGradient: `linear-gradient(180deg, ${getColor('zinc', 950)} 0%, ${getColor('blue', 950)} 100%)`,
    base: getColor('zinc', 950),
    elevated: getColor('zinc', 800, 0.5),
    floating: getColor('zinc', 950, 0.8),
    cardBackground: getColor('zinc', 800, 0.5),
    overlayBackground: getColor('zinc', 950, 0.8),
    foreground: getColor('teal', 100),
    mutedForeground: getColor('zinc', 400),
    accent: getColor('violet', 300),
    accentForeground: getColor('zinc', 50),
    border: getColor('teal', 400, 0.2),
  },
  effects: {
    backdropBlur: 'blur(20px)',
    shadow: `0 0 30px ${getColor('teal', 400, 0.2)}, 0 0 50px ${getColor('violet', 400, 0.1)}`,
    glowColor: getColor('teal', 400, 0.4),
    borderRadius: {
      card: '1.5rem',
      button: '9999px',
      badge: '9999px',
      progress: '9999px',
    },
    animationSpeed: 1.5,
    animationEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  typography: {
    titleSize: '1.75rem',
    titleWeight: '800',
    subtitleSize: '0.9375rem',
    headingFont: 'serif',
    bodyFont: 'sans',
  },
};

export const northernLightsVibe: ThemeVibe = {
  id: 'northern-lights',
  name: 'Northern Lights',
  type: 'holiday',
  light,
  dark,
};
