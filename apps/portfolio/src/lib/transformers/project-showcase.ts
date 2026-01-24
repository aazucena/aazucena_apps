import type { StrapiShowcase } from '../validators/project-showcase';
import { transformPageHeader } from './utils';

export interface ShowcaseConfig {
  header?: ReturnType<typeof transformPageHeader>;
  searchPlaceholder: string;
  dragHintText: string;
  viewMoreButtonLabel: string;
  viewMoreButtonSubtitle: string;
  maxProjectsDisplayed: number;
  projectsPerPage: number;
  projectsListPagePath?: string;
}

export const DEFAULT_SHOWCASE_CONFIG: ShowcaseConfig = {
  searchPlaceholder: 'Search projects by tech, title...',
  dragHintText: 'Drag to explore more projects',
  viewMoreButtonLabel: 'View More',
  viewMoreButtonSubtitle: 'Explore all projects',
  maxProjectsDisplayed: 7,
  projectsPerPage: 4,
};

export function transformShowcase(data: StrapiShowcase): ShowcaseConfig {
  if (!data) return DEFAULT_SHOWCASE_CONFIG;

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
