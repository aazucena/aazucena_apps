/**
 * StatCard Component
 * Display statistic with large value and label
 * Used in AboutSection to showcase achievements/metrics
 */

import type { JSX } from 'react';
import { toTitleCase } from '~/lib/utils/text';
import { GlassCard } from '../common/GlassCard';

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
export function StatCard({
  value,
  label,
}: StatCardProps): JSX.Element {
  return (
    <GlassCard padding="md">
      <div className="text-3xl font-bold text-cyan-400 mb-2">
        {value}
      </div>
      <div className="text-sm text-gray-400">
        {toTitleCase(label)}
      </div>
    </GlassCard>
  );
}
