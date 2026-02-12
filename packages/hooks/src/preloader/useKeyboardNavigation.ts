import { useEffect } from 'react';

export interface UseKeyboardNavigationOptions {
  enableSkip: boolean;
  isReady: boolean;
  onSkip: () => void;
  onContinue: () => void;
}

export function useKeyboardNavigation({
  enableSkip,
  isReady,
  onSkip,
  onContinue,
}: UseKeyboardNavigationOptions): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Allow Escape to skip if enabled and not ready
      if (event.key === 'Escape' && enableSkip && !isReady) {
        event.preventDefault();
        onSkip();
      }

      // Allow Enter or Space to continue when ready
      if ((event.key === 'Enter' || event.key === ' ') && isReady) {
        event.preventDefault();
        onContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableSkip, isReady, onSkip, onContinue]);
}
