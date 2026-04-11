/**
 * Journey Dashboard Component — DEBUG SKELETON
 * All component code commented out to bisect esbuild parse error at 92:93
 * Only lazy imports remain to test if error is in lazy() boilerplate or component code
 */

import { lazy } from "react";

// Lazy imports kept to see if they cause the chunk error
const SpiderChart = lazy(() =>
  import("@aazucena/visualizations").then((m) => ({ default: m.SpiderChart })),
);
const ForceDirectedGraph = lazy(() =>
  import("@aazucena/visualizations").then((m) => ({
    default: m.ForceDirectedGraph,
  })),
);
const StreamGraph = lazy(() =>
  import("@aazucena/visualizations").then((m) => ({ default: m.StreamGraph })),
);
const Heatmap = lazy(() =>
  import("@aazucena/visualizations").then((m) => ({ default: m.Heatmap })),
);
const SankeyWithSemantics = lazy(() =>
  import("~/components/ui/journey/SankeyWithSemantics").then((m) => ({
    default: m.SankeyWithSemantics,
  })),
);
const DetailsModal = lazy(() =>
  import("~/components/ui/journey/DetailsModal").then((m) => ({
    default: m.DetailsModal,
  })),
);

// Suppress unused warnings during debug
void SpiderChart;
void ForceDirectedGraph;
void StreamGraph;
void Heatmap;
void SankeyWithSemantics;
void DetailsModal;

export function JourneyDashboard(_props: Record<string, unknown>) {
  return null;
}
