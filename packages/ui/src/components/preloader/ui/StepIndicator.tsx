import { memo } from 'react';
import { Badge } from '../../ui/badge';
import { CircleNotch as LoadingCircle, CheckCircleSolid as Checkmark } from '@aazucena/icons';
import { IconRenderer } from '../../ui/icon-renderer';
import type { LoadingStep } from '@aazucena/types';
import type { ThemeStyles } from '@aazucena/hooks';

export interface StepIndicatorProps {
  step: LoadingStep;
  isCompleted: boolean;
  isActive: boolean;
  stepComplete: boolean;
  themeStyles: ThemeStyles;
}

export const StepIndicator = memo(function StepIndicator({
  step,
  isCompleted,
  isActive,
  stepComplete,
  themeStyles,
}: StepIndicatorProps) {
  // Defensive check: if icon is null/undefined, skip rendering this step
  if (!step.icon) {
    console.error(`[StepIndicator] Step "${step.name}" has no icon component`);
    return null;
  }

  // Determine background and border styles based on state
  const getContainerStyle = () => {
    if (isActive) {
      return {
        background: `${themeStyles.config.colors.primary}10`, // 10% opacity
        borderColor: `${themeStyles.config.colors.border}`,
      };
    }
    if (isCompleted) {
      return {
        background: `${themeStyles.config.colors.success}10`,
        borderColor: `${themeStyles.config.colors.success}30`,
      };
    }
    return {
      background: 'transparent',
      borderColor: themeStyles.config.colors.border,
    };
  };

  const getIconStyle = () => {
    if (isActive) {
      return {
        background: themeStyles.config.colors.primary,
        color: themeStyles.config.colors.primaryForeground,
      };
    }
    if (stepComplete) {
      return {
        background: themeStyles.config.colors.success,
        color: themeStyles.config.colors.successForeground,
      };
    }
    return {
      background: 'transparent',
      color: themeStyles.config.colors.mutedForeground,
      border: `1px solid ${themeStyles.config.colors.border}`,
    };
  };

  const getTextStyle = () => {
    if (isActive) {
      return { color: themeStyles.config.colors.foreground };
    }
    if (stepComplete) {
      return { color: themeStyles.config.colors.success };
    }
    return { color: themeStyles.config.colors.mutedForeground };
  };

  return (
    <div
      className="flex items-center gap-3 rounded-lg border p-3 transition-all duration-300"
      style={getContainerStyle()}
      role="listitem"
      aria-current={isActive ? 'step' : undefined}
    >
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
          isActive ? 'animate-pulse' : ''
        }`}
        style={getIconStyle()}
        aria-hidden="true"
      >
        <IconRenderer icon={step.icon} className="h-4 w-4" stroke="2.5" aria-hidden />
      </div>

      <div className="min-w-0 flex-1 text-left">
        <p className="text-sm font-medium transition-colors" style={getTextStyle()}>
          {step.name}
        </p>
        <p
          className="truncate text-xs"
          style={{ color: themeStyles.config.colors.mutedForeground }}
        >
          {step.description}
        </p>
        {isActive && !stepComplete && step.check && (
          <p
            className="mt-1 animate-pulse text-xs"
            style={{ color: themeStyles.config.colors.accent }}
          >
            Verifying...
          </p>
        )}
      </div>

      <div className="flex-shrink-0" aria-live="polite">
        {isActive && !stepComplete && (
          <Badge variant="primary" className="animate-pulse" style={themeStyles.getBadgeStyle()}>
            Active
          </Badge>
        )}
        {isActive && stepComplete && (
          <LoadingCircle
            className="h-8 w-8 animate-pulse animate-spin"
            style={themeStyles.getSpinnerStyle(false)}
            aria-label="Processing"
          />
        )}
        {!isActive && stepComplete && (
          <Checkmark
            className="h-8 w-8"
            style={themeStyles.getIconStyle('success')}
            aria-label="Completed"
          />
        )}
      </div>
    </div>
  );
});
