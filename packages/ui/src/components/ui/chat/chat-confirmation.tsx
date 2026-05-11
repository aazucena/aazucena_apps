'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Button } from '../button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../dialog'; // Assuming Dialog components are available
import { DangerCircle } from '@aazucena/icons';

const chatConfirmationVariants = cva('rounded-md border p-4 transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-background border-input',
      glass: 'glass border-input/20',
      cyber:
        'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] text-cyan-400',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface ChatConfirmationProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatConfirmationVariants> {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  title?: string;
  open?: boolean; // For controlled component usage, e.g., in a Dialog
  onOpenChange?: (open: boolean) => void;
  asModal?: boolean; // Render as a Dialog modal if true
}

const ChatConfirmation = React.forwardRef<HTMLDivElement, ChatConfirmationProps>(
  (
    {
      className,
      variant,
      message,
      onConfirm,
      onCancel,
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      title = 'Confirm Action',
      open,
      onOpenChange,
      asModal = false,
      ...props
    },
    ref,
  ) => {
    const handleConfirm = () => {
      onConfirm();
      onOpenChange?.(false);
    };

    const handleCancel = () => {
      onCancel();
      onOpenChange?.(false);
    };

    const content = (
      <div ref={ref} className={cn(chatConfirmationVariants({ variant }), className)} {...props}>
        <div className="mb-4 flex items-center gap-3">
          <DangerCircle className="h-6 w-6 text-orange-500" />
          <h4 className="text-lg font-semibold">{title}</h4>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            {cancelLabel}
          </Button>
          <Button onClick={handleConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    );

    if (asModal) {
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DangerCircle className="h-6 w-6 text-orange-500" /> {title}
              </DialogTitle>
              <DialogDescription>{message}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                {cancelLabel}
              </Button>
              <Button onClick={handleConfirm}>{confirmLabel}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    return content;
  },
);
ChatConfirmation.displayName = 'ChatConfirmation';

export { ChatConfirmation, chatConfirmationVariants };
