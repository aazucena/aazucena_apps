import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { X } from '@mynaui/icons-react';
import {
  useLoadingProgress,
  usePreloaderVisibility,
  usePreloaderLifecycle,
  useKeyboardNavigation,
} from './hooks';
import { getLoadingSteps } from './constants';
import { SimpleLoadingState, SimpleReadyState, ErrorState } from './components';
import type { PreloaderProps } from './types';
import { getTransitionClass } from './utils';

export default function SimplePreloader({
  // Timing & Behavior
  minDisplayTime = 1500,
  maxDisplayTime = 10000,
  autoStart = true,
  enableSkip = false,
  animationDuration = 600,

  // Content & Text
  title = "Loading",
  subtitle,
  readyTitle = "Ready!",
  readySubtitle = "All set to go",
  continueButtonText = "Continue",
  continueButton = true,

  // Styling & Theming
  style,
  overlayClassName = "",
  cardClassName = "",

  // Animation & Transitions
  enableAnimations = true,
  transitionType = 'fade',

  // Customization
  customSteps,
  customReadyComponent: CustomReadyComponent,
  customSpinner: CustomSpinner,

  // Callbacks
  onComplete,
  onStepComplete,
  onLoadingStart,
  onLoadingProgress,
  onSkip,
  onError,

  // Accessibility
  ariaLabel = "Loading progress",
  ariaLive = "polite",
  skipButtonAriaLabel = "Skip loading",

  // Performance
  lazyLoad = false,
}: PreloaderProps) {
  const steps = getLoadingSteps(customSteps);

  const {
    progress,
    isReady,
    loadTime,
    stepStatus,
    startLoading,
    isLoading,
    error,
    resetLoading,
  } = useLoadingProgress(
    minDisplayTime,
    steps,
    onStepComplete,
    animationDuration
  );

  const {
    isVisible,
    isInViewport,
    userSkipped,
    containerRef,
    handleSkip,
    handleContinue,
  } = usePreloaderVisibility({
    lazyLoad,
    onSkip,
    onComplete,
  });

  usePreloaderLifecycle({
    autoStart,
    maxDisplayTime,
    isInViewport,
    isLoading,
    isReady,
    userSkipped,
    continueButton,
    progress,
    currentStep: 0,
    error,
    onLoadingStart,
    onLoadingProgress,
    onError,
    handleSkip,
    startLoading,
  });

  useKeyboardNavigation({
    enableSkip,
    isReady,
    onSkip: handleSkip,
    onContinue: handleContinue,
  });

  // Don't render if lazy loading and not in viewport
  if (lazyLoad && !isInViewport) {
    return <div ref={containerRef} className="h-20" />;
  }

  if (!isVisible) return null;

  const transitionClass = getTransitionClass(transitionType);
  const completedSteps = Object.values(stepStatus).filter(Boolean).length;

  return (
    <div
      ref={containerRef}
      className={`
        fixed inset-0 z-50 bg-background flex items-center justify-center p-4
        ${transitionClass}
        ${overlayClassName}
      `}
      style={style}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role="status"
      tabIndex={-1}
    >
      <Card className={`
        w-full max-w-sm
        ${enableAnimations ? 'animate-in fade-in-0 zoom-in-95' : ''}
        ${cardClassName}
      `}>
        <CardContent className="p-6 space-y-4 text-center relative">
          {/* Skip Button */}
          {enableSkip && !isReady && !error && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="absolute top-2 right-2 z-10"
              aria-label={skipButtonAriaLabel}
            >
              <X className="w-3 h-3" />
            </Button>
          )}

          {error ? (
            <ErrorState
              error={error}
              onRetry={resetLoading}
              onDismiss={handleContinue}
            />
          ) : !isReady ? (
            <SimpleLoadingState
              progress={progress}
              title={title}
              subtitle={subtitle}
              steps={steps}
              customSpinner={CustomSpinner}
            />
          ) : CustomReadyComponent ? (
            <CustomReadyComponent
              loadTime={loadTime}
              continueButton={continueButton}
              onContinue={handleContinue}
              totalSteps={steps.length}
              completedSteps={completedSteps}
            />
          ) : continueButton ? (
            <SimpleReadyState
              readyTitle={readyTitle}
              readySubtitle={readySubtitle}
              continueButtonText={continueButtonText}
              onContinue={handleContinue}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
