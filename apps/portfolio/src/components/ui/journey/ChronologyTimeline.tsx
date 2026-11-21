/**
 * ChronologyTimeline
 *
 * Portfolio wrapper around the generic InteractiveTimeline.
 * Maps TimelineNode domain fields (logo, subtitle, slug) to the
 * package's generic TimelineEvent shape, and wires the hover popup.
 * The chart sits in an instrument panel; a visually hidden table carries
 * the dates for assistive tech (the bars only show them on hover).
 *
 * Must live in .tsx — Astro cannot parse JSX arrow functions inline.
 */

import { Panel, PanelHeader } from "@aazucena/ui";
import { InteractiveTimeline, categorical } from "@aazucena/visualizations";
import type { TimelineEvent } from "@aazucena/visualizations";
import { TimelineEventTooltip } from "./TimelineEventTooltip";
import type { TimelineNode } from "~/lib/transformers";

interface ChronologyTimelineProps {
  data: TimelineNode[];
}

// Lane hues come from the package's series order (CSS vars), matching the sankey entities
const COLOR_MAP = {
  experience: categorical[0],
  education: categorical[1],
};

/** Map portfolio-specific TimelineNode fields to the generic TimelineEvent shape */
function toTimelineEvent(node: TimelineNode): TimelineEvent {
  return {
    ...node,
    subtitle: node.subtitle,
    avatarUrl: node.logo,
    avatarAlt: node.company || node.institution,
  };
}

const fmt = (d: Date | string | undefined) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Present";

export function ChronologyTimeline({ data }: ChronologyTimelineProps) {
  const events = data.map(toTimelineEvent);
  const years = events.map((e) => new Date(e.date).getFullYear());
  const from = years.length ? Math.min(...years) : null;

  return (
    <Panel role="region" aria-label="Chronology" className="border-rule border">
      <PanelHeader label={from ? `CHRONOLOGY // ${from} – NOW` : "CHRONOLOGY"}>
        <span className="micro-label text-signal">
          ● {events.length} ENTRIES
        </span>
      </PanelHeader>
      <div className="p-panel min-w-0">
        {/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- scrollable pane must be keyboard-focusable */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Chronology chart"
          className="focus-visible:outline-signal relative overflow-x-auto focus-visible:outline-2"
        >
          {/* eslint-enable jsx-a11y/no-noninteractive-tabindex */}
          <InteractiveTimeline
            data={events}
            laneKey="type"
            colorMap={COLOR_MAP}
            hideHeader
            showFilter
            hoverPopup={(event, pos) => (
              <TimelineEventTooltip event={event} pos={pos} />
            )}
            onEventClick={(event) => {
              const node = event as TimelineNode;
              if (node.type === "experience" && node.slug) {
                window.location.href = `/experiences/${node.slug}`;
              }
            }}
          />
        </div>
        <div className="sr-only">
          <table>
            <caption>Chronology of experience and education</caption>
            <thead>
              <tr>
                <th scope="col">Entry</th>
                <th scope="col">Type</th>
                <th scope="col">Start</th>
                <th scope="col">End</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => (
                <tr key={i}>
                  <th scope="row">{e.name}</th>
                  <td>{String((e as { type?: string }).type ?? "")}</td>
                  <td>{fmt(e.date)}</td>
                  <td>{fmt(e.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>
  );
}
