import type { ComponentType, CSSProperties } from 'react';

export interface LoadingStep {
  id: number;
  name: string;
  description: string;
  icon: ComponentType<any>;
  check?: () => boolean | Promise<boolean>;
  weight?: number;
}

export interface PreloaderProps {
  // Timing & Behavior
  minDisplayTime?: number;
  maxDisplayTime?: number; // Auto-complete after this time (safety net)
  autoStart?: boolean; // Whether to start loading automatically
  enableSkip?: boolean; // Allow users to skip the preloader

  // Content & Text
  title?: string;
  subtitle?: string;
  readyTitle?: string;
  readySubtitle?: string;
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
  animationDuration?: number;
  enableAnimations?: boolean;
  transitionType?: 'fade' | 'slide' | 'scale' | 'none';

  // Customization
  customSteps?: LoadingStep[];
  customReadyComponent?: React.ComponentType<any>;
  customSpinner?: React.ComponentType<any>;

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
  lazyLoad?: boolean; // Only load when in viewport
  debug?: boolean;
  preloadAssets?: boolean; // Preload critical assets
}

export type PreloaderVariant = 'interactive' | 'simple';

export interface UnifiedPreloaderProps extends PreloaderProps {
  variant?: PreloaderVariant;
}
