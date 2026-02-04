/**
 * ViewAllButton Component
 * Gradient CTA button for "View All" actions
 * Reusable for blog, awards, projects, etc.
 */

import type { JSX } from 'react';

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
  className = '',
}: ViewAllButtonProps): JSX.Element {
  return (
    <div className="mt-16 flex justify-center">
      <a
        href={href}
        className={`px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 ${className}`}
        aria-label={ariaLabel}
      >
        {text}
      </a>
    </div>
  );
}
