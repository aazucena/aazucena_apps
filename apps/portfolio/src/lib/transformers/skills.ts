import type { StrapiSkill } from "../validators/skills";
import type { GradientVariant } from "../validators/enums";
import type { StrapiSkillCategory } from "../validators/skill-category";

export interface Skill {
  name: string;
  category: StrapiSkillCategory;
  proficiency: string;
  display: string;
  icon?: string;
  description?: string;
  yearsOfExperience?: number;
  documentationUrl?: string;
  lastUsed?: string;
  sort?: number;
}

export interface SkillCategory {
  id: number;
  name: string;
  documentId: string;
  label: string;
  display: StrapiSkillCategory["display"];
  gradient: GradientVariant;
  icon?: any;
  skills: Skill[];
}

/**
 * Transform a single Strapi skill to frontend format
 */
export function transformSkill(skill: StrapiSkill): Skill {
  const categoryData = skill.category;
  const categoryName = categoryData?.label || categoryData?.name || "Other";

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
export function groupSkillsByCategory(
  cmsSkills: StrapiSkill[],
): SkillCategory[] {
  // Group logic
  const grouped = cmsSkills.reduce(
    (acc, skill) => {
      const categoryData = skill.category as StrapiSkillCategory;
      const categoryDisplay = categoryData.display || "visible";
      const categoryName = categoryData?.label || categoryData?.name || "Other";

      if (!acc[categoryName]) {
        acc[categoryName] = {
          id: categoryData.id,
          documentId: categoryData?.documentId,
          name: categoryData?.name || "other",
          label: categoryName,
          display: categoryDisplay,
          gradient: (categoryData?.variant as GradientVariant) || "blue-cyan",
          icon: categoryData?.icon,
          skills: [],
        };
      }

      acc[categoryName]!.skills.push(transformSkill(skill));
      return acc;
    },
    {} as Record<string, SkillCategory>,
  );

  return Object.values(grouped).sort((a, b) => a.id - b.id);
}
