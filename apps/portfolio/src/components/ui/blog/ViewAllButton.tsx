/**
 * ViewAllButton Component
 * Link button for "View All" actions (ui Button)
 * Reusable for blog, awards, projects, etc.
 */

import type { JSX } from "react";
import { Button } from "@aazucena/ui";
import { cn } from "@aazucena/utils";

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
 * Reusable CTA link with an accessible label
 */
export function ViewAllButton({
  text,
  href,
  ariaLabel,
  className = "",
}: ViewAllButtonProps): JSX.Element {
  return (
    <div className="mt-4 flex justify-center md:mt-16">
      <Button asChild size="lg" className={cn(className)}>
        <a href={href} aria-label={ariaLabel}>
          {text}
        </a>
      </Button>
    </div>
  );
}
