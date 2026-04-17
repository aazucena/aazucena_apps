/**
 * LearnMoreCard Component
 * Interactive card linking to detailed content pages
 * Used in AboutSection for "Learn More" CTAs
 */

import type { JSX } from "react";
// TEST 13: stub @aazucena/ui barrel import
// import { IconRenderer } from "@aazucena/ui";
const IconRenderer = ({
  icon: _icon,
}: {
  icon?: unknown;
  className?: string;
}) => null;
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
        "group rounded-lg border p-4 transition-all duration-300 hover:scale-105",
        styles.card,
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-3">
        <div
          className={cn(
            "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
            styles.icon,
            iconClassName,
          )}
        >
          <IconRenderer icon={icon} className="h-5 w-5 text-white" />
        </div>
        <h4 className="text-base font-bold text-white">{title}</h4>
      </div>

      {children && <p className="mb-2 text-xs text-gray-400">{children}</p>}

      <div
        className={cn(
          "flex items-center gap-2 text-xs font-medium",
          styles.button,
          buttonClassName,
        )}
      >
        <span>{buttonText}</span>
        {buttonIcon && (
          <IconRenderer
            icon={buttonIcon}
            className="h-3 w-3 transition-transform group-hover:translate-x-1"
          />
        )}
      </div>
    </a>
  );
}
