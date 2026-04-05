import type { StrapiBaseAttributes } from "./types";

// Local CTA Button interface with correct field name (schema uses 'label', not 'text')
export interface StrapiCTAButton {
  id?: number;
  label: string; // Correct field name from schema
  url: string;
  icon?: string;
  variant: "primary" | "secondary" | "outline" | "ghost";
  size: "sm" | "md" | "lg";
  openInNewTab: boolean;
}

export interface StrapiLoadingStep {
  id?: number;
  stepId: number;
  name: string;
  description: string;
  icon: string; // Icon name from @aazucena/icons
  weight: number;
  enabled: boolean;
}

export interface StrapiThemeOverrides {
  colors?: {
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    secondaryForeground?: string;
    success?: string;
    successForeground?: string;
    error?: string;
    errorForeground?: string;
    background?: string;
    backgroundGradient?: string;
    cardBackground?: string;
    overlayBackground?: string;
    foreground?: string;
    mutedForeground?: string;
    accent?: string;
    accentForeground?: string;
    border?: string;
  };
  effects?: {
    backdropBlur?: string;
    cardBlur?: string;
    shadow?: string;
    glowColor?: string;
    borderRadius?: {
      card?: string;
      button?: string;
      badge?: string;
      progress?: string;
    };
    animationSpeed?: number;
    animationEasing?: string;
  };
  typography?: {
    titleSize?: string;
    titleWeight?: string;
    subtitleSize?: string;
    fontFamily?: string;
  };
  customClass?: string;
}

export interface StrapiPreloaderConfig extends StrapiBaseAttributes {
  enabled: boolean;
  variant: "interactive" | "simple";
  theme:
    | "default"
    | "hoyoverse"
    | "cyberpunk"
    | "minimal"
    | "glass"
    | "dark"
    | "light"
    | "nature";

  title: string; // Required
  subtitle?: string;
  readyTitle: string; // Required
  readySubtitle: string; // Required
  readyFooterNote?: string;

  continueButton: StrapiCTAButton; // Required

  minDisplayTime: number;
  maxDisplayTime: number;
  animationDuration: number;

  autoStart: boolean;
  enableSkip: boolean;
  lazyLoad: boolean;
  preloadAssets: boolean;
  enableAnimations: boolean;

  transitionType: "fade" | "slide" | "scale" | "none";
  showCard: boolean;

  loadingSteps: StrapiLoadingStep[]; // Required, min 1

  primaryColor?: string;
  secondaryColor?: string;
  themeOverrides?: StrapiThemeOverrides;

  ariaLabel: string;
  ariaLive: "off" | "polite" | "assertive";
  skipButtonAriaLabel: string;

  customClassName?: string;
  overlayClassName?: string;
  cardClassName?: string;

  debug: boolean;
}
