/**
 * HeatmapInfoPanel
 *
 * Right-side info panel for the Heatmap on the Journey page.
 * Rendered via the `infoPanel` render prop — package owns the 4-col grid
 * layout; this component owns the content (category distribution bars +
 * default / hover states).
 */

import type { GenericHeatmapCell } from "@aazucena/types";

interface HeatmapInfoPanelProps {
  cell: GenericHeatmapCell | null;
}

function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function HeatmapInfoPanel({ cell }: HeatmapInfoPanelProps) {
  const heatmapCell = cell as
    | (GenericHeatmapCell & { categoryDistribution?: Record<string, number> })
    | null;
  const distribution = heatmapCell?.categoryDistribution;

  if (!heatmapCell) {
    return (
      <div className="flex h-full flex-col justify-center gap-3 text-center">
        <div className="text-2xl">🗓️</div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          Hover a cell to see details
        </p>
        <div className="mt-4 space-y-1.5">
          {/* Placeholder legend bars */}
          {["Frontend", "Backend", "DevOps", "Other"].map((label) => (
            <div key={label} className="flex items-center gap-2">
              <div className="h-2 w-2 flex-none rounded-full bg-gray-200 dark:bg-gray-700" />
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalEvents = heatmapCell.value;
  const sortedCategories = distribution
    ? Object.entries(distribution).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto">
      {/* Date header */}
      <div>
        <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase dark:text-gray-500">
          {formatDate(heatmapCell.date)}
        </p>
        <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white">
          {totalEvents}
          <span className="ml-1 text-sm font-medium text-gray-400">
            event{totalEvents !== 1 ? "s" : ""}
          </span>
        </p>
        {heatmapCell.category && (
          <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
            {heatmapCell.category}
          </span>
        )}
      </div>

      {/* Category distribution bars */}
      {sortedCategories.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase dark:text-gray-500">
            By Category
          </p>
          {sortedCategories.map(([cat, count]) => {
            const pct = totalEvents > 0 ? (count / totalEvents) * 100 : 0;
            return (
              <div key={cat}>
                <div className="mb-0.5 flex justify-between">
                  <span className="truncate text-[10px] font-medium text-gray-600 dark:text-gray-300">
                    {cat}
                  </span>
                  <span className="ml-2 flex-none text-[10px] font-bold text-gray-500 dark:text-gray-400">
                    {count}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
