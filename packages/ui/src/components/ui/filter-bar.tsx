'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Search, X } from '@aazucena/icons';
import { Input } from './input.js';
import { NativeSelect } from './native-select.js';

const filterBarVariants = cva('w-full transition-all duration-500 rounded-[2rem] border p-8', {
  variants: {
    variant: {
      default: 'bg-card border-border shadow-sm',
      glass: 'bg-background/5 dark:bg-white/5 backdrop-blur-md border-border/10 text-foreground shadow-xl',
      cyber: 'bg-background/80 dark:bg-black/80 border-cyan-500/30 text-foreground shadow-[0_0_20px_rgba(6,182,212,0.1)]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const FilterBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof filterBarVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(filterBarVariants({ variant }), className)} {...props} />
));
FilterBar.displayName = 'FilterBar';

const FilterBarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center',
        className,
      )}
      {...props}
    >
      <h2 className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">
        {children || 'Filter_Archive'}
      </h2>
    </div>
  ),
);
FilterBarHeader.displayName = 'FilterBarHeader';

const FilterBarGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3', className)}
      {...props}
    />
  ),
);
FilterBarGrid.displayName = 'FilterBarGrid';

const FilterBarItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-3', className)} {...props} />
  ),
);
FilterBarItem.displayName = 'FilterBarItem';

const FilterBarSearch = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof Input> & { label?: string }
>(({ className, label, ...props }, ref) => {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label
          htmlFor={id}
          className="ml-2 block cursor-pointer text-[10px] font-black tracking-widest uppercase opacity-40 transition-opacity hover:opacity-60"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 opacity-40" />
        <Input id={id} ref={ref} className={cn('h-12 rounded-2xl pl-11', className)} {...props} />
      </div>
    </div>
  );
});
FilterBarSearch.displayName = 'FilterBarSearch';

const FilterBarActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-12 flex items-center justify-center', className)} {...props} />
  ),
);
FilterBarActions.displayName = 'FilterBarActions';

export {
  FilterBar,
  FilterBarHeader,
  FilterBarGrid,
  FilterBarItem,
  FilterBarSearch,
  FilterBarActions,
  filterBarVariants,
};
