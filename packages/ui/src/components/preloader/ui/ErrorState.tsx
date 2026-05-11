import { memo } from 'react';
import { Button } from '../../ui/button';
import { CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { X, ClockHand as Retry } from '@aazucena/icons';
import type { ThemeStyles } from '@aazucena/hooks';

export interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
  onDismiss: () => void;
  retryButtonText?: string;
  dismissButtonText?: string;
  themeStyles: ThemeStyles;
}

export const ErrorState = memo(function ErrorState({
  error,
  onRetry,
  onDismiss,
  retryButtonText = 'Retry',
  dismissButtonText = 'Dismiss',
  themeStyles,
}: ErrorStateProps) {
  return (
    <div className="space-y-6 text-center" role="alert" aria-live="assertive">
      <div className="relative mx-auto h-20 w-20">
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full shadow-lg"
          style={{ background: themeStyles.config.colors.error }}
        >
          <X className="h-10 w-10" style={{ color: themeStyles.config.colors.errorForeground }} />
        </div>
      </div>

      <div className="space-y-2">
        <CardTitle
          className="text-2xl"
          style={{
            ...themeStyles.titleStyle,
            color: themeStyles.config.colors.error,
          }}
        >
          Loading Failed
        </CardTitle>
        <p className="text-center" style={themeStyles.subtitleStyle}>
          An error occurred while loading the content
        </p>
      </div>

      <div
        className="rounded-lg border p-4"
        style={{
          background: `${themeStyles.config.colors.error}15`,
          borderColor: themeStyles.config.colors.error,
        }}
      >
        <Badge variant="destructive" className="mb-2">
          Error Details
        </Badge>
        <p
          className="font-mono text-sm break-words"
          style={{ color: themeStyles.config.colors.error }}
        >
          {error.message}
        </p>
      </div>

      <div className="flex gap-2">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="default"
            className="flex-1 gap-2 border-2"
            style={{
              ...themeStyles.getButtonStyle('primary'),
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            }}
            aria-label={retryButtonText}
          >
            <Retry className="h-4 w-4" aria-hidden="true" />
            {retryButtonText}
          </Button>
        )}
        <Button
          onClick={onDismiss}
          variant="outline"
          className="flex-1 border-2"
          style={{
            ...themeStyles.getButtonStyle('secondary'),
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          }}
          aria-label={dismissButtonText}
        >
          {dismissButtonText}
        </Button>
      </div>
    </div>
  );
});
