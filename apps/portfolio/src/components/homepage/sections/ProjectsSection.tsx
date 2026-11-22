/**
 * ProjectsSection Component
 * Mobile: tap-only 2-column compact grid (no gesture conflict with section nav)
 * Desktop: horizontal drag carousel
 */

import {
  ArrowLeftRight as ArrowsHorizontal,
  ArrowRight,
} from "@aazucena/icons";
import type { JSX } from "react";
import { useSectionData } from "~/contexts";
import { useDragToSwipe } from "@aazucena/hooks";
import { getCompanyInitials } from "@aazucena/utils";
import { Button } from "@aazucena/ui";
import { ProjectCard, ViewMoreCard, PageIndicators } from "~/components/ui";
import { SectionLayout } from "./SectionLayout";
import type { SectionProps } from "./types";

export interface ProjectsSectionProps extends SectionProps {}

const MOBILE_MAX_PROJECTS = 6;

export function ProjectsSection({
  title = "Featured Projects",
  subtitle = "Real Solutions, Real Impact",
}: ProjectsSectionProps): JSX.Element {
  const { projects, projectShowcase: showcase } = useSectionData();

  const maxProjectsDisplayed = showcase?.maxProjectsDisplayed ?? 6;
  const displayedProjects = projects.slice(0, maxProjectsDisplayed);

  // Desktop carousel: split into pages
  const projectsPerPage = showcase?.projectsPerPage ?? 3;
  const pages = [];
  for (let i = 0; i < displayedProjects.length; i += projectsPerPage) {
    pages.push(displayedProjects.slice(i, i + projectsPerPage));
  }

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

  const listPageUrl = showcase?.listPagePath ?? "/projects";
  const mobileProjects = projects.slice(0, MOBILE_MAX_PROJECTS);

  return (
    <SectionLayout
      title={title}
      subtitle={subtitle}
      contentWidth="full"
      headerClassName="text-center"
    >
      {/* ── Mobile: tap-only 2-column grid, no scroll/swipe ── */}
      <div className="mt-4 px-4 md:hidden">
        <div className="grid grid-cols-1 gap-3">
          {mobileProjects.map((project, index) => {
            const p =
              project as import("~/components/ui/projects/ProjectCard").ProjectCardData;
            return (
              <a
                key={index}
                href={`/projects/${p.slug}`}
                className="press rounded-card border-rule bg-panel hover:bg-state focus-visible:outline-signal flex items-center gap-3 border p-3 transition-colors duration-(--motion-base) focus-visible:outline-1 focus-visible:outline-offset-2"
              >
                <div className="micro-label rounded-control border-rule bg-state text-foreground flex h-9 w-9 flex-shrink-0 items-center justify-center border">
                  {getCompanyInitials(p.title)}
                </div>
                <h4 className="text-foreground line-clamp-2 text-sm leading-tight font-bold">
                  {p.title}
                </h4>
              </a>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <Button asChild variant="outline">
            <a href={listPageUrl}>
              {showcase?.viewMoreButtonLabel ?? "View All Projects"}
              <ArrowRight aria-hidden />
            </a>
          </Button>
        </div>
      </div>

      {/* ── Desktop: horizontal drag carousel ── */}
      <div className="hidden md:block">
        <div className="mb-4 text-center">
          <p className="text-muted-foreground flex animate-pulse items-center justify-center gap-2 text-sm">
            <ArrowsHorizontal className="h-5 w-5" />
            {showcase?.dragHintText ?? "Drag to explore more projects"}
          </p>
        </div>

        <div
          className={`relative z-10 mx-auto mt-4 overflow-hidden select-none ${
            isDragging ? "!cursor-grabbing" : "!cursor-grab"
          }`}
          style={{ maxWidth: "min(880px, 100%)", minHeight: "auto" }}
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
                    {pageProjects.map((project, index) => (
                      <ProjectCard
                        key={index}
                        project={
                          project as import("~/components/ui/projects/ProjectCard").ProjectCardData
                        }
                        onClick={(slug) =>
                          handleItemClick(() => {
                            window.location.href = `/projects/${slug}`;
                          })
                        }
                        maxTags={3}
                      />
                    ))}

                    {isLastPage && (
                      <ViewMoreCard
                        href={listPageUrl}
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

        <PageIndicators
          totalPages={pages.length}
          currentPage={currentPage}
          onPageClick={setCurrentPage}
        />
      </div>
    </SectionLayout>
  );
}
