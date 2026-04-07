import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as topojson from 'topojson-client';
import { InteractiveTimeline, ParetoFrontier, ChoroplethMap } from '@aazucena/visualizations';
import { timelineData, paretoData, choroplethData } from './_mock-data';

/**
 * ## Engineering Standards
 * - **InteractiveTimeline:** `TimelineEvent` extends `BaseNode` + `date` + optional `endDate` for
 *   spans. Key props:
 *   - `laneKey` (default `'type'`) — field name used for swim-lane grouping and filter pills.
 *     Each unique value in `data[laneKey]` becomes its own horizontal swim lane + a filter button.
 *   - `colorMap` — maps `laneKey` values to colors (bars, legend dots, filter active state).
 *   - `hideHeader` — suppresses the built-in title/description row; passes full height to SVG.
 *   - `hoverPopup` — render prop `(event, pos) => ReactNode`. Package owns absolute positioning;
 *     caller owns content. The popup div is `pointer-events-none` so it never blocks interactions.
 *   - `showFilter` (default `true`) — show/hide the filter pill row above the chart.
 *   - Zoom controls (+, −, ↺) are always visible top-right.
 * - **ParetoFrontier:** Takes a `ParetoData` wrapper object (not an array) with axis labels on the data.
 * - **ChoroplethMap:** Requires a `geoJson` FeatureCollection as a second mandatory prop.
 *   Region IDs must match GeoJSON feature IDs. Uses `world-atlas@2` Natural Earth 110m
 *   TopoJSON converted at runtime via `topojson-client`.
 */
const meta = {
  title: 'Charts & Graphs/Specialized',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Specialized visualizations: interactive timelines, Pareto frontiers, and choropleth maps.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;

// ---------------------------------------------------------------------------
// InteractiveTimeline
// ---------------------------------------------------------------------------

/**
 * Basic timeline — single color map across all events, no swim-lane grouping.
 */
export const Timeline: StoryObj<typeof InteractiveTimeline> = {
  name: 'InteractiveTimeline — Basic',
  render: () => (
    <InteractiveTimeline
      data={timelineData}
      title="Career Journey"
      colorMap={{
        career: '#3b82f6',
        milestone: '#10b981',
        project: '#f59e0b',
      }}
    />
  ),
};

/**
 * `laneKey="type"` groups events into horizontal swim lanes by their `type` field.
 * Each lane gets a labeled stripe + a filter pill above the chart. Bars are colored by lane.
 * This is the configuration used by the portfolio journey page (`ChronologyTimeline`).
 */
export const TimelineSwimLanes: StoryObj<typeof InteractiveTimeline> = {
  name: 'InteractiveTimeline — Swim Lanes',
  render: () => (
    <InteractiveTimeline
      data={timelineData}
      title="Career by Type"
      laneKey="type"
      colorMap={{
        career: '#3b82f6',
        milestone: '#10b981',
        project: '#f59e0b',
      }}
    />
  ),
};

/**
 * `hoverPopup` render prop — package handles absolute positioning, caller handles content.
 * The popup is `pointer-events-none` and positioned relative to the SVG container.
 */
export const TimelineWithPopup: StoryObj<typeof InteractiveTimeline> = {
  name: 'InteractiveTimeline — Hover Popup',
  render: () => (
    <InteractiveTimeline
      data={timelineData}
      title="Career Journey"
      laneKey="type"
      colorMap={{
        career: '#3b82f6',
        milestone: '#10b981',
        project: '#f59e0b',
      }}
      hoverPopup={(event, pos) =>
        event && pos ? (
          <div
            className="absolute z-50 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-xl dark:border-gray-700 dark:bg-gray-900"
            style={{ left: pos.x + 8, top: pos.y - 8 }}
          >
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              {(event as any).type}
            </p>
            <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">{event.name}</p>
            <p className="text-xs text-gray-500">{String(event.date)}</p>
          </div>
        ) : null
      }
    />
  ),
};

/**
 * `hideHeader` suppresses the built-in title/description row, giving the SVG full height.
 * Use when embedding inside a parent container that provides its own heading.
 */
export const TimelineNoHeader: StoryObj<typeof InteractiveTimeline> = {
  name: 'InteractiveTimeline — No Header',
  render: () => (
    <InteractiveTimeline
      data={timelineData}
      hideHeader
      laneKey="type"
      colorMap={{
        career: '#3b82f6',
        milestone: '#10b981',
        project: '#f59e0b',
      }}
    />
  ),
};

// ---------------------------------------------------------------------------
// ParetoFrontier
// ---------------------------------------------------------------------------

export const Pareto: StoryObj<typeof ParetoFrontier> = {
  render: () => (
    <ParetoFrontier
      data={paretoData}
      title="Framework Tradeoffs"
      objectives={{ x: 'max', y: 'max' }}
    />
  ),
};

// ---------------------------------------------------------------------------
// ChoroplethMap — fetches real Natural Earth world map
// ---------------------------------------------------------------------------

const WORLD_ATLAS_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

function ChoroplethDemo() {
  const [geoJson, setGeoJson] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(WORLD_ATLAS_URL)
      .then((res) => res.json())
      .then((topo) => {
        const countries = topojson.feature(topo, topo.objects.countries) as any;
        setGeoJson(countries);
      })
      .catch(() => setError('Failed to load world map data'));
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[500px] text-muted-foreground text-sm">
        {error}
      </div>
    );
  }

  if (!geoJson) {
    return (
      <div className="flex items-center justify-center h-[500px] text-muted-foreground text-sm">
        Loading world map...
      </div>
    );
  }

  return (
    <ChoroplethMap
      data={choroplethData}
      geoJson={geoJson}
      title="Portfolio Visitors by Country"
      description="Geographic distribution of portfolio traffic (ISO 3166-1 numeric IDs)"
      colors={['#e2e8f0', '#3b82f6']}
    />
  );
}

export const Choropleth: StoryObj<typeof ChoroplethMap> = {
  render: () => <ChoroplethDemo />,
};
