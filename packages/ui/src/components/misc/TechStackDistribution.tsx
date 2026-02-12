/**
 * TechStackDistribution.tsx
 * Visualizes the breakdown of focus areas (e.g., Frontend, Backend, DevOps)
 * and displays skill badges with icons categorized by usage.
 */

import { Terminal } from '@aazucena/icons';
import type { JSX } from 'react';
import { cn } from '@aazucena/utils';
import { SKILL_CATEGORY_METADATA } from '@aazucena/constants';
import { IconRenderer } from '../blocks/IconRenderer.js';

export interface TechStackSkill {
  name: string;
  category: string;
}

export interface TechStackDistributionProps {
  skills: TechStackSkill[];
  className?: string;
}

// Helper to determine skill "weight"
const getSkillWeight = (category: string, index: number) => {
  if (['Frontend', 'Backend'].includes(category) && index < 3) return 'core';
  if (['Tools', 'DevOps'].includes(category)) return 'tool';
  return 'occasional';
};

/**
 * Render Category Icon
 */
function CategoryIcon({ category, size = 12 }: { category: string; size?: number }) {
  const metadata = SKILL_CATEGORY_METADATA[category];
  const iconId = metadata?.iconId || 'Terminal';

  return (
    <IconRenderer icon={iconId} size={size} className={size > 12 ? 'h-4 w-4 text-gray-400' : ''} />
  );
}

export function TechStackDistribution({
  skills,
  className,
}: TechStackDistributionProps): JSX.Element {
  // 1. Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill.name);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  // 2. Calculate distribution percentages
  const totalSkills = skills.length;
  const distribution = Object.entries(skillsByCategory)
    .map(([category, items]) => ({
      category,
      count: items.length,
      percentage: Math.round((items.length / totalSkills) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <div className={cn('space-y-8', className)}>
      {/* Distribution Chart */}
      <div>
        <h3 className="mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
          Focus Distribution
        </h3>
        <div className="space-y-4">
          {distribution.map((item) => {
            const metadata = SKILL_CATEGORY_METADATA[item.category];
            const gradient = metadata?.gradientClass || 'from-gray-400 to-gray-500';

            return (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                    <span
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded bg-gradient-to-br text-[10px] text-white',
                        gradient,
                      )}
                    >
                      <span className="opacity-80">
                        <CategoryIcon category={item.category} />
                      </span>
                    </span>
                    {item.category}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">{item.percentage}%</span>
                </div>
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100 opacity-90 dark:bg-gray-700">
                  <div
                    className={cn('h-full bg-gradient-to-r transition-all duration-500', gradient)}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div>
        <h3 className="mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
          Area of Expertise
        </h3>
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, items]) => (
            <div key={category}>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                <CategoryIcon category={category} size={16} />
                {category}
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((skill, idx) => {
                  const weight = getSkillWeight(category, idx);

                  const baseStyles =
                    'inline-flex items-center rounded-md border transition-colors cursor-default';
                  const weightStyles =
                    weight === 'tool'
                      ? 'px-2.5 py-1 text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      : 'px-2 py-0.5 text-[10px] text-gray-500 dark:text-gray-500 border-transparent bg-gray-50 dark:bg-gray-800/50';

                  return (
                    <span key={skill} className={cn(baseStyles, weightStyles)}>
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
