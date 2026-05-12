/**
 * ResumeButton Component
 * Animated resume button with shine effect
 * Used in HeroSection for secondary CTA
 */

import { Download } from "@aazucena/icons";
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
    <button
      onClick={handleClick}
      className="group focus:ring-opacity-50 relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-emerald-500/25 hover:brightness-110 focus:ring-2 focus:ring-emerald-400 focus:outline-none sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
      aria-label="View my resume"
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 h-full w-1/2 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-[200%]" />

      <span className="relative flex items-center justify-center gap-2">
        <Download className="h-4 w-4 group-hover:animate-pulse sm:h-5 sm:w-5" />
        {children ?? "View Resume"}
      </span>
    </button>
  );
}
