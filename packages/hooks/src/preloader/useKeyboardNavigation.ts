import { useEffect } from 'react';

export interface UseKeyboardNavigationOptions {
  enableSkip: boolean;
  isReady: boolean;
  isVisible: boolean;
  onSkip: () => void;
  onContinue: () => void;
}

export function useKeyboardNavigation({
  enableSkip,
  isReady,
  isVisible,
  onSkip,
  onContinue,
}: UseKeyboardNavigationOptions): void {
  useEffect(() => {
    // Only capture keyboard events while the preloader overlay is on screen.
    // Without this guard the global listener persists after the preloader
    // closes (component returns null but stays mounted) and eats every
    // Space/Enter keypress on the rest of the page.
    if (!isVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && enableSkip && !isReady) {
        event.preventDefault();
        onSkip();
      }

      if ((event.key === 'Enter' || event.key === ' ') && isReady) {
        event.preventDefault();
        onContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableSkip, isReady, isVisible, onSkip, onContinue]);
}
