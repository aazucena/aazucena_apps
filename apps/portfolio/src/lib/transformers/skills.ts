import type { StrapiSkill } from '~/lib/validators/skills';
import type { SkillCategory } from '~/components/animations/sections/data/skills';
import { getIconComponent } from '~/lib/utils/icons';

/**
 * Maps color variant to Tailwind gradient classes
 * Shared with skill-category transformer for consistency
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
 * Fallback gradient for categories without a variant
 */
const DEFAULT_GRADIENT = 'from-gray-400 to-gray-500';

/**
 * Transforms Strapi skills array into grouped SkillCategory format
 * Groups skills by category and filters based on display setting
 *
 * @param strapiSkills - Array of skills from Strapi CMS
 * @param displayFilter - Filter by display type ('standard', 'featured', 'core') or 'all'
 * @returns Array of skill categories with grouped skills
 */
export function transformSkills(
  strapiSkills: StrapiSkill[],
  displayFilter: 'all' | 'standard' | 'featured' | 'core' = 'all'
): SkillCategory[] {
  // Filter skills based on display setting (exclude 'hidden')
  const filteredSkills = strapiSkills.filter((skill) => {
    if (skill.display === 'hidden') return false;
    if (displayFilter === 'all') return true;
    return skill.display === displayFilter;
  });

  // Sort skills by sort order (ascending) and name
  const sortedSkills = filteredSkills.sort((a, b) => {
    const sortA = a.id ?? 0;
    const sortB = b.id ?? 0;
    if (sortA !== sortB) return sortA - sortB;
    return a.name.localeCompare(b.name);
  }).filter(
    ({ category }) => category && category?.display !== 'hidden'
  );

  // Group skills by category relation
  // Note: skill.category is now an object { id, name, label, icon } or null
  const groupedByCategory = sortedSkills.reduce((acc, skill) => {
    // Use category name as key, or 'uncategorized' if no category
    const categoryKey = skill.category?.name || 'uncategorized';

    if (!acc[categoryKey]) {
      acc[categoryKey] = {
        label: skill.category?.label || 'Uncategorized',
        icon: skill.category?.icon,
        variant: skill.category?.variant,
        skills: [],
      };
    }
    acc[categoryKey]!.skills.push(skill.name);
    return acc;
  }, {} as Record<string, { label: string; icon?: string; variant?: string | null; skills: string[] }>);

  // Transform into SkillCategory array
  const skillCategories: SkillCategory[] = Object.entries(groupedByCategory).map(
    ([categoryName, categoryData]) => {
      // Get gradient from category variant or use default
      const gradient = categoryData.variant
        ? VARIANT_MAP[categoryData.variant] || DEFAULT_GRADIENT
        : DEFAULT_GRADIENT;

      return {
        id: categoryName, // Already kebab-case from CMS
        label: categoryData.label,
        gradient, // Use category variant from CMS
        // Convert icon name/SVG string to IconComponent using shared utility
        icon: categoryData.icon ? getIconComponent(categoryData.icon) : undefined,
        skills: categoryData.skills,
      };
    }
  );

  return skillCategories;
}

/**
 * Extract featured skill names for tech stack badges
 * Returns array of skill names marked as 'featured' or 'core'
 *
 * @param strapiSkills - Array of skills from Strapi CMS
 * @param maxCount - Maximum number of badges to return (default: 6)
 * @returns Array of skill names for badges
 */
export function transformTechStackBadges(
  strapiSkills: StrapiSkill[],
  maxCount: number = 6
): string[] {
  return strapiSkills
    .filter((skill) => skill.display === 'featured' || skill.display === 'core')
    .sort((a, b) => {
      // Prioritize 'core' over 'featured'
      if (a.display === 'core' && b.display !== 'core') return -1;
      if (a.display !== 'core' && b.display === 'core') return 1;
      // Then sort by sort order
      const sortA = a.sort ?? 0;
      const sortB = b.sort ?? 0;
      return sortA - sortB;
    })
    .slice(0, maxCount)
    .map((skill) => skill.name);
}

/**
 * Default fallback skills if CMS is unavailable
 * Matches the format expected by the frontend
 */
export const DEFAULT_SKILLS: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    gradient: 'from-cyan-400 to-blue-500',
    icon: getIconComponent('Code'),
    skills: ['React', 'Vue.js', 'Svelte', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3'],
  },
  {
    id: 'backend',
    label: 'Backend',
    gradient: 'from-purple-400 to-pink-500',
    icon: getIconComponent('Server'),
    skills: ['Node.js', 'Python', 'Django', 'PHP', 'Java', 'GraphQL', 'REST APIs'],
  },
  {
    id: 'database',
    label: 'Database',
    gradient: 'from-green-400 to-emerald-500',
    icon: getIconComponent('Database'),
    skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis'],
  },
  {
    id: 'devops',
    label: 'DevOps',
    gradient: 'from-blue-400 to-indigo-500',
    icon: getIconComponent('Cloud'),
    skills: ['Docker', 'AWS', 'Firebase', 'Kubernetes', 'CI/CD'],
  },
  {
    id: 'tools',
    label: 'Tools',
    gradient: 'from-yellow-400 to-orange-500',
    icon: getIconComponent('Tools'),
    skills: ['Git', 'Figma', 'VS Code', 'Agile', 'Jira'],
  },
];

export const DEFAULT_TECH_STACK_BADGES = [
  'TypeScript',
  'React',
  'Python',
  'Node.js',
  'PostgreSQL',
  'AWS',
];
