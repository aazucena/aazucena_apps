import { transformImage, transformWebLink as utilTransformWebLink } from '@aazucena/utils';
import type { Experience, Achievement, StrapiExperience } from '@aazucena/types';

export const DEFAULT_EXPERIENCES: Experience[] = [];

export function transformExperience(data: StrapiExperience): Experience {
  const skills = (data.skillsUsed || []).map((skill: any) => ({
    name: skill.name,
    category: skill.category?.label || skill.category?.name || 'Other',
  }));

  const projects = (data.projects || []).map((project: any) => ({
    title: project.title,
    slug: project.slug,
    shortDescription: project.shortDescription,
  }));

  return {
    id: data.id,
    slug: data.slug,
    company: data.company,
    position: data.position,
    companyLogo: transformImage(data.companyLogo),
    industry: data.industry || undefined,
    companySize: data.companySize || undefined,
    location: data.location || undefined,
    startDate: data.startDate,
    endDate: data.endDate || undefined,
    isCurrent: !!data.isCurrent,
    description: data.description,
    responsibilities: data.responsibilities,
    employmentType: data.employmentType || undefined,
    workMode: data.workMode || undefined,
    companyWebsite: data.companyWebsite || undefined,
    companyLinkedIn: data.companyLinkedIn || undefined,
    skills,
    achievements: (data.achievements || []) as Achievement[],
    relatedLinks: (data.relatedLinks || []).map(utilTransformWebLink),
    projects,
  };
}

export function transformExperiences(items: StrapiExperience[]): Experience[] {
  if (!items || items.length === 0) return DEFAULT_EXPERIENCES;

  return items
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .map(transformExperience);
}
