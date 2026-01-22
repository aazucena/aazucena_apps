/**
 * Career Stats & Growth Transformers
 * Quantitative metrics calculation for career summary
 */

import type { Experience, SkillWithCategory } from '~/components/animations/sections/data';
import type { StrapiEducation } from '~/lib/validators/education';
import type { Project } from '~/lib/transformers/projects';
import { getSafeSkillInfo } from './base';

export interface CareerStat {
  totalYears: number;
  totalCompanies: number;
  totalTechnologies: number;
  currentRole: string | null;
}

export interface GrowthData {
  fastestGrowingCategory: string;
  mostUsedTechnology: string;
  learningVelocity: number;
  topDomain: string;
}

export function calculateCareerStats(experiences: Experience[]): CareerStat {
  if (experiences.length === 0) {
    return {
      totalYears: 0,
      totalCompanies: 0,
      totalTechnologies: 0,
      currentRole: null,
    };
  }

  const validStartDates = experiences
    .map((exp) => new Date(exp.startDate))
    .filter((date) => !isNaN(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  let totalYears = 0;
  if (validStartDates.length > 0) {
    const firstJobDate = validStartDates[0];
    const now = new Date();
    totalYears = (now.getTime() - firstJobDate!.getTime()) / (1000 * 60 * 60 * 24 * 365);
  } else {
    totalYears = experiences.length * 2;
  }

  const uniqueCompanies = new Set(experiences.map((exp) => exp.company));
  const uniqueSkills = new Set<string>();
  experiences.forEach((exp) => {
    exp.skills.forEach((skill) => uniqueSkills.add((skill as SkillWithCategory)?.name));
  });

  const currentExp = experiences.find((exp) => exp.isCurrent);
  const currentRole = currentExp ? currentExp.position : null;

  return {
    totalYears: Math.floor(totalYears * 10) / 10,
    totalCompanies: uniqueCompanies.size,
    totalTechnologies: uniqueSkills.size,
    currentRole,
  };
}

export function calculateSkillGrowthMetrics(
  experiences: Experience[],
  education: StrapiEducation[] = [],
  projects: Project[] = []
): GrowthData {
  const skillUsageCount = new Map<string, number>();
  const categoryUsageCount = new Map<string, number>();
  const skillsByYear = new Map<number, Set<string>>();
  
  const processSkills = (skills: (string | SkillWithCategory)[], year?: number) => {
    skills.forEach(s => {
      const { name, category } = getSafeSkillInfo(s);
      skillUsageCount.set(name, (skillUsageCount.get(name) || 0) + 1);
      categoryUsageCount.set(category, (categoryUsageCount.get(category) || 0) + 1);
      if (year) {
        if (!skillsByYear.has(year)) skillsByYear.set(year, new Set());
        skillsByYear.get(year)!.add(name);
      }
    });
  };

  experiences.forEach(e => {
    const year = new Date(e.startDate).getFullYear();
    if (!isNaN(year)) processSkills(e.skills, year);
  });
  
  projects.forEach(p => {
    const year = (p.startDate || p.createdAt).getFullYear();
    processSkills(p.techStack || [], year);
  });

  education.forEach(e => {
    const year = new Date(e.startDate).getFullYear();
    if (!isNaN(year)) processSkills(e.skills || [], year);
  });

  let mostUsedTechnology = 'N/A';
  let maxUsage = 0;
  skillUsageCount.forEach((count, name) => {
    if (count > maxUsage) {
      maxUsage = count;
      mostUsedTechnology = name;
    }
  });

  let topDomain = 'N/A';
  let maxCatUsage = 0;
  categoryUsageCount.forEach((count, cat) => {
    if (count > maxCatUsage) {
      maxCatUsage = count;
      topDomain = cat;
    }
  });

  const years = Array.from(skillsByYear.keys()).sort();
  let totalNewSkills = 0;
  const seenSkills = new Set<string>();

  years.forEach(year => {
    const yearSkills = skillsByYear.get(year)!;
    yearSkills.forEach(s => {
      if (!seenSkills.has(s)) {
        totalNewSkills++;
        seenSkills.add(s);
      }
    });
  });

  const yearRange = years.length > 0 ? (years[years.length - 1]! - years[0]! + 1) : 1;
  const learningVelocity = Math.round((totalNewSkills / yearRange) * 10) / 10;

  return {
    fastestGrowingCategory: topDomain,
    mostUsedTechnology,
    learningVelocity,
    topDomain
  };
}
