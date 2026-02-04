/**
 * ResumeButton Component
 * Animated resume button with shine effect
 * Used in HeroSection for secondary CTA
 */

import { Download } from '@mynaui/icons-react';
import type { JSX } from 'react';
import { RESUME_OPEN_DELAY } from '~/config/animations/constants';

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
  src = '/AldrinAzucena_Resume.pdf'
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
      className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50 overflow-hidden"
      aria-label="View my resume"
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />

      <span className="relative flex items-center justify-center gap-2">
        <Download className="w-5 h-5 group-hover:animate-pulse" />
        {children ?? 'View Resume'}
      </span>
    </button>
  );
}
