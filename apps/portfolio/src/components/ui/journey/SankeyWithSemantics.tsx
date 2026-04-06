/**
 * SankeyWithSemantics
 *
 * Portfolio wrapper for the generic SankeyDiagram. Contains ID-prefix domain
 * knowledge that cannot live in the package:
 *   cat_*   → category node → distinct colour per category
 *   skill_* → skill node → inherits from its source cat_ link
 *   group_* → grouped skill node → same rule as skill_*
 *   exp_*   → experience entity → blue
 *   prj_*   → project entity → purple
 *   edu_*   → education entity → emerald
 *
 * Filtering subscribes to visibleCategoriesStore so the Toolbar works correctly.
 */

import { useMemo } from "react";
import * as d3 from "d3";
import { useStore } from "@nanostores/react";
import { SankeyDiagram } from "@aazucena/visualizations";
import { visibleCategoriesStore } from "~/store/journey";
import type { SankeyData } from "~/lib/transformers";

interface SankeyWithSemanticsProps {
  data: SankeyData;
  height?: number;
}

const ENTITY_COLORS = {
  exp: "#3b82f6",
  prj: "#a855f7",
  edu: "#10b981",
};

const ENTITY_LEGEND = [
  { label: "Experience", color: ENTITY_COLORS.exp },
  { label: "Projects", color: ENTITY_COLORS.prj },
  { label: "Education", color: ENTITY_COLORS.edu },
];

export function SankeyWithSemantics({
  data,
  height = 560,
}: SankeyWithSemanticsProps) {
  const visibleCategories = useStore(visibleCategoriesStore);

  // Build color map from node ids
  const colorMap = useMemo(() => {
    const categoryColor = d3.scaleOrdinal(d3.schemeTableau10);
    const map: Record<string, string> = {};

    for (const node of data.nodes) {
      if (node.id.startsWith("cat_")) {
        map[node.id] = categoryColor(node.name);
      } else if (node.id.startsWith("exp_")) {
        map[node.id] = ENTITY_COLORS.exp;
      } else if (node.id.startsWith("prj_")) {
        map[node.id] = ENTITY_COLORS.prj;
      } else if (node.id.startsWith("edu_")) {
        map[node.id] = ENTITY_COLORS.edu;
      }
      // skill_* and group_* inherit from the source cat_ link — no explicit entry needed
    }
    return map;
  }, [data.nodes]);

  // ID-prefix-aware filtering — the package's groupKey='type' approach doesn't work
  // because Sankey nodes have no `type` field; semantic type lives in the id prefix.
  const filteredData = useMemo(() => {
    if (!visibleCategories) return data;

    const visibleNodes = data.nodes.filter((node) => {
      if (node.id.startsWith("cat_")) {
        return visibleCategories.has(node.name);
      }
      if (node.id.startsWith("skill_") || node.id.startsWith("group_")) {
        // Keep if at least one incoming category link has a visible source
        const incomingLink = data.links.find(
          (l) => l.target === node.id && String(l.source).startsWith("cat_"),
        );
        if (incomingLink) {
          const catNode = data.nodes.find(
            (n) => n.id === String(incomingLink.source),
          );
          return catNode ? visibleCategories.has(catNode.name) : true;
        }
        return true;
      }
      // exp_*, prj_*, edu_* — always visible
      return true;
    });

    const nodeIds = new Set(visibleNodes.map((n) => n.id));
    return {
      nodes: visibleNodes,
      links: data.links.filter(
        (l) => nodeIds.has(String(l.source)) && nodeIds.has(String(l.target)),
      ),
    };
  }, [data, visibleCategories]);

  return (
    <SankeyDiagram
      data={filteredData as any}
      colorMap={colorMap}
      legend={ENTITY_LEGEND}
      hideHeader
      height={height}
    />
  );
}
