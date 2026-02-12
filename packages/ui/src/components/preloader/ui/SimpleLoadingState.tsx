import { memo } from 'react';
import { Progress } from '../../ui/progress.js';
import { CircleNotch as LoadingCircle } from '@aazucena/icons';
import type { CustomSpinnerProps, LoadingStep } from '@aazucena/types';
import type { ThemeStyles } from '@aazucena/hooks';
import type { ComponentType } from 'react';

export interface SimpleLoadingStateProps {
  progress: number;
  title: string;
  subtitle?: string;
  steps: LoadingStep[];
  customSpinner?: ComponentType<CustomSpinnerProps>;
  themeStyles: ThemeStyles;
}

export const SimpleLoadingState = memo(function SimpleLoadingState({
  progress,
  title,
  subtitle,
  steps,
  customSpinner: CustomSpinner,
  themeStyles,
}: SimpleLoadingStateProps) {
  return (
    <>
      {CustomSpinner ? (
        <CustomSpinner />
      ) : (
        <LoadingCircle
          className="mx-auto h-8 w-8 animate-spin"
          style={themeStyles.getSpinnerStyle(false)}
          aria-label="Loading"
        />
      )}
      <div className="space-y-2" role="status" aria-live="polite">
        <h3 className="font-semibold" style={themeStyles.titleStyle}>
          {title}
        </h3>
        <Progress value={progress} aria-label={`Loading progress: ${Math.round(progress)}%`} />
        <p className="text-center text-sm" style={themeStyles.subtitleStyle}>
          {Math.round(progress)}%
        </p>
        {steps.length > 0 && (
          <p className="text-center text-xs" style={themeStyles.subtitleStyle}>
            {steps[Math.min(Math.floor(progress / (100 / steps.length)), steps.length - 1)]?.name}
          </p>
        )}
        {subtitle && (
          <p className="text-xs" style={themeStyles.subtitleStyle}>
            {subtitle}
          </p>
        )}
      </div>
    </>
  );
});
