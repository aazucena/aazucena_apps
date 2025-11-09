/**
 * ExperienceSection Component
 * Timeline of work experiences
 */

import type { JSX } from 'react';
import { useState } from 'react';
import { experiences } from './data/experiences';
import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineLine,
  TimelineContent,
} from '@/components/ui/timeline';

export interface ExperienceSectionProps {
  onOpenExperience: (index: number) => void;
}

const MAX_VISIBLE_EXPERIENCES = 5;

export function ExperienceSection({ onOpenExperience }: ExperienceSectionProps): JSX.Element {
  const [showAll, setShowAll] = useState(false);

  // Show only most recent 5 experiences unless "View All" is clicked
  const displayedExperiences = showAll ? experiences : experiences.slice(0, MAX_VISIBLE_EXPERIENCES);
  const hasMoreExperiences = experiences.length > MAX_VISIBLE_EXPERIENCES;
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
          Experience
          <span className="block text-3xl md:text-4xl mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Building Excellence Over Time
          </span>
        </h2>

        {/* Scrollable Timeline Container with gradient indicators */}
        <div className="relative mt-8 max-w-4xl mx-auto">
          {/* Top gradient fade indicator */}
          {showAll && (
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0a0a1a] to-transparent z-10 pointer-events-none" />
          )}

          {/* Scrollable area */}
          <div className={`overflow-y-auto ${showAll ? 'max-h-[600px]' : ''} scrollbar-thin scrollbar-thumb-cyan-400/50 scrollbar-track-white/10`}>
            <Timeline className="text-left">
              {displayedExperiences.map((exp, index) => (
                <TimelineItem key={index}>
                  <TimelineDot variant="primary" />
                  {index < displayedExperiences.length - 1 && <TimelineLine />}
                  <TimelineContent>
                    <div
                      className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                      onClick={() => onOpenExperience(index)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Company Logo */}
                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${exp.logoGradient} rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                          {exp.logo}
                        </div>

                        {/* Condensed Info */}
                        <div className="flex-grow flex flex-col gap-1">
                          <h3 className="text-lg font-bold text-white">{exp.position}</h3>
                          <span className="text-sm text-cyan-400">{exp.company}</span>
                          <p className="text-gray-400 text-xs whitespace-nowrap">{exp.duration}</p>
                        </div>

                        {/* Click Indicator */}
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>

          {/* Bottom gradient fade indicator */}
          {showAll && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0a0a1a] to-transparent pointer-events-none" />
          )}
        </div>

        {/* View All / Show Less Button */}
        {hasMoreExperiences && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-300"
          >
            {showAll ? 'Show Less' : `View All Experiences (${experiences.length})`}
          </button>
        )}
      </div>
    </div>
  );
}
