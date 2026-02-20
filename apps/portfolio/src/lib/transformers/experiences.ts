import type { StrapiExperience } from "../validators/experiences";
import {
  transformImage,
  transformWebLink as utilTransformWebLink,
} from "./utils";
import type { Achievement } from "../validators/components";

export interface Experience {
  id: number;
  slug: string;
  company: string;
  position: string;
  companyLogo?: ReturnType<typeof transformImage>;
  industry?: string;
  companySize?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: any;
  responsibilities?: any;
  employmentType?: string;
  workMode?: string;
  companyWebsite?: string;
  companyLinkedIn?: string;

  // Relations & Components
  skills: { name: string; category: string }[];
  achievements: Achievement[];
  relatedLinks: ReturnType<typeof utilTransformWebLink>[];
  projects: { title: string; slug: string; shortDescription?: string }[];
}

export const DEFAULT_EXPERIENCES: Experience[] = [];

export function transformExperience(data: StrapiExperience): Experience {
  const skills = (data.skillsUsed || []).map((skill: any) => ({
    name: skill.name,
    category: skill.category?.label || skill.category?.name || "Other",
  }));

  const projects = (data.projects || []).map((project: any) => ({
    title: project.title,
    slug: project.slug,
    shortDescription: project.shortDescription,
  }));

  return {
    id: data.id,
    slug: data.slug || "",
    company: data.company || "Unknown Company",
    position: data.position || "Unknown Position",
    companyLogo: transformImage(data.companyLogo),
    industry: data.industry,
    companySize: data.companySize,
    location: data.location,
    startDate: data.startDate || new Date().toISOString(),
    endDate: data.endDate,
    isCurrent: !!data.isCurrent,
    description: data.description || "",
    responsibilities: data.responsibilities,
    employmentType: data.employmentType,
    workMode: data.workMode,
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
    .sort(
      (a, b) =>
        new Date(b.startDate || 0).getTime() -
        new Date(a.startDate || 0).getTime(),
    )
    .map(transformExperience);
}
