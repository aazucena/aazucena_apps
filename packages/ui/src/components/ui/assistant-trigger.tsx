'use client';

import { Sparkles, X } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const assistantTriggerVariants = cva(
  'fixed bottom-8 right-8 z-[100] flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 group',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-lg rounded-full',
        glass:
          'bg-background/10 dark:bg-white/10 backdrop-blur-xl border border-border/20 text-foreground shadow-2xl rounded-full',
        cyber:
          'bg-background dark:bg-black border border-border dark:border-cyan-500/40 text-primary dark:text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] rounded-2xl',
        ai: 'bg-gradient-to-br from-primary-600 to-blue-600 text-foreground shadow-xl rounded-full',
      },
      size: {
        default: 'w-14 h-14',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20',
      },
      isOpen: {
        true: 'rotate-90',
        false: 'rotate-0',
      },
    },
    defaultVariants: {
      variant: 'ai',
      size: 'default',
      isOpen: false,
    },
  },
);

export interface AssistantTriggerProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof assistantTriggerVariants> {
  hasNotification?: boolean;
  icon?: React.ReactNode;
  label?: string;
  closeLabel?: string;
  tooltip?: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
}

const AssistantTrigger = React.forwardRef<HTMLButtonElement, AssistantTriggerProps>(
  (
    {
      className,
      variant,
      size,
      isOpen,
      hasNotification,
      icon,
      label,
      closeLabel,
      tooltip,
      tooltipSide = 'left',
      ...props
    },
    ref,
  ) => {
    const button = (
      <button
        ref={ref}
        className={cn(assistantTriggerVariants({ variant, size, isOpen }), className)}
        aria-label={label || 'Toggle AI Assistant'}
        {...props}
      >
        {/* Branded Pulse / Notification */}
        {hasNotification && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-black"></span>
          </span>
        )}

        {/* Floating Aura (Cyber/AI variants) */}
        {(variant === 'ai' || variant === 'cyber') && (
          <div className="rounded-inherit absolute inset-0 bg-inherit opacity-20 blur-xl transition-opacity group-hover:opacity-40" />
        )}

        {/* Icon Toggle */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-2"
              >
                <X size={24} strokeWidth={2.5} />
                {closeLabel && (
                  <span className="pr-2 text-xs font-black tracking-widest uppercase">
                    {closeLabel}
                  </span>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="icon"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-2"
              >
                {icon ?? <Sparkles size={24} />}
                {label && (
                  <span className="pr-2 text-xs font-black tracking-widest uppercase">{label}</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    );

    if (!tooltip || isOpen) return button;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side={tooltipSide} className={tooltipSide === 'right' ? 'ml-4' : 'mr-4'}>
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);
AssistantTrigger.displayName = 'AssistantTrigger';

export { AssistantTrigger, assistantTriggerVariants };
