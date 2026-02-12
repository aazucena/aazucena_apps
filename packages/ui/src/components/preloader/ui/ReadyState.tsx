import { memo } from 'react';
import { Button } from '../../ui/button.js';
import { Badge } from '../../ui/badge.js';
import { CardTitle } from '../../ui/card.js';
import {
  Check,
  SparklesSolid as Sparkle,
  Rocket as RocketLaunch,
  ClockCircle as Clock,
} from '@aazucena/icons';
import type { ThemeStyles } from '@aazucena/hooks';

export interface ReadyStateProps {
  loadTime: string;
  onContinue: () => void;
  totalSteps: number;
  completedSteps: number;
  readyTitle: string;
  readySubtitle?: string;
  readyFooterNote?: string;
  continueButtonText: string;
  debug?: boolean;
  themeStyles: ThemeStyles;
}

export const ReadyState = memo(function ReadyState({
  loadTime,
  onContinue,
  totalSteps,
  completedSteps,
  readyTitle,
  readySubtitle,
  readyFooterNote,
  continueButtonText,
  themeStyles,
  debug = false,
}: ReadyStateProps) {
  return (
    <div
      className="animate-in fade-in-0 zoom-in-95 space-y-6 text-center duration-500"
      role="status"
      aria-live="polite"
    >
      <div className="relative mx-auto h-20 w-20" aria-hidden="true">
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full shadow-lg"
          style={{ background: themeStyles.config.colors.success }}
        >
          <Check
            className="h-10 w-10"
            style={{ color: themeStyles.config.colors.successForeground }}
          />
        </div>
        <Sparkle className="absolute -top-2 -right-2 h-6 w-6 animate-pulse text-yellow-400" />
      </div>

      <div className="space-y-2">
        <CardTitle className="text-2xl" style={themeStyles.titleStyle}>
          {readyTitle}
        </CardTitle>
        {readySubtitle && (
          <p className="text-center" style={themeStyles.subtitleStyle}>
            {readySubtitle}
          </p>
        )}
      </div>

      {debug && (
        <div
          className="grid grid-cols-2 gap-4 text-center"
          role="region"
          aria-label="Debug information"
        >
          <div className="space-y-1">
            <Badge variant="outline" className="text-xs">
              <Clock className="mr-1 h-3 w-3" />
              Load Time
            </Badge>
            <p className="text-foreground text-lg font-bold">{loadTime}s</p>
          </div>
          <div className="space-y-1">
            <Badge variant="outline" className="text-xs">
              <Check stroke="2.5" className="mr-1 h-3 w-3" />
              Steps Complete
            </Badge>
            <p className="text-foreground text-lg font-bold">
              {completedSteps}/{totalSteps}
            </p>
          </div>
        </div>
      )}

      <Button
        onClick={onContinue}
        size="lg"
        className="w-full transform gap-2 border-2 transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          ...themeStyles.getButtonStyle('primary'),
          // Ensure text is always visible
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        }}
        aria-label={continueButtonText}
      >
        <RocketLaunch stroke="2.5" className="h-4 w-4" aria-hidden="true" />
        {continueButtonText}
      </Button>
      {readyFooterNote && (
        <p className="text-center text-xs" style={themeStyles.subtitleStyle}>
          {readyFooterNote}
        </p>
      )}
    </div>
  );
});
