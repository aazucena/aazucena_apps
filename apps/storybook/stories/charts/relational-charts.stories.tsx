import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ForceDirectedGraph,
  SankeyDiagram,
  Dendrogram,
  CircularPacking,
} from '@aazucena/visualizations';
import {
  networkData,
  sankeyData,
  dendrogramData,
  circularPackingData,
} from './_mock-data';

/**
 * ## Engineering Standards
 * - **ForceDirectedGraph:** Interactive D3-force simulation with draggable nodes. `groupKey` maps node property to color.
 * - **SankeyDiagram:** Flow visualization with `visibleGroups` runtime filtering and dedicated `legend` prop.
 * - **Dendrogram:** Tree layout with 3 direction modes — horizontal, vertical, radial.
 * - **CircularPacking:** Nested circles — takes a single root `CircularPackingNode` object.
 */
const meta = {
  title: 'Charts & Graphs/Relational',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Relational and network visualizations: force-directed graphs, Sankey diagrams, dendrograms, and circular packing.',
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
// ForceDirectedGraph
// ---------------------------------------------------------------------------

export const ForceGraph: StoryObj<typeof ForceDirectedGraph> = {
  render: () => (
    <ForceDirectedGraph
      data={networkData}
      title="Tech Dependency Graph"
      groupKey="group"
      colorMap={{
        frontend: '#3b82f6',
        backend: '#10b981',
        data: '#f59e0b',
        infra: '#8b5cf6',
      }}
    />
  ),
};

// ---------------------------------------------------------------------------
// SankeyDiagram
// ---------------------------------------------------------------------------

export const Sankey: StoryObj<typeof SankeyDiagram> = {
  render: () => (
    <SankeyDiagram
      data={sankeyData}
      title="Request Flow"
      colorMap={{
        input: '#3b82f6',
        network: '#10b981',
        compute: '#f59e0b',
        storage: '#8b5cf6',
      }}
      legend={[
        { label: 'Input', color: '#3b82f6' },
        { label: 'Network', color: '#10b981' },
        { label: 'Compute', color: '#f59e0b' },
        { label: 'Storage', color: '#8b5cf6' },
      ]}
    />
  ),
};

// ---------------------------------------------------------------------------
// Dendrogram
// ---------------------------------------------------------------------------

export const DendrogramHorizontal: StoryObj<typeof Dendrogram> = {
  render: () => (
    <Dendrogram
      data={dendrogramData}
      title="Skill Tree (Horizontal)"
      direction="horizontal"
    />
  ),
};

export const DendrogramRadial: StoryObj<typeof Dendrogram> = {
  render: () => (
    <Dendrogram
      data={dendrogramData}
      title="Skill Tree (Radial)"
      direction="radial"
    />
  ),
};

// ---------------------------------------------------------------------------
// CircularPacking
// ---------------------------------------------------------------------------

export const CircularPack: StoryObj<typeof CircularPacking> = {
  render: () => (
    <CircularPacking
      data={circularPackingData}
      title="Stack Composition"
      colorMap={{
        frontend: '#3b82f6',
        backend: '#10b981',
        ai: '#8b5cf6',
      }}
    />
  ),
};
