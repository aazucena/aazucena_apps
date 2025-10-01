import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  CircleNotch as LoadingCircle,
  Check,
  CheckCircleSolid as Checkmark,
  SparklesSolid as Sparkle,
  Rocket as RocketLaunch,
  ClockCircle as Clock,
  X
} from '@mynaui/icons-react';
import { useLoadingProgress } from './hooks';
import { DEFAULT_LOADING_STEPS, getLoadingSteps } from './constants';
import type { PreloaderProps } from './types';
import { getTransitionClass } from './utils';

export default function InteractivePreloader({
  // Timing & Behavior
  minDisplayTime = 1500,
  maxDisplayTime = 10000,
  autoStart = true,
  enableSkip = false,

  // Content & Text
  title = "Preparing Your Experience",
  subtitle,
  readyTitle = "Ready to Explore!",
  readySubtitle = "Your experience is fully optimized and ready",
  readyFooterNote = "All systems ready for your journey",
  continueButtonText = "Enter Website",

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
  debug = false,
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
    hasReached100,
    startLoading,
    isLoading,
    error,
  } = useLoadingProgress(
    minDisplayTime,
    steps,
    onStepComplete,
    animationDuration
  );

  // Lazy loading intersection observer
  useEffect(() => {
    if (!lazyLoad || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [lazyLoad]);

  // Auto-start loading when conditions are met
  useEffect(() => {
    if (autoStart && isInViewport && !isLoading && !isReady && !userSkipped) {
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
    if (!maxDisplayTime || userSkipped || isReady) return;

    const timer = setTimeout(() => {
      console.warn('Preloader exceeded max display time');
      onError?.(new Error('Preloader timeout'));
    }, maxDisplayTime);

    return () => clearTimeout(timer);
  }, [maxDisplayTime, isReady, userSkipped, onError]);

  const handleContinue = () => {
    setIsVisible(false);
    onComplete?.();
    document.dispatchEvent(new CustomEvent('preloader-complete'));
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
        fixed inset-0 z-50 bg-background/95 backdrop-blur-sm
        flex items-center justify-center p-4
        ${transitionClass}
        ${overlayClassName}
      `}
      style={style}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role="status"
    >
      <Card className={`
        w-full max-w-md shadow-xl border-0
        ${enableAnimations ? 'animate-in fade-in-0 zoom-in-95' : ''}
        ${cardClassName}
      `}>
        <CardContent className="p-6 space-y-6 relative">
          {/* Skip Button */}
          {enableSkip && !isReady && (
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

          {!isReady ? (
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
              loadTime={loadTime}
              onContinue={handleContinue}
              totalSteps={steps.length}
              completedSteps={Object.values(stepStatus).filter(Boolean).length}
            />
          ) : (
            <ReadyState
              loadTime={loadTime}
              onContinue={handleContinue}
              totalSteps={steps.length}
              completedSteps={Object.values(stepStatus).filter(Boolean).length}
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

interface LoadingStateProps {
  progress: number;
  currentStep: number;
  steps: typeof DEFAULT_LOADING_STEPS;
  stepStatus: Record<number, boolean>;
  hasReached100: boolean;
  title: string;
  subtitle?: string;
  animationDuration: number;
  enableAnimations: boolean;
  customSpinner?: React.ComponentType<any>;
  primaryColor?: string;
}

function LoadingState({
  progress,
  currentStep,
  steps,
  stepStatus,
  hasReached100,
  title,
  subtitle,
  animationDuration,
  enableAnimations,
  customSpinner: CustomSpinner,
  primaryColor
}: LoadingStateProps) {
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  const currentStepInfo = steps[currentStep];

  return (
    <div className="space-y-6 text-center">
      {/* Header Section */}
      <div className="space-y-4">
        {/* Animated Spinner - Show checkmark when at 100% */}
        <div className="relative mx-auto w-20 h-20">
          {hasReached100 ? (
            <>
              <LoadingCircle className="w-20 h-20 text-green-500 animate-spin flex items-center justify-center animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Badge variant="outline" className="text-xs font-bold">
                  {progress}%
                </Badge>
              </div>
            </>
          ) : CustomSpinner ? (
            <CustomSpinner />
          ) : (
            <>
              <LoadingCircle className="w-20 h-20 text-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Badge variant="outline" className="text-xs font-bold">
                  {progress}%
                </Badge>
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <CardTitle className="text-xl">
            {hasReached100 ? 'Finalizing...' : title}
          </CardTitle>
          {currentStepInfo && !hasReached100 && !subtitle && (
            <p className="text-sm text-muted-foreground text-center">
              {currentStepInfo.description}
            </p>
          )}
          {subtitle && !hasReached100 && (
            <p className="text-sm text-muted-foreground text-center">
              {subtitle}
            </p>
          )}
          {hasReached100 && (
            <p className="text-sm text-green-600 animate-pulse text-center">
              Almost ready! Finalizing your experience...
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress
          value={progress}
          className={`h-2 transition-all duration-300 ${
            hasReached100 ? 'bg-green-100' : ''
          }`}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Starting...</span>
          <span className={hasReached100 ? 'text-green-600 font-semibold' : ''}>
            {hasReached100 ? 'Complete!' : 'Almost there'}
          </span>
        </div>
      </div>

      {/* Step Indicators - Hide when at 100% */}
        <div className="grid gap-2">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const status = getStepStatus(index);
            const isCompleted = status === 'completed';
            const isActive = status === 'active';
            const stepComplete = stepStatus[step.id]!;

            return (
              <StepIndicator
                key={step.id}
                step={step}
                StepIcon={StepIcon}
                isCompleted={isCompleted}
                isActive={isActive}
                stepComplete={stepComplete}
              />
            );
          })}
        </div>
    </div>
  );
}

interface StepIndicatorProps {
  step: typeof DEFAULT_LOADING_STEPS[number];
  StepIcon: React.ComponentType<any>;
  isCompleted: boolean;
  isActive: boolean;
  stepComplete: boolean;
}

function StepIndicator({ step, StepIcon, isCompleted, isActive, stepComplete }: StepIndicatorProps) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
      isActive
        ? 'bg-primary/5 border-primary/20 shadow-sm'
        : isCompleted
        ? 'bg-green-50 border-green-200'
        : 'bg-muted/10 border-muted'
    }`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
        isActive
          ? 'bg-primary text-primary-foreground animate-pulse'
          : stepComplete
          ? 'bg-green-500 text-white'
          : 'bg-muted text-muted-foreground'
      }`}>
        <StepIcon className="w-4 h-4" />
      </div>

      <div className="flex-1 text-left min-w-0">
        <p className={`font-medium text-sm transition-colors ${
          isActive ? 'text-foreground' :
          stepComplete ? 'text-green-700' : 'text-muted-foreground'
        }`}>
          {step.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {step.description}
        </p>
        {isActive && !stepComplete && step.check && (
          <p className="text-xs text-blue-600 mt-1 animate-pulse">
            Verifying...
          </p>
        )}
      </div>

      <div className="flex-shrink-0">
        {isActive && !stepComplete && (
          <Badge variant="default" className="animate-pulse">
            Active
          </Badge>
        )}
        {isActive && stepComplete && (
          <LoadingCircle className="w-8 h-8 text-primary animate-spin animate-pulse" />
        )}
        {!isActive && stepComplete && (
          <Checkmark className="w-8 h-8 text-green-500" />
        )}
      </div>
    </div>
  );
}

interface ReadyStateProps {
  loadTime: string;
  onContinue: () => void;
  totalSteps: number;
  completedSteps: number;
  readyTitle: string;
  readySubtitle: string;
  readyFooterNote: string;
  continueButtonText: string;
  debug?: boolean;
}

function ReadyState({
  loadTime,
  onContinue,
  totalSteps,
  completedSteps,
  readyTitle,
  readySubtitle,
  readyFooterNote,
  continueButtonText,
  debug = false
}: ReadyStateProps) {
  return (
    <div className="space-y-6 text-center animate-in fade-in-0 zoom-in-95 duration-500">
      <div className="relative mx-auto w-20 h-20">
        <div className="absolute inset-0 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
          <Check className="w-10 h-10 text-green-foreground text-white" />
        </div>
        <Sparkle className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
      </div>

      <div className="space-y-2">
        <CardTitle className="text-2xl">{readyTitle}</CardTitle>
        <p className="text-muted-foreground text-center">
          {readySubtitle}
        </p>
      </div>

      {debug && (
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Load Time
            </Badge>
            <p className="text-lg font-bold text-foreground">{loadTime}s</p>
          </div>
          <div className="space-y-1">
            <Badge variant="outline" className="text-xs">
              <Check className="w-3 h-3 mr-1" />
              Steps Complete
            </Badge>
            <p className="text-lg font-bold text-foreground">{completedSteps}/{totalSteps}</p>
          </div>
        </div>
      )}

      <Button
        onClick={onContinue}
        size="lg"
        className="w-full gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        <RocketLaunch className="w-4 h-4" />
        {continueButtonText}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        {readyFooterNote}
      </p>
    </div>
  );
}
