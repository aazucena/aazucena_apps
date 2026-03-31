import type { StrapiSkillCategory } from '../validators/skill-category';
import type { SkillCategoryInfo } from '@aazucena/types';

/**
 * Maps color variant to Tailwind gradient classes
 * Matches Card Link component pattern for design consistency
 */
const VARIANT_MAP: Record<string, string> = {
  'cyan-blue': 'from-cyan-400 to-blue-500',
  'purple-pink': 'from-purple-400 to-pink-500',
  'green-emerald': 'from-green-400 to-emerald-500',
  'blue-indigo': 'from-blue-400 to-indigo-500',
  'yellow-orange': 'from-yellow-400 to-orange-500',
  'pink-red': 'from-pink-400 to-red-500',
  'teal-cyan': 'from-teal-400 to-cyan-500',
  'orange-red': 'from-orange-400 to-red-500',
  'violet-purple': 'from-violet-400 to-purple-500',
  'indigo-violet': 'from-indigo-400 to-violet-500',
};

/**
 * Transform Strapi skill category to frontend format
 */
export function transformSkillCategory(strapiCategory: StrapiSkillCategory): SkillCategoryInfo {
  return {
    id: strapiCategory.id,
    name: strapiCategory.name,
    label: strapiCategory.label,
    icon: strapiCategory.icon ?? undefined,
    // Convert variant to Tailwind gradient classes
    gradient: strapiCategory.variant ? VARIANT_MAP[strapiCategory.variant] : undefined,
  };
}

/**
 * Transform array of skill categories
 * Filters out hidden categories and sorts alphabetically
 */
export function transformSkillCategories(
  strapiCategories: StrapiSkillCategory[],
): SkillCategoryInfo[] {
  // Filter out hidden categories (null/undefined defaults to visible)
  const visible = strapiCategories.filter((category) => category.display !== 'hidden');

  // Sort by name alphabetically
  const sorted = visible.sort((a, b) => a.name.localeCompare(b.name));

  return sorted.map(transformSkillCategory);
}

/**
 * Default fallback skill categories
 * Keep in sync with common categories used in CMS
 */
export const DEFAULT_SKILL_CATEGORIES: SkillCategoryInfo[] = [
  { id: 1, name: 'frontend', label: 'Frontend Development' },
  { id: 2, name: 'backend', label: 'Backend Development' },
  { id: 3, name: 'database', label: 'Database' },
  { id: 4, name: 'devops', label: 'DevOps & Cloud' },
  { id: 5, name: 'design', label: 'Design & UI/UX' },
  { id: 6, name: 'tools', label: 'Tools & Productivity' },
];
