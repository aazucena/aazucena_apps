/**
 * ProjectsSection Component
 * Featured projects horizontal grid with draggable slider
 */

import { ArrowLeftRight as ArrowsHorizontal } from '@mynaui/icons-react';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useSectionData } from '../contexts';
import { SectionLayout } from './layouts';
import type { SectionProps } from './types';

export interface ProjectsSectionProps  extends SectionProps {}

export function ProjectsSection({ title = 'Featured Projects', subtitle = 'Real Solutions, Real Impact' }: ProjectsSectionProps): JSX.Element {
  const { projects, showcase } = useSectionData();
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // Use CMS-configured max projects displayed
  const displayedProjects = projects.slice(0, showcase.maxProjectsDisplayed);

  // Split into pages using CMS-configured projects per page
  const pages = [];
  const { projectsPerPage } = showcase;
  for (let i = 0; i < displayedProjects.length; i += projectsPerPage) {
    pages.push(displayedProjects.slice(i, i + projectsPerPage));
  }

  // Add "View More" card to last page
  const totalPages = pages.length;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setHasMoved(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0]!.clientX);
    setHasMoved(false);
  };

  const handleCardClick = (slug: string) => {
    // Only navigate if user didn't drag
    if (!hasMoved) {
      window.location.href = `/projects/${slug}`;
    }
  };

  const handleViewMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent navigation if user dragged
    if (hasMoved) {
      e.preventDefault();
    }
    // Let browser handle navigation to href if not dragged
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleEnd = (clientX: number) => {
      const distance = dragStart - clientX;
      const minDragDistance = 50;

      // Only navigate if user actually dragged (moved more than minDragDistance)
      if (hasMoved && Math.abs(distance) > minDragDistance) {
        // Total pages including the one with View More card
        const maxPages = totalPages;

        if (distance > minDragDistance && currentPage < maxPages - 1) {
          setCurrentPage(currentPage + 1);
        } else if (distance < -minDragDistance && currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
      }

      setIsDragging(false);
      setDragStart(0);
      setHasMoved(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const distance = Math.abs(e.clientX - dragStart);
      if (distance > 5) {
        setHasMoved(true);
        e.preventDefault();
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      handleEnd(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const distance = Math.abs(e.touches[0]!.clientX - dragStart);
      if (distance > 5) {
        setHasMoved(true);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => handleEnd(e.changedTouches[0]!.clientX);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart, currentPage, totalPages, hasMoved]);

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
            {showcase.dragHintText}
          </p>
        </div>

        <div
          className={`mt-4 overflow-hidden mx-auto select-none relative z-10 ${isDragging ? '!cursor-grabbing' : '!cursor-grab'}`}
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
                      {pageProjects.map((project, index) => (
                        <div
                          key={index}
                          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-left w-[420px] cursor-pointer hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300"
                          onClick={() => handleCardClick(project.slug)}
                        >
                          <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                          <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm"
                              >
                                {tag.label}
                              </span>
                            ))}
                            {project.tags.length > 3 && (
                              <span className="px-3 py-1 bg-white/10 text-gray-400 rounded-full text-sm">
                                +{project.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Add View More card to last page */}
                      {isLastPage && (
                        <a
                          href={showcase.listPagePath || '/projects'}
                          className="bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-sm rounded-lg p-6 border border-cyan-400/30 text-left w-[420px] flex items-center justify-center cursor-pointer hover:from-cyan-400/30 hover:to-blue-500/30 transition-all duration-300 block no-underline"
                          onClick={handleViewMoreClick}
                        >
                          <div className="text-center">
                            <h3 className="text-3xl font-bold text-white mb-2">{showcase.viewMoreButtonLabel}</h3>
                            <p className="text-gray-300">{showcase.viewMoreButtonSubtitle}</p>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
        </div>

        {/* Page Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {pages.map((_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => setCurrentPage(pageIndex)}
              className={`transition-all duration-300 rounded-full ${
                currentPage === pageIndex
                  ? 'w-8 h-2 bg-cyan-400'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to page ${pageIndex + 1}`}
            />
          ))}
        </div>
    </SectionLayout>
  );
}
