import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as topojson from 'topojson-client';
import { InteractiveTimeline, ParetoFrontier, ChoroplethMap } from '@aazucena/visualizations';
import { timelineData, paretoData, choroplethData } from './_mock-data';

/**
 * ## Engineering Standards
 * - **InteractiveTimeline:** `TimelineEvent` extends `BaseNode` + `date` + optional `endDate` for spans.
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

export const Timeline: StoryObj<typeof InteractiveTimeline> = {
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
