import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartDescription,
  ChartContent,
  ChartFooter,
  ChartExportControl,
} from '@aazucena/visualizations';

/**
 * ## Engineering Standards
 * - **Composable slots:** `ChartContainer` → `ChartHeader` → `ChartContent` → `ChartFooter` follow the
 *   Radix/ShadCN composition pattern. Each sub-component is a styled `forwardRef` div.
 * - **ChartExportControl:** Standalone export button with SVG/PNG/CSV download support.
 *   Requires an `svgRef` pointing to the chart SVG — disabled gracefully when ref is null.
 * - **asChild:** Container and ExportControl support Radix `Slot` composition via `asChild` prop.
 */
const meta = {
  title: 'Charts & Graphs/Overview/Primitives',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Composable building blocks that all chart components use internally. Use these to build custom chart layouts.',
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
// ChartContainer — empty
// ---------------------------------------------------------------------------

export const ContainerDefault: StoryObj = {
  render: () => (
    <ChartContainer className="h-48">
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Empty ChartContainer
      </div>
    </ChartContainer>
  ),
};

// ---------------------------------------------------------------------------
// Composed Layout — full anatomy
// ---------------------------------------------------------------------------

export const ComposedLayout: StoryObj = {
  render: () => (
    <ChartContainer>
      <ChartHeader>
        <div>
          <ChartTitle>System Metrics</ChartTitle>
          <ChartDescription>Real-time performance overview</ChartDescription>
        </div>
      </ChartHeader>
      <ChartContent className="h-48">
        <div className="flex items-center justify-center h-full border-2 border-dashed border-border/30 rounded-lg text-muted-foreground text-sm">
          Chart SVG renders here
        </div>
      </ChartContent>
      <ChartFooter>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Series A
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Series B
          </span>
        </div>
      </ChartFooter>
    </ChartContainer>
  ),
};

// ---------------------------------------------------------------------------
// ChartExportControl — standalone
// ---------------------------------------------------------------------------

function ExportControlDemo() {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <svg ref={svgRef} width={200} height={100} className="border border-border/50 rounded">
        <rect x={10} y={10} width={80} height={80} fill="#3b82f6" rx={8} />
        <rect x={110} y={30} width={80} height={60} fill="#10b981" rx={8} />
      </svg>
      <ChartExportControl svgRef={svgRef} fileName="demo-export" />
    </div>
  );
}

export const ExportControl: StoryObj = {
  render: () => <ExportControlDemo />,
};
