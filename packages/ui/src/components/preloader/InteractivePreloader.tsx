import { Button } from '../ui/button.js';
import { Card, CardContent } from '../ui/card.js';
import { X } from '@aazucena/icons';
import { useEffect } from 'react';
import {
  useLoadingProgress,
  usePreloaderVisibility,
  usePreloaderLifecycle,
  useKeyboardNavigation,
  usePreloaderTheme,
  useShowOnce,
} from '@aazucena/hooks';
import { LoadingState, ReadyState, ErrorState } from './ui/index.js';
import type { PreloaderPropsWithTheme } from '@aazucena/types';
import { getTransitionClass, getLoadingSteps } from '@aazucena/utils';

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
  currentPath = '/',
}: PreloaderPropsWithTheme) {
  const steps = getLoadingSteps(customSteps);

  // ============================================================================
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS (Rules of Hooks)
  // ============================================================================

  // Determine effective showOnce behavior:
  // - Homepage ('/'): Always show preloader (showOnce = false)
  // - Other pages: Use the configured showOnce value
  const isHomepage = currentPath === '/';
  const effectiveShowOnce = isHomepage ? false : showOnce;

  // Handle show-once behavior with sessionStorage
  const { hasSeenBefore, markAsSeen, isChecking } = useShowOnce(effectiveShowOnce);

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
    if (effectiveShowOnce) {
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

  const themeStyles = usePreloaderTheme({ theme, customTheme });

  // ============================================================================
  // EFFECTS (after all hooks)
  // ============================================================================

  // If user has seen preloader before and showOnce is enabled, skip it
  useEffect(() => {
    if (effectiveShowOnce && hasSeenBefore && !isChecking) {
      // Immediately dispatch completion events
      const brandEvent = new CustomEvent('preloader-mounted');
      const completeEvent = new CustomEvent('preloader-complete');

      document.dispatchEvent(brandEvent);
      document.dispatchEvent(completeEvent);

      // Call onComplete callback if provided
      onComplete?.();
    }
  }, [
    currentPath,
    isHomepage,
    showOnce,
    effectiveShowOnce,
    hasSeenBefore,
    isChecking,
    onComplete,
    debug,
  ]);

  // Emit 'preloader-mounted' event when component mounts
  // This signals BrandIconLoader to hide and allows preloader to take over
  useEffect(() => {
    const event = new CustomEvent('preloader-mounted');
    document.dispatchEvent(event);
  }, []); // Empty deps - run only on mount

  // Sync body background with preloader theme
  useEffect(() => {
    const body = document.body;
    const overlayBackground = themeStyles.overlayStyle.background as string;

    if (body && overlayBackground) {
      const originalBackground = body.style.background;
      body.style.background = originalBackground;

      // Restore original background when component unmounts
      return () => {
        body.style.background = originalBackground;
      };
    }
  }, [themeStyles.overlayStyle.background]);

  // ============================================================================
  // CONDITIONAL RENDERING (after all hooks and effects)
  // ============================================================================

  // If show-once is enabled and user has seen it, render hidden element
  // (this allows all hooks and effects to run while remaining invisible)
  // Note: Homepage always shows preloader, so this only applies to other pages
  if (effectiveShowOnce && hasSeenBefore && !isChecking) {
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
