import type { ComponentType, CSSProperties } from 'react';
import type { IconComponent } from '~/types/icons';

// Loading step definition
export interface LoadingStep {
  id: number;
  name: string;
  description: string;
  icon: IconComponent;
  check?: () => boolean | Promise<boolean>;
  weight?: number;
}

// Custom component props for ready state
export interface CustomReadyComponentProps {
  loadTime: string;
  continueButton?: boolean;
  onContinue: () => void;
  totalSteps: number;
  completedSteps: number;
}

// Custom spinner props
export interface CustomSpinnerProps {
  className?: string;
}

// Grouped configuration interfaces
export interface TimingConfig {
  minDisplayTime?: number;
  maxDisplayTime?: number;
  animationDuration?: number;
}

export interface BehaviorConfig {
  autoStart?: boolean;
  enableSkip?: boolean;
  continueButton?: boolean;
  lazyLoad?: boolean;
  preloadAssets?: boolean;
  showOnce?: boolean; // Show preloader only once per session (uses sessionStorage)
}

export interface ContentConfig {
  title?: string;
  subtitle?: string;
  readyTitle?: string;
  readySubtitle?: string;
  continueButtonText?: string;
  readyFooterNote?: string;
}

export interface StylingConfig {
  className?: string;
  style?: CSSProperties;
  overlayClassName?: string;
  cardClassName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  showCard?: boolean;
}

export interface AnimationConfig {
  enableAnimations?: boolean;
  transitionType?: 'fade' | 'slide' | 'scale' | 'none';
}

export interface CustomizationConfig {
  customSteps?: LoadingStep[];
  customReadyComponent?: ComponentType<CustomReadyComponentProps>;
  customSpinner?: ComponentType<CustomSpinnerProps>;
}

export interface CallbackConfig {
  onComplete?: () => void;
  onStepComplete?: (stepId: number, stepName: string) => void;
  onLoadingStart?: () => void;
  onLoadingProgress?: (progress: number, currentStep: number) => void;
  onSkip?: () => void;
  onError?: (error: Error) => void;
}

export interface AccessibilityConfig {
  ariaLabel?: string;
  ariaLive?: 'off' | 'polite' | 'assertive';
  skipButtonAriaLabel?: string;
}

export interface PerformanceConfig {
  debug?: boolean;
}

// Main preloader props interface (flattened for backward compatibility)
export interface PreloaderProps {
  // Timing & Behavior
  minDisplayTime?: number;
  maxDisplayTime?: number;
  autoStart?: boolean;
  enableSkip?: boolean;
  animationDuration?: number;

  // Content & Text
  title?: string;
  subtitle?: string;
  readyTitle?: string;
  readySubtitle?: string;
  continueButton?: boolean;
  continueButtonText?: string;
  readyFooterNote?: string;

  // Styling & Theming
  className?: string;
  style?: CSSProperties;
  overlayClassName?: string;
  cardClassName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  showCard?: boolean;

  // Animation & Transitions
  enableAnimations?: boolean;
  transitionType?: 'fade' | 'slide' | 'scale' | 'none';

  // Customization
  customSteps?: LoadingStep[];
  customReadyComponent?: ComponentType<CustomReadyComponentProps>;
  customSpinner?: ComponentType<CustomSpinnerProps>;

  // Callbacks
  onComplete?: () => void;
  onStepComplete?: (stepId: number, stepName: string) => void;
  onLoadingStart?: () => void;
  onLoadingProgress?: (progress: number, currentStep: number) => void;
  onSkip?: () => void;
  onError?: (error: Error) => void;

  // Accessibility
  ariaLabel?: string;
  ariaLive?: 'off' | 'polite' | 'assertive';
  skipButtonAriaLabel?: string;

  // Performance
  lazyLoad?: boolean;
  debug?: boolean;
  preloadAssets?: boolean;
}

// Alternative grouped props interface
export interface PreloaderGroupedProps {
  timing?: TimingConfig;
  behavior?: BehaviorConfig;
  content?: ContentConfig;
  styling?: StylingConfig;
  animation?: AnimationConfig;
  customization?: CustomizationConfig;
  callbacks?: CallbackConfig;
  accessibility?: AccessibilityConfig;
  performance?: PerformanceConfig;
}

export type PreloaderVariant = 'interactive' | 'simple';

export interface UnifiedPreloaderProps extends PreloaderProps {
  variant?: PreloaderVariant;
}

// Theme System
export type PreloaderTheme =
  | 'default'
  | 'hoyoverse'
  | 'cyberpunk'
  | 'minimal'
  | 'glass'
  | 'dark'
  | 'light'
  | 'nature';

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;

  // State colors
  success: string;
  successForeground: string;
  error: string;
  errorForeground: string;

  // Backgrounds
  background: string;
  backgroundGradient?: string;
  cardBackground: string;
  overlayBackground: string;

  // Text
  foreground: string;
  mutedForeground: string;

  // Accents
  accent: string;
  accentForeground: string;
  border: string;
}

export interface ThemeEffects {
  // Blur & Glass
  backdropBlur: string;
  cardBlur?: string;

  // Shadows & Glow
  shadow: string;
  glowColor?: string;

  // Border radius
  borderRadius: {
    card: string;
    button: string;
    badge: string;
    progress: string;
  };

  // Animations
  animationSpeed: number; // multiplier for duration
  animationEasing: string;
}

export interface ThemeTypography {
  titleSize: string;
  titleWeight: string;
  subtitleSize: string;
  fontFamily?: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  effects: ThemeEffects;
  typography: ThemeTypography;
  customClass?: string; // Additional tailwind classes
}

export interface PreloaderPropsWithTheme extends PreloaderProps {
  theme?: PreloaderTheme;
  customTheme?: Partial<ThemeConfig>;
  currentPath?: string; // Current page path for conditional behavior
}
