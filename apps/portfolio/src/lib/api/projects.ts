import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiProjectsResponseSchema, type StrapiProject } from '~/lib/validators/projects';
import { transformProjects, transformProject, DEFAULT_PROJECTS, type Project } from '~/lib/transformers/projects';

/**
 * Fetches all projects from Strapi CMS
 * @param displayFilter - Filter by display type
 */
export async function getProjects(
  displayFilter: 'all' | 'listed' | 'standard' | 'featured' | 'home' = 'all'
): Promise<Project[]> {
  try {
    const response = await fetchStrapi<Project[]>('projects', {
      query: {
        sort: ['sort:asc', 'publishedAt:desc'],
        pagination: {
          pageSize: 100,
        },
        publicationState: 'live',
        populate: {
          coverImage: {
            populate: 'src',
          },
          screenshots: {
            populate: 'src',
          },
          demoVideo: true,
          gallery: true,
          tags: true,
          techStack: {
            populate: ['category'],
          },
          metrics: true,
          seo: {
            populate: ['openGraph'],
          },
          relatedLinks: {
            populate: '*',
          },
          experience: {
            fields: ['id', 'documentId', 'position', 'company'],
          },
          education: {
            fields: ['id', 'documentId', 'degree', 'institution'],
          },
        },
      },
    });
  // console.log('strapiProjects', (response?.data || [])?.map(project => project.techStack.map((skill) => skill)))

    const validatedData = StrapiProjectsResponseSchema.parse(response);
    return transformProjects(validatedData.data, displayFilter);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Projects] Invalid CMS data:', error.issues);
    } else {
      console.error('[Projects] Failed to fetch:', error);
    }
    return DEFAULT_PROJECTS;
  }
}

/**
 * Fetches a single project by slug
 * @param slug - Project slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const response = await fetchStrapi<Project[]>('projects', {
      query: {
        filters: {
          slug: {
            $eq: slug,
          },
        },
        publicationState: 'live',
        populate: {
          coverImage: {
            populate: 'src',
          },
          screenshots: {
            populate: 'src',
          },
          demoVideo: true,
          gallery: true,
          tags: true,
          techStack: {
            populate: '*',
          },
          metrics: true,
          seo: {
            populate: ['openGraph'],
          },
          relatedLinks: {
            populate: '*',
          },
        },
      },
      cache: 'force-cache',
    });

    const validatedData = StrapiProjectsResponseSchema.parse(response);

    if (validatedData.data.length === 0) {
      console.warn(`[Projects] No project found with slug: ${slug}`);
      return null;
    }

    return transformProject(validatedData.data[0] as StrapiProject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Projects] Invalid CMS data for slug:', slug, error.issues);
    } else {
      console.error('[Projects] Failed to fetch project:', slug, error);
    }
    return null;
  }
}
