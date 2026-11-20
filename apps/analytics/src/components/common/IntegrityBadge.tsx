'use client';

import React from 'react';
import { Shield } from '@aazucena/icons';
import { Badge } from '@aazucena/ui/components/ui/badge';
import { useSystemStatus } from '@aazucena/hooks/telemetry';
import { cn } from '@/lib/utils';

interface IntegrityBadgeProps {
  className?: string;
  showLabel?: boolean;
}

const statusToVariant = {
  OPERATIONAL: 'success',
  DEGRADED: 'warning',
  UNKNOWN: 'secondary',
  LOADING: 'cyber',
} as const;

const statusToLabel = {
  OPERATIONAL: 'Nominal',
  DEGRADED: '◆ Issues Detected',
  UNKNOWN: 'Unknown',
  LOADING: 'Checking...',
} as const;

export function IntegrityBadge({ className, showLabel = true }: IntegrityBadgeProps) {
  const { status } = useSystemStatus();

  return (
    <a href="/status" target="_blank" rel="noopener noreferrer" className={cn('block', className)}>
      <Badge
        variant={statusToVariant[status as keyof typeof statusToVariant] ?? 'secondary'}
        animated={status === 'OPERATIONAL' || status === 'LOADING'}
        size="xs"
        className="h-[34px] w-full justify-center rounded-control px-2 whitespace-nowrap"
      >
        <Shield size={12} />
        {showLabel && (
          <span>System: {statusToLabel[status as keyof typeof statusToLabel] ?? 'Unknown'}</span>
        )}
      </Badge>
    </a>
  );
}
