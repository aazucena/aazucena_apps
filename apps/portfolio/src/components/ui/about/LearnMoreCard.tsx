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

export type LearnMoreCardVariant =
  | "cyan-blue"
  | "emerald-teal"
  | "purple-pink"
  | "orange-red"
  | "indigo-purple";

export interface LearnMoreCardProps {
  /** Link destination */
  href?: string;
  /** Card title */
  title: string;
  /** Color variant */
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
 * Variant class mappings
 * Pre-defined to work with Tailwind JIT compiler
 */
const variantStyles: Record<
  LearnMoreCardVariant,
  {
    card: string;
    icon: string;
    button: string;
  }
> = {
  "cyan-blue": {
    card: "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 hover:from-cyan-400/20 hover:to-blue-500/20 border-cyan-400/30",
    icon: "bg-gradient-to-br from-cyan-400 to-blue-500",
    button: "text-cyan-400",
  },
  "emerald-teal": {
    card: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:from-emerald-400/20 hover:to-teal-500/20 border-emerald-400/30",
    icon: "bg-gradient-to-br from-emerald-400 to-teal-500",
    button: "text-emerald-400",
  },
  "purple-pink": {
    card: "bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-400/20 hover:to-pink-500/20 border-purple-400/30",
    icon: "bg-gradient-to-br from-purple-400 to-pink-500",
    button: "text-purple-400",
  },
  "orange-red": {
    card: "bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:from-orange-400/20 hover:to-red-500/20 border-orange-400/30",
    icon: "bg-gradient-to-br from-orange-400 to-red-500",
    button: "text-orange-400",
  },
  "indigo-purple": {
    card: "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-400/20 hover:to-purple-500/20 border-indigo-400/30",
    icon: "bg-gradient-to-br from-indigo-400 to-purple-500",
    button: "text-indigo-400",
  },
};

/**
 * LearnMoreCard
 *
 * Interactive card with:
 * - Gradient background matching variant
 * - Icon in colored circle
 * - Title, description, and CTA button
 * - Hover scale effect
 *
 * @example
 * ```tsx
 * <LearnMoreCard
 *   href="/journey"
 *   title="My Journey"
 *   variant="cyan-blue"
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
  variant = "cyan-blue",
  href,
  title,
  children,
  icon,
  buttonText,
  buttonIcon,
}: LearnMoreCardProps): JSX.Element {
  const styles = variantStyles[variant];

  return (
    <a
      href={href}
      className={cn(
        "group rounded-lg border p-3 transition-all duration-300 hover:scale-105 active:scale-95 md:p-4",
        styles.card,
        className,
      )}
    >
      {/* Header row — icon + title, arrow inline on mobile */}
      <div className="flex items-center justify-between gap-3 md:mb-2 md:justify-start">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg md:h-8 md:w-8",
              styles.icon,
              iconClassName,
            )}
          >
            <IconRenderer
              icon={icon}
              className="h-3.5 w-3.5 text-white md:h-5 md:w-5"
            />
          </div>
          <h4 className="text-sm font-bold text-white md:text-base">{title}</h4>
        </div>
        <ArrowRight
          className={cn(
            "h-3 w-3 flex-shrink-0 transition-transform group-hover:translate-x-1 group-active:translate-x-1 md:hidden",
            styles.button,
          )}
        />
      </div>

      {/* Description — desktop only */}
      {children && (
        <p className="mb-2 hidden text-sm text-gray-400 md:block">{children}</p>
      )}

      {/* Button row — desktop only */}
      <div
        className={cn(
          "hidden items-center gap-2 text-xs font-medium md:flex",
          styles.button,
          buttonClassName,
        )}
      >
        <span>{buttonText}</span>
        {buttonIcon ? (
          <IconRenderer
            icon={buttonIcon}
            className="h-3 w-3 transition-transform group-hover:translate-x-1 group-active:translate-x-1"
          />
        ) : (
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 group-active:translate-x-1" />
        )}
      </div>
    </a>
  );
}
