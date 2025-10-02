import InteractivePreloader from './InteractivePreloader';
import SimplePreloader from './SimplePreloader';
import type { PreloaderProps } from './types';

export type PreloaderVariant = 'interactive' | 'simple';

export interface UnifiedPreloaderProps extends PreloaderProps {
  variant?: PreloaderVariant;
}

export default function Preloader({
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
}

// Re-export the individual preloaders
export {
  InteractivePreloader,
  SimplePreloader
};
