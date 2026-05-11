import type { StrapiSkill } from '@aazucena/types';
import type { GradientVariant } from '@aazucena/types';
import type { StrapiSkillCategory } from '../validators/skill-category';
import type { Skill, SkillCategory } from '@aazucena/types';

/**
 * Transform a single Strapi skill to frontend format
 */
export function transformSkill(skill: StrapiSkill): Skill {
  const categoryData = skill.category as any;
  const categoryName = categoryData?.label || categoryData?.name || 'Other';

  return {
    name: skill.name,
    category: categoryName,
    proficiency: skill.proficiency,
    display: skill.display,
    icon: skill.icon || undefined,
    description: skill.description || undefined,
    yearsOfExperience: skill.yearsOfExperience || undefined,
    documentationUrl: skill.documentationUrl || undefined,
    lastUsed: skill.lastUsed || undefined,
    sort: skill.sort || undefined,
  };
}

/**
 * Groups raw Strapi skills into categories for the Kanban display
 */
export function groupSkillsByCategory(cmsSkills: StrapiSkill[]): SkillCategory[] {
  // Group logic
  const grouped = cmsSkills.reduce(
    (acc, skill) => {
      const categoryData = skill.category as StrapiSkillCategory;
      const categoryDisplay = categoryData.display || 'visible';
      const categoryName = categoryData?.label || categoryData?.name || 'Other';

      if (!acc[categoryName]) {
        acc[categoryName] = {
          id: categoryData.id,
          documentId: categoryData?.documentId,
          name: categoryData?.name || 'other',
          label: categoryName,
          display: categoryDisplay,
          gradient: (categoryData?.variant as GradientVariant) || 'blue-cyan',
          icon: categoryData?.icon ?? undefined,
          skills: [],
        };
      }

      const category = acc[categoryName];
      if (category) {
        category.skills.push(transformSkill(skill));
      }
      return acc;
    },
    {} as Record<string, SkillCategory>,
  );

  return Object.values(grouped).sort((a, b) => a.id - b.id);
}
