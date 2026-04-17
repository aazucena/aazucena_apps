/**
 * ExperienceSection Component
 * Timeline of work experiences
 */

// TEST 11: comment out @aazucena/ui barrel import to isolate CJS source
// import { Timeline, TimelineContent, TimelineDot, TimelineItem, TimelineLine } from "@aazucena/ui";
const Timeline = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);
const TimelineContent = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);
const TimelineDot = () => <div />;
const TimelineItem = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);
const TimelineLine = () => <div />;
import type { JSX } from "react";
import { useState } from "react";
import React from "react";
import { useSectionData } from "~/contexts";
import { ExperienceCard, ExperienceActions } from "~/components/ui/experience";
import { SectionLayout } from "./SectionLayout";
import type { SectionProps } from "./types";

export interface ExperienceSectionProps extends SectionProps {}

const MAX_VISIBLE_EXPERIENCES = 5;

export function ExperienceSection({
  title = "Experience",
  subtitle = "Building Excellence Over Time",
}: ExperienceSectionProps): JSX.Element {
  const { experiences: data, experienceShowcase: showcase } = useSectionData();
  const [showAll, setShowAll] = useState(false);

  // Show only most recent 5 experiences unless "View All" is clicked
  const displayedExperiences = showAll
    ? data
    : data.slice(0, MAX_VISIBLE_EXPERIENCES);
  const hasMoreExperiences = data.length > MAX_VISIBLE_EXPERIENCES;
  const listPageUrl = showcase?.listPagePath || "experiences";

  return (
    <SectionLayout title={title} subtitle={subtitle} contentWidth="medium">
      {/* Scrollable Timeline Container with gradient indicators */}
      <div className="relative mx-auto mt-8 max-w-4xl">
        {/* Top gradient fade indicator */}
        {showAll && (
          <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-8 bg-gradient-to-b from-[#0a0a1a] to-transparent" />
        )}

        {/* Scrollable area */}
        <div
          className={`overflow-y-auto ${showAll ? "max-h-[600px]" : ""} scrollbar-thin scrollbar-thumb-cyan-400/50 scrollbar-track-white/10`}
        >
          <Timeline className="text-left">
            {displayedExperiences.map((exp, index) => (
              <TimelineItem key={index}>
                <TimelineDot variant="primary" />
                {index < displayedExperiences.length - 1 && <TimelineLine />}
                <TimelineContent>
                  <ExperienceCard experience={exp} />
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>

        {/* Bottom gradient fade indicator */}
        {showAll && (
          <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-8 bg-gradient-to-t from-[#0a0a1a] to-transparent" />
        )}
      </div>

      {/* Action Buttons */}
      <ExperienceActions
        showToggle={hasMoreExperiences}
        showAll={showAll}
        totalCount={data.length}
        onToggle={() => setShowAll(!showAll)}
        timelineUrl={listPageUrl}
      />
    </SectionLayout>
  );
}
