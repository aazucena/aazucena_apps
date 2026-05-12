/**
 * ExperienceCard Component
 * Timeline card for work experience with company logo, metadata, and click indicator
 */

import type { JSX } from "react";
import { Location, Briefcase, ChevronRight } from "@aazucena/icons";
import { GlassCard } from "../common/GlassCard";
import { CompanyLogo } from "./CompanyLogo";
import { formatDate } from "@aazucena/utils";
import type { Experience } from "@aazucena/types";

export interface ExperienceCardProps {
  /** Experience data */
  experience: Experience;
}

/**
 * ExperienceCard
 * Displays work experience in a timeline card with hover effects.
 * Renders as an <a> link that navigates to the experience detail page.
 */
export function ExperienceCard({
  experience,
}: ExperienceCardProps): JSX.Element {
  return (
    <GlassCard
      as="a"
      href={`/experiences/${experience.slug}`}
      hover
      clickable
      padding="none"
      className="block p-3 text-inherit no-underline md:p-4"
    >
      <div className="flex items-center gap-3 md:gap-4">
        {/* Company Logo */}
        <CompanyLogo
          company={experience.company}
          companyLogo={experience.companyLogo}
          size="sm"
          className="md:!h-12 md:!w-12 md:!text-lg"
        />

        {/* Experience Info */}
        <div className="flex flex-grow flex-col gap-1">
          <h3 className="text-sm font-bold text-white md:text-lg">
            {experience.position}
          </h3>
          <span className="text-xs text-cyan-400 md:text-sm">
            {experience.company}
          </span>
          <p className="text-xs text-gray-300 md:whitespace-nowrap">
            {formatDate(experience.startDate)} -{" "}
            {experience.isCurrent
              ? "Present"
              : formatDate(experience.endDate ?? "")}
          </p>

          {/* Metadata: Location & Employment Type */}
          {(experience.location || experience.employmentType) && (
            <div className="hidden flex-wrap items-center gap-2 text-xs text-gray-400 md:flex">
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
          <ChevronRight className="h-4 w-4 text-cyan-400 md:h-5 md:w-5" />
        </div>
      </div>
    </GlassCard>
  );
}
