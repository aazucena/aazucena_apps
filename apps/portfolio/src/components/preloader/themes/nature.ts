import type { ThemeConfig } from '../types';

// Nature Theme - Organic, earth tones
export const natureTheme: ThemeConfig = {
  colors: {
    primary: 'rgb(34, 197, 94)',
    primaryForeground: 'rgb(255, 255, 255)',
    secondary: 'rgb(20, 184, 166)',
    secondaryForeground: 'rgb(255, 255, 255)',
    success: 'rgb(132, 204, 22)',
    successForeground: 'rgb(255, 255, 255)',
    error: 'rgb(239, 68, 68)',
    errorForeground: 'rgb(255, 255, 255)',
    background: 'linear-gradient(135deg, rgb(236, 252, 203) 0%, rgb(209, 250, 229) 100%)',
    cardBackground: 'rgba(255, 255, 255, 0.8)',
    overlayBackground: 'rgba(240, 253, 244, 0.9)',
    foreground: 'rgb(20, 83, 45)',
    mutedForeground: 'rgb(74, 85, 104)',
    accent: 'rgb(202, 138, 4)',
    accentForeground: 'rgb(255, 255, 255)',
    border: 'rgba(34, 197, 94, 0.2)',
  },
  effects: {
    backdropBlur: 'blur(12px)',
    shadow: '0 10px 40px rgba(34, 197, 94, 0.15)',
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
  },
  customClass: 'font-serif',
};
