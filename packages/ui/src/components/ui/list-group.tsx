'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const listGroupVariants = cva('overflow-hidden rounded-control border', {
  variants: {
    variant: {
      default: 'border-border bg-background',
      glass: 'glass border-rule',
      cyber: 'border-signal/30 bg-scrim',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface ListGroupProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof listGroupVariants> {}

const ListGroup = React.forwardRef<HTMLDivElement, ListGroupProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="list"
      className={cn(listGroupVariants({ variant }), className)}
      {...props}
    />
  ),
);
ListGroup.displayName = 'ListGroup';

const listGroupItemVariants = cva(
  'flex items-center gap-3 border-b px-4 py-3 text-sm transition-colors last:border-b-0',
  {
    variants: {
      variant: {
        default: 'border-border hover:bg-muted/50',
        glass: 'border-rule hover:bg-state',
        cyber: 'border-signal/10 hover:bg-signal/5 text-signal font-mono text-xs',
      },
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { variant: 'default', active: true, className: 'bg-accent' },
      { variant: 'glass', active: true, className: 'bg-state' },
      { variant: 'cyber', active: true, className: 'bg-signal/10' },
    ],
    defaultVariants: { variant: 'default', active: false },
  },
);

export interface ListGroupItemProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof listGroupItemVariants> {
  icon?: React.ReactNode;
  action?: React.ReactNode;
  asButton?: boolean;
}

const ListGroupItem = React.forwardRef<HTMLElement, ListGroupItemProps>(
  ({ className, variant, active, icon, action, asButton, children, ...props }, ref) => {
    const Component = (asButton ? 'button' : 'div') as any;
    return (
      <Component
        ref={ref}
        role="listitem"
        tabIndex={asButton ? 0 : undefined}
        type={asButton ? 'button' : undefined}
        className={cn(
          listGroupItemVariants({ variant, active }),
          asButton && 'w-full cursor-pointer text-left',
          className,
        )}
        {...props}
      >
        {icon && <span className="shrink-0 [&_svg]:size-4">{icon}</span>}
        <span className="flex-1">{children}</span>
        {action && <span className="shrink-0">{action}</span>}
      </Component>
    );
  },
);
ListGroupItem.displayName = 'ListGroupItem';

export { ListGroup, ListGroupItem, listGroupVariants, listGroupItemVariants };
