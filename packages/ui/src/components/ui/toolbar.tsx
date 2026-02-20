'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.js';

const toolbarVariants = cva('fixed flex items-center transition-all duration-300 z-50', {
  variants: {
    variant: {
      default: 'bg-background/80 backdrop-blur-md border border-border shadow-sm text-foreground',
      glass: 'glass text-foreground shadow-2xl',
      cyber:
        'bg-background/80 dark:bg-black/80 border border-border dark:border-cyan-500/30 text-foreground shadow-[0_0_20px_rgba(6,182,212,0.15)]',
      ghost: 'bg-transparent border-none shadow-none',
    },
    position: {
      'top-left': 'top-8 left-8',
      'top-right': 'top-8 right-8',
      'top-center': 'top-8 left-1/2 -translate-x-1/2',
      'bottom-left': 'bottom-8 left-8',
      'bottom-right': 'bottom-8 right-8',
      'bottom-center': 'bottom-8 left-1/2 -translate-x-1/2',
    },
    orientation: {
      horizontal: 'flex-row gap-4 px-4 py-3 rounded-full',
      vertical: 'flex-col gap-4 px-3 py-4 rounded-full',
    },
  },
  defaultVariants: {
    variant: 'glass',
    position: 'top-right',
    orientation: 'horizontal',
  },
});

export interface ToolbarProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toolbarVariants> {}

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, variant, position, orientation, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(toolbarVariants({ variant, position, orientation }), className)}
        {...props}
      />
    );
  },
);
Toolbar.displayName = 'Toolbar';

const toolbarButtonVariants = cva(
  'group relative rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20',
        glass:
          'bg-background/10 dark:bg-white/10 border border-border/10 dark:border-border/20 text-foreground hover:bg-background/20 dark:hover:bg-white/20 hover:border-border/40',
        cyber:
          'bg-primary/10 dark:bg-cyan-500/10 border border-border dark:border-cyan-500/30 text-primary dark:text-cyan-400 dark:hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
      },
      size: {
        sm: 'w-10 h-10',
        default: 'w-12 h-12',
        lg: 'w-14 h-14',
      },
      isActive: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'glass',
        isActive: true,
        className:
          'bg-background/20 dark:bg-white/20 border-border/40 dark:border-white/40 shadow-lg',
      },
      {
        variant: 'cyber',
        isActive: true,
        className:
          'bg-primary/20 dark:bg-cyan-500/20 border-primary/60 dark:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-foreground',
      },
    ],
    defaultVariants: {
      variant: 'glass',
      size: 'lg',
      isActive: false,
    },
  },
);

export interface ToolbarButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toolbarButtonVariants> {
  label?: string;
  icon: React.ReactNode;
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, variant, size, isActive, label, icon, ...props }, ref) => {
    const button = (
      <button
        ref={ref}
        className={cn(toolbarButtonVariants({ variant, size, isActive }), className)}
        aria-label={label}
        {...props}
      >
        {icon}
      </button>
    );

    if (label) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent
              variant={variant === 'cyber' ? 'cyber' : variant === 'glass' ? 'glass' : 'default'}
              side="bottom"
            >
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  },
);
ToolbarButton.displayName = 'ToolbarButton';

export { Toolbar, ToolbarButton, toolbarVariants, toolbarButtonVariants };
