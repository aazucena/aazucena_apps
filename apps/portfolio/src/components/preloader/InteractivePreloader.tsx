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
import { LoadingState, ReadyState, ErrorState } from './components';
import type { PreloaderProps } from './types';
import { getTransitionClass } from './utils';

export default function InteractivePreloader({
  // Timing & Behavior
  minDisplayTime = 1500,
  maxDisplayTime = 10000,
  autoStart = true,
  enableSkip = false,
  animationDuration = 600,

  // Content & Text
  title = "Preparing Your Experience",
  subtitle,
  readyTitle = "Ready to Explore!",
  readySubtitle = "Your experience is fully optimized and ready",
  readyFooterNote = "All systems ready for your journey",
  continueButtonText = "Enter Website",
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
  debug = false,
}: PreloaderProps) {
  const steps = getLoadingSteps(customSteps);

  const {
    progress,
    currentStep,
    isReady,
    loadTime,
    stepStatus,
    hasReached100,
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
    currentStep,
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
        fixed inset-0 z-50 bg-background/95 backdrop-blur-sm
        flex items-center justify-center p-4
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
        w-full max-w-md shadow-xl border-0
        ${enableAnimations ? 'animate-in fade-in-0 zoom-in-95' : ''}
        ${cardClassName}
      `}>
        <CardContent className="p-6 space-y-6 relative">
          {/* Skip Button */}
          {enableSkip && !isReady && !error && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="absolute top-4 right-4 z-10"
              aria-label={skipButtonAriaLabel}
            >
              <X className="w-4 h-4" />
              Skip
            </Button>
          )}

          {error ? (
            <ErrorState
              error={error}
              onRetry={resetLoading}
              onDismiss={handleContinue}
            />
          ) : !isReady ? (
            <LoadingState
              progress={progress}
              currentStep={currentStep}
              steps={steps}
              stepStatus={stepStatus}
              hasReached100={hasReached100}
              title={title}
              subtitle={subtitle}
              animationDuration={animationDuration}
              enableAnimations={enableAnimations}
              customSpinner={CustomSpinner}
            />
          ) : CustomReadyComponent ? (
            <CustomReadyComponent
              continueButton={continueButton}
              loadTime={loadTime}
              onContinue={handleContinue}
              totalSteps={steps.length}
              completedSteps={completedSteps}
            />
          ) : (
            <ReadyState
              loadTime={loadTime}
              onContinue={handleContinue}
              totalSteps={steps.length}
              completedSteps={completedSteps}
              readyTitle={readyTitle}
              readySubtitle={readySubtitle}
              continueButtonText={continueButtonText}
              readyFooterNote={readyFooterNote}
              debug={debug}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
