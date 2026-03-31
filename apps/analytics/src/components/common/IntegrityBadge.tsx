'use client';

import React from 'react';
import { Shield } from '@aazucena/icons';
import { Badge } from '@aazucena/ui/components/ui/badge';
import { useSystemStatus } from '@aazucena/hooks';
import { cn } from '@/lib/utils';

interface IntegrityBadgeProps {
  className?: string;
  showLabel?: boolean;
}

const statusToVariant = {
  OPERATIONAL: 'emerald',
  DEGRADED: 'rose',
  UNKNOWN: 'secondary',
  LOADING: 'sky',
} as const;

const statusToLabel = {
  OPERATIONAL: 'Nominal',
  DEGRADED: 'Issues Detected',
  UNKNOWN: 'Issues Detected',
  LOADING: 'Checking...',
} as const;

export function IntegrityBadge({ className, showLabel = true }: IntegrityBadgeProps) {
  const { status } = useSystemStatus();

  return (
    <a
      href="/status"
      target="_blank"
      rel="noopener noreferrer"
      className={cn('transition-all hover:scale-105 active:scale-95', className)}
    >
      <Badge
        variant={statusToVariant[status as keyof typeof statusToVariant] ?? 'secondary'}
        animated={status === 'OPERATIONAL' || status === 'LOADING'}
        className="font-black tracking-widest rounded-full px-4 py-2"
      >
        <Shield size={12} />
        {showLabel && (
          <span className="ml-1">
            System: {statusToLabel[status as keyof typeof statusToLabel] ?? 'Unknown'}
          </span>
        )}
      </Badge>
    </a>
  );
}
