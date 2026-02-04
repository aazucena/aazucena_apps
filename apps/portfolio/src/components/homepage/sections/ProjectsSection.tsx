/**
 * ProjectsSection Component
 * Featured projects horizontal grid with draggable slider
 */

import { ArrowLeftRight as ArrowsHorizontal } from '@mynaui/icons-react';
import type { JSX } from 'react';
import { useSectionData } from '~/contexts/animations';
import { useDragToSwipe } from '~/hooks/animations';
import { ProjectCard, ViewMoreCard, PageIndicators } from '~/components/ui';
import { SectionLayout } from './layouts';
import type { SectionProps } from './types';

export interface ProjectsSectionProps extends SectionProps {}

export function ProjectsSection({
  title = 'Featured Projects',
  subtitle = 'Real Solutions, Real Impact'
}: ProjectsSectionProps): JSX.Element {
  const { projects, projectShowcase: showcase } = useSectionData();

  // Use CMS-configured max projects displayed (with fallback)
  const maxProjectsDisplayed = showcase?.maxProjectsDisplayed ?? 6;
  const displayedProjects = projects.slice(0, maxProjectsDisplayed);

  // Split into pages using CMS-configured projects per page (with fallback)
  const projectsPerPage = showcase?.projectsPerPage ?? 3;
  const pages = [];
  for (let i = 0; i < displayedProjects.length; i += projectsPerPage) {
    pages.push(displayedProjects.slice(i, i + projectsPerPage));
  }

  // Drag-to-swipe functionality
  const {
    currentPage,
    isDragging,
    setCurrentPage,
    handleMouseDown,
    handleTouchStart,
    handleItemClick,
    handleLinkClick,
  } = useDragToSwipe({
    totalPages: pages.length,
    minDragDistance: 50,
  });

  return (
    <SectionLayout
      title={title}
      subtitle={subtitle}
      contentWidth="full"
      headerClassName="text-center"
    >
      {/* Drag Hint */}
      <div className="text-center mb-4">
        <p className="text-gray-400 text-sm flex items-center justify-center gap-2 animate-pulse">
          <ArrowsHorizontal className="w-5 h-5" />
          {showcase?.dragHintText ?? 'Drag to explore more projects'}
        </p>
      </div>

      {/* Draggable Carousel */}
      <div
        className={`mt-4 overflow-hidden mx-auto select-none relative z-10 ${
          isDragging ? '!cursor-grabbing' : '!cursor-grab'
        }`}
        style={{ maxWidth: '880px', minHeight: '400px' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDragStart={(e) => e.preventDefault()}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out gap-x-1"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((pageProjects, pageIndex) => {
            const isLastPage = pageIndex === pages.length - 1;

            return (
              <div key={pageIndex} className="min-w-full flex-shrink-0">
                <div className="grid grid-rows-2 grid-flow-col gap-6 w-max mx-auto">
                  {/* Project Cards */}
                  {pageProjects.map((project, index) => (
                    <ProjectCard
                      key={index}
                      project={project}
                      onClick={(slug) =>
                        handleItemClick(() => {
                          window.location.href = `/projects/${slug}`;
                        })
                      }
                      maxTags={3}
                    />
                  ))}

                  {/* View More Card (last page only) */}
                  {isLastPage && (
                    <ViewMoreCard
                      href={showcase?.listPagePath ?? '/projects'}
                      title={showcase?.viewMoreButtonLabel ?? 'View All Projects'}
                      subtitle={showcase?.viewMoreButtonSubtitle ?? 'Explore my complete portfolio'}
                      onClick={handleLinkClick}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Page Indicators */}
      <PageIndicators
        totalPages={pages.length}
        currentPage={currentPage}
        onPageClick={setCurrentPage}
      />
    </SectionLayout>
  );
}
