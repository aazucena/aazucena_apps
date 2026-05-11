'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Progress } from './progress';

const distributionVariants = cva('w-full space-y-8 transition-all duration-300', {
  variants: {
    variant: {
      default: '',
      cyber: 'text-foreground font-mono',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Distribution = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof distributionVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(distributionVariants({ variant }), className)} {...props} />
));
Distribution.displayName = 'Distribution';

const DistributionHeader = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('mb-4 text-[10px] font-black tracking-widest uppercase opacity-40', className)}
    {...props}
  />
));
DistributionHeader.displayName = 'DistributionHeader';

const DistributionList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-4', className)} {...props} />
  ),
);
DistributionList.displayName = 'DistributionList';

const distributionBarVariants = cva('space-y-1 group transition-all duration-300', {
  variants: {
    variant: {
      default: '',
      cyber: 'text-cyan-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const DistributionBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof distributionBarVariants> & {
      value: number;
      label: string;
      icon?: React.ReactNode;
      color?: string;
    }
>(({ className, variant, value, label, icon, color, ...props }, ref) => (
  <div ref={ref} className={cn(distributionBarVariants({ variant }), className)} {...props}>
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 font-medium opacity-90">
        {icon && (
          <span
            className={cn(
              'text-foreground flex h-4 w-4 items-center justify-center rounded bg-gradient-to-br text-[10px]',
              color,
            )}
          >
            {icon}
          </span>
        )}
        {label}
      </span>
      <span className="opacity-60">{value}%</span>
    </div>
    <Progress
      value={value}
      className="h-1.5 opacity-90"
      style={{ '--progress-background': color } as any}
    />
  </div>
));
DistributionBar.displayName = 'DistributionBar';

const DistributionGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-6', className)} {...props} />
  ),
);
DistributionGroup.displayName = 'DistributionGroup';

const distributionTagVariants = cva(
  'inline-flex items-center rounded-md border transition-all duration-300 cursor-default',
  {
    variants: {
      weight: {
        default:
          'px-2 py-0.5 text-[10px] opacity-50 border-transparent bg-muted/50 hover:opacity-100 hover:border-border',
        emphasis:
          'px-2.5 py-1 text-xs font-bold border-border bg-muted text-foreground hover:bg-accent',
        cyber:
          'px-2.5 py-1 text-xs font-black uppercase tracking-widest border-cyan-500/20 bg-cyan-500/5 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/10',
      },
    },
    defaultVariants: {
      weight: 'default',
    },
  },
);

const DistributionTag = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof distributionTagVariants>
>(({ className, weight, ...props }, ref) => (
  <span ref={ref} className={cn(distributionTagVariants({ weight }), className)} {...props} />
));
DistributionTag.displayName = 'DistributionTag';

export {
  Distribution,
  DistributionHeader,
  DistributionList,
  DistributionBar,
  DistributionGroup,
  DistributionTag,
  distributionVariants,
  distributionBarVariants,
  distributionTagVariants,
};
