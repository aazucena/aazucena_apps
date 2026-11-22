/**
 * HeatmapInfoPanel
 *
 * Right-side info panel for the Heatmap on the Journey page.
 * Rendered via the `infoPanel` render prop — package owns the grid
 * layout; this component owns the content (category distribution bars +
 * default / hover states) with framer-motion animations.
 */

import * as d3 from "d3";
import { categoricalScale, chartTheme } from "@aazucena/visualizations";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import type { GenericHeatmapCell } from "@aazucena/types";

interface HeatmapInfoPanelProps {
  cell: GenericHeatmapCell | null;
  years?: number[];
}

type RichCell = GenericHeatmapCell & {
  count?: number;
  categoryDistribution?: Record<string, number>;
};

// Category bars take the categorical series hues from the visualizations package (CSS vars)
const categoryScale = categoricalScale();
const getCategoryColor = (cat: string) => categoryScale(cat);

export function HeatmapInfoPanel({ cell, years }: HeatmapInfoPanelProps) {
  const richCell = cell as RichCell | null;
  const distribution = richCell?.categoryDistribution;
  // `count` is the portfolio-specific field; fall back to `value` for generic use
  const activeSkills = richCell?.count ?? richCell?.value ?? 0;
  const maxDistValue = distribution
    ? (d3.max(Object.values(distribution)) ?? 1)
    : 1;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        {richCell && activeSkills > 0 ? (
          <motion.div
            key="hover-details"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Date + count header */}
            <div>
              <div className="text-foreground text-lg font-semibold">
                {d3.timeFormat("%B %Y")(new Date(richCell.date))}
              </div>
              <div className="micro-label text-signal mt-1">
                ● {activeSkills} active skills
              </div>
            </div>

            {/* Category distribution bars */}
            {distribution && (
              <div className="space-y-4">
                <div className="micro-label text-muted-foreground">
                  Category Distribution
                </div>
                <div className="space-y-3">
                  {Object.entries(distribution)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 6)
                    .map(([category, count]) => (
                      <div key={category} className="space-y-1.5">
                        <div className="text-foreground flex justify-between font-mono text-xs">
                          <span className="truncate pr-2">{category}</span>
                          <span>{count}</span>
                        </div>
                        <div className="bg-state h-1.5 w-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(count / maxDistValue) * 100}%`,
                            }}
                            transition={{ duration: 0.4 }}
                            style={{
                              backgroundColor: getCategoryColor(category),
                            }}
                            className="h-full"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="default-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex h-full flex-col"
          >
            <div className="micro-label text-foreground mb-6">
              Quick Insights
            </div>

            <div className="flex-1 space-y-4">
              <p className="text-muted-foreground text-xs leading-relaxed">
                This heatmap visualises technical activity over time. Each cell
                represents a month.
              </p>

              <div className="space-y-3 pt-2">
                <div className="text-muted-foreground flex items-center gap-3 text-xs">
                  <div className="border-rule bg-state h-4 w-4 border" />
                  <span>No skill activity</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-3 text-xs">
                  <div className="flex gap-0.5" aria-hidden="true">
                    {chartTheme.seq.map((c) => (
                      <div
                        key={c}
                        className="h-4 w-3"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span>Frequency scale</span>
                </div>
              </div>

              <div className="pt-6">
                <p className="text-muted-foreground text-xs">
                  Tip: hover over any filled square to see which technology
                  categories dominated that specific month.
                </p>
              </div>
            </div>

            {years && years.length > 0 && (
              <div className="border-rule mt-auto border-t pt-6">
                <div className="micro-label text-muted-foreground mb-1">
                  Timeline Range
                </div>
                <div className="text-foreground font-mono text-sm">
                  {years[0]} — {years[years.length - 1]}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
