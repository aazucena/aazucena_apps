/**
 * Journey Dashboard — DEBUG: wrapper-file lazy imports only, return null
 * Tests if error is in the wrapper-file lazy() calls specifically
 */
import { lazy } from "react";

const SpiderChart = lazy(
  () => import("~/components/ui/journey/lazy/SpiderChart"),
);
const ForceDirectedGraph = lazy(
  () => import("~/components/ui/journey/lazy/ForceDirectedGraph"),
);
const StreamGraph = lazy(
  () => import("~/components/ui/journey/lazy/StreamGraph"),
);
const Heatmap = lazy(() => import("~/components/ui/journey/lazy/Heatmap"));
const SankeyWithSemantics = lazy(
  () => import("~/components/ui/journey/lazy/SankeyWithSemantics"),
);
const DetailsModal = lazy(
  () => import("~/components/ui/journey/lazy/DetailsModal"),
);

void SpiderChart, ForceDirectedGraph, StreamGraph, Heatmap, SankeyWithSemantics, DetailsModal;

export function JourneyDashboard(_props: Record<string, unknown>) {
  return null;
}
