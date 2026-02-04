/**
 * ExperienceCard Component
 * Timeline card for work experience with company logo, metadata, and click indicator
 */

import type { JSX } from 'react';
import { Location, Briefcase } from '@mynaui/icons-react';
import { GlassCard } from '../common/GlassCard';
import { CompanyLogo } from './CompanyLogo';
import { formatDate } from '~/lib/utils/content';
import type { Experience } from '~/lib/transformers/experiences';

export interface ExperienceCardProps {
  /** Experience data */
  experience: Experience;
  /** Click handler */
  onClick: () => void;
}

/**
 * ChevronRightIcon
 * Click indicator icon
 */
function ChevronRightIcon(): JSX.Element {
  return (
    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

/**
 * ExperienceCard
 * Displays work experience in a timeline card with hover effects
 */
export function ExperienceCard({ experience, onClick }: ExperienceCardProps): JSX.Element {
  return (
    <GlassCard
      hover
      clickable
      padding="md"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* Company Logo */}
        <CompanyLogo
          company={experience.company}
          companyLogo={experience.companyLogo}
          size="md"
        />

        {/* Experience Info */}
        <div className="flex-grow flex flex-col gap-1">
          <h3 className="text-lg font-bold text-white">{experience.position}</h3>
          <span className="text-sm text-cyan-400">{experience.company}</span>
          <p className="text-gray-300 text-xs whitespace-nowrap">
            {formatDate(experience.startDate)} - {formatDate(experience.endDate, experience.isCurrent)}
          </p>

          {/* Metadata: Location & Employment Type */}
          {(experience.location || experience.employmentType) && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
              {experience.employmentType && (
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  <span>{experience.employmentType}</span>
                </div>
              )}
              {experience.location && (
                <div className="flex items-center gap-1">
                  <Location className="w-3 h-3" />
                  <span>{experience.location}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Click Indicator */}
        <div className="flex-shrink-0">
          <ChevronRightIcon />
        </div>
      </div>
    </GlassCard>
  );
}
