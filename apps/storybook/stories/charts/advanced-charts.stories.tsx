import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heatmap, StreamGraph, SpiderChart, Treemap, WordCloud } from '@aazucena/visualizations';
import type { GenericHeatmapCell } from '@aazucena/types';
import {
  heatmapData,
  streamGraphData,
  spiderChartData,
  yearlySpiderData,
  treemapData,
  wordCloudData,
} from './_mock-data';

/**
 * ## Engineering Standards
 * - **Heatmap:** GitHub-style contribution grid with intensity color scaling. Supports an
 *   `infoPanel` render prop that adds a right-side panel (4-col grid layout) receiving the
 *   currently-hovered cell. Use `hideHeader` when embedding inside a parent with its own title.
 * - **StreamGraph:** Stacked area with organic curves — uses same `GenericTimeSeriesStep[]` as
 *   LineChart. Supports `hideHeader` to suppress the built-in title/description row.
 * - **SpiderChart:** Multi-dimensional radar for comparing skill profiles. `maxValue` auto-computes
 *   from data (×1.15 headroom) when not provided. `showYearControls` activates year slider,
 *   Animate button, and Compare toggle — data blobs must use numeric year strings as `name`.
 *   `hideHeader` suppresses the title row and gives the SVG the full height.
 * - **Treemap:** Hierarchical rectangles — takes a single root `TreemapNode` object, not an array.
 * - **WordCloud:** D3-cloud layout with font size scaled by `value`.
 */
const meta = {
  title: 'Charts & Graphs/Advanced',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Advanced visualization types: heatmaps, stream graphs, spider/radar charts, treemaps, and word clouds.',
      },
    },
  },
  tags: ['autodocs', 'no-vitest'],
  decorators: [
    (Story) => (
      <div className="w-full">
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
  name: 'Heatmap — Basic',
  render: () => <Heatmap data={heatmapData} title="Contribution Activity" />,
};

/**
 * Demonstrates the `infoPanel` render prop. When provided, the chart switches from a full-width
 * layout to a 4-column grid: chart takes 3 cols, the info panel takes 1. The render prop receives
 * the currently-hovered cell (or `null` when no cell is hovered) and can render any content.
 */
export const HeatmapWithInfoPanel: StoryObj<typeof Heatmap> = {
  name: 'Heatmap — With Info Panel',
  render: () => (
    <Heatmap
      data={heatmapData}
      hideHeader
      infoPanel={(cell: GenericHeatmapCell | null) => (
        <div className="flex h-full flex-col justify-center gap-3 p-4">
          {cell ? (
            <>
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                Selected Cell
              </p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{cell.value}</p>
              <p className="text-sm text-gray-500">{String(cell.date)}</p>
              {cell.category && (
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {cell.category}
                </span>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400">Hover a cell to see details</p>
          )}
        </div>
      )}
    />
  ),
};

// ---------------------------------------------------------------------------
// StreamGraph
// ---------------------------------------------------------------------------

export const Stream: StoryObj<typeof StreamGraph> = {
  name: 'StreamGraph — Basic',
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

/**
 * `hideHeader` removes the title/description row and gives the SVG all available height.
 * Use this when embedding inside a dashboard tab that already provides its own heading.
 */
export const StreamNoHeader: StoryObj<typeof StreamGraph> = {
  name: 'StreamGraph — No Header',
  render: () => (
    <StreamGraph
      data={streamGraphData}
      hideHeader
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

/**
 * Basic spider chart with two blobs (Current vs Target). `maxValue` is not set here —
 * the chart auto-computes it from the highest axis value × 1.15 so blobs use the full radius.
 */
export const Spider: StoryObj<typeof SpiderChart> = {
  name: 'SpiderChart — Basic',
  render: () => (
    <SpiderChart
      data={spiderChartData}
      title="Skill Profile"
      colorMap={{
        Current: '#3b82f6',
        Target: '#10b981',
      }}
    />
  ),
};

/**
 * `showYearControls` activates the year slider, Animate, and Compare controls below the chart.
 * Data blobs must use numeric year strings as `name` (e.g. `'2022'`, `'2023'`).
 * - **Slider** — scrub through years individually
 * - **Animate** — steps through years automatically with a short delay
 * - **Compare** — overlays all years simultaneously for a full history view
 */
export const SpiderYearControls: StoryObj<typeof SpiderChart> = {
  name: 'SpiderChart — Year Controls',
  render: () => (
    <SpiderChart
      data={yearlySpiderData}
      title="Skill Evolution"
      showYearControls
      colorMap={{
        '2022': '#94a3b8',
        '2023': '#60a5fa',
        '2024': '#34d399',
        '2025': '#f59e0b',
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
