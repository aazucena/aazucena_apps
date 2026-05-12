/**
 * ViewAllButton Component
 * Gradient CTA button for "View All" actions
 * Reusable for blog, awards, projects, etc.
 */

import type { JSX } from "react";

export interface ViewAllButtonProps {
  /** Button text */
  text: string;
  /** Button href */
  href: string;
  /** Accessible label for screen readers */
  ariaLabel: string;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * ViewAllButton
 * Reusable gradient CTA button with hover effects and accessibility
 */
export function ViewAllButton({
  text,
  href,
  ariaLabel,
  className = "",
}: ViewAllButtonProps): JSX.Element {
  return (
    <div className="mt-4 flex justify-center md:mt-16">
      <a
        href={href}
        className={`focus:ring-opacity-50 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/25 focus:ring-2 focus:ring-cyan-400 focus:outline-none ${className}`}
        aria-label={ariaLabel}
      >
        {text}
      </a>
    </div>
  );
}
