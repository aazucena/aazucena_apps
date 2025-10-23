import { memo } from 'react';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { CardTitle } from '../../ui/card';
import { CircleNotch as LoadingCircle } from '@mynaui/icons-react';
import { StepIndicator } from './StepIndicator';
import type { LoadingStep } from '../types';

export interface LoadingStateProps {
  progress: number;
  currentStep: number;
  steps: LoadingStep[];
  stepStatus: Record<number, boolean>;
  hasReached100: boolean;
  title: string;
  subtitle?: string;
  animationDuration: number;
  enableAnimations: boolean;
  customSpinner?: React.ComponentType<Record<string, unknown>>;
  primaryColor?: string;
}

export const LoadingState = memo(function LoadingState({
  progress,
  currentStep,
  steps,
  stepStatus,
  hasReached100,
  title,
  subtitle,
  customSpinner: CustomSpinner,
}: LoadingStateProps) {
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  const currentStepInfo = steps[currentStep];

  return (
    <div className="space-y-6 text-center" role="status" aria-live="polite">
      {/* Header Section */}
      <div className="space-y-4">
        {/* Animated Spinner - Show checkmark when at 100% */}
        <div className="relative mx-auto w-20 h-20" aria-hidden="true">
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
          aria-label={`Loading progress: ${progress}%`}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{hasReached100 ? 'Finalizing...' : 'Starting...'}</span>
          <span className={hasReached100 ? 'text-green-600 font-semibold' : ''}>
            {hasReached100 ? 'Complete!' : 'Almost there'}
          </span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid gap-2" role="list" aria-label="Loading steps">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isCompleted = status === 'completed';
          const isActive = status === 'active';
          const stepComplete = stepStatus[step.id] ?? false;

          return (
            <StepIndicator
              key={step.id}
              step={step}
              isCompleted={isCompleted}
              isActive={isActive}
              stepComplete={stepComplete}
            />
          );
        })}
      </div>
    </div>
  );
});
