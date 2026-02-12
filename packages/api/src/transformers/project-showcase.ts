import type { StrapiShowcase } from '../validators/project-showcase.js';
import { transformPageHeader } from '@aazucena/utils';
import type { ProjectShowcaseConfig } from '@aazucena/types';

// Export as ShowcaseConfig for backward compatibility with PortfolioData type
export type ShowcaseConfig = ProjectShowcaseConfig;

export const DEFAULT_PROJECT_SHOWCASE_CONFIG: ProjectShowcaseConfig = {
  searchPlaceholder: 'Search projects by tech, title...',
  dragHintText: 'Drag to explore more projects',
  viewMoreButtonLabel: 'View More',
  viewMoreButtonSubtitle: 'Explore all projects',
  maxProjectsDisplayed: 7,
  projectsPerPage: 4,
};

/**
 * Transform Strapi project showcase data
 * Direct mapping - no nesting, follows Strapi schema
 */
export function transformProjectShowcase(data: StrapiShowcase): ProjectShowcaseConfig {
  if (!data) return DEFAULT_PROJECT_SHOWCASE_CONFIG;

  return {
    header: transformPageHeader(data.header),
    searchPlaceholder: data.searchPlaceholder,
    dragHintText: data.dragHintText,
    viewMoreButtonLabel: data.viewMoreButtonLabel,
    viewMoreButtonSubtitle: data.viewMoreButtonSubtitle,
    maxProjectsDisplayed: data.maxProjectsDisplayed,
    projectsPerPage: data.projectsPerPage,
    listPagePath: data.listPagePath || '/projects',
  };
}
