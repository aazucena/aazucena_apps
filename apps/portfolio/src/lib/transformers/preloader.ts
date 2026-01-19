import type { PreloaderPropsWithTheme, LoadingStep, ThemeConfig } from '~/components/preloader/types';
import type { StrapiPreloaderConfigValidated, StrapiLoadingStep } from '~/lib/validators/preloader';
import { getIconComponent } from '~/lib/utils/icons';

/**
 * Transforms Strapi preloader config to component props
 */
export function transformPreloaderConfig(
  strapiConfig: StrapiPreloaderConfigValidated
): PreloaderPropsWithTheme {
  return {
    // Theme (variant is not used by component)
    theme: strapiConfig.theme,

    // Content Text (required fields)
    title: strapiConfig.title,
    subtitle: strapiConfig.subtitle ?? undefined,
    readyTitle: strapiConfig.readyTitle,
    readySubtitle: strapiConfig.readySubtitle,
    readyFooterNote: strapiConfig.readyFooterNote ?? undefined,
    continueButtonText: strapiConfig.continueButton.label,  // continueButton is required

    // Timing
    minDisplayTime: strapiConfig.minDisplayTime,
    maxDisplayTime: strapiConfig.maxDisplayTime,
    animationDuration: strapiConfig.animationDuration,

    // Behavior
    autoStart: strapiConfig.autoStart,
    enableSkip: strapiConfig.enableSkip,
    continueButton: true,  // Always true since continueButton component is required
    lazyLoad: strapiConfig.lazyLoad,
    preloadAssets: strapiConfig.preloadAssets,
    enableAnimations: strapiConfig.enableAnimations,

    // Transitions
    transitionType: strapiConfig.transitionType,
    showCard: strapiConfig.showCard,

    // Loading Steps
    customSteps: transformLoadingSteps(strapiConfig.loadingSteps),

    // Colors
    primaryColor: strapiConfig.primaryColor ?? undefined,
    secondaryColor: strapiConfig.secondaryColor ?? undefined,

    // Theme Overrides
    customTheme: strapiConfig.themeOverrides as Partial<ThemeConfig>,

    // Accessibility
    ariaLabel: strapiConfig.ariaLabel,
    ariaLive: strapiConfig.ariaLive,
    skipButtonAriaLabel: strapiConfig.skipButtonAriaLabel,

    // Custom Classes
    className: strapiConfig.customClassName ?? undefined,
    overlayClassName: strapiConfig.overlayClassName ?? undefined,
    cardClassName: strapiConfig.cardClassName ?? undefined,

    // Debug
    debug: strapiConfig.debug,
  };
}

/**
 * Transforms Strapi loading steps to component LoadingStep[]
 * Note: loadingSteps is required in schema (min: 1)
 */
function transformLoadingSteps(
  strapiSteps: StrapiLoadingStep[]
): LoadingStep[] {
  return strapiSteps
    .filter(step => step.enabled)
    .filter(step => {
      // Additional safety check for icon field
      if (!step.icon || step.icon.trim() === '') {
        console.warn(`[Preloader] Step "${step.name}" has empty icon, skipping`);
        return false;
      }
      return true;
    })
    .map(step => ({
      id: step.stepId, // Map stepId to id for component compatibility
      name: step.name,
      description: step.description,
      icon: getIconComponent(step.icon),
      weight: step.weight,
    }));
}

// getIconComponent is now imported from ~/lib/utils/icons for consistency

/**
 * Default fallback config if CMS is unavailable
 * Note: Includes all required fields from schema (title, readyTitle, readySubtitle, continueButton)
 */
export const DEFAULT_PRELOADER_CONFIG: PreloaderPropsWithTheme = {
  theme: 'default',
  title: 'Preparing Your Experience',  // Required in schema
  readyTitle: 'Ready to Explore!',  // Required in schema
  readySubtitle: 'Your experience is fully optimized and ready',  // Required in schema
  readyFooterNote: 'All systems ready for your journey',
  continueButtonText: 'Enter Website',  // continueButton is required in schema
  minDisplayTime: 1500,
  maxDisplayTime: 10000,
  animationDuration: 600,
  autoStart: true,
  enableSkip: false,
  continueButton: true,
  lazyLoad: false,
  preloadAssets: false,
  enableAnimations: true,
  transitionType: 'fade',
  showCard: false,
  ariaLabel: 'Loading progress',
  ariaLive: 'polite',
  skipButtonAriaLabel: 'Skip loading',
  debug: false,
};