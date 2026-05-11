/**
 * SectionLabel Component
 * Decorative section label with gradient lines
 * Used for "Certifications" and "Awards" labels in the hexagonal grid
 */

import type { JSX } from "react";

export interface SectionLabelProps {
  /** Label text */
  text: string;
  /** Gradient color for the line and text */
  color: "cyan" | "yellow";
  /** Additional className */
  className?: string;
}

/**
 * Color variant styles for gradient lines and text
 */
const colorVariants = {
  cyan: {
    text: "text-cyan-400",
    lineFrom: "from-transparent to-cyan-400/50",
    lineTo: "from-transparent to-cyan-400/50",
  },
  yellow: {
    text: "text-yellow-400",
    lineFrom: "from-transparent to-yellow-400/50",
    lineTo: "from-transparent to-yellow-400/50",
  },
} as const;

/**
 * SectionLabel
 * Displays a decorative label with gradient lines on both sides
 */
export function SectionLabel({
  text,
  color,
  className = "",
}: SectionLabelProps): JSX.Element {
  const styles = colorVariants[color];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center gap-4">
        <div className={`h-px w-16 bg-gradient-to-r ${styles.lineFrom}`}></div>
        <h3
          className={`text-lg font-semibold ${styles.text} tracking-wider uppercase`}
        >
          {text}
        </h3>
        <div className={`h-px w-16 bg-gradient-to-l ${styles.lineTo}`}></div>
      </div>
    </div>
  );
}
