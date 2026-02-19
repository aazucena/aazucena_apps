import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  ScatterPlot,
  BarPlot,
  RadialGauge,
} from '@aazucena/visualizations';
import {
  barChartData,
  lineChartData,
  pieChartData,
  areaChartData,
  scatterPlotData,
  barPlotData,
} from './_mock-data';

/**
 * ## Engineering Standards
 * - **D3 Bindings:** Each chart uses a companion `use[Chart]` hook for scales, axes, and resize.
 * - **Composable:** All charts wrap in `ChartContainer` → `ChartHeader` → `ChartContent` → `ChartFooter`.
 * - **Export:** Built-in toolbar for SVG / PNG / CSV export via `ChartExportControl`.
 * - **Responsive:** Charts resize to parent container width automatically.
 */
const meta = {
  title: 'Charts & Graphs/Standard',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Standard chart types: bar, line, pie, area, scatter, histogram, and gauge. These cover the most common data visualization needs.',
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
// BarChart
// ---------------------------------------------------------------------------

export const Bar: StoryObj<typeof BarChart> = {
  render: () => (
    <BarChart
      data={barChartData}
      title="Language Proficiency"
      color="var(--color-primary, #3b82f6)"
    />
  ),
};

export const BarHorizontal: StoryObj<typeof BarChart> = {
  render: () => (
    <BarChart data={barChartData} title="Language Proficiency (Horizontal)" horizontal />
  ),
};

// ---------------------------------------------------------------------------
// LineChart
// ---------------------------------------------------------------------------

export const Line: StoryObj<typeof LineChart> = {
  render: () => (
    <LineChart
      data={lineChartData}
      title="Commit Activity"
      colorMap={{
        TypeScript: '#3178c6',
        Python: '#3572a5',
        Go: '#00add8',
      }}
    />
  ),
};

// ---------------------------------------------------------------------------
// PieChart
// ---------------------------------------------------------------------------

export const Pie: StoryObj<typeof PieChart> = {
  render: () => <PieChart data={pieChartData} title="Time Allocation" />,
};

export const Donut: StoryObj<typeof PieChart> = {
  render: () => <PieChart data={pieChartData} title="Time Allocation (Donut)" innerRadius={60} />,
};

// ---------------------------------------------------------------------------
// AreaChart
// ---------------------------------------------------------------------------

export const Area: StoryObj<typeof AreaChart> = {
  render: () => <AreaChart data={areaChartData} title="Performance Trend" fillOpacity={0.25} />,
};

// ---------------------------------------------------------------------------
// ScatterPlot
// ---------------------------------------------------------------------------

export const Scatter: StoryObj<typeof ScatterPlot> = {
  render: () => (
    <ScatterPlot
      data={scatterPlotData}
      title="Framework Landscape"
      xAxisLabel="Adoption (%)"
      yAxisLabel="Satisfaction (%)"
      colorMap={{
        Frontend: '#3b82f6',
        Backend: '#10b981',
        DevOps: '#f59e0b',
        ML: '#8b5cf6',
      }}
    />
  ),
};

// ---------------------------------------------------------------------------
// BarPlot (Histogram)
// ---------------------------------------------------------------------------

export const Histogram: StoryObj<typeof BarPlot> = {
  render: () => (
    <BarPlot
      data={barPlotData}
      title="Score Distribution"
      binCount={12}
      color="var(--color-primary, #3b82f6)"
    />
  ),
};

// ---------------------------------------------------------------------------
// RadialGauge
// ---------------------------------------------------------------------------

export const Gauge: StoryObj<typeof RadialGauge> = {
  render: () => (
    <div className="flex items-center justify-center p-8">
      <RadialGauge value={73} max={100} label="Performance" color="var(--color-primary, #3b82f6)" />
    </div>
  ),
};

export const GaugeSmall: StoryObj<typeof RadialGauge> = {
  render: () => (
    <div className="flex items-center justify-center p-8">
      <RadialGauge value={42} max={100} label="CPU" size={120} thickness={12} color="#10b981" />
    </div>
  ),
};
