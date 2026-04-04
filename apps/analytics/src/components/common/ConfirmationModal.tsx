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
    iconBg: 'bg-rose-500/10 border-rose-500/20',
    iconColor: 'text-rose-500',
    badge: 'text-rose-500',
    separator: 'bg-rose-500/30',
    badgeLabel: 'IRREVERSIBLE_OPERATION',
  },
  warning: {
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    iconColor: 'text-amber-500',
    badge: 'text-amber-500',
    separator: 'bg-amber-500/30',
    badgeLabel: 'CAUTION_REQUIRED',
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
      <DialogContent variant="default" size="sm" className="rounded-3xl p-0 overflow-hidden">
        {/* Header band */}
        <div className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl border flex items-center justify-center shrink-0',
                  styles.iconBg,
                  styles.iconColor,
                )}
              >
                <Icon size={20} />
              </div>
              <div className="text-left">
                <DialogTitle className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter leading-tight">
                  {title}
                </DialogTitle>
                {commandLabel && (
                  <DialogDescription className="text-[10px] font-mono text-zinc-500 mt-0.5">
                    {commandLabel}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {description}
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={cn('mt-4 h-px origin-left', styles.separator)}
          />
          <p
            className={cn(
              'mt-2 text-[9px] font-black font-mono uppercase tracking-[0.25em]',
              styles.badge,
            )}
          >
            {styles.badgeLabel}
          </p>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 flex gap-2">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="flex-1 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]"
            >
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="flex-1 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] active:scale-95"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
