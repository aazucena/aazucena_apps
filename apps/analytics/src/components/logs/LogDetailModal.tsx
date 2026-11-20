'use client';

import React from 'react';
import { LogEntry } from './TelemetryFeed';
import { Copy, Terminal } from '@aazucena/icons';
import { Button } from '@aazucena/ui';
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
      <DialogContent variant="default" size="lg">
        <DialogHeader className="text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-control border border-rule text-signal">
              <Terminal size={20} />
            </div>
            <div>
              <DialogTitle className="micro-label text-base">{log.event}</DialogTitle>
              <DialogDescription className="font-mono text-[10px] text-muted-foreground">
                ID: {log.id}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-card border border-rule bg-panel p-3">
              <span className="micro-label mb-1 block text-muted-foreground">Timestamp</span>
              <span className="font-mono text-xs text-foreground">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="rounded-card border border-rule bg-panel p-3">
              <span className="micro-label mb-1 block text-muted-foreground">Session ID</span>
              <span className="font-mono text-xs text-foreground">{log.sessionId}</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="micro-label text-muted-foreground">Raw Payload</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(JSON.stringify(log.data, null, 2))}
              >
                <Copy size={12} /> COPY_RAW
              </Button>
            </div>
            <pre className="overflow-x-auto rounded-card border border-rule bg-background p-4 font-mono text-[11px] leading-relaxed text-foreground">
              {JSON.stringify(log.data || {}, null, 2)}
            </pre>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Close_Detail_View
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
