'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

/**
 * Data List Table Components
 */

export const DataListTable = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="overflow-x-auto p-2">
    <table ref={ref} className={cn('w-full border-collapse text-left', className)} {...props} />
  </div>
));
DataListTable.displayName = 'DataListTable';

export const DataListRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'group border-b border-current/5 transition-colors last:border-0 hover:bg-current/5',
      className,
    )}
    {...props}
  />
));
DataListRow.displayName = 'DataListRow';

export const dataListCellVariants = cva('px-6 py-4 transition-all duration-300', {
  variants: {
    type: {
      default: '',
      rank: 'w-16 font-mono text-xs font-bold opacity-40',
      detail: 'min-w-[200px]',
      metric: 'text-right font-mono text-xs font-bold',
      visual: 'text-right w-48',
    },
  },
  defaultVariants: {
    type: 'default',
  },
});

export const DataListCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & VariantProps<typeof dataListCellVariants>
>(({ className, type, ...props }, ref) => (
  <td ref={ref} className={cn(dataListCellVariants({ type }), className)} {...props} />
));
DataListCell.displayName = 'DataListCell';
