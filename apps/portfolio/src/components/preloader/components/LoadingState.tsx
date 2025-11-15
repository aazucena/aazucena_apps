import { CircleNotch as LoadingCircle } from '@mynaui/icons-react';
import { memo } from 'react';
import { CardTitle } from '../../ui/card';
import { Progress } from '../../ui/progress';
import type { ThemeStyles } from '../hooks/useTheme';
import type { CustomSpinnerProps, LoadingStep } from '../types';
import { StepIndicator } from './StepIndicator';
import type { ComponentType } from 'react';

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
  customSpinner?: ComponentType<CustomSpinnerProps>;
  primaryColor?: string;
  themeStyles: ThemeStyles;
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
  themeStyles,
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
              <LoadingCircle
                className="w-20 h-20 animate-spin flex items-center justify-center animate-pulse"
                style={themeStyles.getSpinnerStyle(true)}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold" style={themeStyles.getBadgeStyle()}>
                  {progress}%
                </span>
              </div>
            </>
          ) : CustomSpinner ? (
            <CustomSpinner />
          ) : (
            <>
              <LoadingCircle
                className="w-20 h-20 animate-spin"
                style={themeStyles.getSpinnerStyle(false)}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold" style={themeStyles.getBadgeStyle()}>
                  {progress}%
                </span>
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <CardTitle className="text-xl" style={themeStyles.titleStyle}>
            {hasReached100 ? 'Finalizing...' : title}
          </CardTitle>
          {currentStepInfo && !hasReached100 && !subtitle && (
            <p className="text-sm text-center" style={themeStyles.subtitleStyle}>
              {currentStepInfo.description}
            </p>
          )}
          {subtitle && !hasReached100 && (
            <p className="text-sm text-center" style={themeStyles.subtitleStyle}>
              {subtitle}
            </p>
          )}
          {hasReached100 && (
            <p className="text-sm text-center" style={themeStyles.getIconStyle('success')}>
              Almost ready! Finalizing your experience...
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress
          value={progress}
          className="h-2 transition-all duration-300"
          progressStyle={themeStyles.getProgressStyle(progress)}
          aria-label={`Loading progress: ${progress}%`}
        />
        <div className="flex justify-between text-xs" style={{ color: themeStyles.config.colors.mutedForeground }}>
          <span>{hasReached100 ? 'Finalizing...' : 'Starting...'}</span>
          <span
            className={hasReached100 ? 'font-semibold' : ''}
            style={hasReached100 ? { color: themeStyles.config.colors.success } : {}}
          >
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
              themeStyles={themeStyles}
            />
          );
        })}
      </div>
    </div>
  );
});
