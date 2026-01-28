'use client';

import React, { useEffect, useState } from 'react';
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineLine,
} from '@/components/ui/timeline';
import {
  Eye,
  Music,
  MousePointer as Mouse,
  Envelope,
  DangerTriangle,
  ChevronRight,
  Globe
} from '@mynaui/icons-react';
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

const EVENT_CONFIG: Record<string, { icon: any; color: string; dot: "primary" | "success" | "warning" | "danger" | "default" }> = {
  'Page View': { icon: Eye, color: 'text-cyan-400', dot: 'primary' },
  'Music Play': { icon: Music, color: 'text-purple-400', dot: 'default' },
  'Interaction': { icon: Mouse, color: 'text-primary-400', dot: 'success' },
  'Form Submit': { icon: Envelope, color: 'text-orange-400', dot: 'warning' },
  'Error': { icon: DangerTriangle, color: 'text-rose-400', dot: 'danger' },
};

export function TelemetryFeed({ logs, filter = '', scrollable = true }: TelemetryFeedProps) {
  const [showAll, setShowAll] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredLogs = logs.filter(log =>
    log.event.toLowerCase().includes(filter.toLowerCase()) ||
    log.sessionId.toLowerCase().includes(filter.toLowerCase())
  );

  // If not scrollable (full page), always show all logs
  const displayedLogs = (showAll || !scrollable) ? filteredLogs : filteredLogs.slice(0, 10);

  return (
    <div className={cn("relative", !scrollable && "h-full")}>
      {showAll && scrollable && (
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
      )}

      <div className={cn(
        scrollable && "overflow-y-auto transition-all duration-500 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800",
        scrollable && (showAll ? "max-h-[800px]" : "max-h-[500px]"),
          !scrollable && "pb-8",
      )}>
        <Timeline className={cn(
          "px-2",
        )}>
          {displayedLogs.map((log, index) => {
            const config = EVENT_CONFIG[log.event] || { icon: Globe, color: 'text-zinc-400', dot: 'default' };
            const Icon = config.icon;
            const timestamp = mounted ? new Date(log.timestamp).toLocaleTimeString([], { hour12: false }) : '--:--:--';
            
            return (
              <TimelineItem key={`${log.id}-${index}`}>
                <TimelineDot variant={config.dot} />
                {index < displayedLogs.length - 1 && <TimelineLine />}

                <TimelineContent>
                  <div
                    className="group bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-4 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 shadow-sm dark:shadow-inner group-hover:scale-110 transition-transform",
                        config.color
                      )}>
                        <Icon size={20} />
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate uppercase tracking-tight">
                            {log.event}
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-500 whitespace-nowrap">
                            {timestamp}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                            {log.url}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">
                              {log.sessionId.split('_')[1] || log.sessionId}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors">
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

      {scrollable && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[10px] font-bold tracking-widest text-zinc-500 hover:text-primary-500 uppercase flex items-center gap-2 transition-colors border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-2 hover:bg-zinc-50 dark:hover:bg-primary-500/5 hover:border-zinc-300 dark:hover:border-primary-500/20"
          >
            {showAll ? 'Collapse System Logs' : `Expand Stream (${filteredLogs.length} events)`}
          </button>
        </div>
      )}
      
      {selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}