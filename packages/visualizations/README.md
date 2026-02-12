# @aazucena/visualizations : D3_Intelligence_Charts

## SUMMARY

D3.js-powered data visualization library featuring 21 chart types (19 D3 + 2 intelligence visualizations) optimized for analytics dashboards, telemetry interfaces, and agentic insights. Provides responsive, theme-aware, interactive visualizations with SVG/PNG export, type-safe generic components, and zero-config integration for React-based applications.

---

## 🛠️ VISUALIZATION_MANIFEST

| System                     | Protocol          | Description                                                                 |
| :------------------------- | :---------------- | :-------------------------------------------------------------------------- |
| **Basic_Charts**           | Continuous_Data   | Area, Bar, Line, Pie, Scatter. Foundation for trends and comparisons.      |
| **Flow_Diagrams**          | Relational_Data   | Sankey, StreamGraph, ForceDirectedGraph, Timeline. Network topology.       |
| **Geographic_Maps**        | Spatial_Data      | ChoroplethMap with TopoJSON. Geolocation heatmaps.                         |
| **Specialized_Charts**     | Statistical_Data  | Heatmap, SpiderChart, Treemap, WordCloud, BoxPlot, ViolinPlot, Dendrogram.|
| **Intelligence_Viz**       | Agentic_Insights  | NeuralMap (decision paths), NeuralNode (RL trajectories).                  |
| **Export_Controls**        | Asset_Generation  | SVG (lossless) and PNG (1920x1080) export.                                 |
| **Responsive_Design**      | Container_Adapt   | ResizeObserver, width auto-detection, mobile-friendly.                     |
| **Dark_Mode_Support**      | Theme_Awareness   | Tailwind classes, CSS variable integration.                                 |

---

## 🏗️ CHART_FACTORIES

### [Basic Charts] : The_Foundations

**Location:** `src/d3/`
**Protocol:** D3.js v7, React useEffect integration, responsive design
**Exports:** `AreaChart`, `BarChart`, `LineChart`, `PieChart`, `ScatterPlot`

#### AreaChart

**Purpose:** Visualize continuous data with filled areas (revenue trends, user growth)

**Props:**
```typescript
interface AreaChartProps<T extends { label: string; value: number }> {
  data: T[];
  height?: number; // Default: 300
  baseColor?: string; // Default: '#3b82f6'
  gradient?: boolean; // Default: false
  exportFileName?: string;
  className?: string;
}
```

**Example:**
```tsx
import { AreaChart } from '@aazucena/visualizations';

const monthlyRevenue = [
  { label: 'Jan', value: 45000 },
  { label: 'Feb', value: 52000 },
  { label: 'Mar', value: 61000 },
];

<AreaChart
  data={monthlyRevenue}
  height={300}
  baseColor="#10b981"
  gradient={true}
  exportFileName="revenue-2026-q1"
/>
```

**Patterns:**
- **D3 scales:** `d3.scaleLinear()` for Y-axis, `d3.scaleBand()` for X-axis
- **Area generator:** `d3.area()` with `.curve(d3.curveMonotoneX)`
- **Gradients:** SVG `<linearGradient>` for visual depth

---

#### BarChart

**Purpose:** Compare categorical data (technology usage, performance benchmarks)

**Props:**
```typescript
interface BarChartProps<T extends { label: string; value: number }> {
  data: T[];
  height?: number; // Default: 300
  orientation?: 'vertical' | 'horizontal'; // Default: 'vertical'
  colorMap?: Record<string, string>; // Category colors
  onBarClick?: (bar: T) => void;
  className?: string;
}
```

**Example:**
```tsx
import { BarChart } from '@aazucena/visualizations';

const techUsage = [
  { label: 'React', value: 45 },
  { label: 'Vue', value: 30 },
  { label: 'Angular', value: 25 },
];

<BarChart
  data={techUsage}
  height={400}
  orientation="vertical"
  colorMap={{
    React: '#61dafb',
    Vue: '#42b883',
    Angular: '#dd0031',
  }}
  onBarClick={(bar) => console.log(`${bar.label}: ${bar.value}%`)}
/>
```

**Patterns:**
- **Scale:** `d3.scaleBand()` with `.padding(0.1)` for spacing
- **Hover effects:** D3 transitions for opacity + scale
- **Click handlers:** React callbacks integrated with D3 events

---

#### LineChart

**Purpose:** Show trends over time (temperature, stock prices, latency)

**Props:**
```typescript
interface LineChartProps<T extends { label: string; value: number }> {
  data: T[];
  height?: number; // Default: 300
  strokeWidth?: number; // Default: 2
  color?: string; // Default: '#3b82f6'
  showPoints?: boolean; // Default: false
  className?: string;
}
```

**Example:**
```tsx
import { LineChart } from '@aazucena/visualizations';

const hourlyLatency = [
  { label: '00:00', value: 45 },
  { label: '01:00', value: 52 },
  { label: '02:00', value: 38 },
];

<LineChart
  data={hourlyLatency}
  height={250}
  strokeWidth={3}
  color="#ef4444"
  showPoints={true}
/>
```

**Patterns:**
- **Line generator:** `d3.line()` with `.curve(d3.curveMonotoneX)`
- **Points:** SVG `<circle>` elements at data points
- **Tooltip:** Positioned tooltip on hover

---

#### PieChart (Donut)

**Purpose:** Show proportions (budget allocation, market share)

**Props:**
```typescript
interface PieChartProps<T extends { label: string; value: number }> {
  data: T[];
  height?: number; // Default: 400
  innerRadius?: number; // 0 for pie, >0 for donut (0-1)
  colorMap?: Record<string, string>;
  onSliceClick?: (slice: T) => void;
  className?: string;
}
```

**Example:**
```tsx
import { PieChart } from '@aazucena/visualizations';

const budget = [
  { label: 'Frontend', value: 40 },
  { label: 'Backend', value: 35 },
  { label: 'DevOps', value: 25 },
];

<PieChart
  data={budget}
  height={400}
  innerRadius={0.5} // Donut chart
  colorMap={{
    Frontend: '#61dafb',
    Backend: '#10b981',
    DevOps: '#f59e0b',
  }}
  onSliceClick={(slice) => console.log(slice)}
/>
```

**Patterns:**
- **Arc generator:** `d3.arc()` with inner/outer radius
- **Pie layout:** `d3.pie()` for angle calculations
- **Labels:** Positioned with `arc.centroid()`

---

#### ScatterPlot

**Purpose:** Plot correlation (performance vs cost, features vs complexity)

**Props:**
```typescript
interface ScatterPlotProps<T extends { x: number; y: number; label?: string }> {
  data: T[];
  height?: number; // Default: 400
  color?: string; // Default: '#3b82f6'
  pointSize?: number; // Default: 4
  showTrendLine?: boolean; // Default: false
  onPointClick?: (point: T) => void;
  className?: string;
}
```

**Example:**
```tsx
import { ScatterPlot } from '@aazucena/visualizations';

const modelPerformance = [
  { x: 100, y: 85, label: 'Model A' }, // Cost vs Accuracy
  { x: 150, y: 88, label: 'Model B' },
  { x: 200, y: 92, label: 'Model C' },
];

<ScatterPlot
  data={modelPerformance}
  height={400}
  color="#8b5cf6"
  pointSize={6}
  showTrendLine={true}
  onPointClick={(point) => console.log(point.label)}
/>
```

**Patterns:**
- **Scales:** `d3.scaleLinear()` for both axes
- **Trend line:** Linear regression with `d3.line()`
- **Voronoi overlay:** For precise hover targeting

---

### [Flow Diagrams] : The_Relational

**Location:** `src/d3/`
**Protocol:** D3 layouts (sankey, stack, force), graph algorithms
**Exports:** `SankeyDiagram`, `StreamGraph`, `ForceDirectedGraph`, `InteractiveTimeline`

#### SankeyDiagram

**Purpose:** Visualize flow between nodes (user funnels, energy flow, budget allocation)

**Props:**
```typescript
interface SankeyDiagramProps {
  data: {
    nodes: { id: string; label: string }[];
    links: { source: string; target: string; value: number }[];
  };
  height?: number; // Default: 500
  nodeWidth?: number; // Default: 20
  nodePadding?: number; // Default: 8
  colorMap?: Record<string, string>;
  onNodeClick?: (node: Node) => void;
  className?: string;
}
```

**Example:**
```tsx
import { SankeyDiagram } from '@aazucena/visualizations';

const userFunnel = {
  nodes: [
    { id: 'visit', label: 'Visits' },
    { id: 'signup', label: 'Sign Ups' },
    { id: 'purchase', label: 'Purchases' },
  ],
  links: [
    { source: 'visit', target: 'signup', value: 1000 },
    { source: 'signup', target: 'purchase', value: 300 },
  ],
};

<SankeyDiagram
  data={userFunnel}
  height={500}
  nodeWidth={20}
  nodePadding={8}
  colorMap={{
    visit: '#3b82f6',
    signup: '#10b981',
    purchase: '#f59e0b',
  }}
  onNodeClick={(node) => console.log(node.label)}
/>
```

**Patterns:**
- **d3-sankey plugin:** `d3.sankey()` layout algorithm
- **Link path:** Custom SVG path for curved flows
- **Node tooltips:** Flow value + percentage

---

#### StreamGraph

**Purpose:** Stacked time-series (tech stack evolution, skill development)

**Props:**
```typescript
interface StreamGraphProps<T extends GenericTimeSeriesStep> {
  data: T[]; // { timestamp: string, values: Record<string, number> }
  height?: number; // Default: 400
  colorMap?: Record<string, string>;
  onLayerClick?: (key: string) => void;
  className?: string;
}

interface GenericTimeSeriesStep {
  timestamp: string | Date;
  values: Record<string, number>;
}
```

**Example:**
```tsx
import { StreamGraph } from '@aazucena/visualizations';

const techEvolution = [
  { timestamp: '2020', values: { react: 100, vue: 80, angular: 120 } },
  { timestamp: '2021', values: { react: 130, vue: 85, angular: 100 } },
  { timestamp: '2022', values: { react: 160, vue: 90, angular: 80 } },
];

<StreamGraph
  data={techEvolution}
  height={400}
  colorMap={{
    react: '#61dafb',
    vue: '#42b883',
    angular: '#dd0031',
  }}
  onLayerClick={(key) => console.log(key)}
/>
```

**Patterns:**
- **Stack layout:** `d3.stack()` with `.offset(d3.stackOffsetSilhouette)`
- **Area generator:** `d3.area()` with `.curve(d3.curveBasis)`
- **Time scale:** `d3.scaleTime()` for X-axis

---

#### ForceDirectedGraph

**Purpose:** Network visualization (skill dependencies, knowledge graphs)

**Props:**
```typescript
interface ForceDirectedGraphProps {
  data: {
    nodes: { id: string; label: string; group: string }[];
    links: { source: string; target: string }[];
  };
  height?: number; // Default: 600
  colorMap?: Record<string, string>; // Group colors
  chargeStrength?: number; // Default: -100
  linkDistance?: number; // Default: 50
  onNodeClick?: (node: Node) => void;
  className?: string;
}
```

**Example:**
```tsx
import { ForceDirectedGraph } from '@aazucena/visualizations';

const skillGraph = {
  nodes: [
    { id: '1', label: 'React', group: 'frontend' },
    { id: '2', label: 'TypeScript', group: 'language' },
    { id: '3', label: 'Node.js', group: 'backend' },
  ],
  links: [
    { source: '1', target: '2' },
    { source: '2', target: '3' },
  ],
};

<ForceDirectedGraph
  data={skillGraph}
  height={600}
  colorMap={{
    frontend: '#61dafb',
    language: '#3178c6',
    backend: '#10b981',
  }}
  chargeStrength={-200}
  linkDistance={80}
  onNodeClick={(node) => console.log(node.label)}
/>
```

**Patterns:**
- **Force simulation:** `d3.forceSimulation()` with charge, link, center forces
- **Drag behavior:** `d3.drag()` for interactive nodes
- **Canvas rendering:** Optional for >1000 nodes

---

#### InteractiveTimeline

**Purpose:** Scroll-synced career progression (journey page, project history)

**Props:**
```typescript
interface InteractiveTimelineProps {
  events: TimelineEvent[];
  height?: number; // Default: 500
  colorMap?: Record<string, string>; // Event type colors
  onEventClick?: (event: TimelineEvent) => void;
  className?: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  type: string; // 'job' | 'milestone' | 'education'
  description?: string;
}
```

**Example:**
```tsx
import { InteractiveTimeline } from '@aazucena/visualizations';

const careerEvents = [
  {
    id: '1',
    date: '2020-01-15',
    title: 'Started at Company X',
    type: 'job',
    description: 'Full-stack developer',
  },
  {
    id: '2',
    date: '2022-06-10',
    title: 'Promoted to Senior',
    type: 'milestone',
    description: 'Led team of 5',
  },
];

<InteractiveTimeline
  events={careerEvents}
  height={500}
  colorMap={{
    job: '#3b82f6',
    milestone: '#f59e0b',
    education: '#10b981',
  }}
  onEventClick={(event) => console.log(event.title)}
/>
```

**Patterns:**
- **Time scale:** `d3.scaleTime()` with extent
- **Scroll sync:** IntersectionObserver integration
- **Animations:** Framer Motion for entry/exit

---

### [Geographic Maps] : The_Spatial

**Location:** `src/d3/`
**Protocol:** TopoJSON, d3-geo projections, choropleth coloring
**Exports:** `ChoroplethMap`

#### ChoroplethMap

**Purpose:** Geographic data visualization (user demographics, sales by region)

**Props:**
```typescript
interface ChoroplethMapProps<T extends { id: string; value: number }> {
  data: T[];
  geoData: GeoJSON | TopoJSON; // Map boundaries
  height?: number; // Default: 600
  colorScale?: string; // 'blues' | 'greens' | 'reds' | 'oranges'
  onRegionClick?: (region: T) => void;
  className?: string;
}
```

**Example:**
```tsx
import { ChoroplethMap } from '@aazucena/visualizations';
import usStatesGeoJSON from './us-states.json';

const usersByState = [
  { id: 'US-CA', value: 1200, label: 'California' },
  { id: 'US-TX', value: 980, label: 'Texas' },
  { id: 'US-NY', value: 1500, label: 'New York' },
];

<ChoroplethMap
  data={usersByState}
  geoData={usStatesGeoJSON}
  height={600}
  colorScale="blues"
  onRegionClick={(region) => console.log(region.label)}
/>
```

**Patterns:**
- **Projection:** `d3.geoAlbersUsa()` or `d3.geoMercator()`
- **Path generator:** `d3.geoPath()`
- **Color scale:** `d3.scaleQuantize()` with buckets
- **TopoJSON:** Smaller file size, converted to GeoJSON at runtime

---

### [Specialized Charts] : The_Advanced

**Location:** `src/d3/`
**Protocol:** Statistical algorithms, hierarchical layouts, text positioning
**Exports:** `Heatmap`, `SpiderChart`, `Treemap`, `WordCloud`, `BoxPlot`, `ViolinPlot`, `Dendrogram`, etc.

#### Heatmap

**Purpose:** Activity patterns (GitHub contribution grid, time-based telemetry)

**Props:**
```typescript
interface HeatmapProps<T extends GenericHeatmapCell> {
  data: T[];
  height?: number; // Default: 200
  baseColor?: string; // Default: '#3b82f6'
  colorMap?: Record<string, string>; // Category colors
  onCellClick?: (cell: T) => void;
  className?: string;
}

interface GenericHeatmapCell {
  x: string; // Column (e.g., day of week)
  y: string; // Row (e.g., hour)
  value: number;
  category?: string;
}
```

**Example:**
```tsx
import { Heatmap } from '@aazucena/visualizations';

const activityData = [
  { x: 'Mon', y: '00:00', value: 12, category: 'Music Play' },
  { x: 'Mon', y: '01:00', value: 8, category: 'Page View' },
  { x: 'Tue', y: '00:00', value: 15, category: 'Interaction' },
];

<Heatmap
  data={activityData}
  height={200}
  baseColor="#3b82f6"
  colorMap={{
    'Music Play': '#f59e0b',
    'Page View': '#3b82f6',
    'Interaction': '#10b981',
  }}
  onCellClick={(cell) => console.log(cell)}
/>
```

**Patterns:**
- **Grid layout:** Fixed cell size (`Math.min(width / 53, height / 7)`)
- **Color scale:** `d3.scaleLinear()` from light to baseColor
- **Tooltip:** Hover shows X, Y, value, category

---

#### SpiderChart (Radar)

**Purpose:** Multi-dimensional comparison (skill profiling, product features)

**Props:**
```typescript
interface SpiderChartProps {
  data: { axis: string; value: number }[];
  height?: number; // Default: 400
  levels?: number; // Default: 5 (concentric circles)
  color?: string; // Default: '#3b82f6'
  fillOpacity?: number; // Default: 0.2
  className?: string;
}
```

**Example:**
```tsx
import { SpiderChart } from '@aazucena/visualizations';

const skills = [
  { axis: 'React', value: 90 },
  { axis: 'TypeScript', value: 85 },
  { axis: 'Node.js', value: 80 },
  { axis: 'GraphQL', value: 75 },
  { axis: 'AWS', value: 70 },
];

<SpiderChart
  data={skills}
  height={400}
  levels={5}
  color="#8b5cf6"
  fillOpacity={0.3}
/>
```

**Patterns:**
- **Radial coordinates:** Angle per axis, radius per value
- **Polygon path:** Connect all points with SVG path
- **Grid:** Concentric circles + radial lines

---

#### Treemap

**Purpose:** Hierarchical data with nested rectangles (file systems, portfolio)

**Props:**
```typescript
interface TreemapProps {
  data: HierarchyNode;
  height?: number; // Default: 500
  colorScale?: (d: any) => string;
  onTileClick?: (tile: any) => void;
  className?: string;
}
```

**Example:**
```tsx
import { Treemap } from '@aazucena/visualizations';

const fileSystem = {
  name: 'root',
  children: [
    {
      name: 'Frontend',
      children: [
        { name: 'React', value: 1000 },
        { name: 'Vue', value: 800 },
      ],
    },
    {
      name: 'Backend',
      children: [
        { name: 'Node.js', value: 1200 },
        { name: 'Python', value: 900 },
      ],
    },
  ],
};

<Treemap
  data={fileSystem}
  height={500}
  colorScale={(d) => categoryColors[d.data.name]}
  onTileClick={(tile) => console.log(tile.data.name)}
/>
```

**Patterns:**
- **Hierarchy:** `d3.hierarchy()` with `.sum()`
- **Treemap layout:** `d3.treemap()` with `.tile(d3.treemapSquarify)`
- **Labels:** Clipped text inside rectangles

---

#### WordCloud

**Purpose:** Text frequency visualization (tag clouds, keyword analysis)

**Props:**
```typescript
interface WordCloudProps {
  words: { text: string; size: number }[];
  height?: number; // Default: 400
  colorScale?: string;
  onWordClick?: (word: Word) => void;
  className?: string;
}
```

**Example:**
```tsx
import { WordCloud } from '@aazucena/visualizations';

const keywords = [
  { text: 'React', size: 80 },
  { text: 'TypeScript', size: 65 },
  { text: 'Node.js', size: 50 },
  { text: 'GraphQL', size: 40 },
];

<WordCloud
  words={keywords}
  height={400}
  colorScale="blues"
  onWordClick={(word) => console.log(word.text)}
/>
```

**Patterns:**
- **d3-cloud plugin:** `d3.layout.cloud()` for positioning
- **Font scaling:** Size maps to fontSize
- **Rotation:** Optional random rotation angles

---

### [Intelligence Visualizations] : The_Agentic

**Location:** `src/intelligence/`
**Protocol:** Custom layouts for AI decision paths, RL trajectories
**Exports:** `NeuralMap`, `NeuralNode`

#### NeuralMap

**Purpose:** Visualize AI decision flow (perceive → reason → decide → execute)

**Props:**
```typescript
interface NeuralMapProps {
  steps: any[]; // Array of trajectory steps with rewards
  currentStepIndex: number; // Active step
  graphData?: { nodes: any[]; edges: any[] }; // Optional structure
  className?: string;
}
```

**Example:**
```tsx
import { NeuralMap } from '@aazucena/visualizations/intelligence';

const aiSteps = [
  { action: 'perceive', reward: 0.8 },
  { action: 'reason', reward: 0.9 },
  { action: 'decide', reward: -0.3 }, // Failed step
  { action: 'execute', reward: 0.85 },
];

<NeuralMap
  steps={aiSteps}
  currentStepIndex={2}
  graphData={{
    nodes: [
      { id: 'perceive', label: 'Perceive' },
      { id: 'reason', label: 'Reason' },
      { id: 'decide', label: 'Decide' },
      { id: 'execute', label: 'Execute' },
    ],
    edges: [],
  }}
/>
```

**Patterns:**
- **Node states:** isActive, isCompleted, isFailed
- **Reward coloring:** Green (positive), red (negative)
- **Arrow connectors:** SVG paths between nodes
- **Dot grid background:** Subtle neural network aesthetic

---

#### NeuralNode

**Purpose:** Individual node in neural map (building block)

**Props:**
```typescript
interface NeuralNodeProps {
  type: string;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  isFailed: boolean;
}
```

**Example:**
```tsx
import { NeuralNode } from '@aazucena/visualizations/intelligence';

<NeuralNode
  type="reason"
  label="Reasoning Phase"
  isActive={true}
  isCompleted={false}
  isFailed={false}
/>
```

**Patterns:**
- **Icon mapping:** `perceive` → Eye, `reason` → Brain, `decide` → Target, `execute` → Zap
- **Pulse animation:** Active nodes have animated pulse effect
- **Checkmark:** Completed nodes show checkmark overlay

---

## 🔗 INTEGRATION_PROTOCOLS

### React + D3 Standard Pattern

```tsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ExportControls } from '../common/ExportControls';

export function Chart({ data, height = 400 }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // 1. Responsive width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. D3 rendering
  useEffect(() => {
    if (!svgRef.current || width === 0 || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // ... D3 visualization logic

    return () => {
      d3.selectAll('.viz-tooltip').remove(); // Cleanup
    };
  }, [data, width, height]);

  return (
    <div ref={containerRef} className="w-full relative group">
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExportControls svgRef={svgRef} fileName="chart" />
      </div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full text-foreground bg-accent/5 rounded-2xl transition-colors"
      />
    </div>
  );
}
```

---

### Generic TypeScript Pattern

```typescript
import type { GenericHeatmapCell } from '@aazucena/types';

export interface HeatmapProps<T extends GenericHeatmapCell = GenericHeatmapCell> {
  data: T[];
  colorMap?: Record<string, string>;
  onCellClick?: (cell: T) => void;
}

export function Heatmap<T extends GenericHeatmapCell>({
  data,
  colorMap = {},
  onCellClick,
}: HeatmapProps<T>) {
  // Type-safe implementation
}
```

---

## 📖 API_REFERENCE

### Common Props Pattern

All charts share these base props:

```typescript
interface BaseChartProps {
  height?: number; // Chart height (default varies by chart)
  exportFileName?: string; // Filename for SVG/PNG export
  className?: string; // Tailwind classes
}
```

---

### Interactive Props Pattern

Charts with interactivity include:

```typescript
interface InteractiveChartProps<T> {
  onItemClick?: (item: T) => void; // Click callback
  onItemHover?: (item: T) => void; // Hover callback
  tooltip?: boolean; // Enable tooltips (default: true)
}
```

---

### Color Props Pattern

Charts with custom colors include:

```typescript
interface ColorChartProps {
  baseColor?: string; // Primary color (default: '#3b82f6')
  colorMap?: Record<string, string>; // Category → color mapping
  colorScale?: string; // D3 color scheme name ('blues', 'greens', etc.)
}
```

---

## 🗂️ ARCHITECTURE_BLUEPRINT

```
packages/visualizations/
├── src/
│   ├── index.ts                      # Main export (all charts)
│   ├── d3/
│   │   ├── AreaChart.tsx             # Area chart (continuous data)
│   │   ├── BarChart.tsx              # Bar chart (categorical)
│   │   ├── BarPlot.tsx               # Statistical bar plot
│   │   ├── LineChart.tsx             # Line chart (trends)
│   │   ├── PieChart.tsx              # Pie/Donut chart (proportions)
│   │   ├── ScatterPlot.tsx           # Scatter plot (correlation)
│   │   ├── SankeyDiagram.tsx         # Sankey flow diagram
│   │   ├── StreamGraph.tsx           # Stacked area chart
│   │   ├── ForceDirectedGraph.tsx    # Network graph
│   │   ├── InteractiveTimeline.tsx   # Career timeline
│   │   ├── ChoroplethMap.tsx         # Geographic map
│   │   ├── Heatmap.tsx               # Activity heatmap
│   │   ├── SpiderChart.tsx           # Radar chart
│   │   ├── Treemap.tsx               # Hierarchical rectangles
│   │   ├── WordCloud.tsx             # Text frequency
│   │   ├── CircularPacking.tsx       # Circle packing
│   │   ├── Dendrogram.tsx            # Tree diagram
│   │   ├── ParetoFrontier.tsx        # Optimization chart
│   │   └── RadialGauge.tsx           # Circular gauge
│   ├── intelligence/
│   │   ├── NeuralMap.tsx             # AI decision flow
│   │   └── NeuralNode.tsx            # Neural node component
│   └── common/
│       └── ExportControls.tsx        # SVG/PNG export buttons
├── docs/
│   ├── chart-catalog.md              # Complete chart reference (~600 lines)
│   └── d3-patterns.md                # D3 + React patterns (~500 lines)
├── package.json
├── tsconfig.json
└── README.md                         # This file (~1,200 lines)
```

**Design Principles:**
- **D3 Powered:** Leverage D3.js v7 ecosystem (scales, layouts, transitions)
- **React Integration:** Declarative D3 with React lifecycle (useEffect, useRef)
- **Responsive:** Auto-resize with ResizeObserver, container-based width
- **Accessible:** ARIA labels, keyboard navigation, semantic HTML
- **Performance:** Optimized for large datasets (10k+ points), virtual scrolling
- **Theme Aware:** Dark mode support via Tailwind classes + CSS variables
- **Type Safe:** Generic TypeScript components with constraint types

---

## 🌐 FRAMEWORK_COMPATIBILITY

| Framework | Support | Notes                                         |
| :-------- | :------ | :-------------------------------------------- |
| Next.js   | ✅      | App Router + Pages Router. Use client components. |
| Astro     | ✅      | Use `client:load` or `client:only="react"`.   |
| Remix     | ✅      | Full support with React 19.                    |
| Vite      | ✅      | Native support.                                |
| Universal | ✅      | Any React 18+ environment.                     |

**SSR Considerations:**
- All charts safe for SSR (no window references during import)
- Use `client:only="react"` in Astro for interactive features
- Export controls work client-side only

---

## 📦 DEPENDENCY_MATRIX

### Internal Dependencies

| Package           | Purpose                          |
| :---------------- | :------------------------------- |
| @aazucena/types   | Chart data type definitions      |
| @aazucena/utils   | Data transformation utilities    |
| @aazucena/icons   | Icon components for NeuralMap    |
| @aazucena/context | TelemetryConfig for NeuralMap    |
| @aazucena/constants | NEURAL_MAP_FALLBACK_NODES       |

### External Dependencies

| Package              | Version  | Purpose                          |
| :------------------- | :------- | :------------------------------- |
| d3                   | ^7.9.0   | Core visualization library       |
| d3-sankey            | ^0.12.3  | Sankey diagram plugin            |
| d3-cloud             | ^1.2.7   | Word cloud layout                |
| topojson-client      | ^3.1.0   | Geographic data utilities        |
| react                | ^19.2.0  | Peer dependency                  |
| framer-motion        | ^11.18.3 | Animation library (optional)     |

---

## 🔗 RELATED_SYSTEMS

- **[AZUCENA_LYTICS](../../apps/analytics)** - Analytics dashboard using these charts
- **[@aazucena/design-system](../design-system)** - Color scales for charts
- **[@aazucena/types](../types)** - Chart data type definitions
- **[@aazucena/constants](../constants)** - Chart configuration constants

---

## 📚 DOCUMENTATION_HUB

- **[Chart Catalog](./docs/chart-catalog.md)** - Complete reference for all 21 chart types
- **[D3 Patterns](./docs/d3-patterns.md)** - React + D3 integration, responsive design, performance, dark mode

---

**Package:** @aazucena/visualizations
**Version:** 0.0.0
**Status:** Development
**Maintainer:** @aazucena
**Charts:** 21 (19 D3 + 2 Intelligence)
**Lines:** ~1,200
**Last Updated:** 2026-02-11

**INTELLIGENCE_THEME** • **D3_INTELLIGENCE_CHARTS** 📊
