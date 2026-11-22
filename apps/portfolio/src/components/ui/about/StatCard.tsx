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
 * Displays a key metric in a panel:
 * - Large value in the signal tone
 * - Micro-caps label
 *  *
 * @example
 * ```tsx
 * <StatCard value="5+" label="Years Experience" />
 * <StatCard value="50+" label="Projects Delivered" />
 * ```
 */
export function StatCard({ value, label }: StatCardProps): JSX.Element {
  return (
    <GlassCard padding="none" className="short:md:p-2 p-3 md:p-4">
      <div className="text-signal mb-1 text-xl font-light md:mb-2 md:text-2xl">
        {value}
      </div>
      <div className="micro-label text-muted-foreground">
        {toTitleCase(label)}
      </div>
    </GlassCard>
  );
}
