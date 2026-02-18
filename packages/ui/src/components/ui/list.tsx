'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const listVariants = cva('space-y-1', {
  variants: {
    variant: {
      default: 'text-foreground',
      glass: 'text-foreground/90',
      cyber: 'font-mono text-sm text-primary/80 dark:text-cyan-400/80',
      muted: 'text-muted-foreground',
    },
    type: {
      unordered: 'list-disc',
      ordered: 'list-decimal',
      none: 'list-none',
    },
    size: {
      sm: 'text-sm pl-4',
      md: 'text-base pl-6',
      lg: 'text-lg pl-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    type: 'unordered',
    size: 'md',
  },
});

export interface ListProps
  extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement>,
    VariantProps<typeof listVariants> {}

const List = React.forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
  ({ className, variant, type, size, ...props }, ref) => {
    const Comp = type === 'ordered' ? 'ol' : 'ul';
    return (
      <Comp
        ref={ref as React.Ref<HTMLUListElement> & React.Ref<HTMLOListElement>}
        className={cn(listVariants({ variant, type, size }), className)}
        {...props}
      />
    );
  },
);
List.displayName = 'List';

const listItemVariants = cva('', {
  variants: {
    variant: {
      default: '',
      glass: 'opacity-90',
      cyber: 'before:content-[">_"] before:text-cyan-500/50 list-none',
      muted: 'text-muted-foreground',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface ListItemProps
  extends React.LiHTMLAttributes<HTMLLIElement>,
    VariantProps<typeof listItemVariants> {}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, variant, ...props }, ref) => (
    <li ref={ref} className={cn(listItemVariants({ variant }), className)} {...props} />
  ),
);
ListItem.displayName = 'ListItem';

export { List, ListItem, listVariants, listItemVariants };
