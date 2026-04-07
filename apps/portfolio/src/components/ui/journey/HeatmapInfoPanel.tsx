/**
 * HeatmapInfoPanel
 *
 * Right-side info panel for the Heatmap on the Journey page.
 * Rendered via the `infoPanel` render prop — package owns the grid
 * layout; this component owns the content (category distribution bars +
 * default / hover states) with framer-motion animations.
 */

import * as d3 from "d3";
import { motion, AnimatePresence } from "framer-motion";
import type { GenericHeatmapCell } from "@aazucena/types";

interface HeatmapInfoPanelProps {
  cell: GenericHeatmapCell | null;
  years?: number[];
}

type RichCell = GenericHeatmapCell & {
  count?: number;
  categoryDistribution?: Record<string, number>;
};

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "bg-sky-500",
  Backend: "bg-emerald-500",
  "AI/ML": "bg-purple-500",
  DevOps: "bg-orange-500",
  Tools: "bg-slate-500",
  Design: "bg-pink-500",
  Mobile: "bg-indigo-500",
  Cloud: "bg-cyan-500",
  Data: "bg-amber-500",
  Security: "bg-rose-500",
  Testing: "bg-lime-500",
  Other: "bg-gray-500",
};

const getCategoryColor = (cat: string) => CATEGORY_COLORS[cat] ?? "bg-blue-500";

export function HeatmapInfoPanel({ cell, years }: HeatmapInfoPanelProps) {
  const richCell = cell as RichCell | null;
  const distribution = richCell?.categoryDistribution;
  // `count` is the portfolio-specific field; fall back to `value` for generic use
  const activeSkills = richCell?.count ?? richCell?.value ?? 0;
  const maxDistValue = distribution
    ? (d3.max(Object.values(distribution)) ?? 1)
    : 1;

  return (
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
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {d3.timeFormat("%B %Y")(new Date(richCell.date))}
            </div>
            <div className="mt-1 text-sm font-semibold text-blue-500">
              {activeSkills} Active Skills
            </div>
          </div>

          {/* Category distribution bars */}
          {distribution && (
            <div className="space-y-4">
              <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                Category Distribution
              </div>
              <div className="space-y-3">
                {Object.entries(distribution)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 6)
                  .map(([category, count]) => (
                    <div key={category} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                        <span className="truncate pr-2">{category}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(count / maxDistValue) * 100}%`,
                          }}
                          transition={{ duration: 0.4 }}
                          className={`${getCategoryColor(category)} h-full rounded-full`}
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
          <div className="mb-6 text-sm font-bold text-gray-900 dark:text-gray-100">
            Quick Insights
          </div>

          <div className="flex-1 space-y-4">
            <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              This heatmap visualises technical activity over time. Each cell
              represents a month.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                <div className="h-4 w-4 rounded border border-gray-200 bg-[#f3f4f6]" />
                <span>No skill activity</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex gap-0.5">
                  <div className="h-4 w-3 rounded-sm bg-blue-100" />
                  <div className="h-4 w-3 rounded-sm bg-blue-300" />
                  <div className="h-4 w-3 rounded-sm bg-blue-500" />
                  <div className="h-4 w-3 rounded-sm bg-blue-700" />
                </div>
                <span>Frequency scale</span>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-[10px] text-gray-400 italic">
                Tip: Hover over any blue square to see which technology
                categories dominated that specific month.
              </p>
            </div>
          </div>

          {years && years.length > 0 && (
            <div className="mt-auto border-t border-gray-100 pt-6 dark:border-gray-700">
              <div className="mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Timeline Range
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {years[0]} — {years[years.length - 1]}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
