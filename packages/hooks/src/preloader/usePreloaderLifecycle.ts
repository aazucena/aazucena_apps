import { useEffect, useRef } from 'react';
import type { TransformedCtaButton } from '@aazucena/types';

export interface UsePreloaderLifecycleOptions {
  autoStart?: boolean;
  maxDisplayTime?: number;
  isInViewport: boolean;
  isLoading: boolean;
  isReady: boolean;
  userSkipped: boolean;
  continueButton?: boolean | TransformedCtaButton;
  progress: number;
  currentStep: number;
  error: Error | null;
  onLoadingStart?: () => void;
  onLoadingProgress?: (progress: number, currentStep: number) => void;
  onError?: (error: Error) => void;
  handleSkip: () => void;
  startLoading: () => void;
}

export function usePreloaderLifecycle({
  autoStart = true,
  maxDisplayTime,
  isInViewport,
  isLoading,
  isReady,
  userSkipped,
  continueButton,
  progress,
  currentStep,
  error,
  onLoadingStart,
  onLoadingProgress,
  onError,
  handleSkip,
  startLoading,
}: UsePreloaderLifecycleOptions): void {
  const hasStartedRef = useRef(false);

  // Auto-start loading when conditions are met
  useEffect(() => {
    if (
      autoStart &&
      isInViewport &&
      !isLoading &&
      !isReady &&
      !userSkipped &&
      !hasStartedRef.current
    ) {
      hasStartedRef.current = true;
      onLoadingStart?.();
      startLoading();
    }
  }, [autoStart, isInViewport, isLoading, isReady, userSkipped, startLoading, onLoadingStart]);

  // Progress callback
  useEffect(() => {
    if (onLoadingProgress) {
      onLoadingProgress(progress, currentStep);
    }
  }, [progress, currentStep, onLoadingProgress]);

  // Error callback
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Max display time safety net
  useEffect(() => {
    if (!maxDisplayTime || userSkipped || isReady) {
      if (isReady && !continueButton) {
        handleSkip();
      }
      return;
    }

    const timer = setTimeout(() => {
      console.warn('Preloader exceeded max display time');
      onError?.(new Error('Preloader timeout'));
    }, maxDisplayTime);

    return () => clearTimeout(timer);
  }, [maxDisplayTime, isReady, userSkipped, continueButton, handleSkip, onError]);
}
