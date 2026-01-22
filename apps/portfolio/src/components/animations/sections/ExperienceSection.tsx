/**
 * ExperienceSection Component
 * Timeline of work experiences
 */

import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineLine,
} from '@/components/ui/timeline';
import type { JSX } from 'react';
import { useState } from 'react';
import { usePortfolio, useSectionData } from '../contexts';
import { SectionLayout } from './layouts';
import type { SectionProps } from './types';
import { Location, Briefcase } from '@mynaui/icons-react';

export interface ExperienceSectionProps extends SectionProps {}

const MAX_VISIBLE_EXPERIENCES = 5;

export function ExperienceSection({ title = 'Experience', subtitle = 'Building Excellence Over Time' }: ExperienceSectionProps): JSX.Element {
  const { experiences: data } = useSectionData();
  const { openExperienceModal } = usePortfolio();
  const [showAll, setShowAll] = useState(false);

  const handleOpen = (index: number) => {
    openExperienceModal(index);
  }

  // Show only most recent 5 experiences unless "View All" is clicked
  const displayedExperiences = showAll ? data : data.slice(0, MAX_VISIBLE_EXPERIENCES);
  const hasMoreExperiences = data.length > MAX_VISIBLE_EXPERIENCES;
  return (
    <SectionLayout
      title={title}
      subtitle={subtitle}
      contentWidth="medium"
    >
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
                      onClick={() => handleOpen(index)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Company Logo */}
                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${exp.logoGradient} rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden`}>
                          {exp.logo.startsWith('http') || exp.logo.startsWith('/') ? (
                            <img src={exp.logo} alt={`${exp.company} logo`} className="w-full h-full object-cover" />
                          ) : (
                            exp.logo
                          )}
                        </div>

                        {/* Condensed Info */}
                        <div className="flex-grow flex flex-col gap-1">
                          <h3 className="text-lg font-bold text-white">{exp.position}</h3>
                          <span className="text-sm text-cyan-400">{exp.company}</span>
                          <p className="text-gray-300 text-xs whitespace-nowrap">{exp.duration}</p>
                          {(exp.location || exp.employmentType) && (
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                              {exp.employmentType && (
                                <div className="flex items-center gap-1">
                                  <Briefcase className="w-3 h-3" />
                                  <span>{exp.employmentType}</span>
                                </div>
                              )}
                              {exp.location && (
                                <div className="flex items-center gap-1">
                                  <Location className="w-3 h-3" />
                                  <span>{exp.location}</span>
                                </div>
                              )}
                            </div>
                          )}
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

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
        {/* View All / Show Less Button */}
        {hasMoreExperiences && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-300"
          >
            {showAll ? 'Show Less' : `View All Experiences (${data.length})`}
          </button>
        )}

        {/* Link to Full Timeline Page */}
        <a
          href="/experiences"
          className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          View Full Timeline
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    </SectionLayout>
  );
}
