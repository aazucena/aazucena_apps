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
} from "@aazucena/ui";
import type { JSX } from "react";
import { useSectionData } from "~/contexts";
import { ExperienceCard, ExperienceActions } from "~/components/ui/experience";
import { SectionLayout } from "./SectionLayout";
import type { SectionProps } from "./types";

export interface ExperienceSectionProps extends SectionProps {}

const MAX_VISIBLE_EXPERIENCES = 3;

export function ExperienceSection({
  title = "Experience",
  subtitle = "Building Excellence Over Time",
}: ExperienceSectionProps): JSX.Element {
  const { experiences: data, experienceShowcase: showcase } = useSectionData();

  const displayedExperiences = data.slice(0, MAX_VISIBLE_EXPERIENCES);
  const listPageUrl = showcase?.listPagePath || "experiences";

  return (
    <SectionLayout title={title} subtitle={subtitle} contentWidth="medium">
      <div className="relative mx-auto mt-4 max-w-4xl md:mt-8">
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

      <ExperienceActions timelineUrl={listPageUrl} />
    </SectionLayout>
  );
}
