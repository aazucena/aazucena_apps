import type { StrapiShowcase } from '../validators/project-showcase';
import { transformPageHeader } from './utils';

export interface ProjectShowcaseConfig {
  header?: ReturnType<typeof transformPageHeader>;
  searchPlaceholder: string;
  dragHintText: string;
  viewMoreButtonLabel: string;
  viewMoreButtonSubtitle: string;
  maxProjectsDisplayed: number;
  projectsPerPage: number;
  projectsListPagePath?: string;
}

export const DEFAULT_PROJECT_SHOWCASE_CONFIG: ProjectShowcaseConfig = {
  searchPlaceholder: 'Search projects by tech, title...',
  dragHintText: 'Drag to explore more projects',
  viewMoreButtonLabel: 'View More',
  viewMoreButtonSubtitle: 'Explore all projects',
  maxProjectsDisplayed: 7,
  projectsPerPage: 4,
};

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
    projectsListPagePath: data.projectsListPagePath || undefined,
  };
}
