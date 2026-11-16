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
  'flex size-14 items-center justify-center rounded-[var(--radius-card,6px)] border transition-colors',
  {
    variants: {
      state: {
        default: 'border-(--rule) bg-(--panel) text-(--muted-foreground)',
        active: 'border-(--signal) bg-(--state)',
        completed: 'border-(--success) bg-(--panel)',
        failed: 'border-2 border-(--alert) bg-(--panel)',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);

const labelVariants = cva(
  'max-w-[80px] text-center font-mono text-[9px] leading-tight uppercase tracking-[0.12em]',
  {
    variants: {
      state: {
        default: 'text-(--muted-foreground)',
        active: 'text-(--signal)',
        completed: 'text-(--muted-foreground)',
        failed: 'text-(--alert)',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);

/**
 * Default icon mapping keyed by lowercase node type substrings.
 * Export this to extend or replace in your own app.
 */
export const DEFAULT_NEURAL_ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  intent: Component,
  shades: Database,
  librarian: Database,
  insights: Activity,
  sage: Activity,
  architect: Terminal,
  chronicler: Calendar,
  history: Calendar,
  auditor: HardDrive,
  codebase: HardDrive,
  fiscal: CreditCard,
  spend: CreditCard,
  navigator: Globe,
  route: Globe,
  dispatcher: Globe,
  retrieve: Search,
  knowledge: Search,
  generate: Message,
  response: Message,
  validate: CheckCircle,
  check: CheckCircle,
};

export interface NeuralNodeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof nodeVariants> {
  type: string;
  label: string;
  isActive?: boolean;
  isCompleted?: boolean;
  isFailed?: boolean;
  /**
   * Override or extend the default icon mapping.
   * Keys are lowercase substrings matched against the node `type`.
   * Provide your own map to add domain-specific node types.
   */
  iconMap?: Record<string, React.ComponentType<{ size?: number; className?: string }>>;
}

export const NeuralNode = forwardRef<HTMLDivElement, NeuralNodeProps>(
  ({ type, label, isActive, isCompleted, isFailed, iconMap, className, ...props }, ref) => {
    // Determine state for CVA
    const state = isFailed ? 'failed' : isActive ? 'active' : isCompleted ? 'completed' : 'default';

    const resolvedMap = iconMap ?? DEFAULT_NEURAL_ICON_MAP;

    const getIcon = (): React.ComponentType<{ size?: number; className?: string }> => {
      const t = type.toLowerCase();
      for (const [key, Icon] of Object.entries(resolvedMap)) {
        if (t.includes(key)) return Icon;
      }
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
          }}
          className={cn(nodeVariants({ state }))}
        >
          <Icon
            size={20}
            className={cn(
              state === 'active' && 'text-(--signal)',
              state === 'failed' && 'text-(--alert)',
              state === 'completed' && 'text-(--success)',
              state === 'default' && 'text-(--muted-foreground)',
            )}
          />
        </motion.div>
        <span className={cn(labelVariants({ state }))}>
          {state === 'failed' && <span aria-hidden="true">▲ </span>}
          {label.replace('_', ' ')}
        </span>
      </div>
    );
  },
);

NeuralNode.displayName = 'NeuralNode';
