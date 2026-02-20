/** @shadcn standard component */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const tableVariants = cva('w-full caption-bottom text-sm transition-all duration-300', {
  variants: {
    variant: {
      default: '',
      glass: 'text-foreground/90',
      cyber: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & VariantProps<typeof tableVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    className={cn(
      'relative w-full overflow-auto rounded-lg',
      variant === 'glass' &&
        'glass dark:bg-background/5 dark:border-border/10 shadow-xl dark:bg-white/5',
      variant === 'cyber' &&
        'border-border/10 glass bg-primary-100 dark:bg-background/80 border shadow-[0_0_20px_rgba(6,182,212,0.1)] dark:border-cyan-500/30 dark:bg-black/80',
    )}
  >
    <table ref={ref} className={cn(tableVariants({ variant }), className)} {...props} />
  </div>
));
Table.displayName = 'Table';

const tableHeaderVariants = cva('[&_tr]:border-b', {
  variants: {
    variant: {
      default: '',
      glass: '[&_tr]:border-border/10 bg-background/5 dark:bg-white/5',
      cyber:
        '[&_tr]:border-border/10 dark:[&_tr]:border-cyan-500/20 glass bg-primary-100 dark:bg-cyan-500/5',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & VariantProps<typeof tableHeaderVariants>
>(({ className, variant, ...props }, ref) => (
  <thead ref={ref} className={cn(tableHeaderVariants({ variant }), className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const tableRowVariants = cva('border-b transition-colors data-[state=selected]:bg-muted', {
  variants: {
    variant: {
      default: 'hover:bg-muted/50',
      glass: 'border-border/10 hover:bg-background/5 dark:bg-white/5',
      cyber:
        'border-border/10 dark:border-cyan-500/20 hover:bg-primary/10 dark:hover:bg-cyan-500/10',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & VariantProps<typeof tableRowVariants>
>(({ className, variant, ...props }, ref) => (
  <tr ref={ref} className={cn(tableRowVariants({ variant }), className)} {...props} />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'text-muted-foreground h-10 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn('text-muted-foreground mt-4 text-sm', className)} {...props} />
));
TableCaption.displayName = 'TableCaption';

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
