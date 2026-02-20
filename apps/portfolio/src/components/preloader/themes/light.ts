import type { ThemeConfig } from "../types";

// Light Theme - Bright, airy, soft
export const lightTheme: ThemeConfig = {
  colors: {
    primary: "rgb(59, 130, 246)",
    primaryForeground: "rgb(255, 255, 255)",
    secondary: "rgb(226, 232, 240)",
    secondaryForeground: "rgb(15, 23, 42)",
    success: "rgb(34, 197, 94)",
    successForeground: "rgb(255, 255, 255)",
    error: "rgb(239, 68, 68)",
    errorForeground: "rgb(255, 255, 255)",
    background: "rgb(248, 250, 252)",
    cardBackground: "rgb(255, 255, 255)",
    overlayBackground: "rgba(248, 250, 252, 0.95)",
    foreground: "rgb(15, 23, 42)",
    mutedForeground: "rgb(100, 116, 139)",
    accent: "rgb(236, 72, 153)",
    accentForeground: "rgb(255, 255, 255)",
    border: "rgb(226, 232, 240)",
  },
  effects: {
    backdropBlur: "blur(8px)",
    shadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    borderRadius: {
      card: "1rem",
      button: "0.5rem",
      badge: "9999px",
      progress: "9999px",
    },
    animationSpeed: 1,
    animationEasing: "ease-out",
  },
  typography: {
    titleSize: "1.5rem",
    titleWeight: "600",
    subtitleSize: "0.875rem",
  },
};
