/**
 * TechStackDistribution.tsx
 * Visualizes the breakdown of focus areas (e.g., Frontend, Backend, DevOps)
 * and displays skill badges with icons categorized by usage.
 */

import {
  Cloud,
  Database,
  Grid,
  LayersOne,
  Layout,
  Paint,
  Servers,
  Terminal,
  Wrench
} from '@mynaui/icons-react';
import type { JSX } from 'react';
import { Progress } from '~/components/ui/progress';

interface Skill {
  name: string;
  category: string;
}

interface TechStackDistributionProps {
  skills: Skill[];
}

// Icon mapping for skill categories
const CATEGORY_ICONS: Record<string, any> = {
  'Frontend': Layout,
  'Backend': Servers,
  'Database': Database,
  'Cloud': Cloud,
  'Tools': Wrench,
  'Design': Paint,
  'Testing': LayersOne,
  'Core': Grid,
  'Other': Terminal,
};

// Color mapping for skill categories (gradients)
const CATEGORY_COLORS: Record<string, string> = {
  'Frontend': 'from-blue-400 to-cyan-400',
  'Backend': 'from-green-400 to-emerald-500',
  'Database': 'from-yellow-400 to-orange-500',
  'Cloud': 'from-purple-400 to-pink-500',
  'Tools': 'from-gray-400 to-gray-600',
  'Design': 'from-pink-400 to-rose-500',
  'Testing': 'from-red-400 to-red-600',
  'Other': 'from-indigo-400 to-violet-500',
};

// Helper to determine skill "weight" (Core, Tool, Occasional)
// In a real app, this could come from Strapi "proficiency" or "usage" field
// Here we infer it or randomize slightly for visual variety if not provided
const getSkillWeight = (category: string, index: number) => {
  if (['Frontend', 'Backend'].includes(category) && index < 3) return 'core';
  if (['Tools', 'DevOps'].includes(category)) return 'tool';
  return 'occasional';
};

export function TechStackDistribution({ skills }: TechStackDistributionProps): JSX.Element {
  // 1. Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  // 2. Calculate distribution percentages (simple count-based for now)
  const totalSkills = skills.length;
  const distribution = Object.entries(skillsByCategory)
    .map(([category, items]) => ({
      category,
      count: items.length,
      percentage: Math.round((items.length / totalSkills) * 100)
    }))
    .sort((a, b) => b.count - a.count) // Sort by most used
    .slice(0, 4); // Take top 4 for the chart

  return (
    <div className="space-y-8">
      {/* Distribution Chart */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Focus Distribution
        </h3>
        <div className="space-y-4">
          {distribution.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  {CATEGORY_ICONS[item.category] && (
                    <span className={`w-4 h-4 flex items-center justify-center rounded bg-gradient-to-br ${CATEGORY_COLORS[item.category] || 'from-gray-400 to-gray-500'} text-[10px] text-white`}>
                      <span className="opacity-80">
                         {/* We render the icon component dynamically */}
                         {(() => {
                            const Icon = CATEGORY_ICONS[item.category] || Terminal;
                            return <Icon size={12} />;
                         })()}
                      </span>
                    </span>
                  )}
                  {item.category}
                </span>
                <span className="text-gray-500 dark:text-gray-400">{item.percentage}%</span>
              </div>
              <Progress 
                value={item.percentage} 
                className="h-1.5 bg-gray-100 dark:bg-gray-700"
                progressStyle={{
                    backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                    // We need to construct the gradient class string manually or pass colors
                }}
              />
              {/* Custom colored progress bar hack since Progress component usually takes primary color */}
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 -mt-2.5 opacity-90">
                <div 
                   className={`h-full bg-gradient-to-r ${CATEGORY_COLORS[item.category] || 'from-gray-400 to-gray-500'} transition-all duration-500`}
                   style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Area of Expertise
        </h3>
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-900 dark:text-white">
                 {(() => {
                    const Icon = CATEGORY_ICONS[category] || Terminal;
                    return <Icon className="w-4 h-4 text-gray-400" />;
                 })()}
                {category}
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((skill, idx) => {
                  const weight = getSkillWeight(category, idx);
                  
                  // Visual styles based on weight
                  const baseStyles = "inline-flex items-center rounded-md border transition-colors cursor-default";
                  const weightStyles = weight === 'tool'
                    ? "px-2.5 py-1 text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                    : "px-2 py-0.5 text-[10px] text-gray-500 dark:text-gray-500 border-transparent bg-gray-50 dark:bg-gray-800/50"; // Occasional

                  return (
                    <span key={skill} className={`${baseStyles} ${weightStyles}`}>
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
