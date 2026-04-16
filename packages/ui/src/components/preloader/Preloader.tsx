import { memo } from 'react';
import InteractivePreloader from './InteractivePreloader';
import SimplePreloader from './SimplePreloader';
import type { PreloaderVariant, PreloaderPropsWithTheme } from '@aazucena/types';

export interface UnifiedPreloaderPropsWithTheme extends PreloaderPropsWithTheme {
  variant?: PreloaderVariant;
}

/**
 * Unified Preloader Component
 *
 * A flexible, accessible preloader with two variants and theme support:
 * - 'interactive': Feature-rich with step indicators and detailed progress
 * - 'simple': Minimal loading spinner with progress bar
 *
 * Features:
 * - 8 Predefined themes (default, hoyoverse, cyberpunk, minimal, glass, dark, light, nature)
 * - Custom theme configuration support
 * - Full keyboard navigation (Escape to skip, Enter/Space to continue)
 * - ARIA attributes for screen readers
 * - Error handling with retry capability
 * - Lazy loading support
 * - Custom components and styling
 * - TypeScript strict mode compatible
 *
 * @example
 * ```tsx
 * <Preloader
 *   variant="interactive"
 *   theme="hoyoverse"
 *   title="Loading Your Experience"
 *   enableSkip
 *   onComplete={() => console.log('Done!')}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Preloader
 *   variant="interactive"
 *   theme="default"
 *   customTheme={{
 *     colors: {
 *       primary: 'rgb(255, 0, 128)',
 *       success: 'rgb(0, 255, 128)',
 *     }
 *   }}
 * />
 * ```
 */
const Preloader = memo(function Preloader({
  variant = 'interactive',
  theme = 'default',
  customTheme,
  showCard = false,
  ...props
}: UnifiedPreloaderPropsWithTheme) {
  switch (variant) {
    case 'simple':
      return (
        <SimplePreloader theme={theme} customTheme={customTheme} showCard={showCard} {...props} />
      );

    case 'interactive':
    default:
      return (
        <InteractivePreloader
          theme={theme}
          customTheme={customTheme}
          showCard={showCard}
          {...props}
        />
      );
  }
});

export default Preloader;

// Re-export the individual preloaders
export { InteractivePreloader, SimplePreloader };

// Re-export types
export type { PreloaderVariant };
