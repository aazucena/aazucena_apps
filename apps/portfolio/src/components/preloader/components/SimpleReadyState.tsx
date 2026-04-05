import { memo } from "react";
import { Button } from "../../ui/button";
import { CheckCircle, Rocket as RocketLaunch } from "@aazucena/icons";
import type { ThemeStyles } from "../hooks/useTheme";

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
        className="mx-auto h-12 w-12"
        style={themeStyles.getIconStyle("success")}
        aria-label="Ready"
      />
      <div className="space-y-2">
        <h3 className="font-semibold" style={themeStyles.titleStyle}>
          {readyTitle}
        </h3>
        <p className="text-center text-sm" style={themeStyles.subtitleStyle}>
          {readySubtitle}
        </p>
      </div>
      <Button
        onClick={onContinue}
        className="w-full border-2"
        style={{
          ...themeStyles.getButtonStyle("primary"),
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
        }}
        aria-label={continueButtonText}
      >
        <RocketLaunch className="mr-2 h-4 w-4" aria-hidden="true" />
        {continueButtonText}
      </Button>
    </>
  );
});
