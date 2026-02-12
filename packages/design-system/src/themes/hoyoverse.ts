import type { SystemThemeConfig, ThemeVibe } from '@aazucena/types';
import { getColor } from '../tokens/colors.js';
import { defaultVibe } from './default.js';

const dark: SystemThemeConfig = {
  colors: {
    primary: `linear-gradient(135deg, ${getColor('amber', 400)} 0%, ${getColor('amber', 600)} 100%)`,
    primaryForeground: getColor('zinc', 950),
    secondary: getColor('violet', 500),
    secondaryForeground: getColor('zinc', 50),
    success: getColor('amber', 400),
    successForeground: getColor('zinc', 950),
    error: getColor('red', 600),
    errorForeground: getColor('zinc', 50),
    background: `linear-gradient(135deg, ${getColor('indigo', 950)} 0%, ${getColor('indigo', 900)} 100%)`,
    backgroundGradient: `radial-gradient(circle at 50% 50%, ${getColor('amber', 400, 0.1)} 0%, transparent 50%)`,
    base: getColor('indigo', 950),
    elevated: getColor('indigo', 900, 0.8),
    floating: getColor('indigo', 950, 0.9),
    cardBackground: getColor('indigo', 900, 0.8),
    overlayBackground: getColor('indigo', 950, 0.9),
    foreground: getColor('zinc', 50),
    mutedForeground: getColor('zinc', 300),
    accent: getColor('amber', 300),
    accentForeground: getColor('zinc', 950),
    border: getColor('amber', 400, 0.3),
  },
  effects: {
    backdropBlur: 'blur(16px)',
    cardBlur: 'blur(20px)',
    shadow: `0 20px 60px ${getColor('amber', 400, 0.15)}, 0 0 40px ${getColor('violet', 500, 0.1)}`,
    glowColor: getColor('amber', 400, 0.4),
    borderRadius: {
      card: '1rem',
      button: '0.75rem',
      badge: '0.5rem',
      progress: '9999px',
    },
    animationSpeed: 1.2,
    animationEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  typography: {
    titleSize: '1.75rem',
    titleWeight: '800',
    subtitleSize: '0.9375rem',
    headingFont: 'serif',
    bodyFont: 'sans',
  },
  customClass: 'font-serif',
};

export const hoyoverseVibe: ThemeVibe = {
  id: 'hoyoverse',
  name: 'Hoyoverse',
  type: 'standard',
  light: defaultVibe.light,
  dark,
};
