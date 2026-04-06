/**
 * ChronologyTimeline
 *
 * Thin wrapper around InteractiveTimeline for the journey page chronology phase.
 * The hoverPopup render prop must live in a .tsx file — Astro's esbuild transform
 * cannot parse JSX returned inside inline arrow functions in .astro templates.
 */

import { InteractiveTimeline } from "@aazucena/visualizations";
import { TimelineEventTooltip } from "./TimelineEventTooltip";
import type { TimelineEvent } from "@aazucena/visualizations";

interface ChronologyTimelineProps {
  data: TimelineEvent[];
}

const COLOR_MAP = {
  experience: "#3b82f6",
  education: "#8b5cf6",
};

export function ChronologyTimeline({ data }: ChronologyTimelineProps) {
  return (
    <InteractiveTimeline
      data={data}
      laneKey="type"
      colorMap={COLOR_MAP}
      hideHeader
      height={420}
      hoverPopup={(event, pos) => (
        <TimelineEventTooltip event={event} pos={pos} />
      )}
    />
  );
}
