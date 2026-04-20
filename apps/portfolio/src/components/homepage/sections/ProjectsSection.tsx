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
import {
  getCompanyInitials,
  getCompanyLogoGradient,
  getGradientColors,
} from "@aazucena/utils";
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
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 transition-all duration-200 active:scale-95 active:bg-white/10"
              >
                {(() => {
                  const gradient = getCompanyLogoGradient(p.title);
                  const { from, to } = getGradientColors(gradient);
                  return (
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow"
                      style={{
                        background: `linear-gradient(135deg, ${from}, ${to})`,
                      }}
                    >
                      {getCompanyInitials(p.title)}
                    </div>
                  );
                })()}
                <h4 className="line-clamp-2 text-sm leading-tight font-bold text-white">
                  {p.title}
                </h4>
              </a>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <a
            href={listPageUrl}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-cyan-400 transition-all duration-300 active:bg-cyan-400/20"
          >
            {showcase?.viewMoreButtonLabel ?? "View All Projects"}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* ── Desktop: horizontal drag carousel ── */}
      <div className="hidden md:block">
        <div className="mb-4 text-center">
          <p className="flex animate-pulse items-center justify-center gap-2 text-sm text-gray-400">
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
