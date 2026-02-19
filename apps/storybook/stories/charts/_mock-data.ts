/**
 * Shared mock data for all Charts & Graphs stories.
 * Uses portfolio tech-domain flavor for realism.
 */
import type {
  BarChartData,
  PieChartData,
  GenericTimeSeriesStep,
  AreaChartPoint,
  ScatterPlotPoint,
  GenericPoint,
  GenericHeatmapCell,
  SpiderChartData,
  TreemapNode,
  WordCloudData,
  GenericNetworkData,
  DendrogramNode,
  CircularPackingNode,
  MapRegion,
  ParetoData,
} from '@aazucena/types';
import type { TimelineEvent } from '@aazucena/visualizations';

// ---------------------------------------------------------------------------
// Standard Charts
// ---------------------------------------------------------------------------

export const barChartData: BarChartData[] = [
  { label: 'TypeScript', value: 92 },
  { label: 'React', value: 88 },
  { label: 'Python', value: 76 },
  { label: 'Go', value: 58 },
  { label: 'Rust', value: 42 },
  { label: 'SQL', value: 71 },
];

export const pieChartData: PieChartData[] = [
  { label: 'Frontend', value: 42, color: '#3b82f6' },
  { label: 'Backend', value: 28, color: '#10b981' },
  { label: 'DevOps', value: 12, color: '#f59e0b' },
  { label: 'ML/AI', value: 10, color: '#8b5cf6' },
  { label: 'Design', value: 8, color: '#ec4899' },
];

const months = [
  '2025-01',
  '2025-02',
  '2025-03',
  '2025-04',
  '2025-05',
  '2025-06',
  '2025-07',
  '2025-08',
  '2025-09',
  '2025-10',
  '2025-11',
  '2025-12',
];

export const lineChartData: GenericTimeSeriesStep[] = months.map((m, i) => ({
  timestamp: `${m}-15`,
  values: {
    TypeScript: 60 + Math.round(Math.sin(i * 0.5) * 20 + i * 2),
    Python: 40 + Math.round(Math.cos(i * 0.4) * 15 + i * 1.5),
    Go: 20 + Math.round(Math.sin(i * 0.3) * 10 + i),
  },
}));

export const areaChartData: AreaChartPoint[] = Array.from({ length: 20 }, (_, i) => ({
  id: `pt-${i}`,
  name: `Point ${i}`,
  x: i * 5,
  y: 30 + Math.round(Math.sin(i * 0.6) * 25 + i * 1.2),
}));

export const scatterPlotData: ScatterPlotPoint[] = [
  { id: 's1', name: 'React', x: 95, y: 88, category: 'Frontend', r: 8 },
  { id: 's2', name: 'Vue', x: 80, y: 72, category: 'Frontend', r: 6 },
  { id: 's3', name: 'Angular', x: 70, y: 65, category: 'Frontend', r: 5 },
  { id: 's4', name: 'Svelte', x: 60, y: 85, category: 'Frontend', r: 4 },
  { id: 's5', name: 'Node.js', x: 90, y: 78, category: 'Backend', r: 7 },
  { id: 's6', name: 'Django', x: 75, y: 70, category: 'Backend', r: 6 },
  { id: 's7', name: 'FastAPI', x: 65, y: 90, category: 'Backend', r: 5 },
  { id: 's8', name: 'Express', x: 85, y: 60, category: 'Backend', r: 6 },
  { id: 's9', name: 'Docker', x: 88, y: 82, category: 'DevOps', r: 7 },
  { id: 's10', name: 'K8s', x: 72, y: 75, category: 'DevOps', r: 5 },
  { id: 's11', name: 'TensorFlow', x: 55, y: 68, category: 'ML', r: 6 },
  { id: 's12', name: 'PyTorch', x: 60, y: 80, category: 'ML', r: 7 },
  { id: 's13', name: 'LangChain', x: 45, y: 92, category: 'ML', r: 5 },
  { id: 's14', name: 'Next.js', x: 92, y: 86, category: 'Frontend', r: 7 },
  { id: 's15', name: 'Astro', x: 50, y: 94, category: 'Frontend', r: 4 },
];

export const barPlotData: GenericPoint[] = Array.from({ length: 30 }, (_, i) => ({
  id: `bp-${i}`,
  name: `Sample ${i}`,
  x: Math.round(Math.random() * 100),
  y: Math.round(Math.random() * 50 + 10),
}));

// ---------------------------------------------------------------------------
// Advanced Charts
// ---------------------------------------------------------------------------

export const heatmapData: GenericHeatmapCell[] = Array.from({ length: 90 }, (_, i) => {
  const d = new Date(2025, 0, 1);
  d.setDate(d.getDate() + i);
  return {
    date: d.toISOString().split('T')[0]!,
    value: Math.round(Math.random() * 10),
    category: i % 7 === 0 || i % 7 === 6 ? 'weekend' : 'weekday',
  };
});

export const streamGraphData: GenericTimeSeriesStep[] = months.map((m, i) => ({
  timestamp: `${m}-15`,
  values: {
    React: 30 + Math.round(Math.sin(i * 0.4) * 15),
    D3: 15 + Math.round(Math.cos(i * 0.5) * 8),
    Three: 10 + Math.round(Math.sin(i * 0.6) * 6),
    GSAP: 12 + Math.round(Math.cos(i * 0.3) * 7),
  },
}));

export const spiderChartData: SpiderChartData[] = [
  {
    name: 'Current',
    axes: [
      { axis: 'Frontend', value: 92 },
      { axis: 'Backend', value: 78 },
      { axis: 'DevOps', value: 65 },
      { axis: 'Design', value: 70 },
      { axis: 'ML/AI', value: 55 },
      { axis: 'Architecture', value: 82 },
    ],
  },
  {
    name: 'Target',
    axes: [
      { axis: 'Frontend', value: 95 },
      { axis: 'Backend', value: 88 },
      { axis: 'DevOps', value: 80 },
      { axis: 'Design', value: 75 },
      { axis: 'ML/AI', value: 78 },
      { axis: 'Architecture', value: 90 },
    ],
  },
];

export const treemapData: TreemapNode = {
  id: 'root',
  name: 'Portfolio',
  children: [
    {
      id: 'frontend',
      name: 'Frontend',
      children: [
        { id: 'react', name: 'React', value: 40 },
        { id: 'astro', name: 'Astro', value: 25 },
        { id: 'tailwind', name: 'Tailwind', value: 20 },
        { id: 'three', name: 'Three.js', value: 15 },
      ],
    },
    {
      id: 'backend',
      name: 'Backend',
      children: [
        { id: 'node', name: 'Node.js', value: 30 },
        { id: 'python', name: 'Python', value: 25 },
        { id: 'strapi', name: 'Strapi', value: 20 },
      ],
    },
    {
      id: 'infra',
      name: 'Infrastructure',
      children: [
        { id: 'docker', name: 'Docker', value: 20 },
        { id: 'vercel', name: 'Vercel', value: 15 },
        { id: 'railway', name: 'Railway', value: 10 },
      ],
    },
  ],
};

export const wordCloudData: WordCloudData[] = [
  { text: 'TypeScript', value: 95, category: 'lang' },
  { text: 'React', value: 90, category: 'framework' },
  { text: 'Next.js', value: 75, category: 'framework' },
  { text: 'Astro', value: 70, category: 'framework' },
  { text: 'Node.js', value: 80, category: 'runtime' },
  { text: 'Python', value: 72, category: 'lang' },
  { text: 'D3.js', value: 65, category: 'lib' },
  { text: 'Three.js', value: 60, category: 'lib' },
  { text: 'GSAP', value: 55, category: 'lib' },
  { text: 'Tailwind', value: 85, category: 'css' },
  { text: 'PostgreSQL', value: 68, category: 'db' },
  { text: 'Redis', value: 50, category: 'db' },
  { text: 'Docker', value: 62, category: 'devops' },
  { text: 'Vercel', value: 58, category: 'devops' },
  { text: 'ClickHouse', value: 45, category: 'db' },
  { text: 'LangChain', value: 55, category: 'ai' },
  { text: 'Storybook', value: 50, category: 'tool' },
  { text: 'Turborepo', value: 48, category: 'tool' },
  { text: 'Framer', value: 52, category: 'lib' },
  { text: 'Zod', value: 60, category: 'lib' },
  { text: 'Playwright', value: 42, category: 'tool' },
  { text: 'Vitest', value: 40, category: 'tool' },
  { text: 'GraphQL', value: 55, category: 'api' },
  { text: 'REST', value: 65, category: 'api' },
  { text: 'WebSocket', value: 38, category: 'api' },
];

// ---------------------------------------------------------------------------
// Relational Charts
// ---------------------------------------------------------------------------

export const networkData: GenericNetworkData = {
  nodes: [
    { id: 'react', name: 'React', group: 'frontend' },
    { id: 'next', name: 'Next.js', group: 'frontend' },
    { id: 'astro', name: 'Astro', group: 'frontend' },
    { id: 'node', name: 'Node.js', group: 'backend' },
    { id: 'strapi', name: 'Strapi', group: 'backend' },
    { id: 'postgres', name: 'PostgreSQL', group: 'data' },
    { id: 'redis', name: 'Redis', group: 'data' },
    { id: 'vercel', name: 'Vercel', group: 'infra' },
  ],
  links: [
    { source: 'react', target: 'next', value: 5 },
    { source: 'react', target: 'astro', value: 3 },
    { source: 'next', target: 'node', value: 4 },
    { source: 'next', target: 'vercel', value: 3 },
    { source: 'astro', target: 'vercel', value: 2 },
    { source: 'node', target: 'strapi', value: 4 },
    { source: 'strapi', target: 'postgres', value: 5 },
    { source: 'node', target: 'postgres', value: 3 },
    { source: 'node', target: 'redis', value: 2 },
    { source: 'strapi', target: 'redis', value: 2 },
  ],
};

export const sankeyData: GenericNetworkData = {
  nodes: [
    { id: 'user', name: 'User Request', type: 'input' },
    { id: 'cdn', name: 'CDN Edge', type: 'network' },
    { id: 'ssr', name: 'SSR Runtime', type: 'compute' },
    { id: 'api', name: 'API Gateway', type: 'compute' },
    { id: 'db', name: 'Database', type: 'storage' },
    { id: 'cache', name: 'Cache Layer', type: 'storage' },
  ],
  links: [
    { source: 'user', target: 'cdn', value: 100 },
    { source: 'cdn', target: 'ssr', value: 60 },
    { source: 'cdn', target: 'cache', value: 40 },
    { source: 'ssr', target: 'api', value: 45 },
    { source: 'ssr', target: 'cache', value: 15 },
    { source: 'api', target: 'db', value: 30 },
    { source: 'api', target: 'cache', value: 15 },
  ],
};

export const dendrogramData: DendrogramNode = {
  id: 'skills',
  name: 'Skills',
  children: [
    {
      id: 'web',
      name: 'Web',
      children: [
        { id: 'react', name: 'React' },
        { id: 'astro', name: 'Astro' },
        { id: 'nextjs', name: 'Next.js' },
      ],
    },
    {
      id: 'data',
      name: 'Data',
      children: [
        { id: 'sql', name: 'SQL' },
        { id: 'd3', name: 'D3.js' },
        { id: 'clickhouse', name: 'ClickHouse' },
      ],
    },
    {
      id: 'devops',
      name: 'DevOps',
      children: [
        { id: 'docker', name: 'Docker' },
        { id: 'ci', name: 'CI/CD' },
      ],
    },
  ],
};

export const circularPackingData: CircularPackingNode = {
  id: 'root',
  name: 'Tech Stack',
  children: [
    {
      id: 'frontend',
      name: 'Frontend',
      group: 'frontend',
      children: [
        { id: 'react', name: 'React', value: 40, group: 'frontend' },
        { id: 'astro', name: 'Astro', value: 25, group: 'frontend' },
        { id: 'tailwind', name: 'Tailwind', value: 30, group: 'frontend' },
      ],
    },
    {
      id: 'backend',
      name: 'Backend',
      group: 'backend',
      children: [
        { id: 'node', name: 'Node.js', value: 35, group: 'backend' },
        { id: 'python', name: 'Python', value: 20, group: 'backend' },
      ],
    },
    {
      id: 'ai',
      name: 'AI/ML',
      group: 'ai',
      children: [
        { id: 'langchain', name: 'LangChain', value: 18, group: 'ai' },
        { id: 'pytorch', name: 'PyTorch', value: 15, group: 'ai' },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Specialized Charts
// ---------------------------------------------------------------------------

export const timelineData: TimelineEvent[] = [
  { id: 'e1', name: 'Started Web Development', date: '2018-06-01', type: 'career' },
  { id: 'e2', name: 'First React Project', date: '2019-03-15', type: 'milestone' },
  {
    id: 'e3',
    name: 'Full-Stack Engineer',
    date: '2020-01-10',
    endDate: '2022-06-30',
    type: 'career',
  },
  { id: 'e4', name: 'Open Source Contribution', date: '2021-08-20', type: 'milestone' },
  { id: 'e5', name: 'Senior Developer', date: '2022-07-01', endDate: '2024-12-31', type: 'career' },
  { id: 'e6', name: 'Portfolio Monorepo', date: '2025-01-01', type: 'project' },
];

export const paretoData: ParetoData = {
  points: [
    { id: 'p1', name: 'React', x: 95, y: 88 },
    { id: 'p2', name: 'Vue', x: 80, y: 72 },
    { id: 'p3', name: 'Angular', x: 70, y: 65 },
    { id: 'p4', name: 'Svelte', x: 60, y: 85 },
    { id: 'p5', name: 'Solid', x: 40, y: 90 },
    { id: 'p6', name: 'Astro', x: 50, y: 94 },
    { id: 'p7', name: 'Next.js', x: 92, y: 86 },
    { id: 'p8', name: 'Remix', x: 55, y: 78 },
    { id: 'p9', name: 'Qwik', x: 35, y: 92 },
    { id: 'p10', name: 'Ember', x: 75, y: 55 },
    { id: 'p11', name: 'Preact', x: 45, y: 82 },
    { id: 'p12', name: 'Lit', x: 30, y: 70 },
  ],
  xAxisLabel: 'Community Adoption (%)',
  yAxisLabel: 'Developer Satisfaction (%)',
};

/**
 * Choropleth data — IDs use ISO 3166-1 numeric codes to match
 * world-atlas v2 TopoJSON feature IDs (e.g., "840" = USA).
 */
export const choroplethData: MapRegion[] = [
  { id: '840', name: 'United States', value: 245 },
  { id: '124', name: 'Canada', value: 180 },
  { id: '826', name: 'United Kingdom', value: 120 },
  { id: '276', name: 'Germany', value: 95 },
  { id: '392', name: 'Japan', value: 88 },
  { id: '036', name: 'Australia', value: 65 },
  { id: '356', name: 'India', value: 110 },
  { id: '076', name: 'Brazil', value: 72 },
  { id: '250', name: 'France', value: 85 },
  { id: '410', name: 'South Korea', value: 60 },
];

// ---------------------------------------------------------------------------
// Intelligence
// ---------------------------------------------------------------------------

export const neuralSteps = [
  { action: 'analyze_intent', reward: 0.8, observation: 'User intent classified' },
  { action: 'expert_dispatcher', reward: 0.6, observation: 'Routed to specialist' },
  { action: 'retrieve_knowledge', reward: 0.9, observation: 'RAG context fetched' },
  { action: 'generate_response', reward: 0.7, observation: 'Response drafted' },
  { action: 'validate_response', reward: 0.85, observation: 'Truth verified' },
];

export const neuralStepsFailed = [
  { action: 'analyze_intent', reward: 0.8, observation: 'User intent classified' },
  { action: 'expert_dispatcher', reward: 0.6, observation: 'Routed to specialist' },
  { action: 'retrieve_knowledge', reward: -0.4, observation: 'Knowledge retrieval failed' },
  { action: 'generate_response', reward: -0.8, observation: 'Hallucination detected' },
  { action: 'validate_response', reward: -0.9, observation: 'Validation rejected' },
];
