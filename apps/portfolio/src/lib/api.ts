/**
 * Strapi Data Fetching Utilities
 *
 * Convenient type-safe wrappers for fetching Strapi content
 * These functions provide common query patterns for each content type
 *
 * @see src/lib/strapi.ts
 */

import { fetchStrapi, type FetchOptions } from './strapi';
import type {
  Hero,
  About,
  Portfolio,
  WebsiteConfiguration,
  Theme,
  Homepage,
  AnimationSystem,
  Maintenance,
  Analytics,
  BlogConfiguration,
  Skill,
  MusicGenre,
  Post,
  Project,
  Experience,
  Testimonial,
  Award,
  Composition,
  FormSubmission,
  EasterEggCompletion,
  StrapiSingleTypeResponse,
  StrapiCollectionResponse,
} from '../types/strapi';

// ============================================================================
// Single Types
// ============================================================================

/**
 * Fetch Hero section data
 *
 * @example
 * const hero = await getHero();
 */
export async function getHero(options?: FetchOptions): Promise<Hero> {
  const response = await fetchStrapi<StrapiSingleTypeResponse<Hero>>('hero', {
    ...options,
    query: {
      populate: '*',
      ...options?.query,
    },
  });
  return response.data.data;
}

/**
 * Fetch About section data
 *
 * @example
 * const about = await getAbout();
 */
export async function getAbout(options?: FetchOptions): Promise<About> {
  const response = await fetchStrapi<StrapiSingleTypeResponse<About>>('about', {
    ...options,
    query: {
      populate: {
        stats: true,
      },
      ...options?.query,
    },
  });
  return response.data.data;
}

/**
 * Fetch Portfolio data
 *
 * @example
 * const portfolio = await getPortfolio();
 */
export async function getPortfolio(options?: FetchOptions): Promise<Portfolio> {
  const response = await fetchStrapi<StrapiSingleTypeResponse<Portfolio>>('portfolio', {
    ...options,
    query: {
      populate: {
        stats: true,
        profileImage: { populate: 'image' },
        resumeFile: true,
        socialLinks: true,
        education: true,
      },
      ...options?.query,
    },
  });
  return response.data.data;
}

/**
 * Fetch Website Configuration
 *
 * @example
 * const config = await getWebsiteConfiguration();
 */
export async function getWebsiteConfiguration(options?: FetchOptions): Promise<WebsiteConfiguration> {
  const response = await fetchStrapi<StrapiSingleTypeResponse<WebsiteConfiguration>>('website-configuration', {
    ...options,
    query: {
      populate: {
        siteLogo: true,
        favicon: true,
        defaultSEO: {
          populate: {
            openGraph: { populate: 'ogImage' },
          },
        },
      },
      ...options?.query,
    },
    cache: 'force-cache', // Config rarely changes
  });
  return response.data.data;
}

/**
 * Fetch Theme configuration
 *
 * @example
 * const theme = await getTheme();
 */
export async function getTheme(options?: FetchOptions): Promise<Theme> {
  const response = await fetchStrapi<StrapiSingleTypeResponse<Theme>>('theme', {
    ...options,
    cache: 'force-cache', // Theme rarely changes
  });
  return response.data.data;
}

/**
 * Fetch Homepage configuration
 *
 * @example
 * const homepage = await getHomepage();
 */
export async function getHomepage(options?: FetchOptions): Promise<Homepage> {
  const response = await fetchStrapi<StrapiSingleTypeResponse<Homepage>>('homepage', {
    ...options,
    cache: 'force-cache',
  });
  return response.data.data;
}

/**
 * Fetch Animation System configuration
 *
 * @example
 * const animation = await getAnimationSystem();
 */
export async function getAnimationSystem(options?: FetchOptions): Promise<AnimationSystem> {
  const response = await fetchStrapi<StrapiSingleTypeResponse<AnimationSystem>>('animation', {
    ...options,
    cache: 'force-cache',
  });
  return response.data.data;
}

/**
 * Fetch Maintenance Mode status
 *
 * @example
 * const maintenance = await getMaintenance();
 * if (maintenance.enabled) {
 *   // Show maintenance page
 * }
 */
export async function getMaintenance(options?: FetchOptions): Promise<Maintenance> {
  const response = await fetchStrapi<StrapiSingleTypeResponse<Maintenance>>('maintenance', {
    ...options,
    cache: 'no-store', // Always check maintenance status
  });
  return response.data.data;
}

/**
 * Fetch Analytics configuration
 *
 * @example
 * const analytics = await getAnalytics();
 */
export async function getAnalytics(options?: FetchOptions): Promise<Analytics> {
  const response = await fetchStrapi<StrapiSingleTypeResponse<Analytics>>('analytic', {
    ...options,
    cache: 'force-cache',
  });
  return response.data.data;
}

/**
 * Fetch Blog configuration
 *
 * @example
 * const blogConfig = await getBlogConfiguration();
 */
export async function getBlogConfiguration(options?: FetchOptions): Promise<BlogConfiguration> {
  const response = await fetchStrapi<StrapiSingleTypeResponse<BlogConfiguration>>('blog', {
    ...options,
    cache: 'force-cache',
  });
  return response.data.data;
}

// ============================================================================
// Collection Types
// ============================================================================

/**
 * Fetch all skills
 *
 * @example
 * const skills = await getSkills({ featured: true });
 */
export async function getSkills(filters?: {
  category?: string;
  featured?: boolean;
}): Promise<Skill[]> {
  const response = await fetchStrapi<StrapiCollectionResponse<Skill>>('skills', {
    query: {
      populate: '*',
      filters: filters as any,
      sort: ['proficiency:desc', 'order:asc'],
      pagination: { pageSize: 100 },
    },
    cache: 'force-cache',
  });
  return response.data.data;
}

/**
 * Fetch single skill by ID
 *
 * @example
 * const skill = await getSkill(1);
 */
export async function getSkill(id: number): Promise<Skill | null> {
  try {
    const response = await fetchStrapi<StrapiSingleTypeResponse<Skill>>(`skills/${id}`, {
      query: { populate: '*' },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch skill ${id}:`, error);
    return null;
  }
}

/**
 * Fetch all music genres
 *
 * @example
 * const genres = await getMusicGenres();
 */
export async function getMusicGenres(): Promise<MusicGenre[]> {
  const response = await fetchStrapi<StrapiCollectionResponse<MusicGenre>>('music-genres', {
    query: {
      sort: ['name:asc'],
      pagination: { pageSize: 100 },
    },
    cache: 'force-cache',
  });
  return response.data.data;
}

/**
 * Fetch all blog posts
 *
 * @example
 * const posts = await getPosts({ featured: true, page: 1, pageSize: 10 });
 */
export async function getPosts(filters?: {
  featured?: boolean;
  tags?: string[];
  categories?: string[];
  page?: number;
  pageSize?: number;
}): Promise<{ posts: Post[]; meta: any }> {
  const { page = 1, pageSize = 10, ...restFilters } = filters || {};

  const response = await fetchStrapi<StrapiCollectionResponse<Post>>('posts', {
    query: {
      populate: {
        coverImage: true,
        seo: true,
      },
      filters: restFilters as any,
      sort: ['publishedAt:desc'],
      pagination: { page, pageSize },
      publicationState: 'live',
    },
  });

  return {
    posts: response.data.data,
    meta: response.data.meta,
  };
}

/**
 * Fetch single post by slug
 *
 * @example
 * const post = await getPostBySlug('my-first-post');
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await fetchStrapi<StrapiCollectionResponse<Post>>('posts', {
      query: {
        filters: { slug: { $eq: slug } },
        populate: {
          coverImage: true,
          seo: true,
        },
        publicationState: 'live',
      },
    });

    return response.data.data[0] || null;
  } catch (error) {
    console.error(`Failed to fetch post ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch all projects
 *
 * @example
 * const projects = await getProjects({ featured: true });
 */
export async function getProjects(filters?: {
  featured?: boolean;
  category?: string;
  status?: string;
}): Promise<Project[]> {
  const response = await fetchStrapi<StrapiCollectionResponse<Project>>('projects', {
    query: {
      populate: {
        coverImage: true,
        gallery: true,
        seo: true,
      },
      filters: filters as any,
      sort: ['order:asc', 'publishedAt:desc'],
      pagination: { pageSize: 100 },
      publicationState: 'live',
    },
    cache: 'force-cache',
  });
  return response.data.data;
}

/**
 * Fetch single project by slug
 *
 * @example
 * const project = await getProjectBySlug('my-portfolio-website');
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const response = await fetchStrapi<StrapiCollectionResponse<Project>>('projects', {
      query: {
        filters: { slug: { $eq: slug } },
        populate: {
          coverImage: true,
          gallery: true,
          seo: true,
        },
        publicationState: 'live',
      },
    });

    return response.data.data[0] || null;
  } catch (error) {
    console.error(`Failed to fetch project ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch all work experiences
 *
 * @example
 * const experiences = await getExperiences();
 */
export async function getExperiences(): Promise<Experience[]> {
  const response = await fetchStrapi<StrapiCollectionResponse<Experience>>('experiences', {
    query: {
      populate: {
        achievements: true,
        companyLogo: true,
      },
      sort: ['startDate:desc'],
      pagination: { pageSize: 100 },
    },
    cache: 'force-cache',
  });
  return response.data.data;
}

/**
 * Fetch all testimonials
 *
 * @example
 * const testimonials = await getTestimonials({ featured: true });
 */
export async function getTestimonials(filters?: {
  featured?: boolean;
  approved?: boolean;
}): Promise<Testimonial[]> {
  const response = await fetchStrapi<StrapiCollectionResponse<Testimonial>>('testimonials', {
    query: {
      populate: {
        avatar: true,
        companyLogo: true,
        projectRelated: true,
      },
      filters: {
        approved: true, // Only show approved testimonials by default
        ...filters,
      } as any,
      sort: ['publishedAt:desc'],
      pagination: { pageSize: 100 },
      publicationState: 'live',
    },
  });
  return response.data.data;
}

/**
 * Fetch all awards
 *
 * @example
 * const awards = await getAwards();
 */
export async function getAwards(filters?: {
  category?: string;
}): Promise<Award[]> {
  const response = await fetchStrapi<StrapiCollectionResponse<Award>>('awards', {
    query: {
      populate: {
        badge: true,
        skills: true,
      },
      filters: filters as any,
      sort: ['date:desc', 'order:asc'],
      pagination: { pageSize: 100 },
    },
    cache: 'force-cache',
  });
  return response.data.data;
}

/**
 * Fetch all music compositions
 *
 * @example
 * const compositions = await getCompositions({ featured: true });
 */
export async function getCompositions(filters?: {
  featured?: boolean;
  genres?: string[];
}): Promise<Composition[]> {
  const response = await fetchStrapi<StrapiCollectionResponse<Composition>>('compositions', {
    query: {
      populate: {
        audioFile: true,
        coverArt: true,
        waveformImage: true,
        genres: true,
        audioMetadata: true,
      },
      filters: filters as any,
      sort: ['order:asc', 'releaseDate:desc'],
      pagination: { pageSize: 100 },
      publicationState: 'live',
    },
  });
  return response.data.data;
}

/**
 * Fetch single composition by slug
 *
 * @example
 * const composition = await getCompositionBySlug('midnight-jazz');
 */
export async function getCompositionBySlug(slug: string): Promise<Composition | null> {
  try {
    const response = await fetchStrapi<StrapiCollectionResponse<Composition>>('compositions', {
      query: {
        filters: { slug: { $eq: slug } },
        populate: {
          audioFile: true,
          coverArt: true,
          waveformImage: true,
          genres: true,
          audioMetadata: true,
        },
        publicationState: 'live',
      },
    });

    return response.data.data[0] || null;
  } catch (error) {
    console.error(`Failed to fetch composition ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch Easter Egg leaderboard
 *
 * @example
 * const leaderboard = await getEasterEggLeaderboard(10);
 */
export async function getEasterEggLeaderboard(limit = 10): Promise<EasterEggCompletion[]> {
  const response = await fetchStrapi<StrapiCollectionResponse<EasterEggCompletion>>('easter-egg-completions', {
    query: {
      sort: ['score:desc', 'completedAt:asc'],
      pagination: { pageSize: limit },
    },
    cache: 'no-store', // Always fresh for leaderboard
  });
  return response.data.data;
}