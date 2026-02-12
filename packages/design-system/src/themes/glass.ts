import type { SystemThemeConfig, ThemeVibe } from '@aazucena/types';
import { getColor } from '../tokens/colors.js';
import { defaultVibe } from './default.js';

const dark: SystemThemeConfig = {
  colors: {
    primary: getColor('indigo', 500, 0.9),
    primaryForeground: getColor('zinc', 50),
    secondary: getColor('purple', 500, 0.9),
    secondaryForeground: getColor('zinc', 50),
    success: getColor('blue', 500, 0.9),
    successForeground: getColor('zinc', 50),
    error: getColor('red', 500, 0.9),
    errorForeground: getColor('zinc', 50),
    background: `linear-gradient(135deg, ${getColor('zinc', 900, 0.95)} 0%, ${getColor('zinc', 800, 0.95)} 100%)`,
    base: getColor('zinc', 900, 0.95),
    elevated: getColor('zinc', 800, 0.7),
    floating: getColor('zinc', 950, 0.9),
    cardBackground: getColor('zinc', 800, 0.7),
    overlayBackground: getColor('zinc', 950, 0.9),
    foreground: getColor('zinc', 50),
    mutedForeground: getColor('zinc', 300),
    accent: getColor('pink', 500, 0.9),
    accentForeground: getColor('zinc', 50),
    border: getColor('zinc', 50, 0.15),
  },
  effects: {
    backdropBlur: 'blur(24px)',
    cardBlur: 'blur(32px)',
    shadow: `0 8px 32px ${getColor('zinc', 950, 0.15)}`,
    glowColor: getColor('pink', 500, 0.5),
    borderRadius: {
      card: '1.5rem',
      button: '1rem',
      badge: '9999px',
      progress: '9999px',
    },
    animationSpeed: 1.1,
    animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  typography: {
    titleSize: '1.5rem',
    titleWeight: '600',
    subtitleSize: '0.875rem',
    headingFont: 'sans',
    bodyFont: 'sans',
  },
};

export const glassVibe: ThemeVibe = {
  id: 'glass',
  name: 'Glass',
  type: 'standard',
  light: defaultVibe.light,
  dark,
};
