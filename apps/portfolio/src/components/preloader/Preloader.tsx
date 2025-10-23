import { memo } from 'react';
import InteractivePreloader from './InteractivePreloader';
import SimplePreloader from './SimplePreloader';
import type { UnifiedPreloaderProps, PreloaderVariant } from './types';

/**
 * Unified Preloader Component
 *
 * A flexible, accessible preloader with two variants:
 * - 'interactive': Feature-rich with step indicators and detailed progress
 * - 'simple': Minimal loading spinner with progress bar
 *
 * Features:
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
 *   title="Loading Your Experience"
 *   enableSkip
 *   onComplete={() => console.log('Done!')}
 * />
 * ```
 */
const Preloader = memo(function Preloader({
  variant = 'interactive',
  ...props
}: UnifiedPreloaderProps) {
  switch (variant) {
    case 'simple':
      return <SimplePreloader {...props} />;

    case 'interactive':
    default:
      return <InteractivePreloader {...props} />;
  }
});

export default Preloader;

// Re-export the individual preloaders
export {
  InteractivePreloader,
  SimplePreloader
};

// Re-export types
export type { PreloaderVariant, UnifiedPreloaderProps };
