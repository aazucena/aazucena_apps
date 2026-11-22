/**
 * GlassCard Component
 * Base card on the ui Panel surface (name kept for existing imports)
 * Reusable across all sections for consistent card appearance
 */

import type { JSX, ElementType, ComponentPropsWithoutRef } from "react";
import { Panel, panelVariants } from "@aazucena/ui";
import { cn } from "@aazucena/utils";

export interface GlassCardProps<T extends ElementType = "div"> {
  /** HTML element to render as (div, article, section, etc.) */
  as?: T;
  /** Card content */
  children: React.ReactNode;
  /** Enable hover effect (state tone) */
  hover?: boolean;
  /** Enable cursor pointer */
  clickable?: boolean;
  /** Padding size variant */
  padding?: "none" | "sm" | "md" | "lg";
  /** Additional classes */
  className?: string;
}

const paddingVariants = {
  none: "",
  sm: "p-3",
  md: "p-panel",
  lg: "p-6",
} as const;

/**
 * GlassCard
 *
 * Base card over the ui `Panel` surface:
 * - Flat panel tone with a 1px rule, no blur or shadow
 * - Optional hover tone (`bg-state`)
 * - Configurable padding
 *
 * Renders the ui `Panel` for a div; other elements (`as`) take the same
 * `panelVariants` classes so the surface is identical.
 *
 * @example
 * ```tsx
 * // Basic card
 * <GlassCard padding="md">Content here</GlassCard>
 *
 * // Interactive card
 * <GlassCard hover clickable onClick={handleClick}>
 *   Clickable content
 * </GlassCard>
 *
 * // Semantic article card
 * <GlassCard as="article" padding="lg">
 *   Article content
 * </GlassCard>
 * ```
 */
export function GlassCard<T extends ElementType = "div">({
  as,
  children,
  hover = false,
  clickable = false,
  padding = "md",
  className,
  ...props
}: GlassCardProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof GlassCardProps<T>>): JSX.Element {
  const paddingClass = paddingVariants[padding];
  const classes = cn(
    "border-rule border",
    paddingClass,
    hover &&
      "hover:bg-state hover-grow [--grow:1.02] [--transition-also:color,background-color,border-color]",
    clickable && "cursor-pointer",
    className,
  );

  if (!as || as === "div") {
    return (
      <Panel className={classes} {...(props as object)}>
        {children}
      </Panel>
    );
  }

  const Component = as as ElementType;
  return (
    <Component className={cn(panelVariants(), classes)} {...props}>
      {children}
    </Component>
  );
}
