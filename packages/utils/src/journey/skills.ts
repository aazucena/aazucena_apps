/**
 * Skills Transformers
 * Handles evolution, network graph, and skill details
 */

import type {
  Experience,
  Education,
  Project,
  SkillsOverTime,
  SkillNode,
  SkillLink,
  SkillsNetworkData,
  SkillDetails,
} from '@aazucena/types';
import { getSafeSkillInfo } from './base';

export function transformToSkillsEvolution(
  experiences: Experience[],
  education: Education[] = [],
  projects: Project[] = [],
): SkillsOverTime[] {
  const skillsByYear = new Map<number, Map<string, Set<string>>>();
  const currentYear = new Date().getFullYear();

  const addSkillsToYear = (year: number, skills: unknown[]) => {
    if (!skillsByYear.has(year)) skillsByYear.set(year, new Map());
    const yearSkillsMap = skillsByYear.get(year);

    if (yearSkillsMap) {
      skills.forEach((skill) => {
        const { name: skillName, category: categoryName } = getSafeSkillInfo(skill);
        if (!yearSkillsMap.has(categoryName)) yearSkillsMap.set(categoryName, new Set());
        yearSkillsMap.get(categoryName)?.add(skillName);
      });
    }
  };

  experiences.forEach((exp, index) => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.isCurrent ? new Date() : new Date(exp.endDate || Date.now());
    const startYear = !isNaN(startDate.getTime())
      ? startDate.getFullYear()
      : currentYear - index - 1;
    const endYear = !isNaN(endDate.getTime()) ? endDate.getFullYear() : currentYear;

    for (let year = startYear; year <= endYear; year++) {
      addSkillsToYear(year, exp.skills);
    }
  });

  education.forEach((edu, index) => {
    const startDate = new Date(edu.startDate);
    const endDate = edu.current
      ? new Date()
      : new Date(edu.graduationDate || edu.graduationDate || Date.now());
    const startYear = !isNaN(startDate.getTime())
      ? startDate.getFullYear()
      : currentYear - experiences.length - index - 5;
    const endYear = !isNaN(endDate.getTime()) ? endDate.getFullYear() : currentYear;

    for (let year = startYear; year <= endYear; year++) {
      addSkillsToYear(year, edu.skills || []);
    }
  });

  projects.forEach((project, index) => {
    const startDate = project.startDate || project.createdAt;
    const endDate = project.endDate || project.updatedAt || project.createdAt;
    const startYear = startDate ? startDate.getFullYear() : currentYear - index;
    const endYear = endDate ? endDate.getFullYear() : startYear;

    for (let year = startYear; year <= endYear; year++) {
      addSkillsToYear(year, project.techStack || []);
    }
  });

  const years = Array.from(skillsByYear.keys()).sort();
  return years.map((year) => {
    const yearSkillsMap = skillsByYear.get(year);
    const categories: { [category: string]: number } = {};
    let totalSkills = 0;

    if (yearSkillsMap) {
      yearSkillsMap.forEach((skills) => {
        totalSkills += skills.size;
      });
      categories['Total Skills'] = totalSkills;
      yearSkillsMap.forEach((skills, categoryName) => {
        categories[categoryName] = skills.size;
      });
    }

    return { year, categories };
  });
}

export function transformToSkillsNetwork(
  experiences: Experience[],
  education: Education[] = [],
  projects: Project[] = [],
): SkillsNetworkData {
  const skillFrequency = new Map<string, number>();
  const skillPairs = new Map<string, number>();
  const skillCategories = new Map<string, string>();
  const allSkills = new Set<string>();

  const processSkills = (skills: unknown[]) => {
    skills.forEach((skill) => {
      const { name: skillName, category: categoryName } = getSafeSkillInfo(skill);
      allSkills.add(skillName);
      skillFrequency.set(skillName, (skillFrequency.get(skillName) || 0) + 1);
      if (!skillCategories.has(skillName)) skillCategories.set(skillName, categoryName);
    });
  };

  const findCoOccurringSkills = (skills: unknown[]) => {
    const skillNames = skills.map((skill) => getSafeSkillInfo(skill).name);
    for (let i = 0; i < skillNames.length; i++) {
      for (let j = i + 1; j < skillNames.length; j++) {
        const pair = [skillNames[i], skillNames[j]].sort().join('|');
        skillPairs.set(pair, (skillPairs.get(pair) || 0) + 1);
      }
    }
  };

  experiences.forEach((exp) => {
    processSkills(exp.skills);
    findCoOccurringSkills(exp.skills);
  });

  education.forEach((edu) => {
    if (edu.skills && edu.skills.length > 0) {
      processSkills(edu.skills);
      findCoOccurringSkills(edu.skills);
    }
  });

  projects.forEach((project) => {
    if (project.techStack && project.techStack.length > 0) {
      processSkills(project.techStack);
      findCoOccurringSkills(project.techStack);
    }
  });

  const nodes: SkillNode[] = Array.from(allSkills).map((skillName) => ({
    id: skillName,
    name: skillName,
    category: skillCategories.get(skillName) || 'Other',
    size: skillFrequency.get(skillName) || 1,
  }));

  const links: SkillLink[] = [];
  skillPairs.forEach((count, pair) => {
    const [source, target] = pair.split('|');
    if (source && target) {
      links.push({ source, target, value: count });
    }
  });

  return { nodes, links };
}

export function getSkillDetails(
  skillName: string,
  experiences: Experience[],
  _education: Education[],
  projects: Project[],
): SkillDetails {
  const occurrences: { date: Date; source: string }[] = [];
  const relatedSkillsSet = new Set<string>();
  let totalProjects = 0;
  let totalExperiences = 0;
  let category = 'Other';

  experiences.forEach((exp) => {
    const hasSkill = exp.skills.some((s) => {
      const info = getSafeSkillInfo(s);
      if (info.name === skillName) {
        if (info.category !== 'Other') category = info.category;
        return true;
      }
      return false;
    });

    if (hasSkill) {
      totalExperiences++;
      const startDate = new Date(exp.startDate);
      if (!isNaN(startDate.getTime())) occurrences.push({ date: startDate, source: exp.company });
      const endDate = exp.isCurrent ? new Date() : new Date(exp.endDate || Date.now());
      if (!isNaN(endDate.getTime())) occurrences.push({ date: endDate, source: exp.company });

      exp.skills.forEach((s) => {
        const info = getSafeSkillInfo(s);
        if (info.name !== skillName) relatedSkillsSet.add(info.name);
      });
    }
  });

  projects.forEach((proj) => {
    const hasSkill = proj.techStack?.some((s) => {
      const info = getSafeSkillInfo(s);
      if (info.name === skillName) {
        if (info.category !== 'Other') category = info.category;
        return true;
      }
      return false;
    });

    if (hasSkill) {
      totalProjects++;
      const date = proj.startDate || proj.createdAt;
      if (date) occurrences.push({ date, source: proj.title });
      proj.techStack?.forEach((s) => {
        const info = getSafeSkillInfo(s);
        if (info.name !== skillName) relatedSkillsSet.add(info.name);
      });
    }
  });

  occurrences.sort((a, b) => a.date.getTime() - b.date.getTime());
  const yearsUsed = Array.from(new Set(occurrences.map((o) => o.date.getFullYear()))).sort();
  const firstUsed = occurrences.length > 0 ? occurrences[0]!.date : new Date();
  const lastUsed = occurrences.length > 0 ? occurrences[occurrences.length - 1]!.date : new Date();

  const yearsCount = yearsUsed.length;
  let proficiencyLevel: SkillDetails['proficiencyLevel'] = 'Beginner';
  if (yearsCount >= 5) proficiencyLevel = 'Expert';
  else if (yearsCount >= 3) proficiencyLevel = 'Advanced';
  else if (yearsCount >= 1) proficiencyLevel = 'Intermediate';

  return {
    name: skillName,
    category,
    yearsUsed,
    totalProjects,
    totalExperiences,
    relatedSkills: Array.from(relatedSkillsSet).slice(0, 10),
    firstUsed,
    lastUsed,
    proficiencyLevel,
  };
}
