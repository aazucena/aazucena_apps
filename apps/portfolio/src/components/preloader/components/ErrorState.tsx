import { memo } from 'react';
import { Button } from '../../ui/button';
import { CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { X, ClockHand as Retry } from '@mynaui/icons-react';

export interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
  onDismiss: () => void;
  retryButtonText?: string;
  dismissButtonText?: string;
}

export const ErrorState = memo(function ErrorState({
  error,
  onRetry,
  onDismiss,
  retryButtonText = 'Retry',
  dismissButtonText = 'Dismiss',
}: ErrorStateProps) {
  return (
    <div className="space-y-6 text-center" role="alert" aria-live="assertive">
      <div className="relative mx-auto w-20 h-20">
        <div className="absolute inset-0 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
          <X className="w-10 h-10 text-white" />
        </div>
      </div>

      <div className="space-y-2">
        <CardTitle className="text-2xl text-red-600">Loading Failed</CardTitle>
        <p className="text-muted-foreground text-center">
          An error occurred while loading the content
        </p>
      </div>

      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <Badge variant="destructive" className="mb-2">
          Error Details
        </Badge>
        <p className="text-sm text-red-800 font-mono break-words">
          {error.message}
        </p>
      </div>

      <div className="flex gap-2">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="default"
            className="flex-1 gap-2"
            aria-label={retryButtonText}
          >
            <Retry className="w-4 h-4" aria-hidden="true" />
            {retryButtonText}
          </Button>
        )}
        <Button
          onClick={onDismiss}
          variant="outline"
          className="flex-1"
          aria-label={dismissButtonText}
        >
          {dismissButtonText}
        </Button>
      </div>
    </div>
  );
});
