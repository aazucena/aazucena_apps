/**
 * ResumeButton Component
 * Resume button (outline)
 * Used in HeroSection for secondary CTA
 */

import { Download } from "@aazucena/icons";
import { Button } from "@aazucena/ui";
import type { JSX } from "react";
import { RESUME_OPEN_DELAY } from "~/config/animations";

export interface ResumeButtonProps {
  /** Resume PDF URL */
  src?: string;
  /** Click handler for animations */
  onClick?: () => void;
  /** Button text */
  children?: React.ReactNode;
  /** Whether to show the button */
  show?: boolean;
}

export function ResumeButton({
  show = true,
  onClick,
  children,
  src = "/AldrinAzucena_Resume.pdf",
}: ResumeButtonProps): JSX.Element {
  if (!show) return <></>;

  const handleClick = () => {
    onClick?.();
    setTimeout(() => {
      // Secure window.open to prevent tabnabbing attacks
      const resumeWindow = window.open(src, "_blank");
      if (resumeWindow) {
        resumeWindow.opener = null;
      }
    }, RESUME_OPEN_DELAY);
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="sm:h-control-lg w-full sm:w-auto sm:px-6"
      aria-label="View my resume"
    >
      <Download aria-hidden />
      {children ?? "View Resume"}
    </Button>
  );
}
