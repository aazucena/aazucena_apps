'use client';

import React, { useSyncExternalStore, useState } from 'react';
import { Button } from '@aazucena/ui';
import { cn } from '@/lib/utils';
import { LogDetailModal } from './LogDetailModal';

export interface LogEntry {
  id: string;
  event: string;
  timestamp: string;
  url: string;
  sessionId: string;
  country?: string;
  data?: Record<string, any>;
}

interface TelemetryFeedProps {
  logs: LogEntry[];
  filter?: string;
  scrollable?: boolean;
}

/** Status grammar: ● info, OK success, ◆ warning, ▲ alert. */
const EVENT_CONFIG: Record<string, { marker: string; tone: string; text: string }> = {
  'Page View': { marker: '●', tone: 'text-signal', text: 'text-foreground' },
  'Music Play': { marker: '●', tone: 'text-signal', text: 'text-foreground' },
  Interaction: { marker: '●', tone: 'text-success', text: 'text-foreground' },
  'Form Submit': { marker: '◆', tone: 'text-warning', text: 'text-foreground' },
  Error: { marker: '▲', tone: 'text-alert', text: 'text-alert' },
};
const DEFAULT_EVENT = { marker: '●', tone: 'text-muted-foreground', text: 'text-foreground' };

export function TelemetryFeed({ logs, filter = '', scrollable = true }: TelemetryFeedProps) {
  const [showAll, setShowAll] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const filteredLogs = logs.filter(
    (log) =>
      log.event.toLowerCase().includes(filter.toLowerCase()) ||
      log.sessionId.toLowerCase().includes(filter.toLowerCase()),
  );

  // If not scrollable (full page), always show all logs
  const displayedLogs = showAll || !scrollable ? filteredLogs : filteredLogs.slice(0, 10);

  return (
    <div className={cn('relative', !scrollable && 'h-full')}>
      <div
        className={cn(
          scrollable && 'overflow-y-auto',
          scrollable && (showAll ? 'max-h-[800px]' : 'max-h-[500px]'),
        )}
      >
        {displayedLogs.length === 0 && (
          <p className="micro-label py-6 text-muted-foreground">NO_EVENTS_IN_BUFFER</p>
        )}
        <ul className="divide-y divide-rule">
          {displayedLogs.map((log, index) => {
            const config = EVENT_CONFIG[log.event] ?? DEFAULT_EVENT;
            const timestamp = mounted
              ? new Date(log.timestamp).toLocaleTimeString([], { hour12: false })
              : '--:--:--';

            return (
              <li key={`${log.id}-${index}`}>
                <button
                  type="button"
                  className="grid w-full grid-cols-[4.5rem_1rem_minmax(0,8rem)_minmax(0,1fr)_auto] items-center gap-3 py-2.5 text-left font-mono text-xs hover:bg-state focus-visible:outline-1 focus-visible:outline-solid focus-visible:outline-signal"
                  onClick={() => setSelectedLog(log)}
                >
                  <span className="text-muted-foreground tabular-nums">{timestamp}</span>
                  <span aria-hidden className={config.tone}>
                    {config.marker}
                  </span>
                  <span className="micro-label truncate">{log.event}</span>
                  <span className={cn('truncate', config.text)}>{log.url}</span>
                  <span className="text-muted-foreground">
                    {log.sessionId.split('_')[1] || log.sessionId}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {scrollable && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Collapse System Logs' : `Expand Stream (${filteredLogs.length} events)`}
          </Button>
        </div>
      )}

      {selectedLog && <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  );
}
