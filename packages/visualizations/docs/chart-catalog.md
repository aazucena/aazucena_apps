# 📊 CHART_CATALOG

**REFERENCE_DOCUMENTATION** • **INTELLIGENCE_THEME** • **Phase_4_Developer_Experience**

Complete reference for all D3.js visualizations in @aazucena/visualizations.

---

## 📋 TABLE_OF_CONTENTS

- [📈 BASIC_CHARTS](#-basic_charts)
- [🌊 FLOW_DIAGRAMS](#-flow_diagrams)
- [🗺️ GEOGRAPHIC_MAPS](#️-geographic_maps)
- [🎯 SPECIALIZED_CHARTS](#-specialized_charts)
- [🧠 INTELLIGENCE_VISUALIZATIONS](#-intelligence_visualizations)

---

## 📈 BASIC_CHARTS

### AreaChart
**Purpose:** Visualize continuous data with filled areas

```tsx
import { AreaChart } from '@aazucena/visualizations';

const data = [
  { label: 'Jan', value: 120 },
  { label: 'Feb', value: 150 },
  { label: 'Mar', value: 180 },
];

<AreaChart
  data={data}
  height={300}
  baseColor="#3b82f6"
  gradient={true}
  exportFileName="monthly-metrics"
/>
```

**Props:**
- `data: { label: string; value: number }[]` - Chart data
- `height?: number` - Chart height (default: 300)
- `baseColor?: string` - Fill color (default: '#3b82f6')
- `gradient?: boolean` - Use gradient fill (default: false)
- `exportFileName?: string` - Export filename
- `className?: string` - Custom CSS classes

**Use Cases:**
- Revenue/sales trends
- User growth over time
- Performance metrics

---

### BarChart
**Purpose:** Compare categorical data with bars

```tsx
import { BarChart } from '@aazucena/visualizations';

const data = [
  { label: 'React', value: 45 },
  { label: 'Vue', value: 30 },
  { label: 'Angular', value: 25 },
];

<BarChart
  data={data}
  height={300}
  orientation="vertical"
  colorMap={{ React: '#61dafb', Vue: '#42b883', Angular: '#dd0031' }}
  onBarClick={(bar) => console.log(bar.label)}
/>
```

**Props:**
- `data: { label: string; value: number }[]` - Chart data
- `height?: number` - Chart height (default: 300)
- `orientation?: 'vertical' | 'horizontal'` - Bar direction (default: 'vertical')
- `colorMap?: Record<string, string>` - Category colors
- `onBarClick?: (bar: T) => void` - Click callback
- `className?: string` - Custom CSS classes

**Use Cases:**
- Technology comparisons
- Category breakdowns
- Frequency distributions

---

### LineChart
**Purpose:** Show trends over time with a line

```tsx
import { LineChart } from '@aazucena/visualizations';

const data = [
  { label: '00:00', value: 12 },
  { label: '01:00', value: 18 },
  { label: '02:00', value: 15 },
];

<LineChart
  data={data}
  height={300}
  strokeWidth={2}
  color="#10b981"
  showPoints={true}
/>
```

**Props:**
- `data: { label: string; value: number }[]` - Chart data
- `height?: number` - Chart height (default: 300)
- `strokeWidth?: number` - Line thickness (default: 2)
- `color?: string` - Line color (default: '#3b82f6')
- `showPoints?: boolean` - Show data points (default: false)
- `className?: string` - Custom CSS classes

**Use Cases:**
- Time-series data
- Stock prices
- Temperature trends

---

### PieChart
**Purpose:** Show proportions of a whole

```tsx
import { PieChart } from '@aazucena/visualizations';

const data = [
  { label: 'Frontend', value: 40 },
  { label: 'Backend', value: 35 },
  { label: 'DevOps', value: 25 },
];

<PieChart
  data={data}
  height={400}
  innerRadius={0.5} // 0 for pie, >0 for donut
  colorMap={{
    Frontend: '#61dafb',
    Backend: '#10b981',
    DevOps: '#f59e0b',
  }}
  onSliceClick={(slice) => console.log(slice.label)}
/>
```

**Props:**
- `data: { label: string; value: number }[]` - Slice data
- `height?: number` - Chart height (default: 400)
- `innerRadius?: number` - Donut inner radius (0-1, default: 0)
- `colorMap?: Record<string, string>` - Slice colors
- `onSliceClick?: (slice: T) => void` - Click callback
- `className?: string` - Custom CSS classes

**Use Cases:**
- Market share
- Budget allocation
- Survey results

---

### ScatterPlot
**Purpose:** Plot points to show correlation

```tsx
import { ScatterPlot } from '@aazucena/visualizations';

const data = [
  { x: 10, y: 20, label: 'Point A' },
  { x: 15, y: 35, label: 'Point B' },
  { x: 20, y: 30, label: 'Point C' },
];

<ScatterPlot
  data={data}
  height={400}
  color="#8b5cf6"
  pointSize={6}
  showTrendLine={true}
  onPointClick={(point) => console.log(point.label)}
/>
```

**Props:**
- `data: { x: number; y: number; label?: string }[]` - Point data
- `height?: number` - Chart height (default: 400)
- `color?: string` - Point color (default: '#3b82f6')
- `pointSize?: number` - Point radius (default: 4)
- `showTrendLine?: boolean` - Show regression line (default: false)
- `onPointClick?: (point: T) => void` - Click callback
- `className?: string` - Custom CSS classes

**Use Cases:**
- Correlation analysis
- Data clustering
- Outlier detection

---

## 🌊 FLOW_DIAGRAMS

### SankeyDiagram
**Purpose:** Visualize flow between nodes

```tsx
import { SankeyDiagram } from '@aazucena/visualizations';

const data = {
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
  data={data}
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

**Props:**
- `data: { nodes: Node[]; links: Link[] }` - Graph data
- `height?: number` - Chart height (default: 500)
- `nodeWidth?: number` - Node bar width (default: 20)
- `nodePadding?: number` - Space between nodes (default: 8)
- `colorMap?: Record<string, string>` - Node colors
- `onNodeClick?: (node: Node) => void` - Click callback
- `className?: string` - Custom CSS classes

**Use Cases:**
- User funnels
- Energy flow
- Budget allocation

---

### StreamGraph
**Purpose:** Show stacked time-series data

```tsx
import { StreamGraph } from '@aazucena/visualizations';

const data = [
  { timestamp: '2026-01-01', values: { react: 120, vue: 80, angular: 60 } },
  { timestamp: '2026-01-02', values: { react: 130, vue: 85, angular: 55 } },
  { timestamp: '2026-01-03', values: { react: 145, vue: 90, angular: 50 } },
];

<StreamGraph
  data={data}
  height={400}
  colorMap={{
    react: '#61dafb',
    vue: '#42b883',
    angular: '#dd0031',
  }}
  onLayerClick={(key) => console.log(key)}
/>
```

**Props:**
- `data: GenericTimeSeriesStep[]` - Time-series data
- `height?: number` - Chart height (default: 400)
- `colorMap?: Record<string, string>` - Category colors
- `onLayerClick?: (key: string) => void` - Click callback
- `className?: string` - Custom CSS classes

**Type Definition:**
```typescript
interface GenericTimeSeriesStep {
  timestamp: string | Date;
  values: Record<string, number>;
}
```

**Use Cases:**
- Tech stack evolution
- Skill development over time
- Market trends

---

### ForceDirectedGraph
**Purpose:** Interactive network graph with physics simulation

```tsx
import { ForceDirectedGraph } from '@aazucena/visualizations';

const data = {
  nodes: [
    { id: '1', label: 'React', group: 'frontend' },
    { id: '2', label: 'Node.js', group: 'backend' },
    { id: '3', label: 'TypeScript', group: 'language' },
  ],
  links: [
    { source: '1', target: '3' },
    { source: '2', target: '3' },
  ],
};

<ForceDirectedGraph
  data={data}
  height={600}
  colorMap={{
    frontend: '#61dafb',
    backend: '#10b981',
    language: '#3178c6',
  }}
  onNodeClick={(node) => console.log(node.label)}
/>
```

**Props:**
- `data: { nodes: Node[]; links: Link[] }` - Graph data
- `height?: number` - Chart height (default: 600)
- `colorMap?: Record<string, string>` - Group colors
- `chargeStrength?: number` - Force strength (default: -100)
- `linkDistance?: number` - Link length (default: 50)
- `onNodeClick?: (node: Node) => void` - Click callback
- `className?: string` - Custom CSS classes

**Use Cases:**
- Skill dependencies
- Knowledge graphs
- Network topology

---

### InteractiveTimeline
**Purpose:** Scroll-synced career progression timeline

```tsx
import { InteractiveTimeline } from '@aazucena/visualizations';

const events = [
  {
    id: '1',
    date: '2020-01-15',
    title: 'Started at Company X',
    type: 'job',
    description: 'Full-stack developer role',
  },
  {
    id: '2',
    date: '2022-06-10',
    title: 'Promoted to Senior',
    type: 'milestone',
    description: 'Led team of 5 engineers',
  },
];

<InteractiveTimeline
  events={events}
  height={500}
  onEventClick={(event) => console.log(event.title)}
/>
```

**Props:**
- `events: TimelineEvent[]` - Timeline events
- `height?: number` - Chart height (default: 500)
- `colorMap?: Record<string, string>` - Event type colors
- `onEventClick?: (event: TimelineEvent) => void` - Click callback
- `className?: string` - Custom CSS classes

**Use Cases:**
- Career journey
- Project timeline
- Historical events

---

## 🗺️ GEOGRAPHIC_MAPS

### ChoroplethMap
**Purpose:** Geographic data visualization

```tsx
import { ChoroplethMap } from '@aazucena/visualizations';

const data = [
  { id: 'US-CA', value: 1200, label: 'California' },
  { id: 'US-TX', value: 980, label: 'Texas' },
  { id: 'US-NY', value: 1500, label: 'New York' },
];

<ChoroplethMap
  data={data}
  geoData={usStatesGeoJSON}
  height={600}
  colorScale="blues"
  onRegionClick={(region) => console.log(region.label)}
/>
```

**Props:**
- `data: { id: string; value: number; label?: string }[]` - Geographic data
- `geoData: GeoJSON` - Map boundaries
- `height?: number` - Map height (default: 600)
- `colorScale?: string` - Color scheme ('blues', 'greens', 'reds', etc.)
- `onRegionClick?: (region: T) => void` - Click callback
- `className?: string` - Custom CSS classes

**Use Cases:**
- User demographics by region
- Sales by territory
- Visitor geolocation heatmap

---

## 🎯 SPECIALIZED_CHARTS

### Heatmap
**Purpose:** Display density data in a grid

```tsx
import { Heatmap } from '@aazucena/visualizations';

const data = [
  { x: 'Mon', y: '00:00', value: 12, category: 'Music Play' },
  { x: 'Mon', y: '01:00', value: 8, category: 'Page View' },
  { x: 'Tue', y: '00:00', value: 15, category: 'Interaction' },
];

<Heatmap
  data={data}
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

**Props:**
- `data: GenericHeatmapCell[]` - Grid data
- `height?: number` - Chart height (default: 200)
- `baseColor?: string` - Default color (default: '#3b82f6')
- `colorMap?: Record<string, string>` - Category colors
- `onCellClick?: (cell: T) => void` - Click callback
- `className?: string` - Custom CSS classes

**Type Definition:**
```typescript
interface GenericHeatmapCell {
  x: string;
  y: string;
  value: number;
  category?: string;
}
```

**Use Cases:**
- Activity patterns (GitHub contribution grid)
- Time-based data
- Correlation matrices

---

### SpiderChart
**Purpose:** Multi-dimensional data comparison (radar chart)

```tsx
import { SpiderChart } from '@aazucena/visualizations';

const data = [
  { axis: 'React', value: 90 },
  { axis: 'TypeScript', value: 85 },
  { axis: 'Node.js', value: 80 },
  { axis: 'GraphQL', value: 75 },
  { axis: 'AWS', value: 70 },
];

<SpiderChart
  data={data}
  height={400}
  levels={5}
  color="#8b5cf6"
  fillOpacity={0.2}
/>
```

**Props:**
- `data: { axis: string; value: number }[]` - Radar data
- `height?: number` - Chart height (default: 400)
- `levels?: number` - Concentric circles (default: 5)
- `color?: string` - Fill color (default: '#3b82f6')
- `fillOpacity?: number` - Fill transparency (0-1, default: 0.2)
- `className?: string` - Custom CSS classes

**Use Cases:**
- Skill profiling
- Product comparison
- Performance metrics

---

### Treemap
**Purpose:** Hierarchical data with nested rectangles

```tsx
import { Treemap } from '@aazucena/visualizations';

const data = {
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
  data={data}
  height={500}
  colorScale={(d) => categoryColors[d.data.name]}
  onTileClick={(tile) => console.log(tile.data.name)}
/>
```

**Props:**
- `data: HierarchyNode` - Tree structure
- `height?: number` - Chart height (default: 500)
- `colorScale?: (d: any) => string` - Color function
- `onTileClick?: (tile: any) => void` - Click callback
- `className?: string` - Custom CSS classes

**Use Cases:**
- File system visualization
- Market capitalization
- Budget breakdown

---

### WordCloud
**Purpose:** Text frequency visualization

```tsx
import { WordCloud } from '@aazucena/visualizations';

const words = [
  { text: 'React', size: 80 },
  { text: 'TypeScript', size: 65 },
  { text: 'Node.js', size: 50 },
  { text: 'GraphQL', size: 40 },
];

<WordCloud
  words={words}
  height={400}
  colorScale="blues"
  onWordClick={(word) => console.log(word.text)}
/>
```

**Props:**
- `words: { text: string; size: number }[]` - Word data
- `height?: number` - Cloud height (default: 400)
- `colorScale?: string` - Color scheme
- `onWordClick?: (word: Word) => void` - Click callback
- `className?: string` - Custom CSS classes

**Use Cases:**
- Tag clouds
- Keyword analysis
- Document summarization

---

### CircularPacking
**Purpose:** Hierarchical circle packing

```tsx
import { CircularPacking } from '@aazucena/visualizations';

const data = {
  name: 'root',
  children: [
    { name: 'React', value: 1000 },
    { name: 'Vue', value: 800 },
    { name: 'Angular', value: 600 },
  ],
};

<CircularPacking
  data={data}
  height={500}
  colorScale={(d) => colorByGroup[d.data.group]}
  onCircleClick={(circle) => console.log(circle.data.name)}
/>
```

**Props:**
- `data: HierarchyNode` - Tree structure
- `height?: number` - Chart height (default: 500)
- `colorScale?: (d: any) => string` - Color function
- `onCircleClick?: (circle: any) => void` - Click callback
- `className?: string` - Custom CSS classes

**Use Cases:**
- Organization hierarchy
- File size visualization
- Portfolio allocation

---

### Dendrogram
**Purpose:** Tree diagram for hierarchical clustering

```tsx
import { Dendrogram } from '@aazucena/visualizations';

const data = {
  name: 'root',
  children: [
    {
      name: 'Frontend',
      children: [
        { name: 'React' },
        { name: 'Vue' },
      ],
    },
    {
      name: 'Backend',
      children: [
        { name: 'Node.js' },
        { name: 'Python' },
      ],
    },
  ],
};

<Dendrogram
  data={data}
  height={500}
  orientation="horizontal"
  onNodeClick={(node) => console.log(node.data.name)}
/>
```

**Props:**
- `data: HierarchyNode` - Tree structure
- `height?: number` - Chart height (default: 500)
- `orientation?: 'horizontal' | 'vertical'` - Tree direction (default: 'horizontal')
- `onNodeClick?: (node: any) => void` - Click callback
- `className?: string` - Custom CSS classes

**Use Cases:**
- Taxonomies
- Decision trees
- Organizational charts

---

### ParetoFrontier
**Purpose:** Multi-objective optimization visualization

```tsx
import { ParetoFrontier } from '@aazucena/visualizations';

const data = [
  { x: 10, y: 90, label: 'Model A', isOptimal: true },
  { x: 20, y: 80, label: 'Model B', isOptimal: true },
  { x: 30, y: 75, label: 'Model C', isOptimal: false },
];

<ParetoFrontier
  data={data}
  height={400}
  xAxisLabel="Cost ($)"
  yAxisLabel="Accuracy (%)"
  showFrontierLine={true}
  onPointClick={(point) => console.log(point.label)}
/>
```

**Props:**
- `data: { x: number; y: number; label?: string; isOptimal?: boolean }[]` - Point data
- `height?: number` - Chart height (default: 400)
- `xAxisLabel?: string` - X-axis label
- `yAxisLabel?: string` - Y-axis label
- `showFrontierLine?: boolean` - Show Pareto frontier (default: true)
- `onPointClick?: (point: T) => void` - Click callback
- `className?: string` - Custom CSS classes

**Use Cases:**
- Model performance comparison
- Cost-benefit analysis
- Trade-off visualization

---

### RadialGauge
**Purpose:** Circular gauge for single metric

```tsx
import { RadialGauge } from '@aazucena/visualizations';

<RadialGauge
  value={75}
  max={100}
  height={300}
  color="#10b981"
  label="System Health"
  showValue={true}
/>
```

**Props:**
- `value: number` - Current value
- `max: number` - Maximum value (default: 100)
- `height?: number` - Chart height (default: 300)
- `color?: string` - Arc color (default: '#3b82f6')
- `label?: string` - Metric label
- `showValue?: boolean` - Display value text (default: true)
- `className?: string` - Custom CSS classes

**Use Cases:**
- KPI dashboards
- Progress indicators
- Health metrics

---

### BarPlot
**Purpose:** Statistical bar plot with error bars

```tsx
import { BarPlot } from '@aazucena/visualizations';

const data = [
  { label: 'React', mean: 85, stdDev: 5 },
  { label: 'Vue', mean: 78, stdDev: 7 },
  { label: 'Angular', mean: 72, stdDev: 6 },
];

<BarPlot
  data={data}
  height={400}
  showErrorBars={true}
  colorMap={{
    React: '#61dafb',
    Vue: '#42b883',
    Angular: '#dd0031',
  }}
/>
```

**Props:**
- `data: { label: string; mean: number; stdDev?: number }[]` - Statistical data
- `height?: number` - Chart height (default: 400)
- `showErrorBars?: boolean` - Display error bars (default: false)
- `colorMap?: Record<string, string>` - Category colors
- `className?: string` - Custom CSS classes

**Use Cases:**
- A/B test results
- Performance benchmarks
- Survey data with confidence intervals

---

## 🧠 INTELLIGENCE_VISUALIZATIONS

### NeuralMap
**Purpose:** Visualize AI decision path and cognitive flow

```tsx
import { NeuralMap } from '@aazucena/visualizations/intelligence';

const steps = [
  { action: 'perceive', reward: 0.8 },
  { action: 'reason', reward: 0.9 },
  { action: 'decide', reward: -0.3 }, // Failed step
  { action: 'execute', reward: 0.85 },
];

<NeuralMap
  steps={steps}
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

**Props:**
- `steps: any[]` - Trajectory steps with rewards
- `currentStepIndex: number` - Current active step
- `graphData?: { nodes: any[]; edges: any[] }` - Graph structure
- `className?: string` - Custom CSS classes

**Use Cases:**
- RL agent trajectories
- Decision process visualization
- AI workflow tracking

---

### NeuralNode
**Purpose:** Individual node in neural map

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

**Props:**
- `type: string` - Node type/ID
- `label: string` - Display label
- `isActive: boolean` - Current step indicator
- `isCompleted: boolean` - Past step indicator
- `isFailed: boolean` - Failed step indicator

**Use Cases:**
- Component of NeuralMap
- Custom AI visualization pipelines

---

## 🎨 COMMON_PATTERNS

### Export Controls
All charts include `ExportControls` for SVG/PNG export:

```tsx
import { ExportControls } from '@aazucena/visualizations/common';

<ExportControls svgRef={svgRef} fileName="my-chart" />
```

**Exports:**
- **SVG** - Scalable vector format (lossless)
- **PNG** - Raster image (1920x1080)

---

### Responsive Design
All charts are responsive by default:

```tsx
const [width, setWidth] = useState(0);

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
```

---

### Dark Mode Support
Charts adapt to theme automatically:

```css
className="text-foreground bg-accent/5"
```

Uses Tailwind's dark mode system:
- `text-foreground` - Adapts to light/dark text color
- `bg-accent/5` - Subtle background with 5% opacity

---

**DOCUMENTATION_METADATA:**
- **Version:** 1.0.0
- **Last Updated:** 2026-02-11
- **Charts:** 19 D3 + 2 Intelligence
- **Lines:** ~600

**INTELLIGENCE_THEME** • **CHART_REFERENCE** 📊
