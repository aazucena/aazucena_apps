/**
 * StatCard Component
 * Display statistic with large value and label
 * Used in AboutSection to showcase achievements/metrics
 */

import type { JSX } from "react";
import { toTitleCase } from "@aazucena/utils";
import { GlassCard } from "../common/GlassCard";

export interface StatCardProps {
  /** Large numeric/text value to display */
  value: string;
  /** Descriptive label for the stat */
  label: string;
}

/**
 * StatCard
 *
 * Displays a key metric in a glass-morphism card:
 * - Large, bold value in cyan accent
 * - Small label in gray
 * - Backdrop blur effect (via GlassCard)
 *
 * @example
 * ```tsx
 * <StatCard value="5+" label="Years Experience" />
 * <StatCard value="50+" label="Projects Delivered" />
 * ```
 */
export function StatCard({ value, label }: StatCardProps): JSX.Element {
  return (
    <GlassCard padding="none" className="p-3 md:p-4">
      <div className="mb-1 text-xl font-bold text-cyan-400 md:mb-2 md:text-2xl">
        {value}
      </div>
      <div className="text-xs text-gray-400 md:text-sm">
        {toTitleCase(label)}
      </div>
    </GlassCard>
  );
}
