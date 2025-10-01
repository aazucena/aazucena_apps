import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Card, CardContent } from '../ui/card';
import {
  CircleNotch as LoadingCircle,
  CheckCircle,
  Rocket as RocketLaunch,
  X
} from '@mynaui/icons-react';
import { useLoadingProgress } from './hooks';
import { getLoadingSteps } from './constants';
import type { PreloaderProps } from './types';
import { getTransitionClass } from './utils';

export default function SimplePreloader({
  // Timing & Behavior
  minDisplayTime = 1500,
  maxDisplayTime = 10000,
  autoStart = true,
  enableSkip = false,

  // Content & Text
  title = "Loading",
  subtitle,
  readyTitle = "Ready!",
  readySubtitle = "All set to go",
  continueButtonText = "Continue",
  continueButton = true,

  // Styling & Theming
  className = "",
  style,
  overlayClassName = "",
  cardClassName = "",

  // Animation & Transitions
  animationDuration = 600,
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
  preloadAssets = false,
}: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(!lazyLoad);
  const [isInViewport, setIsInViewport] = useState(!lazyLoad);
  const [userSkipped, setUserSkipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = getLoadingSteps(customSteps);

  const {
    progress,
    currentStep,
    isReady,
    loadTime,
    stepStatus,
    startLoading,
    isLoading,
    error,
  } = useLoadingProgress(
    minDisplayTime,
    steps,
    onStepComplete,
    animationDuration
  );

  // Auto-start loading when conditions are met
  useEffect(() => {
    if (autoStart && isInViewport && !isLoading && !isReady && !userSkipped) {
      onLoadingStart?.();
      startLoading();
    }
  }, [autoStart, isInViewport, isLoading, isReady, userSkipped, startLoading, onLoadingStart]);


  const handleContinue = () => {
    setIsVisible(false);
    onComplete?.();
  };

  const handleSkip = () => {
    setUserSkipped(true);
    setIsVisible(false);
    onSkip?.();
    onComplete?.();
  };

  // Don't render if lazy loading and not in viewport
  if (lazyLoad && !isInViewport) {
    return <div ref={containerRef} className="h-20" />;
  }

  if (!isVisible) return null;

  const transitionClass = getTransitionClass(transitionType);

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
    >
      <Card className={`
        w-full max-w-sm
        ${enableAnimations ? 'animate-in fade-in-0 zoom-in-95' : ''}
        ${cardClassName}
      `}>
        <CardContent className="p-6 space-y-4 text-center relative">
          {/* Skip Button */}
          {enableSkip && !isReady && (
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

          {!isReady ? (
            <>
              {CustomSpinner ? (
                <CustomSpinner />
              ) : (
                <LoadingCircle className="w-8 h-8 animate-spin mx-auto text-primary" />
              )}
              <div className="space-y-2">
                <h3 className="font-semibold">{title}</h3>
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground text-center">{Math.round(progress)}%</p>
                {steps.length > 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    {steps[Math.min(Math.floor(progress / (100 / steps.length)), steps.length - 1)]?.name}
                  </p>
                )}
                {subtitle && (
                  <p className="text-xs text-muted-foreground">{subtitle}</p>
                )}
              </div>
            </>
          ) : CustomReadyComponent ? (
            <CustomReadyComponent
              loadTime={loadTime}
              continueButton={continueButton}
              onContinue={handleContinue}
              totalSteps={steps.length}
              completedSteps={Object.values(stepStatus).filter(Boolean).length}
            />
          ) : continueButton &&(
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <div className="space-y-2">
                <h3 className="font-semibold">{readyTitle}</h3>
                <p className="text-sm text-muted-foreground text-center">{readySubtitle}</p>
              </div>
              <Button onClick={handleContinue} className="w-full">
                <RocketLaunch className="w-4 h-4 mr-2" />
                {continueButtonText}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
