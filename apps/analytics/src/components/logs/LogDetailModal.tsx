'use client';

import React from 'react';
import { LogEntry } from './TelemetryFeed';
import { Copy, Terminal } from '@aazucena/icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@aazucena/ui/components/ui/dialog';

interface LogDetailModalProps {
  log: LogEntry;
  onClose: () => void;
}

export function LogDetailModal({ log, onClose }: LogDetailModalProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent variant="default" size="lg" className="rounded-3xl">
        <DialogHeader className="text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500">
              <Terminal size={20} />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold uppercase tracking-tight">
                {log.event}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                ID: {log.id}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto space-y-6 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800/50">
              <span className="block text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1 font-mono">
                Timestamp
              </span>
              <span className="text-xs font-mono text-zinc-700 dark:text-zinc-300">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800/50">
              <span className="block text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1 font-mono">
                Session ID
              </span>
              <span className="text-xs font-mono text-zinc-700 dark:text-zinc-300">
                {log.sessionId}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1 font-mono">
                Raw Payload
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(log.data, null, 2))}
                className="text-[10px] font-bold text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-400 flex items-center gap-1 transition-colors px-2 py-1 rounded bg-primary-500/5 border border-primary-500/10"
              >
                <Copy size={12} /> COPY_RAW
              </button>
            </div>
            <pre className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-[11px] font-mono text-primary-500/90 overflow-x-auto leading-relaxed shadow-inner">
              {JSON.stringify(log.data || {}, null, 2)}
            </pre>
          </div>
        </div>

        <DialogFooter>
          <DialogClose
            onClick={onClose}
            className="px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-800 dark:hover:bg-white transition-all shadow-lg active:scale-95"
          >
            Close_Detail_View
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
