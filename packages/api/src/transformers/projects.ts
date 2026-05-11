import type { StrapiProject } from '@aazucena/types';
import {
  transformImage,
  getMediaUrl,
  transformTag,
  transformStats,
  transformSeo,
  transformWebLink,
} from '@aazucena/utils';
import type { Project } from '@aazucena/types';

export const DEFAULT_PROJECTS: Project[] = [];

/**
 * Transforms raw Strapi Project data to clean frontend Project format
 */
export function transformProject(data: StrapiProject): Project {
  // Map tech stack with category flattening
  const techStack = (data.techStack || []).map((skill: any) => ({
    name: skill.name,
    category: skill.category?.label || skill.category?.name || 'Other',
  }));

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    shortDescription: data.shortDescription,
    description: data.description,
    display: data.display,
    projectType: data.projectType || undefined,
    projectStatus: data.projectStatus || undefined,
    sort: data.sort ?? 0,

    coverImage: transformImage(data.coverImage),
    screenshots: (data.screenshots || [])
      .map((s) => transformImage(s))
      .filter((s): s is Exclude<typeof s, undefined> => !!s),
    gallery: (data.gallery || [])
      .map((img: any) => {
        const url = getMediaUrl(img);
        if (!url) return undefined;
        return { url, alt: img.alternativeText || undefined, width: img.width, height: img.height };
      })
      .filter((img): img is Exclude<typeof img, undefined> => !!img),

    tags: (data.tags || []).map(transformTag),
    techStack,
    metrics: (data.metrics || []).map(transformStats),
    relatedLinks: (data.relatedLinks || []).map(transformWebLink),

    experience: data.experience
      ? {
          position: (data.experience as any).position,
          company: (data.experience as any).company,
          slug: (data.experience as any).slug,
        }
      : undefined,

    repositoryUrl: data.repositoryUrl || undefined,
    liveDemoUrl: data.liveDemoUrl || undefined,

    seo: transformSeo(data.seo),
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    createdAt: new Date(data.createdAt || ''),
    updatedAt: new Date(data.updatedAt || ''),
  };
}

export function transformProjects(projects: StrapiProject[]): Project[] {
  if (!projects || projects.length === 0) return DEFAULT_PROJECTS;

  return projects.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)).map(transformProject);
}
