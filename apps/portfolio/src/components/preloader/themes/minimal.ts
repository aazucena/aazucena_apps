import type { ThemeConfig } from '../types';

// Minimal Theme - Clean, simple, monochrome
export const minimalTheme: ThemeConfig = {
  colors: {
    primary: 'rgb(23, 23, 23)',
    primaryForeground: 'rgb(250, 250, 250)',
    secondary: 'rgb(115, 115, 115)',
    secondaryForeground: 'rgb(250, 250, 250)',
    success: 'rgb(23, 23, 23)',
    successForeground: 'rgb(250, 250, 250)',
    error: 'rgb(115, 115, 115)',
    errorForeground: 'rgb(250, 250, 250)',
    background: 'rgb(255, 255, 255)',
    cardBackground: 'rgb(250, 250, 250)',
    overlayBackground: 'rgba(255, 255, 255, 0.95)',
    foreground: 'rgb(23, 23, 23)',
    mutedForeground: 'rgb(115, 115, 115)',
    accent: 'rgb(64, 64, 64)',
    accentForeground: 'rgb(250, 250, 250)',
    border: 'rgb(229, 229, 229)',
  },
  effects: {
    backdropBlur: 'blur(4px)',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
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
  },
  customClass: 'font-sans',
};
