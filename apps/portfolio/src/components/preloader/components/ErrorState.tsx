import { memo } from 'react';
import { Button } from '../../ui/button';
import { CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { X, ClockHand as Retry } from '@mynaui/icons-react';
import type { ThemeStyles } from '../hooks/useTheme';

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
      <div className="relative mx-auto w-20 h-20">
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: themeStyles.config.colors.error }}
        >
          <X className="w-10 h-10" style={{ color: themeStyles.config.colors.errorForeground }} />
        </div>
      </div>

      <div className="space-y-2">
        <CardTitle className="text-2xl" style={{ ...themeStyles.titleStyle, color: themeStyles.config.colors.error }}>
          Loading Failed
        </CardTitle>
        <p className="text-center" style={themeStyles.subtitleStyle}>
          An error occurred while loading the content
        </p>
      </div>

      <div
        className="p-4 border rounded-lg"
        style={{
          background: `${themeStyles.config.colors.error}15`,
          borderColor: themeStyles.config.colors.error
        }}
      >
        <Badge variant="destructive" className="mb-2">
          Error Details
        </Badge>
        <p className="text-sm font-mono break-words" style={{ color: themeStyles.config.colors.error }}>
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
            <Retry className="w-4 h-4" aria-hidden="true" />
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
