/**
 * SkillBadgeList Component
 * Displays a list of skill badges in a flex-wrap container
 */

import type { JSX } from 'react';
import { LegacyBadge as Badge } from '../common/Badge.js';
import { cn } from '@aazucena/utils';
import type { ColorVariant, ButtonSize } from '@aazucena/types';

export interface SkillItem {
  name: string;
  level?: string;
}

export interface SkillBadgeListProps {
  /** Array of skills to display */
  skills: SkillItem[];
  /** Badge color variant */
  variant?: ColorVariant;
  /** Badge size */
  size?: ButtonSize;
  /** Additional className for the container */
  className?: string;
}

/**
 * SkillBadgeList
 */
export function SkillBadgeList({
  skills,
  variant,
  size = 'sm',
  className,
}: SkillBadgeListProps): JSX.Element {
  return (
    <div className={cn('flex flex-wrap justify-center gap-3', className)}>
      {skills.map((skill) => (
        <Badge key={skill.name} variant={variant || 'cyan'} size={size}>
          {skill.name}
        </Badge>
      ))}
    </div>
  );
}
