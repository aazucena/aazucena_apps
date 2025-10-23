import { memo } from 'react';
import { Progress } from '../../ui/progress';
import { CircleNotch as LoadingCircle } from '@mynaui/icons-react';
import type { LoadingStep } from '../types';

export interface SimpleLoadingStateProps {
  progress: number;
  title: string;
  subtitle?: string;
  steps: LoadingStep[];
  customSpinner?: React.ComponentType<Record<string, unknown>>;
}

export const SimpleLoadingState = memo(function SimpleLoadingState({
  progress,
  title,
  subtitle,
  steps,
  customSpinner: CustomSpinner,
}: SimpleLoadingStateProps) {
  return (
    <>
      {CustomSpinner ? (
        <CustomSpinner />
      ) : (
        <LoadingCircle className="w-8 h-8 animate-spin mx-auto text-primary" aria-label="Loading" />
      )}
      <div className="space-y-2" role="status" aria-live="polite">
        <h3 className="font-semibold">{title}</h3>
        <Progress value={progress} aria-label={`Loading progress: ${Math.round(progress)}%`} />
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
  );
});
