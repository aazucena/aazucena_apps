/**
 * Base utilities and shared logic for journey transformers
 */

/**
 * Robust helper to extract name and category from a skill object
 * Handles both string skills, SkillWithCategory, and raw StrapiSkill objects
 */
export const getSafeSkillInfo = (skill: any): { name: string; category: string } => {
  if (typeof skill === 'string') return { name: skill, category: 'Other' };

  const name = skill.name || 'Unknown Skill';
  let category = 'Other';

  if (typeof skill.category === 'string') {
    category = skill.category;
  } else if (typeof skill.category === 'object' && skill.category !== null) {
    category = skill.category.label || skill.category.name || 'Other';
  }

  return { name, category };
};
