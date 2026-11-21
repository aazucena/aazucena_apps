/**
 * Badge Component
 * Reusable pill/tag badge with variant colors
 * Used for skills, tags, categories, status indicators
 */

import type { JSX, KeyboardEvent } from "react";
import {
  Badge as UiBadge,
  type BadgeProps as UiBadgeProps,
} from "@aazucena/ui";
import { cn } from "@aazucena/utils";

export type BadgeVariant =
  | "cyan"
  | "blue"
  | "emerald"
  | "purple"
  | "pink"
  | "yellow"
  | "orange"
  | "gray"
  | "white";

export type BadgeSize = "xs" | "sm" | "md" | "lg";

export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Color variant */
  variant?: BadgeVariant;
  /** Size variant */
  size?: BadgeSize;
  /** Additional classes */
  className?: string;
  /** Click handler (makes badge interactive) */
  onClick?: () => void;
}

/**
 * Legacy hue names map onto Avra badge variants. Tags carry no status, so no
 * variant here is `warning` or `destructive` (those need their markers).
 */
const variantMap: Record<BadgeVariant, UiBadgeProps["variant"]> = {
  cyan: "cyber",
  blue: "sky",
  emerald: "success",
  purple: "indigo",
  pink: "rose",
  yellow: "outline",
  orange: "outline",
  gray: "secondary",
  white: "outline",
};

const sizeMap: Record<BadgeSize, UiBadgeProps["size"]> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
};

/**
 * Badge
 *
 * Tag badge over the ui Badge:
 * - 9 legacy hue names mapped to Avra variants
 * - 4 size variants
 * - Optional interactive (clickable)
 *
 * Used for:
 * - Skill tags (AboutSection, SkillsSection, ExperienceSection)
 * - Project tags (ProjectsSection)
 * - Category labels (BlogSection)
 * - Status indicators (AwardsSection)
 *
 * @example
 * ```tsx
 * // Skill badge
 * <Badge variant="cyan" size="sm">React</Badge>
 *
 * // Interactive tag
 * <Badge variant="blue" onClick={() => filterByTag('frontend')}>
 *   Frontend
 * </Badge>
 *
 * // "+N more" indicator
 * <Badge variant="white" size="xs">+5 more</Badge>
 * ```
 */
export function Badge({
  children,
  variant = "cyan",
  size = "sm",
  className,
  onClick,
}: BadgeProps): JSX.Element {
  const isInteractive = Boolean(onClick);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <UiBadge
      variant={variantMap[variant]}
      size={sizeMap[size]}
      className={cn(
        "justify-center",
        isInteractive && "hover:bg-state cursor-pointer",
        className,
      )}
      onClick={onClick}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {children}
    </UiBadge>
  );
}
