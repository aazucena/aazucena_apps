/**
 * ProjectsSection Component
 * Featured projects horizontal grid with draggable slider
 */

import type { JSX } from 'react';
import { useState, useEffect } from 'react';
import { ArrowLeftRight as ArrowsHorizontal } from '@mynaui/icons-react';
import { projects as staticProjects } from './data/projects';
import type { ProjectData } from '~/types/portfolio';

export interface ProjectsSectionProps {
  projects?: ProjectData[];
}

export function ProjectsSection({ projects = staticProjects }: ProjectsSectionProps): JSX.Element {
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // Only show first 7 projects
  const displayedProjects = projects.slice(0, 7);

  // Split into pages of 4
  const pages = [];
  for (let i = 0; i < displayedProjects.length; i += 4) {
    pages.push(displayedProjects.slice(i, i + 4));
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

  const handleCardClick = (project: typeof projects[0]) => {
    // Only trigger click if user didn't drag
    if (!hasMoved) {
      console.log('Clicked project:', project.title);
      // TODO: Add your click handler here (e.g., open modal, navigate to project page, etc.)
    }
  };

  const handleViewMoreClick = () => {
    // Only trigger click if user didn't drag
    if (!hasMoved) {
      console.log('Clicked View More');
      // TODO: Add your view more handler here
    }
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
    <div className="container mx-auto max-w-7xl">
      <div className="text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
          Featured Projects
          <span className="block text-3xl md:text-4xl mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Real Solutions, Real Impact
          </span>
        </h2>

        {/* Drag Hint */}
        <div className="text-center mb-4">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2 animate-pulse">
            <ArrowsHorizontal className="w-5 h-5" />
            Drag to explore more projects
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
                          onClick={() => handleCardClick(project)}
                        >
                          <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                          <p className="text-gray-300 mb-4">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Add View More card to last page */}
                      {isLastPage && (
                        <div
                          className="bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-sm rounded-lg p-6 border border-cyan-400/30 text-left w-[420px] flex items-center justify-center cursor-pointer hover:from-cyan-400/30 hover:to-blue-500/30 transition-all duration-300"
                          onClick={handleViewMoreClick}
                        >
                          <div className="text-center">
                            <h3 className="text-3xl font-bold text-white mb-2">View More</h3>
                            <p className="text-gray-300">Explore all projects</p>
                          </div>
                        </div>
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
      </div>
    </div>
  );
}
