/**
 * Visualization Transformers
 * Sankey, Heatmap, and Stream Graph
 */

import type { SkillWithCategory } from '~/components/animations/sections/data';
import type { Experience } from '~/lib/transformers/experiences'
import type { Education } from '~/lib/transformers/education';
import type { Project } from '~/lib/transformers/projects';
import { getSafeSkillInfo } from './base';

export interface SankeyNode {
  id: string;
  name: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface HeatmapCell {
  date: Date;
  count: number;
  category?: string;
  categoryDistribution?: Record<string, number>;
}

export interface StreamGraphStep {
  date: Date;
  [category: string]: any;
}

export function transformToSankeyData(
  experiences: Experience[],
  education: Education[] = [],
  projects: Project[] = []
): SankeyData {
  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];
  const nodeIds = new Set<string>();

  const addNode = (id: string, name: string) => {
    if (!nodeIds.has(id)) {
      nodes.push({ id, name });
      nodeIds.add(id);
    }
  };

  const skillCounts = new Map<string, number>();
  const skillCategoryMap = new Map<string, string>();

  const countSkill = (s: string | SkillWithCategory) => {
    const { name, category } = getSafeSkillInfo(s);
    skillCounts.set(name, (skillCounts.get(name) || 0) + 1);
    if (!skillCategoryMap.has(name) || skillCategoryMap.get(name) === 'Other') {
      skillCategoryMap.set(name, category);
    }
  };

  experiences.forEach(e => e.skills.forEach(countSkill));
  projects.forEach(p => (p.techStack || []).forEach(countSkill));
  education.forEach(e => (e.skills || []).forEach(countSkill));

  const topSkillsSet = new Set(Array.from(skillCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 15).map(s => s[0]));
  const categorySkillLinks = new Map<string, number>();
  const skillEntityLinks = new Map<string, number>();

  const processEntity = (entityName: string, skills: (string | SkillWithCategory)[], typePrefix: 'exp' | 'prj' | 'edu') => {
    const entityId = `${typePrefix}_${entityName.replace(/\s+/g, '_')}`;
    addNode(entityId, entityName);

    skills.forEach(s => {
      const { name: realName } = getSafeSkillInfo(s);
      const category = skillCategoryMap.get(realName) || 'Other';
      let skillNodeName = realName;
      let skillNodeId = `skill_${realName.replace(/\s+/g, '_')}`;

      if (!topSkillsSet.has(realName)) {
        skillNodeName = `Other ${category}`;
        skillNodeId = `group_${category.replace(/\s+/g, '_')}`;
      }

      addNode(skillNodeId, skillNodeName);
      const catNodeId = `cat_${category.replace(/\s+/g, '_')}`;
      addNode(catNodeId, category);

      const catLinkKey = `${catNodeId}|${skillNodeId}`;
      categorySkillLinks.set(catLinkKey, (categorySkillLinks.get(catLinkKey) || 0) + 1);
      const entLinkKey = `${skillNodeId}|${entityId}`;
      skillEntityLinks.set(entLinkKey, (skillEntityLinks.get(entLinkKey) || 0) + 1);
    });
  };

  experiences.forEach(exp => processEntity(exp.company, exp.skills, 'exp'));
  projects.slice(0, 6).forEach(proj => processEntity(proj.title, proj.techStack || [], 'prj'));
  education.slice(0, 2).forEach(edu => processEntity(edu.institution, edu.skills || [], 'edu'));

  categorySkillLinks.forEach((count, key) => {
    const [source, target] = key.split('|');
    links.push({ source: source!, target: target!, value: count });
  });

  skillEntityLinks.forEach((count, key) => {
    const [source, target] = key.split('|');
    links.push({ source: source!, target: target!, value: count });
  });

  return { nodes, links };
}

export function transformToHeatmapData(
  experiences: Experience[],
  education: Education[] = [],
  projects: Project[] = []
): HeatmapCell[] {
  const heatmap: HeatmapCell[] = [];
  let minDate = new Date();
  const now = new Date();

  const updateMinDate = (dateStr: string | Date) => {
    const d = dateStr instanceof Date ? dateStr : new Date(dateStr);
    if (!isNaN(d.getTime()) && d < minDate) minDate = d;
  };

  experiences.forEach(exp => updateMinDate(exp.startDate));
  education.forEach(edu => updateMinDate(edu.startDate));
  projects.forEach(proj => updateMinDate(proj.startDate || proj.createdAt));

  let current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  while (current <= now) {
    const monthSkills = new Set<string>();
    const categoryCounts = new Map<string, number>();
    const monthStart = current;
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);

    const checkActive = (start: Date, end: Date, skills: (string | SkillWithCategory)[]) => {
      if (start <= monthEnd && end >= monthStart) {
        skills.forEach(skill => {
          const { name, category } = getSafeSkillInfo(skill);
          monthSkills.add(name);
          categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
        });
      }
    };

    experiences.forEach(exp => checkActive(new Date(exp.startDate), exp.isCurrent ? now : new Date(exp.endDate || Date.now()), exp.skills));
    education.forEach(edu => checkActive(new Date(edu.startDate), edu.current ? now : new Date(edu.graduationDate || Date.now()), edu.skills || []));
    projects.forEach(proj => checkActive(proj.startDate || proj.createdAt, proj.endDate || proj.updatedAt || proj.createdAt, proj.techStack || []));

    let dominantCategory = 'Other';
    let maxCount = 0;
    const distribution: Record<string, number> = {};
    
    categoryCounts.forEach((count, cat) => {
      distribution[cat] = count;
      if (count > maxCount) { maxCount = count; dominantCategory = cat; }
    });

    heatmap.push({ 
      date: new Date(current), 
      count: monthSkills.size, 
      category: monthSkills.size > 0 ? dominantCategory : undefined,
      categoryDistribution: monthSkills.size > 0 ? distribution : undefined
    });
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  }
  return heatmap;
}

export function transformToStreamGraphData(
  experiences: Experience[],
  education: Education[] = [],
  projects: Project[] = []
): StreamGraphStep[] {
  const data: StreamGraphStep[] = [];
  let minDate = new Date();
  const now = new Date();

  const updateMinDate = (dateStr: string | Date) => {
    const d = dateStr instanceof Date ? dateStr : new Date(dateStr);
    if (!isNaN(d.getTime()) && d < minDate) minDate = d;
  };

  experiences.forEach(exp => updateMinDate(exp.startDate));
  education.forEach(edu => updateMinDate(edu.startDate));
  projects.forEach(proj => updateMinDate(proj.startDate || proj.createdAt));

  const allCategories = new Set<string>();
  const collectCategories = (skills: any[]) => {
    skills.forEach(s => allCategories.add(getSafeSkillInfo(s).category));
  };
  experiences.forEach(e => collectCategories(e.skills));
  projects.forEach(p => collectCategories(p.techStack || []));
  education.forEach(e => collectCategories(e.skills || []));

  let current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  while (current <= now) {
    const step: StreamGraphStep = { date: new Date(current) };
    allCategories.forEach(cat => { step[cat] = 0; });
    const monthStart = current;
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);

    const checkActive = (start: Date, end: Date, skills: any[]) => {
      if (start <= monthEnd && end >= monthStart) {
        skills.forEach(skill => {
          const { category } = getSafeSkillInfo(skill);
          step[category] = (step[category] || 0) + 1;
        });
      }
    };

    experiences.forEach(exp => checkActive(new Date(exp.startDate), exp.isCurrent ? now : new Date(exp.endDate || Date.now()), exp.skills));
    education.forEach(edu => checkActive(new Date(edu.startDate), edu.current ? now : new Date(edu.graduationDate || Date.now()), edu.skills || []));
    projects.forEach(proj => checkActive(proj.startDate || proj.createdAt, proj.endDate || proj.updatedAt || proj.createdAt, proj.techStack || []));

    data.push(step);
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  }
  return data;
}
