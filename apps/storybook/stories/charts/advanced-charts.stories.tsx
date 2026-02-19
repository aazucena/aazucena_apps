import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heatmap, StreamGraph, SpiderChart, Treemap, WordCloud } from '@aazucena/visualizations';
import {
  heatmapData,
  streamGraphData,
  spiderChartData,
  treemapData,
  wordCloudData,
} from './_mock-data';

/**
 * ## Engineering Standards
 * - **Heatmap:** GitHub-style contribution grid with intensity color scaling.
 * - **StreamGraph:** Stacked area with organic curves — uses same `GenericTimeSeriesStep[]` as LineChart.
 * - **SpiderChart:** Multi-dimensional radar for comparing skill profiles.
 * - **Treemap:** Hierarchical rectangles — takes a single root `TreemapNode` object, not an array.
 * - **WordCloud:** D3-cloud layout with font size scaled by `value`.
 */
const meta = {
  title: 'Charts & Graphs/Advanced',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Advanced visualization types: heatmaps, stream graphs, spider/radar charts, treemaps, and word clouds.',
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
// Heatmap
// ---------------------------------------------------------------------------

export const HeatmapActivity: StoryObj<typeof Heatmap> = {
  render: () => <Heatmap data={heatmapData} title="Contribution Activity" baseColor="#3b82f6" />,
};

// ---------------------------------------------------------------------------
// StreamGraph
// ---------------------------------------------------------------------------

export const Stream: StoryObj<typeof StreamGraph> = {
  render: () => (
    <StreamGraph
      data={streamGraphData}
      title="Library Usage Over Time"
      colorMap={{
        React: '#61dafb',
        D3: '#f9a03c',
        Three: '#049ef4',
        GSAP: '#88ce02',
      }}
    />
  ),
};

// ---------------------------------------------------------------------------
// SpiderChart
// ---------------------------------------------------------------------------

export const Spider: StoryObj<typeof SpiderChart> = {
  render: () => (
    <SpiderChart
      data={spiderChartData}
      title="Skill Profile"
      maxValue={100}
      colorMap={{
        Current: '#3b82f6',
        Target: '#10b981',
      }}
    />
  ),
};

// ---------------------------------------------------------------------------
// Treemap
// ---------------------------------------------------------------------------

export const TreemapHierarchy: StoryObj<typeof Treemap> = {
  render: () => <Treemap data={treemapData} title="Tech Stack Breakdown" />,
};

// ---------------------------------------------------------------------------
// WordCloud
// ---------------------------------------------------------------------------

export const Cloud: StoryObj<typeof WordCloud> = {
  render: () => (
    <WordCloud
      data={wordCloudData}
      title="Technology Keywords"
      minFontSize={14}
      maxFontSize={56}
      colorMap={{
        lang: '#3178c6',
        framework: '#61dafb',
        runtime: '#68a063',
        lib: '#f59e0b',
        css: '#38bdf8',
        db: '#336791',
        devops: '#2496ed',
        ai: '#8b5cf6',
        tool: '#ec4899',
        api: '#10b981',
      }}
    />
  ),
};
