import type { SystemThemeConfig, ThemeVibe } from '@aazucena/types';
import { getColor } from '../tokens/colors';
import { defaultVibe } from './default';

const light: SystemThemeConfig = {
  colors: {
    primary: getColor('green', 600),
    primaryForeground: getColor('zinc', 50),
    secondary: getColor('teal', 600),
    secondaryForeground: getColor('zinc', 50),
    success: getColor('lime', 600),
    successForeground: getColor('zinc', 50),
    destructive: getColor('red', 600),
    destructiveForeground: getColor('zinc', 50),
    error: getColor('red', 600),
    errorForeground: getColor('zinc', 50),
    background: getColor('lime', 50),
    backgroundGradient: `linear-gradient(135deg, ${getColor('lime', 50)} 0%, ${getColor('emerald', 50)} 100%)`,
    base: getColor('lime', 50),
    elevated: getColor('zinc', 50, 0.8),
    floating: getColor('green', 50, 0.9),
    cardBackground: getColor('zinc', 50, 0.8),
    overlayBackground: getColor('green', 50, 0.9),
    foreground: getColor('green', 900),
    mutedForeground: getColor('zinc', 500),
    accent: getColor('amber', 600),
    accentForeground: getColor('zinc', 50),
    border: getColor('green', 500, 0.2),
  },
  effects: {
    backdropBlur: 'blur(12px)',
    shadow: `0 10px 40px ${getColor('green', 700, 0.15)}`,
    borderRadius: {
      card: '1.25rem',
      button: '9999px',
      badge: '9999px',
      progress: '9999px',
    },
    animationSpeed: 1.1,
    animationEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  typography: {
    titleSize: '1.5rem',
    titleWeight: '700',
    subtitleSize: '0.875rem',
    headingFont: 'serif',
    bodyFont: 'sans',
  },
  customClass: 'font-serif',
};

export const natureVibe: ThemeVibe = {
  id: 'nature',
  name: 'Nature',
  type: 'standard',
  light,
  dark: defaultVibe.dark,
};
