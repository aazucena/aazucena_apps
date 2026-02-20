import type { ThemeConfig } from "../types";

// Cyberpunk Theme - Neon, futuristic, tech
export const cyberpunkTheme: ThemeConfig = {
  colors: {
    primary: "rgb(6, 182, 212)",
    primaryForeground: "rgb(8, 8, 22)",
    secondary: "rgb(236, 72, 153)",
    secondaryForeground: "rgb(255, 255, 255)",
    success: "rgb(34, 211, 238)",
    successForeground: "rgb(8, 8, 22)",
    error: "rgb(249, 115, 22)",
    errorForeground: "rgb(255, 255, 255)",
    background: "rgb(8, 8, 22)",
    backgroundGradient:
      "linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
    cardBackground: "rgba(15, 23, 42, 0.8)",
    overlayBackground: "rgba(8, 8, 22, 0.9)",
    foreground: "rgb(240, 253, 244)", // Light text for dark background
    mutedForeground: "rgb(203, 213, 225)", // Lighter muted text
    accent: "rgb(167, 139, 250)",
    accentForeground: "rgb(8, 8, 22)",
    border: "rgba(6, 182, 212, 0.3)",
  },
  effects: {
    backdropBlur: "blur(12px)",
    shadow: "0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)",
    glowColor: "rgba(6, 182, 212, 0.6)",
    borderRadius: {
      card: "0.25rem",
      button: "0.25rem",
      badge: "0.25rem",
      progress: "0.125rem",
    },
    animationSpeed: 0.8,
    animationEasing: "cubic-bezier(0.87, 0, 0.13, 1)",
  },
  typography: {
    titleSize: "1.625rem",
    titleWeight: "900",
    subtitleSize: "0.875rem",
    fontFamily: "monospace",
  },
  customClass: "uppercase tracking-wider",
};
