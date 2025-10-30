import type { ThemeConfig } from '../types';

// Dark Theme - Deep dark with vibrant accents
export const darkTheme: ThemeConfig = {
  colors: {
    primary: 'rgb(99, 102, 241)',
    primaryForeground: 'rgb(248, 250, 252)',
    secondary: 'rgb(51, 65, 85)',
    secondaryForeground: 'rgb(241, 245, 249)',
    success: 'rgb(16, 185, 129)',
    successForeground: 'rgb(255, 255, 255)',
    error: 'rgb(239, 68, 68)',
    errorForeground: 'rgb(255, 255, 255)',
    background: 'rgb(15, 23, 42)',
    cardBackground: 'rgb(30, 41, 59)',
    overlayBackground: 'rgba(15, 23, 42, 0.95)',
    foreground: 'rgb(248, 250, 252)',
    mutedForeground: 'rgb(148, 163, 184)',
    accent: 'rgb(59, 130, 246)',
    accentForeground: 'rgb(248, 250, 252)',
    border: 'rgb(51, 65, 85)',
  },
  effects: {
    backdropBlur: 'blur(10px)',
    shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
    glowColor: 'rgba(59, 130, 246, 0.5)', // Blue glow for buttons
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
  },
};
