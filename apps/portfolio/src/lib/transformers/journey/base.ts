import { DateTime } from 'luxon';

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

/**
 * Calculate duration between two dates in months
 */
export function calculateMonthsDuration(start: Date, end: Date): number {
  const months = (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  return Math.max(months, 1); // At least 1 month
}

/**
 * Calculate detailed duration using Luxon
 * Returns a string formatted with years and days
 */
export function calculateDetailedDuration(start: Date, end: Date): string {
  const startDt = DateTime.fromJSDate(start);
  const endDt = DateTime.fromJSDate(end);
  
  // Get duration in years and days
  const diff = endDt.diff(startDt, ['years', 'months', 'days']).toObject();
  
  const years = Math.floor(diff.years || 0);
  const months = Math.floor(diff.months || 0);
  const days = Math.floor(diff.days || 0);
  
  const parts = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  }
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  }
  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }
  
  return parts.length > 0 ? parts.join(', ') : '1 day';
}
