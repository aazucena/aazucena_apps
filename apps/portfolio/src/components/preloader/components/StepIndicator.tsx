import { memo } from 'react';
import { Badge } from '../../ui/badge';
import { type Icon, CircleNotch as LoadingCircle, CheckCircleSolid as Checkmark } from '@mynaui/icons-react';
import type { LoadingStep } from '../types';
import type { ThemeStyles } from '../hooks/useTheme';

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
  const StepIcon = step.icon as Icon;

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
      className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-300"
      style={getContainerStyle()}
      role="listitem"
      aria-current={isActive ? 'step' : undefined}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive ? 'animate-pulse' : ''
        }`}
        style={getIconStyle()}
        aria-hidden="true"
      >
        <StepIcon stroke="2.5" className="w-4 h-4" />
      </div>

      <div className="flex-1 text-left min-w-0">
        <p
          className="font-medium text-sm transition-colors"
          style={getTextStyle()}
        >
          {step.name}
        </p>
        <p className="text-xs truncate" style={{ color: themeStyles.config.colors.mutedForeground }}>
          {step.description}
        </p>
        {isActive && !stepComplete && step.check && (
          <p
            className="text-xs mt-1 animate-pulse"
            style={{ color: themeStyles.config.colors.accent }}
          >
            Verifying...
          </p>
        )}
      </div>

      <div className="flex-shrink-0" aria-live="polite">
        {isActive && !stepComplete && (
          <Badge variant="default" className="animate-pulse" style={themeStyles.getBadgeStyle()}>
            Active
          </Badge>
        )}
        {isActive && stepComplete && (
          <LoadingCircle
            className="w-8 h-8 animate-spin animate-pulse"
            style={themeStyles.getSpinnerStyle(false)}
            aria-label="Processing"
          />
        )}
        {!isActive && stepComplete && (
          <Checkmark
            className="w-8 h-8"
            style={themeStyles.getIconStyle('success')}
            aria-label="Completed"
          />
        )}
      </div>
    </div>
  );
});
