import type { ThemeConfig } from '../types';

// Glass Theme - Glassmorphism, frosted glass
export const glassTheme: ThemeConfig = {
  colors: {
    primary: 'rgba(99, 102, 241, 0.9)',
    primaryForeground: 'rgb(255, 255, 255)',
    secondary: 'rgba(168, 85, 247, 0.9)',
    secondaryForeground: 'rgb(255, 255, 255)',
    success: 'rgba(59, 130, 246, 0.9)',
    successForeground: 'rgb(255, 255, 255)',
    error: 'rgba(239, 68, 68, 0.9)',
    errorForeground: 'rgb(255, 255, 255)',
    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)', // Dark background
    cardBackground: 'rgba(30, 41, 59, 0.7)', // More opaque dark card with glass effect
    overlayBackground: 'rgba(15, 23, 42, 0.9)', // Darker overlay for better readability
    foreground: 'rgb(248, 250, 252)', // Light text for dark background
    mutedForeground: 'rgb(203, 213, 225)', // Light muted text
    accent: 'rgba(236, 72, 153, 0.9)',
    accentForeground: 'rgb(255, 255, 255)',
    border: 'rgba(255, 255, 255, 0.15)',
  },
  effects: {
    backdropBlur: 'blur(24px)',
    cardBlur: 'blur(32px)',
    shadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
    glowColor: 'rgba(236, 72, 153, 0.5)', // Pink glow for buttons
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
  },
};
