/**
 * LogDetailModal Component
 * Full-screen modal for inspecting raw telemetry payloads.
 */

import React from 'react';
import type { LogEntry } from './types.js';
import { X, Copy, Terminal } from '@aazucena/icons';

interface LogDetailModalProps {
  log: LogEntry;
  onClose: () => void;
}

export function LogDetailModal({ log, onClose }: LogDetailModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="animate-in fade-in zoom-in relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl duration-300 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="bg-primary-500/10 border-primary-500/20 text-primary-500 flex h-10 w-10 items-center justify-center rounded-xl border">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-900 uppercase dark:text-zinc-100">
                {log.event}
              </h2>
              <p className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">ID: {log.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="custom-scrollbar space-y-6 overflow-y-auto p-6 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-950 dark:shadow-none">
              <span className="mb-1 block font-mono text-[10px] font-black tracking-widest text-zinc-400 uppercase dark:text-zinc-600">
                Timestamp
              </span>
              <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-950 dark:shadow-none">
              <span className="mb-1 block font-mono text-[10px] font-black tracking-widest text-zinc-400 uppercase dark:text-zinc-600">
                Session ID
              </span>
              <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                {log.sessionId}
              </span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="ml-1 font-mono text-[10px] font-black tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
                Raw Payload
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(log.data, null, 2))}
                className="text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-400 bg-primary-500/5 border-primary-500/10 flex items-center gap-1 rounded border px-2 py-1 text-[10px] font-bold transition-colors"
              >
                <Copy size={12} /> COPY_RAW
              </button>
            </div>
            <pre className="text-primary-500/90 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-left font-mono text-[11px] leading-relaxed shadow-inner">
              {JSON.stringify(log.data || {}, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-900 px-6 py-2 text-[10px] font-bold tracking-[0.2em] text-white uppercase shadow-lg transition-all hover:bg-zinc-800 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Close_Detail_View
          </button>
        </div>
      </div>
    </div>
  );
}
