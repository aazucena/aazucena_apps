import type { ThemeConfig } from '../types';

// Default Theme - Clean, modern, professional
export const defaultTheme: ThemeConfig = {
  colors: {
    primary: 'rgb(50, 160, 197)', // Bright cyan-blue from CSS vars (--primary-500)
    primaryForeground: 'rgb(255, 255, 255)',
    secondary: 'rgb(255, 123, 84)', // Bright orange from CSS vars (--secondary-500)
    secondaryForeground: 'rgb(255, 255, 255)',
    success: 'rgb(107, 212, 117)', // Bright green from CSS vars (--success-500)
    successForeground: 'rgb(15, 23, 42)',
    error: 'rgb(239, 68, 68)',
    errorForeground: 'rgb(255, 255, 255)',
    background: 'rgb(15, 23, 42)', // Dark background for consistency
    cardBackground: 'rgb(30, 41, 59)', // Dark card for better contrast
    overlayBackground: 'rgba(15, 23, 42, 0.95)', // Dark overlay
    foreground: 'rgb(248, 250, 252)', // Light text for dark background
    mutedForeground: 'rgb(203, 213, 225)', // Light muted text
    accent: 'rgb(107, 212, 117)', // Use success green as accent for high contrast
    accentForeground: 'rgb(15, 23, 42)',
    border: 'rgba(148, 163, 184, 0.3)', // Subtle border
  },
  effects: {
    backdropBlur: 'blur(8px)',
    shadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    glowColor: 'rgba(107, 212, 117, 0.4)', // Green glow for buttons
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
