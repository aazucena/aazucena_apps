import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { X } from '@aazucena/icons';
import { useEffect } from 'react';
import {
  useLoadingProgress,
  usePreloaderVisibility,
  usePreloaderLifecycle,
  useKeyboardNavigation,
  usePreloaderTheme,
} from '@aazucena/hooks';
import { SimpleLoadingState, SimpleReadyState, ErrorState } from './ui/index';
import type { PreloaderPropsWithTheme } from '@aazucena/types';
import { getTransitionClass, getLoadingSteps } from '@aazucena/utils';

export default function SimplePreloader({
  // Timing & Behavior
  minDisplayTime = 1500,
  maxDisplayTime = 10000,
  autoStart = true,
  enableSkip = false,
  animationDuration = 600,

  // Content & Text
  title = 'Loading',
  subtitle,
  readyTitle = 'Ready!',
  readySubtitle = 'All set to go',
  continueButtonText = 'Continue',
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

  // Theme
  theme = 'default',
  customTheme,
  currentPath: _unusedCurrentPath = '/', // Accepted for prop consistency but not used in simple variant
}: PreloaderPropsWithTheme) {
  const steps = getLoadingSteps(customSteps);

  const { progress, isReady, loadTime, stepStatus, startLoading, isLoading, error, resetLoading } =
    useLoadingProgress(minDisplayTime, steps, onStepComplete, animationDuration);

  const { isVisible, isInViewport, userSkipped, containerRef, handleSkip, handleContinue } =
    usePreloaderVisibility({
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

  const themeStyles = usePreloaderTheme({ theme, customTheme });

  // Emit 'preloader-mounted' event when component mounts.
  // rAF ensures the Preloader is composited before BrandIconLoader starts fading.
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

  // Don't render if lazy loading and not in viewport
  if (lazyLoad && !isInViewport) {
    return <div ref={containerRef} className="h-20" />;
  }

  if (!isVisible) return null;

  const transitionClass = getTransitionClass(isReady ? transitionType : isReady);
  const completedSteps = Object.values(stepStatus).filter(Boolean).length;

  // Content wrapper - shared between card and non-card modes
  const contentWrapperClasses = showCard
    ? 'p-6 space-y-4 text-center relative'
    : 'w-full max-w-sm p-6 space-y-4 text-center relative';

  const cardWrapperClasses = `
    w-full max-w-sm border
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
          className="absolute top-2 right-2 z-10"
          aria-label={skipButtonAriaLabel}
        >
          <X className="h-3 w-3" />
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
        <SimpleLoadingState
          progress={progress}
          title={title}
          subtitle={subtitle}
          steps={steps}
          customSpinner={CustomSpinner}
          themeStyles={themeStyles}
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
          themeStyles={themeStyles}
        />
      ) : null}
    </>
  );

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 ${transitionClass} ${overlayClassName} ${themeStyles.overlayClasses} `}
      style={{ ...themeStyles.overlayStyle, ...style }}
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
        <div className={contentWrapperClasses} style={themeStyles.cardStyle}>
          {content}
        </div>
      )}
    </div>
  );
}
