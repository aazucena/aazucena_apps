import type { StrapiProject } from "../validators/projects";
import {
  transformImage,
  transformTag,
  transformStats,
  transformSeo,
  transformWebLink,
} from "./utils";

/**
 * Cleaned Project interface for Astro components.
 * Closely mirrors Strapi schema but with resolved media and structured data.
 */
export interface Project {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  description: any; // Blocks/Markdown
  display: string;
  projectType?: string;
  projectStatus?: string;
  sort: number;

  // Transformed Components
  coverImage?: ReturnType<typeof transformImage>;
  screenshots?: ReturnType<typeof transformImage>[];
  demoVideoUrl?: string;

  // Metadata
  tags: ReturnType<typeof transformTag>[];
  techStack: { name: string; category: string }[];
  metrics: ReturnType<typeof transformStats>[];
  relatedLinks: ReturnType<typeof transformWebLink>[];

  // Relations (Simplified)
  experience?: {
    position: string;
    company: string;
    slug: string;
  };

  // Links
  repositoryUrl?: string;
  liveDemoUrl?: string;

  // SEO & Dates (as Date objects for internal logic)
  seo?: ReturnType<typeof transformSeo>;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_PROJECTS: Project[] = [];

/**
 * Transforms raw Strapi Project data to clean frontend Project format
 */
export function transformProject(data: StrapiProject): Project {
  // Map tech stack with category flattening
  const techStack = (data.techStack || []).map((skill: any) => ({
    name: skill.name,
    category: skill.category?.label || skill.category?.name || "Other",
  }));

  return {
    id: data.id,
    slug: data.slug || "",
    title: data.title || "Untitled Project",
    shortDescription: data.shortDescription || "",
    description: data.description || "",
    display: data.display || "standard",
    projectType: data.projectType || undefined,
    projectStatus: data.projectStatus || undefined,
    sort: data.sort ?? 0,

    coverImage: transformImage(data.coverImage),
    screenshots: (data.screenshots || [])
      .map((s) => transformImage(s))
      .filter((s): s is Exclude<typeof s, undefined> => !!s),

    tags: (data.tags || []).map(transformTag),
    techStack,
    metrics: (data.metrics || []).map(transformStats),
    relatedLinks: (data.relatedLinks || []).map(transformWebLink),

    experience: data.experience
      ? {
          position: data.experience.position,
          company: data.experience.company,
          slug: data.experience.slug,
        }
      : undefined,

    repositoryUrl: data.repositoryUrl || undefined,
    liveDemoUrl: data.liveDemoUrl || undefined,

    seo: transformSeo(data.seo),
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    createdAt: new Date(data.createdAt || 0),
    updatedAt: new Date(data.updatedAt || 0),
  };
}

export function transformProjects(projects: StrapiProject[]): Project[] {
  if (!projects || projects.length === 0) return DEFAULT_PROJECTS;

  return projects
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(transformProject);
}
