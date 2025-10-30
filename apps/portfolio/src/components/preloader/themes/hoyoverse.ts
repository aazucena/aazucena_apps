import type { ThemeConfig } from '../types';

// Hoyoverse Theme - Elegant, golden, game-inspired
export const hoyoverseTheme: ThemeConfig = {
  colors: {
    primary: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    primaryForeground: 'rgb(26, 26, 46)',
    secondary: 'rgb(139, 92, 246)',
    secondaryForeground: 'rgb(255, 255, 255)',
    success: 'rgb(255, 215, 0)',
    successForeground: 'rgb(26, 26, 46)',
    error: 'rgb(220, 38, 38)',
    errorForeground: 'rgb(255, 255, 255)',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    backgroundGradient: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
    cardBackground: 'rgba(30, 30, 60, 0.8)', // Darker, more opaque card for better contrast
    overlayBackground: 'rgba(26, 26, 46, 0.9)', // More opaque overlay
    foreground: 'rgb(248, 250, 252)', // Light text
    mutedForeground: 'rgb(203, 213, 225)', // Light muted text
    accent: 'rgb(251, 191, 36)',
    accentForeground: 'rgb(26, 26, 46)',
    border: 'rgba(255, 215, 0, 0.3)', // More visible border
  },
  effects: {
    backdropBlur: 'blur(16px)',
    cardBlur: 'blur(20px)',
    shadow: '0 20px 60px rgba(255, 215, 0, 0.15), 0 0 40px rgba(139, 92, 246, 0.1)',
    glowColor: 'rgba(255, 215, 0, 0.4)',
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
  },
  customClass: 'font-serif',
};
