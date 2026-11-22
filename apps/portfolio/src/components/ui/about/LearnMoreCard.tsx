/**
 * LearnMoreCard Component
 * Interactive card linking to detailed content pages
 * Used in AboutSection for "Learn More" CTAs
 */

import type { JSX } from "react";
import { IconRenderer } from "@aazucena/ui";
import { ArrowRight } from "@aazucena/icons";
import { cn } from "@aazucena/utils";
import type { IconComponent } from "@aazucena/types";
import { cmsTone } from "~/lib/utils/cms-tone";

export type LearnMoreCardVariant =
  "cyan-blue" | "emerald-teal" | "purple-pink" | "orange-red" | "indigo-purple";

export interface LearnMoreCardProps {
  /** Link destination */
  href?: string;
  /** Card title */
  title: string;
  /** CMS colour name; mapped to a signal or series tone, neutral signal when unknown. */
  variant?: LearnMoreCardVariant;
  /** Card description */
  children?: React.ReactNode;
  /** Icon for the card header */
  icon: IconComponent;
  /** Button text */
  buttonText: string;
  /** Button icon */
  buttonIcon?: IconComponent;
  /** Additional card classes */
  className?: string;
  /** Additional icon container classes */
  iconClassName?: string;
  /** Additional button classes */
  buttonClassName?: string;
}

/**
 * LearnMoreCard
 *
 * Interactive card with:
 * - Flat panel surface with a rule border
 * - Icon in the signal tone
 * - Title, description, and CTA button
 * - Hover state tone
 *
 * @example
 * ```tsx
 * <LearnMoreCard
 *   href="/journey"
 *   title="My Journey"
 *   icon={MapIcon}
 *   buttonText="Explore Timeline"
 *   buttonIcon={ArrowRightIcon}
 * >
 *   Discover my professional path and key milestones
 * </LearnMoreCard>
 * ```
 */
export function LearnMoreCard({
  className,
  iconClassName,
  buttonClassName,
  href,
  title,
  children,
  icon,
  buttonText,
  buttonIcon,
  variant,
}: LearnMoreCardProps): JSX.Element {
  return (
    <a
      href={href}
      className={cn(
        "press group bg-panel border-rule rounded-card hover:bg-state focus-visible:outline-signal block border p-3 transition-colors duration-(--motion-base) focus-visible:outline-1 focus-visible:outline-offset-2 md:p-4",
        className,
      )}
    >
      {/* Header row: icon + title, arrow inline on mobile */}
      <div className="flex items-center justify-between gap-3 md:mb-2 md:justify-start">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "text-signal flex h-6 w-6 flex-shrink-0 items-center justify-center md:h-8 md:w-8",
              iconClassName,
            )}
            style={{ color: cmsTone(variant) ?? undefined }}
          >
            <IconRenderer icon={icon} className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <h4 className="text-foreground text-sm font-semibold md:text-base">
            {title}
          </h4>
        </div>
        <ArrowRight className="text-signal h-3 w-3 flex-shrink-0 md:hidden" />
      </div>

      {/* Description: desktop only */}
      {children && (
        <p className="text-muted-foreground mb-2 hidden text-sm md:block">
          {children}
        </p>
      )}

      {/* Button row: desktop only */}
      <div
        className={cn(
          "text-signal hidden items-center gap-2 text-xs font-medium md:flex",
          buttonClassName,
        )}
      >
        <span>{buttonText}</span>
        {buttonIcon ? (
          <IconRenderer icon={buttonIcon} className="h-3 w-3" />
        ) : (
          <ArrowRight className="h-3 w-3" />
        )}
      </div>
    </a>
  );
}
