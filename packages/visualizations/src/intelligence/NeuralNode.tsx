/**
 * NeuralNode Component
 * Individual node in the AI cognitive flow visualization.
 * Standardized using CVA for variant management.
 */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Activity as Sparkles,
  Search,
  Message,
  Terminal,
  Database,
  Component,
  Globe,
  Activity,
  Calendar,
  Database as HardDrive,
  CreditCard,
  CheckCircle,
} from '@aazucena/icons';
import { cn } from '@aazucena/utils';

const nodeVariants = cva(
  'w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-colors shadow-xl',
  {
    variants: {
      state: {
        default:
          'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-300 dark:text-zinc-800',
        active: 'bg-primary-500/10 border-primary-500 shadow-primary-500/20',
        completed: 'bg-emerald-500/10 border-emerald-500',
        failed: 'bg-rose-500/10 border-rose-500 shadow-rose-500/20',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);

const labelVariants = cva(
  'text-[9px] font-black uppercase tracking-widest text-center max-w-[80px] leading-tight',
  {
    variants: {
      state: {
        default: 'text-zinc-500',
        active: 'text-primary-500',
        completed: 'text-zinc-500',
        failed: 'text-rose-500',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);

export interface NeuralNodeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof nodeVariants> {
  type: string;
  label: string;
  isActive?: boolean;
  isCompleted?: boolean;
  isFailed?: boolean;
}

export const NeuralNode = forwardRef<HTMLDivElement, NeuralNodeProps>(
  ({ type, label, isActive, isCompleted, isFailed, className, ...props }, ref) => {
    // Determine state for CVA
    const state = isFailed ? 'failed' : isActive ? 'active' : isCompleted ? 'completed' : 'default';

    const getIcon = () => {
      const t = type.toLowerCase();
      if (t.includes('intent')) return Component;
      if (t.includes('shades') || t.includes('librarian')) return Database;
      if (t.includes('insights') || t.includes('sage')) return Activity;
      if (t.includes('architect')) return Terminal;
      if (t.includes('chronicler') || t.includes('history')) return Calendar;
      if (t.includes('auditor') || t.includes('codebase')) return HardDrive;
      if (t.includes('fiscal') || t.includes('spend')) return CreditCard;
      if (t.includes('navigator') || t.includes('route') || t.includes('dispatcher')) return Globe;
      if (t.includes('retrieve') || t.includes('knowledge')) return Search;
      if (t.includes('generate') || t.includes('response')) return Message;
      if (t.includes('validate') || t.includes('check')) return CheckCircle;
      return Sparkles;
    };

    const Icon = getIcon();

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center gap-2 shrink-0', className)}
        {...props}
      >
        <motion.div
          animate={{
            scale: isActive ? 1.1 : 1,
            borderColor: isActive
              ? 'var(--primary-500)'
              : isFailed
                ? 'var(--color-rose-500)'
                : isCompleted
                  ? 'var(--color-emerald-500)'
                  : 'currentColor',
          }}
          className={cn(nodeVariants({ state }))}
        >
          <Icon
            size={20}
            className={cn(
              state === 'active' && 'text-primary-500',
              state === 'failed' && 'text-rose-500',
              state === 'completed' && 'text-emerald-500',
              state === 'default' && 'text-zinc-400 dark:text-zinc-600',
            )}
          />
        </motion.div>
        <span className={cn(labelVariants({ state }))}>{label.replace('_', ' ')}</span>
      </div>
    );
  },
);

NeuralNode.displayName = 'NeuralNode';
