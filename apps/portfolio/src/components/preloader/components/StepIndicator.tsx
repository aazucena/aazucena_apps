import { memo } from 'react';
import { Badge } from '../../ui/badge';
import { CircleNotch as LoadingCircle, CheckCircleSolid as Checkmark } from '@mynaui/icons-react';
import type { LoadingStep } from '../types';

export interface StepIndicatorProps {
  step: LoadingStep;
  isCompleted: boolean;
  isActive: boolean;
  stepComplete: boolean;
}

export const StepIndicator = memo(function StepIndicator({
  step,
  isCompleted,
  isActive,
  stepComplete
}: StepIndicatorProps) {
  const StepIcon = step.icon;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
        isActive
          ? 'bg-primary/5 border-primary/20 shadow-sm'
          : isCompleted
          ? 'bg-green-50 border-green-200'
          : 'bg-muted/10 border-muted'
      }`}
      role="listitem"
      aria-current={isActive ? 'step' : undefined}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive
            ? 'bg-primary text-primary-foreground animate-pulse'
            : stepComplete
            ? 'bg-green-500 text-white'
            : 'bg-muted text-muted-foreground'
        }`}
        aria-hidden="true"
      >
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

      <div className="flex-shrink-0" aria-live="polite">
        {isActive && !stepComplete && (
          <Badge variant="default" className="animate-pulse">
            Active
          </Badge>
        )}
        {isActive && stepComplete && (
          <LoadingCircle className="w-8 h-8 text-primary animate-spin animate-pulse" aria-label="Processing" />
        )}
        {!isActive && stepComplete && (
          <Checkmark className="w-8 h-8 text-green-500" aria-label="Completed" />
        )}
      </div>
    </div>
  );
});
