'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { ArrowLeft, ArrowRight } from '@aazucena/icons';

const detailNavigationVariants = cva(
  'grid grid-cols-1 gap-8 md:grid-cols-2 mt-20 border-t pt-12 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border-border',
        glass: 'border-border/10',
        cyber: 'border-border dark:border-cyan-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const detailNavItemVariants = cva(
  'group space-y-2 p-8 transition-all duration-300 rounded-[2rem] border',
  {
    variants: {
      variant: {
        default: 'border-border bg-card hover:border-primary/20',
        glass:
          'border-border/10 bg-background/5 dark:bg-white/5 backdrop-blur-md text-foreground hover:bg-background/10 dark:bg-white/10 hover:border-border/20',
        cyber:
          'border-cyan-500/20 bg-background/40 dark:bg-black/40 text-foreground hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]',
      },
      alignment: {
        left: 'text-left',
        right: 'text-right',
      },
    },
    defaultVariants: {
      variant: 'default',
      alignment: 'left',
    },
  },
);

export interface DetailNavItem {
  slug: string;
  title: string;
}

export interface DetailNavigationProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof detailNavigationVariants> {
  prevItem?: DetailNavItem | null;
  nextItem?: DetailNavItem | null;
  basePath: string;
  prevLabel?: string;
  nextLabel?: string;
}

const DetailNavigation = React.forwardRef<HTMLElement, DetailNavigationProps>(
  (
    {
      className,
      variant,
      prevItem,
      nextItem,
      basePath,
      prevLabel = 'Previous',
      nextLabel = 'Next',
      ...props
    },
    ref,
  ) => {
    if (!nextItem && !prevItem) return null;
    const normalizedBasePath = basePath.replace(/\/$/, '');

    return (
      <nav ref={ref} className={cn(detailNavigationVariants({ variant }), className)} {...props}>
        {prevItem ? (
          <a
            href={`${normalizedBasePath}/${prevItem.slug}`}
            className={cn(detailNavItemVariants({ variant, alignment: 'left' }))}
          >
            <div
              className={cn(
                'flex items-center gap-2 text-[9px] font-black tracking-[0.3em] uppercase',
                variant === 'cyber' ? 'text-foreground0' : 'text-muted-foreground',
              )}
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              {prevLabel}
            </div>
            <div className="line-clamp-2 text-xl font-bold tracking-tighter">{prevItem.title}</div>
          </a>
        ) : (
          <div aria-hidden="true" />
        )}

        {nextItem && (
          <a
            href={`${normalizedBasePath}/${nextItem.slug}`}
            className={cn(detailNavItemVariants({ variant, alignment: 'right' }))}
          >
            <div
              className={cn(
                'flex items-center justify-end gap-2 text-[9px] font-black tracking-[0.3em] uppercase',
                variant === 'cyber' ? 'text-foreground0' : 'text-muted-foreground',
              )}
            >
              {nextLabel}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
            <div className="line-clamp-2 text-xl font-bold tracking-tighter">{nextItem.title}</div>
          </a>
        )}
      </nav>
    );
  },
);
DetailNavigation.displayName = 'DetailNavigation';

export { DetailNavigation, detailNavigationVariants, detailNavItemVariants };
