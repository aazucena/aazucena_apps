/**
 * ExperienceCard Component
 * Timeline card for work experience
 */

import type { JSX } from 'react';
import { Location, Briefcase, ChevronRight } from '@aazucena/icons';
import { GlassCard } from '../common/GlassCard.js';
import { CompanyLogo } from './CompanyLogo.js';
import { cn } from '@aazucena/utils';
import type { Experience } from '@aazucena/types';

export interface ExperienceCardProps {
  /** Experience data */
  experience: Experience;
  /** Click handler */
  onClick: () => void;
  /** Date formatter function */
  formatDate: (date: string, isCurrent?: boolean) => string;
  /** Additional className */
  className?: string;
}

/**
 * ExperienceCard
 */
export function ExperienceCard({
  experience,
  onClick,
  formatDate,
  className,
}: ExperienceCardProps): JSX.Element {
  return (
    <GlassCard hover clickable padding="md" onClick={onClick} className={cn(className)}>
      <div className="flex items-center gap-4">
        {/* Company Logo */}
        <CompanyLogo company={experience.company} companyLogo={experience.companyLogo} size="md" />

        {/* Experience Info */}
        <div className="flex flex-grow flex-col gap-1">
          <h3 className="text-lg font-bold text-white">{experience.position}</h3>
          <span className="text-sm text-cyan-400">{experience.company}</span>
          <p className="text-xs whitespace-nowrap text-gray-300">
            {formatDate(experience.startDate)} -{' '}
            {formatDate(experience.endDate || '', experience.isCurrent)}
          </p>

          {/* Metadata: Location & Employment Type */}
          {(experience.location || experience.employmentType) && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
              {experience.employmentType && (
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  <span>{experience.employmentType}</span>
                </div>
              )}
              {experience.location && (
                <div className="flex items-center gap-1">
                  <Location className="h-3 w-3" />
                  <span>{experience.location}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Click Indicator */}
        <div className="flex-shrink-0">
          <ChevronRight className="h-5 w-5 text-cyan-400" />
        </div>
      </div>
    </GlassCard>
  );
}
