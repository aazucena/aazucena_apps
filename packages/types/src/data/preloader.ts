/**
 * [Types] : Preloader_System_Interfaces
 */

import type { ComponentType, CSSProperties } from 'react';
import type { IconComponent } from '../icons.js';
import type { PreloaderTheme, PreloaderVariant, TransitionType } from '../enums.js';
import type { TransformedCtaButton } from './content.js';
import type { SystemThemeConfig } from '../config.js';

// Loading step definition
export interface LoadingStep {
  id: number;
  name: string;
  description: string;
  icon: IconComponent | string;
  check?: () => boolean | Promise<boolean>;
  weight?: number;
}

// Custom component props for ready state
export interface CustomReadyComponentProps {
  loadTime: string;
  continueButton?: boolean | TransformedCtaButton;
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
  continueButton?: boolean | TransformedCtaButton;
  lazyLoad?: boolean;
  preloadAssets?: boolean;
  showOnce?: boolean; // Show preloader only once per session
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

export interface PreloaderAnimationConfig {
  enableAnimations?: boolean;
  transitionType?: TransitionType;
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

/**
 * Strapi Preloader Configuration
 * Matches the structure of the Strapi preloader single type
 */
export interface PreloaderConfig {
  enabled: boolean;
  variant: PreloaderVariant;
  theme: PreloaderTheme;
  title: string;
  subtitle?: string;
  readyTitle: string;
  readySubtitle: string;
  readyFooterNote?: string;
  continueButton: TransformedCtaButton;
  minDisplayTime: number;
  maxDisplayTime: number;
  animationDuration: number;
  autoStart: boolean;
  enableSkip: boolean;
  showOnce: boolean;
  lazyLoad: boolean;
  preloadAssets: boolean;
  enableAnimations: boolean;
  transitionType: TransitionType;
  showCard: boolean;
  loadingSteps: unknown[];
  debug: boolean;
}

// Main preloader props interface
export interface PreloaderProps extends Omit<Partial<PreloaderConfig>, 'continueButton'> {
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
  continueButton?: boolean | TransformedCtaButton;
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
  transitionType?: TransitionType;

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
  animation?: PreloaderAnimationConfig;
  customization?: CustomizationConfig;
  callbacks?: CallbackConfig;
  accessibility?: AccessibilityConfig;
  performance?: PerformanceConfig;
}

export interface UnifiedPreloaderProps extends PreloaderProps {
  variant?: PreloaderVariant;
}

export interface PreloaderPropsWithTheme extends PreloaderProps {
  theme?: PreloaderTheme;
  customTheme?: Partial<SystemThemeConfig>;
  currentPath?: string;
}
