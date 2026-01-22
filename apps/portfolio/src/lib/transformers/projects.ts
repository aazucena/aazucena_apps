import type { StrapiProject } from '~/lib/validators/projects';
import type { WebLink } from '~/lib/validators/web-link';
import { transformWebLinks } from './web-link';
import type { SkillWithCategory } from '~/components/animations/sections/data';

/**
 * Tag with color for display
 */
export interface Tag {
  label: string;
  color: 'cyan' | 'blue' | 'purple' | 'pink' | 'green' | 'teal' | 'orange' | 'red' | 'gray';
}

/**
 * Project metric/stat
 */
export interface ProjectMetric {
  label: string;
  value: string;
  icon?: string;
  description?: string;
}

/**
 * Complete Project interface for list and detail pages
 */
export interface Project {
  // Core fields
  slug: string;
  title: string;
  shortDescription: string;
  description: any; // Richtext/Blocks content

  // Display & organization
  display: 'hidden' | 'unlisted' | 'standard' | 'featured' | 'home';
  projectType?: 'Web App' | 'Mobile App' | 'Desktop App' | 'Library' | 'API' | 'CLI Tool' | 'Game' | 'Music Production' | 'Hardware/Embedded';
  projectStatus?: 'Planned' | 'In Progress' | 'Released' | 'Maintenance' | 'On Hold' | 'Completed' | 'Archived';
  sort: number;

  // Media
  coverImage?: {
    src: any; // StrapiMedia
    altText: string;
  };
  screenshots?: Array<{
    src: any;
    altText: string;
  }>;
  demoVideo?: any; // StrapiMedia
  gallery?: any[]; // Array of StrapiMedia

  // Links
  repositoryUrl?: string;
  liveDemoUrl?: string;

  // Dates
  startDate?: Date;
  endDate?: Date;

  // Metadata
  tags: Tag[];
  techStack: SkillWithCategory[]; // Array of skill names or objects with categories
  metrics?: ProjectMetric[];

  // New relations (Phase 0.5)
  relatedLinks: WebLink[];
  experience?: {
    id: number;
    documentId?: string;
    position: string;
    company: string;
  };
  education?: {
    id: number;
    documentId?: string;
    degree: string;
    institution: string;
  };

  // SEO
  seo?: any;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

/**
 * Transforms Strapi project to frontend format
 */
export function transformProject(strapiProject: StrapiProject): Project {
  // Transform tags from component array to Tag interface
  const tags: Tag[] = strapiProject.tags?.map(tag => ({
    label: tag.label,
    color: tag.color,
  })) || [];

  // Extract skills from techStack relation with category information
  const techStack = strapiProject.techStack
    ?.filter(skill => skill !== null)
    .map((skill: any) => {
      // If skill is just a string, return it as-is (fallback)
      if (typeof skill === 'string') return skill;

      // Strapi v5 wraps relations in a 'data' property
      // Try: skill.category.data.label (v5) or skill.category.label (v4)
      const categoryData = skill.category?.data || skill.category;
      const categoryName = categoryData?.label || categoryData?.name || 'Other';

      // Return skill object with name and category
      return {
        name: skill.name,
        category: categoryName,
      };
    }) || [];

  // Transform dates
  const startDate = strapiProject.startDate ? new Date(strapiProject.startDate) : undefined;
  const endDate = strapiProject.endDate ? new Date(strapiProject.endDate) : undefined;
  const createdAt = new Date(strapiProject.createdAt);
  const updatedAt = new Date(strapiProject.updatedAt);
  const publishedAt = strapiProject.publishedAt ? new Date(strapiProject.publishedAt) : undefined;

  return {
    slug: strapiProject.slug,
    title: strapiProject.title,
    shortDescription: strapiProject.shortDescription,
    description: strapiProject.description,
    display: strapiProject.display,
    projectType: strapiProject.projectType || undefined,
    projectStatus: strapiProject.projectStatus || undefined,
    sort: strapiProject.sort ?? 0,
    coverImage: strapiProject.coverImage || undefined,
    screenshots: strapiProject.screenshots?.filter(s => s !== null) as any || undefined,
    demoVideo: strapiProject.demoVideo || undefined,
    gallery: strapiProject.gallery || undefined,
    repositoryUrl: strapiProject.repositoryUrl || undefined,
    liveDemoUrl: strapiProject.liveDemoUrl || undefined,
    startDate,
    endDate,
    tags,
    techStack,
    metrics: strapiProject.metrics || undefined,
    relatedLinks: transformWebLinks(strapiProject.relatedLinks),
    experience: strapiProject.experience || undefined,
    education: strapiProject.education || undefined,
    seo: strapiProject.seo || undefined,
    createdAt,
    updatedAt,
    publishedAt,
  };
}

/**
 * Transforms array of Strapi projects
 * Filters by display setting and sorts
 */
export function transformProjects(
  strapiProjects: StrapiProject[],
  displayFilter: 'all' | 'listed' | 'standard' | 'featured' | 'home' = 'all'
): Project[] {
  const filtered = strapiProjects.filter((project) => {
    // Hidden projects are never shown
    if (project.display === 'hidden') return false;
    // Unlisted projects only accessible via direct URL, not in listings
    if (project.display === 'unlisted') return false;
    if (displayFilter === 'all') return true;
    // 'listed' shows all publicly listed projects (standard, featured, home)
    if (displayFilter === 'listed') return ['standard', 'featured', 'home'].includes(project.display);
    return project.display === displayFilter;
  });

  const sorted = filtered.sort((a, b) => {
    const sortA = a.sort ?? 0;
    const sortB = b.sort ?? 0;
    return sortA - sortB;
  });

  return sorted.map(transformProject);
}

/**
 * Default fallback projects
 */
export const DEFAULT_PROJECTS: Project[] = [
  {
    slug: 'hugo-ui-component-library',
    title: 'Hugo UI Component Library',
    shortDescription: 'Engineered 25+ standardized, tested components accelerating front-end development by 25% and reducing UI-related bugs by 15%.',
    description: null,
    display: 'standard',
    sort: 0,
    tags: [
      { label: 'Hugo', color: 'blue' },
      { label: 'JavaScript', color: 'cyan' },
      { label: 'Component Library', color: 'purple' },
    ],
    techStack: ['Hugo', 'JavaScript'],
    relatedLinks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: 'multi-lingual-accessible-websites',
    title: 'Multi-lingual Accessible Websites',
    shortDescription: 'Developed and deployed 15+ websites achieving Lighthouse scores above 95 and full WCAG compliance for global accessibility.',
    description: null,
    display: 'standard',
    sort: 1,
    tags: [
      { label: 'React', color: 'cyan' },
      { label: 'Vue.js', color: 'green' },
      { label: 'Accessibility', color: 'blue' },
    ],
    techStack: ['React', 'Vue.js'],
    relatedLinks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: 'admin-dashboards-suite',
    title: 'Admin Dashboards Suite',
    shortDescription: 'Built 15+ dashboards with Svelte, Vue, and React, reducing content publishing time from 30 minutes to under 10 minutes.',
    description: null,
    display: 'standard',
    sort: 2,
    tags: [
      { label: 'Svelte', color: 'orange' },
      { label: 'Vue.js', color: 'green' },
      { label: 'React', color: 'cyan' },
    ],
    techStack: ['Svelte', 'Vue.js', 'React'],
    relatedLinks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
