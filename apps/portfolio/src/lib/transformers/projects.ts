import type { StrapiProject } from '~/lib/validators/projects';
import type { Project } from '~/components/animations/sections/data/projects';

/**
 * Transforms Strapi project to frontend format
 */
export function transformProject(strapiProject: StrapiProject): Project {
  // Parse tags from comma-separated string to array
  const tags = strapiProject.tags
    ? strapiProject.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
    : [];

  return {
    title: strapiProject.title,
    description: strapiProject.shortDescription,
    tags,
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
    title: 'Hugo UI Component Library',
    description: 'Engineered 25+ standardized, tested components accelerating front-end development by 25% and reducing UI-related bugs by 15%.',
    tags: ['Hugo', 'JavaScript', 'Component Library'],
  },
  {
    title: 'Multi-lingual Accessible Websites',
    description: 'Developed and deployed 15+ websites achieving Lighthouse scores above 95 and full WCAG compliance for global accessibility.',
    tags: ['React', 'Vue.js', 'Accessibility'],
  },
  {
    title: 'Admin Dashboards Suite',
    description: 'Built 15+ dashboards with Svelte, Vue, and React, reducing content publishing time from 30 minutes to under 10 minutes.',
    tags: ['Svelte', 'Vue.js', 'React'],
  },
];
