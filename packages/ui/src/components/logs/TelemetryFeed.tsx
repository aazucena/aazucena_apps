/**
 * TelemetryFeed Component
 * Real-time timeline of system events and interactions.
 */

import React, { useEffect, useState } from 'react';
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineLine,
} from '../ui/timeline.js';
import { Globe, ChevronRight } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { LogDetailModal } from './LogDetailModal.js';
import type { LogEntry } from './types.js';
import { TELEMETRY_EVENT_METADATA } from '@aazucena/constants';
import { IconRenderer } from '../blocks/IconRenderer.js';

interface TelemetryFeedProps {
  logs: LogEntry[];
  filter?: string;
  scrollable?: boolean;
  className?: string;
}

export function TelemetryFeed({
  logs,
  filter = '',
  scrollable = true,
  className,
}: TelemetryFeedProps) {
  const [showAll, setShowAll] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.event.toLowerCase().includes(filter.toLowerCase()) ||
      log.sessionId.toLowerCase().includes(filter.toLowerCase()),
  );

  // If not scrollable (full page), always show all logs
  const displayedLogs = showAll || !scrollable ? filteredLogs : filteredLogs.slice(0, 10);

  return (
    <div className={cn('relative', !scrollable && 'h-full', className)}>
      {showAll && scrollable && (
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-12 bg-gradient-to-b from-white to-transparent dark:from-zinc-950" />
      )}

      <div
        className={cn(
          scrollable &&
            'scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 overflow-y-auto transition-all duration-500',
          scrollable && (showAll ? 'max-h-[800px]' : 'max-h-[500px]'),
          !scrollable && 'pb-8',
        )}
      >
        <Timeline className={cn('px-2')}>
          {displayedLogs.map((log, index) => {
            const config = TELEMETRY_EVENT_METADATA[log.event] || {
              iconId: 'Globe',
              colorClass: 'text-zinc-400',
              dotVariant: 'default',
            };

            const timestamp = mounted
              ? new Date(log.timestamp).toLocaleTimeString([], {
                  hour12: false,
                })
              : '--:--:--';

            return (
              <TimelineItem key={`${log.id}-${index}`}>
                <TimelineDot variant={config.dotVariant as any} />
                {index < displayedLogs.length - 1 && <TimelineLine />}

                <TimelineContent>
                  <div
                    className="group cursor-pointer rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-left transition-all duration-300 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800/50 dark:bg-zinc-900/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50"
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm transition-transform group-hover:scale-110 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-inner',
                          config.colorClass,
                        )}
                      >
                        <IconRenderer icon={config.iconId} size={20} />
                      </div>

                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="truncate text-sm font-bold tracking-tight text-zinc-900 uppercase dark:text-zinc-100">
                            {log.event}
                          </h4>
                          <span className="font-mono text-[10px] whitespace-nowrap text-zinc-500">
                            {timestamp}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-3">
                          <span className="truncate font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                            {log.url}
                          </span>
                          <div className="flex shrink-0 items-center gap-1">
                            <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                            <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600">
                              {log.sessionId.split('_')[1] || log.sessionId}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-zinc-300 transition-colors group-hover:text-zinc-500 dark:text-zinc-700 dark:group-hover:text-zinc-400">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </div>

      {scrollable && filteredLogs.length > 10 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="hover:text-primary-500 dark:hover:bg-primary-500/5 dark:hover:border-primary-500/20 flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800"
          >
            {showAll ? 'Collapse System Logs' : `Expand Stream (${filteredLogs.length} events)`}
          </button>
        </div>
      )}

      {selectedLog && <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  );
}
