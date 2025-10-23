import type { ComponentType, CSSProperties, ReactNode } from 'react';

// Icon component type
export type IconComponent = ComponentType<{ className?: string }>;

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
