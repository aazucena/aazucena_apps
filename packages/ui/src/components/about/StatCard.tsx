/**
 * StatCard Component
 * Display statistic with large value and label
 */

import type { JSX } from 'react';
import { toTitleCase } from '@aazucena/utils';
import { GlassCard } from '../common/GlassCard.js';
import { cn } from '@aazucena/utils';

export interface StatCardProps {
  /** Large numeric/text value to display */
  value: string;
  /** Descriptive label for the stat */
  label: string;
  /** Additional className */
  className?: string;
}

/**
 * StatCard
 *
 * Displays a key metric in a glass-morphism card
 */
export function StatCard({ value, label, className }: StatCardProps): JSX.Element {
  return (
    <GlassCard padding="md" className={cn(className)}>
      <div className="mb-2 text-3xl font-bold text-cyan-400">{value}</div>
      <div className="text-sm text-gray-400">{toTitleCase(label)}</div>
    </GlassCard>
  );
}
