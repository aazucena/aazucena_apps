import React from 'react';
import { Shield } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { useSystemStatus } from '@aazucena/hooks';
import { SYSTEM_STATUS_METADATA } from '@aazucena/constants';

export interface IntegrityBadgeProps {
  className?: string;
  showLabel?: boolean;
}

export function IntegrityBadge({ className, showLabel = true }: IntegrityBadgeProps) {
  const { status, baseUrl } = useSystemStatus();
  const metadata = SYSTEM_STATUS_METADATA[status];

  return (
    <a
      href={baseUrl ? `${baseUrl}/status` : '/status'}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-black tracking-[0.2em] uppercase transition-all hover:bg-white hover:shadow-lg active:scale-95 dark:hover:bg-gray-800',
        metadata.colorClass,
        className,
      )}
    >
      <Shield size={12} className={cn(status === 'OPERATIONAL' && 'animate-pulse')} />
      {showLabel && <span>{metadata.label}</span>}
    </a>
  );
}
