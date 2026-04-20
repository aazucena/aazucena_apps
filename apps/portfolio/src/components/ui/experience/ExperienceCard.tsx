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
      padding="md"
      className="block text-inherit no-underline"
    >
      <div className="flex items-center gap-4">
        {/* Company Logo */}
        <CompanyLogo
          company={experience.company}
          companyLogo={experience.companyLogo}
          size="md"
        />

        {/* Experience Info */}
        <div className="flex flex-grow flex-col gap-1">
          <h3 className="text-base font-bold text-white md:text-lg">
            {experience.position}
          </h3>
          <span className="text-sm text-cyan-400">{experience.company}</span>
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
          <ChevronRight className="h-5 w-5 text-cyan-400" />
        </div>
      </div>
    </GlassCard>
  );
}
