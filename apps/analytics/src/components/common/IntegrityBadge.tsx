'use client';

import React, { useEffect, useState } from 'react';
import { Shield } from '@mynaui/icons-react';
import { cn } from '@/lib/utils';

interface IntegrityBadgeProps {
  className?: string;
  showLabel?: boolean;
}

export function IntegrityBadge({ className, showLabel = true }: IntegrityBadgeProps) {
  const [status, setStatus] = useState<'OPERATIONAL' | 'DEGRADED' | 'UNKNOWN' | 'LOADING'>(
    'UNKNOWN',
  );

  useEffect(() => {
    fetch('/api/health/public')
      .then((res) => res.json())
      .then((json) => setStatus(json.system.overall))
      .catch(() => setStatus('UNKNOWN'));
  }, []);

  const colors = {
    OPERATIONAL: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    DEGRADED: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    UNKNOWN: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20',
    LOADING: 'text-primary-500 bg-primary-500/10 border-primary-500/20 animate-pulse',
  };

  return (
    <a
      href="/status"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95',
        colors[status],
        className,
      )}
    >
      <Shield size={12} className={cn(status === 'OPERATIONAL' && 'animate-pulse')} />
      {showLabel && (
        <span>
          System:{' '}
          {status === 'OPERATIONAL'
            ? 'Nominal'
            : status === 'LOADING'
              ? 'Checking...'
              : 'Issues Detected'}
        </span>
      )}
    </a>
  );
}
