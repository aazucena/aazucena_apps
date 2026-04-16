import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
// TEST 3: @aazucena/icons commented out
// import { X } from '@aazucena/icons';
const X = () => null;
import { useEffect } from 'react';
// TEST 2: @aazucena/hooks commented out — stubs below to isolate CJS source
// import {
//   useLoadingProgress,
//   usePreloaderVisibility,
//   usePreloaderLifecycle,
//   useKeyboardNavigation,
//   usePreloaderTheme,
//   useShowOnce,
// } from '@aazucena/hooks';

const useShowOnce = (_: boolean) => ({
  hasSeenBefore: false,
  markAsSeen: () => {},
  isChecking: false,
});
const useLoadingProgress = (_min: number, steps: any[], _onStep: any, _dur: number) => ({
  progress: 100,
  currentStep: steps[0],
  isReady: true,
  loadTime: 0,
  stepStatus: {} as Record<string, boolean>,
  hasReached100: true,
  startLoading: () => {},
  isLoading: false,
  error: null,
  resetLoading: () => {},
});
const usePreloaderVisibility = (_: any) => ({
  isVisible: true,
  isInViewport: true,
  userSkipped: false,
  containerRef: { current: null } as React.RefObject<HTMLDivElement | null>,
  handleSkip: () => {},
  handleContinue: () => {},
});
const usePreloaderLifecycle = (_: any) => {};
const useKeyboardNavigation = (_: any) => {};
const usePreloaderTheme = (_: any) => ({
  backgroundStyle: {} as React.CSSProperties,
  overlayStyle: {} as React.CSSProperties,
  cardStyle: {} as React.CSSProperties,
  cardClasses: '',
  overlayClasses: '',
  titleStyle: {} as React.CSSProperties,
  subtitleStyle: {} as React.CSSProperties,
  getProgressStyle: () => ({}) as React.CSSProperties,
  getButtonStyle: () => ({}) as React.CSSProperties,
  getBadgeStyle: () => ({}) as React.CSSProperties,
  getSpinnerStyle: () => ({}) as React.CSSProperties,
  getIconStyle: () => ({}) as React.CSSProperties,
  config: {} as any,
});
// TEST 3: sub-components commented out — they also import @aazucena/icons
// import { LoadingState, ReadyState, ErrorState } from './ui/index';
const LoadingState = () => <div>loading...</div>;
const ReadyState = () => <div>ready</div>;
const ErrorState = () => <div>error</div>;
import type { PreloaderPropsWithTheme } from '@aazucena/types';
// TEST 4: @aazucena/utils commented out
// import { getTransitionClass, getLoadingSteps } from '@aazucena/utils';
const getTransitionClass = (_: any) => '';
const getLoadingSteps = (steps: any) => steps ?? [];

export default function InteractivePreloader({
  // Timing & Behavior
  minDisplayTime = 1500,
  maxDisplayTime = 10000,
  autoStart = true,
  enableSkip = false,
  showOnce = false,
  animationDuration = 600,

  // Content & Text
  title = 'Preparing Your Experience',
  subtitle,
  readyTitle = 'Ready to Explore!',
  readySubtitle = 'Your experience is fully optimized and ready',
  readyFooterNote = 'All systems ready for your journey',
  continueButtonText = 'Enter Website',
  continueButton = true,

  // Styling & Theming
  style,
  overlayClassName = '',
  cardClassName = '',
  showCard = false,

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
  ariaLabel = 'Loading progress',
  ariaLive = 'polite',
  skipButtonAriaLabel = 'Skip loading',

  // Performance
  lazyLoad = false,
  debug = false,

  // Theme
  theme = 'default',
  customTheme,
  mode = 'dark',
  currentPath = '/',
}: PreloaderPropsWithTheme) {
  const steps = getLoadingSteps(customSteps);

  // ============================================================================
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS (Rules of Hooks)
  // ============================================================================

  // Handle show-once behavior with sessionStorage
  const { hasSeenBefore, markAsSeen, isChecking } = useShowOnce(showOnce);

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
  } = useLoadingProgress(minDisplayTime, steps, onStepComplete, animationDuration);

  const {
    isVisible,
    isInViewport,
    userSkipped,
    containerRef,
    handleSkip,
    handleContinue: originalHandleContinue,
  } = usePreloaderVisibility({
    lazyLoad,
    onSkip,
    onComplete,
  });

  // Wrap handleContinue to mark as seen when show-once is enabled
  const handleContinue = () => {
    if (showOnce) {
      markAsSeen();
    }
    originalHandleContinue();
  };

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

  const themeStyles = usePreloaderTheme({ theme, customTheme, mode });

  // ============================================================================
  // EFFECTS (after all hooks)
  // ============================================================================

  // If user has seen preloader before and showOnce is enabled, skip it
  useEffect(() => {
    if (showOnce && hasSeenBefore && !isChecking) {
      // Immediately dispatch completion events
      const brandEvent = new CustomEvent('preloader-mounted');
      const completeEvent = new CustomEvent('preloader-complete');

      document.dispatchEvent(brandEvent);
      document.dispatchEvent(completeEvent);

      // Call onComplete callback if provided
      onComplete?.();
    }
  }, [currentPath, showOnce, hasSeenBefore, isChecking, onComplete, debug]);

  // Emit 'preloader-mounted' event when component mounts.
  // useEffect already fires after paint, but we use rAF to be certain the
  // Preloader is composited and visible before BrandIconLoader starts fading.
  // Without this, there can be a one-frame gap between BrandIconLoader hiding
  // and the Preloader becoming visually solid.
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      document.dispatchEvent(new CustomEvent('preloader-mounted'));
    });
    return () => cancelAnimationFrame(rafId);
  }, []); // Empty deps - run only on mount

  // Sync body background with preloader theme to prevent flash during hydration
  useEffect(() => {
    const body = document.body;
    const themeBackground = themeStyles.backgroundStyle.background as string;

    if (body && themeBackground) {
      const originalBackground = body.style.background;
      body.style.background = themeBackground;

      // Restore original background when component unmounts
      return () => {
        body.style.background = originalBackground;
      };
    }
  }, [themeStyles.backgroundStyle.background]);

  // ============================================================================
  // CONDITIONAL RENDERING (after all hooks and effects)
  // ============================================================================

  // If show-once is enabled and user has seen it, render hidden element
  // (this allows all hooks and effects to run while remaining invisible)
  if (showOnce && hasSeenBefore && !isChecking) {
    return <div style={{ display: 'none' }} aria-hidden="true" data-preloader-skipped="true" />;
  }

  // Don't render if lazy loading and not in viewport
  if (lazyLoad && !isInViewport) {
    return <div ref={containerRef} className="h-20" />;
  }

  if (!isVisible) return null;

  const transitionClass = getTransitionClass(isReady ? transitionType : isReady);
  const completedSteps = Object.values(stepStatus).filter(Boolean).length;

  // Content wrapper - shared between card and non-card modes
  const contentWrapperClasses = showCard
    ? 'p-6 space-y-6 relative'
    : 'w-full max-w-md p-6 space-y-6 relative';

  const cardWrapperClasses = `
    w-full max-w-md border
    ${enableAnimations ? 'animate-in fade-in-0 zoom-in-95' : ''}
    ${cardClassName}
    ${themeStyles.cardClasses}
  `;

  const content = (
    <>
      {/* Skip Button */}
      {enableSkip && !isReady && !error && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="absolute top-4 right-4 z-10"
          aria-label={skipButtonAriaLabel}
        >
          <X className="h-4 w-4" />
          Skip
        </Button>
      )}

      {error ? (
        <ErrorState
          error={error}
          onRetry={resetLoading}
          onDismiss={handleContinue}
          themeStyles={themeStyles}
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
          themeStyles={themeStyles}
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
          themeStyles={themeStyles}
        />
      )}
    </>
  );

  const containerStyle = showCard ? themeStyles.overlayStyle : themeStyles.backgroundStyle;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 ${transitionClass} ${overlayClassName} ${themeStyles.overlayClasses} `}
      style={{ ...containerStyle, ...style }}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role="status"
      tabIndex={-1}
    >
      {showCard ? (
        <Card className={cardWrapperClasses} style={themeStyles.cardStyle}>
          <CardContent className={contentWrapperClasses}>{content}</CardContent>
        </Card>
      ) : (
        <div className={contentWrapperClasses}>{content}</div>
      )}
    </div>
  );
}
