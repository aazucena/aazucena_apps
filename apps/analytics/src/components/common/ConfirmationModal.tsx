'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DangerTriangle } from '@aazucena/icons';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@aazucena/ui/components/ui/dialog';
import { Button } from '@aazucena/ui/components/ui/button';

// --- Types ---

type ConfirmationVariant = 'danger' | 'warning';

const VARIANT_STYLES = {
  danger: {
    iconColor: 'text-alert border-alert',
    badge: 'text-alert',
    separator: 'bg-alert',
    badgeLabel: '▲ IRREVERSIBLE_OPERATION',
  },
  warning: {
    iconColor: 'text-warning border-warning',
    badge: 'text-warning',
    separator: 'bg-warning',
    badgeLabel: '◆ CAUTION_REQUIRED',
  },
} as const;

export interface ConfirmationModalOptions {
  title: string;
  description: string;
  /** Monospace sub-label shown beneath the title (e.g. "PURGE_THREAD_LOG") */
  commandLabel?: string;
  variant?: ConfirmationVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: React.ComponentType<{ size?: number }>;
  onConfirm: () => void;
}

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Null when closed — provider passes the active request here */
  options: ConfirmationModalOptions | null;
}

// --- Component ---

export function ConfirmationModal({ open, onOpenChange, options }: ConfirmationModalProps) {
  if (!options) return null;

  const {
    title,
    description,
    commandLabel,
    variant = 'danger',
    confirmLabel = 'Confirm',
    cancelLabel = 'Abort',
    icon,
    onConfirm,
  } = options;

  const styles = VARIANT_STYLES[variant];
  const Icon = icon ?? DangerTriangle;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="default" size="sm" className="overflow-hidden rounded-card p-0">
        {/* Header band */}
        <div className="border-b border-rule bg-panel">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-control border',
                  styles.iconColor,
                )}
              >
                <Icon size={20} />
              </div>
              <div className="text-left">
                <DialogTitle className="micro-label leading-tight text-foreground">
                  {title}
                </DialogTitle>
                {commandLabel && (
                  <DialogDescription className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {commandLabel}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={cn('mt-4 h-px origin-left', styles.separator)}
          />
          <p className={cn('micro-label mt-2', styles.badge)}>{styles.badgeLabel}</p>
        </div>

        {/* Footer */}
        <DialogFooter className="flex gap-2 p-4">
          <DialogClose asChild>
            <Button variant="ghost" className="flex-1">
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleConfirm} className="flex-1">
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
