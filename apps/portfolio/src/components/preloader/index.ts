// Main Components
export { default as Preloader } from "./Preloader";
export { default as InteractivePreloader } from "./InteractivePreloader";
export { default as SimplePreloader } from "./SimplePreloader";

// Sub-components
export {
  LoadingState,
  ReadyState,
  SimpleLoadingState,
  SimpleReadyState,
  StepIndicator,
  ErrorState,
} from "./components";

// Hooks
export {
  useLoadingProgress,
  usePreloaderVisibility,
  usePreloaderLifecycle,
  useKeyboardNavigation,
  useTheme,
} from "./hooks";

// Constants
export {
  DEFAULT_LOADING_STEPS,
  EXTRA_LOADING_STEPS,
  getLoadingSteps,
  getExtraStep,
  getExtraSteps,
} from "./constants";

// Utilities
export { getTransitionClass } from "./utils";

// Theme
export { themes, getTheme, mergeTheme } from "./themes";

// Types
export type {
  PreloaderProps,
  PreloaderVariant,
  UnifiedPreloaderProps,
  LoadingStep,
  IconComponent,
  CustomReadyComponentProps,
  CustomSpinnerProps,
  TimingConfig,
  BehaviorConfig,
  ContentConfig,
  StylingConfig,
  AnimationConfig,
  CustomizationConfig,
  CallbackConfig,
  AccessibilityConfig,
  PerformanceConfig,
  PreloaderGroupedProps,
  PreloaderTheme,
  PreloaderPropsWithTheme,
  ThemeConfig,
  ThemeColors,
  ThemeEffects,
  ThemeTypography,
} from "./types";

// Re-export unified type with theme from Preloader
export type { UnifiedPreloaderPropsWithTheme } from "./Preloader";

// Default export
export { default } from "./Preloader";
