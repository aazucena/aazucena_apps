'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const metadataVariants = cva('w-full transition-all duration-300', {
  variants: {
    variant: {
      default: 'space-y-6',
      card: 'bg-card border border-border rounded-2xl p-6 shadow-sm',
      glass: 'bg-background/5 dark:bg-white/5 backdrop-blur-md border border-border/10 rounded-2xl p-6 text-foreground',
      cyber: 'bg-background/40 dark:bg-black/40 border border-border/10 dark:border-cyan-500/20 rounded-2xl p-6 text-foreground',
      // Compact vertical variant for headers
      readout:
        'flex flex-col items-end px-4 border-r border-current/10 last:border-0 h-8 justify-center',
      // Stacked variant for sidebars/details
      stack: 'flex flex-col gap-1.5',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const MetaData = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof metadataVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(metadataVariants({ variant }), className)} {...props} />
));
MetaData.displayName = 'MetaData';

const MetaDataHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4 flex flex-col gap-1', className)} {...props} />
  ),
);
MetaDataHeader.displayName = 'MetaDataHeader';

const metadataTitleVariants = cva('font-black transition-all duration-300', {
  variants: {
    size: {
      default: 'text-[10px] font-black tracking-[0.3em] uppercase opacity-40',
      lg: 'text-xl md:text-2xl tracking-tight opacity-90',
    },
    variant: {
      default: 'text-foreground',
      cyber: 'text-primary dark:text-cyan-400',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
});

const MetaDataTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & VariantProps<typeof metadataTitleVariants>
>(({ className, size, variant, ...props }, ref) => (
  <h3 ref={ref} className={cn(metadataTitleVariants({ size, variant }), className)} {...props} />
));
MetaDataTitle.displayName = 'MetaDataTitle';

const MetaDataContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm leading-relaxed', className)} {...props} />
  ),
);
MetaDataContent.displayName = 'MetaDataContent';

const metadataGridVariants = cva('grid transition-all duration-300', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-2 md:grid-cols-4',
    },
    gap: {
      default: 'gap-6',
      sm: 'gap-3',
      lg: 'gap-8',
    },
  },
  defaultVariants: {
    cols: 2,
    gap: 'default',
  },
});

const MetaDataGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof metadataGridVariants>
>(({ className, cols, gap, ...props }, ref) => (
  <div ref={ref} className={cn(metadataGridVariants({ cols, gap }), className)} {...props} />
));
MetaDataGrid.displayName = 'MetaDataGrid';

const MetaDataItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props} />
  ),
);
MetaDataItem.displayName = 'MetaDataItem';

const metadataLabelVariants = cva(
  'text-[10px] font-black uppercase tracking-widest uppercase transition-colors',
  {
    variants: {
      variant: {
        default: 'text-muted-foreground opacity-40',
        cyber: 'text-muted-foreground opacity-60',
        bright: 'text-foreground/80',
        readout: 'text-[8px] opacity-40 leading-none mb-1',
        stack: 'text-[9px] text-zinc-400 tracking-widest',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const MetaDataLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof metadataLabelVariants>
>(({ className, variant, ...props }, ref) => (
  <span ref={ref} className={cn(metadataLabelVariants({ variant }), className)} {...props} />
));
MetaDataLabel.displayName = 'MetaDataLabel';

const metadataValueVariants = cva('transition-all duration-300', {
  variants: {
    variant: {
      default: 'text-sm font-medium text-foreground opacity-90',
      cyber: 'text-sm font-mono tracking-tight text-foreground',
      muted: 'text-sm text-muted-foreground',
      readout: 'text-xs font-mono font-black text-primary leading-none',
      stack: 'text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const MetaDataValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof metadataValueVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(metadataValueVariants({ variant }), className)} {...props} />
));
MetaDataValue.displayName = 'MetaDataValue';

const MetaDataIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'cyber' | 'muted' }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-8 w-8 items-center justify-center rounded-lg border',
      variant === 'cyber'
        ? 'border-border dark:border-cyan-500/20 bg-primary/5 dark:bg-cyan-500/5 text-primary dark:text-cyan-400'
        : variant === 'muted'
          ? 'h-auto w-auto shrink-0 border-none bg-transparent text-zinc-400'
          : 'bg-muted/50 border-border text-muted-foreground',
      className,
    )}
    {...props}
  />
));
MetaDataIcon.displayName = 'MetaDataIcon';

export {
  MetaData,
  MetaDataHeader,
  MetaDataTitle,
  MetaDataContent,
  MetaDataGrid,
  MetaDataItem,
  MetaDataLabel,
  MetaDataValue,
  MetaDataIcon,
  metadataTitleVariants,
  metadataGridVariants,
  metadataLabelVariants,
  metadataValueVariants,
};
