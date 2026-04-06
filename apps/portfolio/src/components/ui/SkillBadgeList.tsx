/**
 * SkillBadgeList Component
 * Displays a list of skill badges in a flex-wrap container
 */

import type { JSX } from "react";
import { Badge } from "./common/Badge";
import type { BadgeVariant } from "./common/Badge";

export interface Skill {
  name: string;
  level?: string;
}

export interface SkillBadgeListProps {
  /** Array of skills to display */
  skills: Skill[];
  /** Badge color variant */
  variant?: BadgeVariant;
  /** Additional className for the container */
  className?: string;
}

/**
 * Maps gradient string to Badge variant
 * Extracts the primary color from gradient (e.g., "from-cyan-400 to-blue-500" → "cyan")
 */
function mapGradientToVariant(gradient: string): BadgeVariant {
  // Extract the first color from gradient string
  const match = gradient.match(/from-(\w+)-/);
  const color = match?.[1] || "cyan";

  // Map to Badge variants
  const variantMap: Record<string, BadgeVariant> = {
    cyan: "cyan",
    blue: "blue",
    purple: "purple",
    pink: "pink",
    green: "emerald",
    emerald: "emerald",
    yellow: "yellow",
    orange: "orange",
    red: "orange", // fallback to orange
    gray: "gray",
  };

  return variantMap[color] || "cyan";
}

/**
 * SkillBadgeList
 * Renders skills as badges in a centered flex-wrap layout
 */
export function SkillBadgeList({
  skills,
  variant,
  className = "",
}: SkillBadgeListProps): JSX.Element {
  return (
    <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {skills.map((skill) => (
        <Badge key={skill.name} variant={variant || "cyan"} size="md">
          {skill.name}
        </Badge>
      ))}
    </div>
  );
}

// Export helper function for use in parent components
export { mapGradientToVariant };
