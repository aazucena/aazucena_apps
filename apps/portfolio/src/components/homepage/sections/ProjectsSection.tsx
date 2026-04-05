/**
 * ProjectsSection Component
 * Featured projects horizontal grid with draggable slider
 */

import { ArrowLeftRight as ArrowsHorizontal } from "@mynaui/icons-react";
import type { JSX } from "react";
import { useSectionData } from "~/contexts/animations";
import { useDragToSwipe } from "@aazucena/hooks";
import { ProjectCard, ViewMoreCard, PageIndicators } from "~/components/ui";
import { SectionLayout } from "./layouts";
import type { SectionProps } from "./types";

export interface ProjectsSectionProps extends SectionProps {}

export function ProjectsSection({
  title = "Featured Projects",
  subtitle = "Real Solutions, Real Impact",
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
      <div className="mb-4 text-center">
        <p className="flex animate-pulse items-center justify-center gap-2 text-sm text-gray-400">
          <ArrowsHorizontal className="h-5 w-5" />
          {showcase?.dragHintText ?? "Drag to explore more projects"}
        </p>
      </div>

      {/* Draggable Carousel */}
      <div
        className={`relative z-10 mx-auto mt-4 overflow-hidden select-none ${
          isDragging ? "!cursor-grabbing" : "!cursor-grab"
        }`}
        style={{ maxWidth: "880px", minHeight: "400px" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDragStart={(e) => e.preventDefault()}
      >
        <div
          className="flex gap-x-1 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((pageProjects, pageIndex) => {
            const isLastPage = pageIndex === pages.length - 1;

            return (
              <div key={pageIndex} className="min-w-full flex-shrink-0">
                <div className="mx-auto grid w-max grid-flow-col grid-rows-2 gap-6">
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
                      href={showcase?.listPagePath ?? "/projects"}
                      title={
                        showcase?.viewMoreButtonLabel ?? "View All Projects"
                      }
                      subtitle={
                        showcase?.viewMoreButtonSubtitle ??
                        "Explore my complete portfolio"
                      }
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
