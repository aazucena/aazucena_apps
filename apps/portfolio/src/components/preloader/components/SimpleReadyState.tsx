import { memo } from 'react';
import { Button } from '../../ui/button';
import { CheckCircle, Rocket as RocketLaunch } from '@mynaui/icons-react';
import type { ThemeStyles } from '../hooks/useTheme';

export interface SimpleReadyStateProps {
  readyTitle: string;
  readySubtitle: string;
  continueButtonText: string;
  onContinue: () => void;
  themeStyles: ThemeStyles;
}

export const SimpleReadyState = memo(function SimpleReadyState({
  readyTitle,
  readySubtitle,
  continueButtonText,
  onContinue,
  themeStyles,
}: SimpleReadyStateProps) {
  return (
    <>
      <CheckCircle
        className="w-12 h-12 mx-auto"
        style={themeStyles.getIconStyle('success')}
        aria-label="Ready"
      />
      <div className="space-y-2">
        <h3 className="font-semibold" style={themeStyles.titleStyle}>{readyTitle}</h3>
        <p className="text-sm text-center" style={themeStyles.subtitleStyle}>{readySubtitle}</p>
      </div>
      <Button
        onClick={onContinue}
        className="w-full border-2"
        style={{
          ...themeStyles.getButtonStyle('primary'),
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        }}
        aria-label={continueButtonText}
      >
        <RocketLaunch className="w-4 h-4 mr-2" aria-hidden="true" />
        {continueButtonText}
      </Button>
    </>
  );
});
