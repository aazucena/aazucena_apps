import { memo } from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { CardTitle } from '../../ui/card';
import {
  Check,
  SparklesSolid as Sparkle,
  Rocket as RocketLaunch,
  ClockCircle as Clock,
} from '@mynaui/icons-react';
import type { ThemeStyles } from '../hooks/useTheme';

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
  debug = false
}: ReadyStateProps) {
  return (
    <div className="space-y-6 text-center animate-in fade-in-0 zoom-in-95 duration-500" role="status" aria-live="polite">
      <div className="relative mx-auto w-20 h-20" aria-hidden="true">
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: themeStyles.config.colors.success }}
        >
          <Check className="w-10 h-10" style={{ color: themeStyles.config.colors.successForeground }} />
        </div>
        <Sparkle className="absolute -top-2 -right-2 w-6 h-6 animate-pulse text-yellow-400" />
      </div>

      <div className="space-y-2">
        <CardTitle className="text-2xl" style={themeStyles.titleStyle}>{readyTitle}</CardTitle>
        {readySubtitle && (
          <p className="text-center" style={themeStyles.subtitleStyle}>
            {readySubtitle}
          </p>
        )}
      </div>

      {debug && (
        <div className="grid grid-cols-2 gap-4 text-center" role="region" aria-label="Debug information">
          <div className="space-y-1">
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Load Time
            </Badge>
            <p className="text-lg font-bold text-foreground">{loadTime}s</p>
          </div>
          <div className="space-y-1">
            <Badge variant="outline" className="text-xs">
              <Check stroke="2.5" className="w-3 h-3 mr-1" />
              Steps Complete
            </Badge>
            <p className="text-lg font-bold text-foreground">{completedSteps}/{totalSteps}</p>
          </div>
        </div>
      )}

      <Button
        onClick={onContinue}
        size="lg"
        className="w-full gap-2 transition-all duration-300 transform hover:scale-105 active:scale-95 border-2"
        style={{
          ...themeStyles.getButtonStyle('primary'),
          // Ensure text is always visible
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        }}
        aria-label={continueButtonText}
      >
        <RocketLaunch stroke="2.5" className="w-4 h-4" aria-hidden="true" />
        {continueButtonText}
      </Button>
      {readyFooterNote && (
        <p className="text-xs text-center" style={themeStyles.subtitleStyle}>
          {readyFooterNote}
        </p>
      )}
    </div>
  );
});
