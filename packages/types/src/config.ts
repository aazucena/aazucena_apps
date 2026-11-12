/**
 * [Types] : Site_Configuration_Interfaces
 */

export interface SiteMetadata {
  siteName: string;
  siteUrl: string;
  baseUrl: string;
  metaTitleTemplate: string;
  defaultSEO: {
    title: string;
    description: string;
    keywords?: string;
    robots: string;
    viewport: string;
    canonical?: string;
    twitterCard: string;
  };
  social: {
    twitter?: string;
  };
  faviconUrl?: string;
  siteLogoUrl?: string;
  googleSiteVerificationId?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

export interface ThemeConfig {
  mode: 'system' | 'light' | 'dark' | 'light:only' | 'dark:only';
  colors: {
    light: { primary: string; secondary: string; accent: string };
    dark: { primary: string; secondary: string; accent: string };
  };
  fonts: {
    sans: string;
    serif: string;
    heading: string;
    code: string;
  };
}

export interface SiteConfig {
  metadata: SiteMetadata;
  theme: ThemeConfig;
}

// --- System Theme System ---

export interface SystemThemeColors {
  primary: string;
  primaryForeground: string;
  primaryGradient?: string;
  secondary: string;
  secondaryForeground: string;
  secondaryGradient?: string;
  success: string;
  successForeground: string;
  destructive: string;
  destructiveForeground: string;
  error?: string;
  errorForeground?: string;
  background: string;
  backgroundGradient?: string;
  base: string; // Lowest layer (e.g., Body background)
  elevated: string; // Mid layer (e.g., Cards, Sidebar)
  floating: string; // Top layer (e.g., Modals, Tooltips)
  cardBackground: string; // Legacy support
  overlayBackground: string; // Legacy support
  foreground: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;

  // --- Avra instrument roles (optional: vibes that omit them inherit the defaults' CSS) ---
  panel?: string; // Panel surface
  panelRaised?: string; // Raised surfaces: popover, menu, dialog, toast
  state?: string; // Hover / selected rows (never panelRaised)
  rule?: string; // Hairline dividers
  ruleStrong?: string; // Interactive control borders (>= 3:1)
  signal?: string;
  signalForeground?: string;
  signalFaint?: string; // 8% tint
  signalSubtle?: string; // 15% tint
  signalLine?: string; // 40% tint
  alert?: string; // Alerts / anomalies / destructive, always with a ▲ marker
  alertForeground?: string;
  warning?: string; // Always with a ◆ marker
  warningForeground?: string;
  warningSubtle?: string;
  successSubtle?: string;
  scrim?: string; // Modal overlay
  panelGlass?: string; // Glass variant surface
  series1?: string;
  series2?: string;
  series3?: string;
  series4?: string;
  chartSeq1?: string;
  chartSeq2?: string;
  chartSeq3?: string;
  chartSeq4?: string;
  chartSeq5?: string;
  chartDivLow?: string;
  chartDivLowMid?: string;
  chartDivMid?: string;
  chartDivHighMid?: string;
  chartDivHigh?: string;
  chartGrid?: string;
  chartAxis?: string;
}

export interface SystemThemeEffects {
  backdropBlur: string;
  cardBlur?: string;
  shadow: string;
  glowColor?: string;
  borderRadius: {
    card: string;
    button: string;
    badge: string;
    progress: string;
    control?: string;
  };
  animationSpeed: number;
  animationEasing: string;
}

export interface SystemThemeTypography {
  titleSize: string;
  titleWeight: string;
  subtitleSize: string;
  headingFont: 'sans' | 'mono' | 'serif';
  bodyFont: 'sans' | 'mono' | 'serif';
  fontFamily?: string; // Legacy support
}

/**
 * Global Theme Configuration
 * Defines visual tokens for the entire system (not just preloader)
 */
export interface SystemThemeConfig {
  colors: SystemThemeColors;
  effects: SystemThemeEffects;
  typography: SystemThemeTypography;
  customClass?: string;
}

/**
 * Types of themes available in the system.
 */
export type ThemeType = 'standard' | 'holiday' | 'special' | 'custom';

/**
 * A "Vibe" represents a named aesthetic that provides both light and dark modes.
 */
export interface ThemeVibe {
  id: string;
  name: string;
  type: ThemeType;
  light: SystemThemeConfig;
  dark: SystemThemeConfig;
}
