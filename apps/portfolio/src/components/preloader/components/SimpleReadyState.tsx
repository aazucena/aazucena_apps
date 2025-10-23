import { memo } from 'react';
import { Button } from '../../ui/button';
import { CheckCircle, Rocket as RocketLaunch } from '@mynaui/icons-react';

export interface SimpleReadyStateProps {
  readyTitle: string;
  readySubtitle: string;
  continueButtonText: string;
  onContinue: () => void;
}

export const SimpleReadyState = memo(function SimpleReadyState({
  readyTitle,
  readySubtitle,
  continueButtonText,
  onContinue,
}: SimpleReadyStateProps) {
  return (
    <>
      <CheckCircle className="w-12 h-12 text-green-500 mx-auto" aria-label="Ready" />
      <div className="space-y-2">
        <h3 className="font-semibold">{readyTitle}</h3>
        <p className="text-sm text-muted-foreground text-center">{readySubtitle}</p>
      </div>
      <Button onClick={onContinue} className="w-full" aria-label={continueButtonText}>
        <RocketLaunch className="w-4 h-4 mr-2" aria-hidden="true" />
        {continueButtonText}
      </Button>
    </>
  );
});
