import { useEffect, useRef } from "react";

export interface UsePreloaderLifecycleOptions {
  autoStart?: boolean;
  maxDisplayTime?: number;
  isInViewport: boolean;
  isLoading: boolean;
  isReady: boolean;
  userSkipped: boolean;
  continueButton?: boolean;
  progress: number;
  currentStep: number;
  error: Error | null;
  onLoadingStart?: () => void;
  onLoadingProgress?: (_progress: number, _currentStep: number) => void;
  onError?: (_error: Error) => void;
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
  progress: _progress,
  currentStep: _currentStep,
  error: _error,
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
  }, [
    autoStart,
    isInViewport,
    isLoading,
    isReady,
    userSkipped,
    startLoading,
    onLoadingStart,
  ]);

  // Progress callback
  useEffect(() => {
    if (onLoadingProgress) {
      onLoadingProgress(_progress, _currentStep);
    }
  }, [_progress, _currentStep, onLoadingProgress]);

  // Error callback
  useEffect(() => {
    if (_error && onError) {
      onError(_error);
    }
  }, [_error, onError]);

  // Max display time safety net
  useEffect(() => {
    if (!maxDisplayTime || userSkipped || isReady) {
      if (isReady && !continueButton) {
        handleSkip();
      }
      return;
    }

    const timer = setTimeout(() => {
      console.warn("Preloader exceeded max display time");
      onError?.(new Error("Preloader timeout"));
    }, maxDisplayTime);

    return () => clearTimeout(timer);
  }, [
    maxDisplayTime,
    isReady,
    userSkipped,
    continueButton,
    handleSkip,
    onError,
  ]);
}
