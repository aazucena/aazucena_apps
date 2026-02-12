/**
 * Generic Visualization Types
 * Framework-agnostic interfaces for data-driven components.
 */

export interface BaseNode {
  id: string;
  name: string;
  type?: string;
  category?: string;
  group?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface BaseLink<T = string | BaseNode> {
  source: T;
  target: T;
  value: number;
  type?: string;
  metadata?: Record<string, unknown>;
}

export interface GenericNetworkData<
  TNode extends BaseNode = BaseNode,
  TLink extends BaseLink<string> = BaseLink<string>,
> {
  nodes: TNode[];
  links: TLink[];
}

export interface GenericHeatmapCell {
  date: string | Date;
  value: number;
  category?: string;
  metadata?: Record<string, unknown>;
}

export interface GenericTimeSeriesStep {
  timestamp: string | Date;
  values: Record<string, number>;
  metadata?: Record<string, unknown>;
}

export interface SpiderChartAxis {
  axis: string;
  value: number;
}

export interface SpiderChartData {
  name: string;
  axes: SpiderChartAxis[];
}

export interface GenericPoint extends BaseNode {
  x: number;
  y: number;
}

export interface ParetoData<T extends GenericPoint = GenericPoint> {
  points: T[];
  xAxisLabel: string;
  yAxisLabel: string;
}

export interface BarChartData {
  label: string;
  value: number;
  group?: string;
  metadata?: Record<string, unknown>;
}

export interface PieChartData {
  label: string;
  value: number;
  color?: string;
}

export interface TreemapNode extends BaseNode {
  children?: TreemapNode[];
}

export interface WordCloudData {
  text: string;
  value: number;
  category?: string;
  metadata?: Record<string, unknown>;
}

export interface DendrogramNode extends BaseNode {
  children?: DendrogramNode[];
}

export interface CircularPackingNode extends BaseNode {
  children?: CircularPackingNode[];
  value?: number;
}

export interface ScatterPlotPoint extends GenericPoint {
  category?: string;
  r?: number; // Radius/Size
}

export interface MapRegion {
  id: string; // ISO Code
  name: string;
  value: number;
  metadata?: Record<string, unknown>;
}

export interface AreaChartPoint extends GenericPoint {
  category?: string;
}
