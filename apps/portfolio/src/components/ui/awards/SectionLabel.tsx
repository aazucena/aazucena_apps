/**
 * SectionLabel Component
 * Section label with rules on both sides
 * Used for "Certifications" and "Awards" labels in the hexagonal grid
 */

import type { JSX } from "react";

export interface SectionLabelProps {
  /** Label text */
  text: string;
  /** Series hue for the label: cyan maps to series 1, yellow to series 3 */
  color: "cyan" | "yellow";
  /** Additional className */
  className?: string;
}

/** Series tokens; the label text always names the group, so hue never carries meaning alone. */
const colorVariants = {
  cyan: { text: "text-series-1", line: "bg-series-1/50" },
  yellow: { text: "text-series-3", line: "bg-series-3/50" },
} as const;

/**
 * SectionLabel
 * Displays a label with a rule on each side
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
        <div className={`h-px w-16 ${styles.line}`} aria-hidden="true"></div>
        <h3 className={`micro-label ${styles.text}`}>{text}</h3>
        <div className={`h-px w-16 ${styles.line}`} aria-hidden="true"></div>
      </div>
    </div>
  );
}
