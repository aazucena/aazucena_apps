import { memo } from 'react';
import { Progress } from '../../ui/progress';
import { CircleNotch as LoadingCircle } from '@mynaui/icons-react';
import type { LoadingStep } from '../types';
import type { ThemeStyles } from '../hooks/useTheme';

export interface SimpleLoadingStateProps {
  progress: number;
  title: string;
  subtitle?: string;
  steps: LoadingStep[];
  customSpinner?: React.ComponentType<Record<string, unknown>>;
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
          className="w-8 h-8 animate-spin mx-auto"
          style={themeStyles.getSpinnerStyle(false)}
          aria-label="Loading"
        />
      )}
      <div className="space-y-2" role="status" aria-live="polite">
        <h3 className="font-semibold" style={themeStyles.titleStyle}>{title}</h3>
        <Progress value={progress} aria-label={`Loading progress: ${Math.round(progress)}%`} />
        <p className="text-sm text-center" style={themeStyles.subtitleStyle}>{Math.round(progress)}%</p>
        {steps.length > 0 && (
          <p className="text-xs text-center" style={themeStyles.subtitleStyle}>
            {steps[Math.min(Math.floor(progress / (100 / steps.length)), steps.length - 1)]?.name}
          </p>
        )}
        {subtitle && (
          <p className="text-xs" style={themeStyles.subtitleStyle}>{subtitle}</p>
        )}
      </div>
    </>
  );
});
