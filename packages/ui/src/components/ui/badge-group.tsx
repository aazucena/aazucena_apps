'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Badge } from './badge';

const badgeGroupVariants = cva('flex flex-wrap gap-2 transition-all duration-300', {
  variants: {
    alignment: {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    },
    spacing: {
      tight: 'gap-1.5',
      default: 'gap-2.5',
      wide: 'gap-4',
    },
  },
  defaultVariants: {
    alignment: 'left',
    spacing: 'default',
  },
});

export interface BadgeGroupProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeGroupVariants> {
  maxItems?: number;
}

const BadgeGroup = React.forwardRef<HTMLDivElement, BadgeGroupProps>(
  ({ className, alignment, spacing, maxItems, children, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const childrenArray = React.Children.toArray(children);

    const shouldTruncate = maxItems && childrenArray.length > maxItems && !isExpanded;
    const displayedChildren = shouldTruncate ? childrenArray.slice(0, maxItems) : childrenArray;
    const remainingCount = childrenArray.length - displayedChildren.length;

    return (
      <div
        ref={ref}
        className={cn(badgeGroupVariants({ alignment, spacing }), className)}
        {...props}
      >
        {displayedChildren}
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-muted-foreground hover:text-primary pl-1 text-[10px] font-black tracking-tighter uppercase transition-colors"
          >
            + {remainingCount} more
          </button>
        )}
        {isExpanded && maxItems && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-muted-foreground hover:text-primary pl-1 text-[10px] font-black tracking-tighter uppercase transition-colors"
          >
            Show less
          </button>
        )}
      </div>
    );
  },
);
BadgeGroup.displayName = 'BadgeGroup';

const BadgeGroupItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Badge>
>(({ className, ...props }, ref) => (
  <Badge
    ref={ref}
    size="md"
    className={cn('transition-transform hover:scale-110', className)}
    {...props}
  />
));
BadgeGroupItem.displayName = 'BadgeGroupItem';

export { BadgeGroup, BadgeGroupItem, badgeGroupVariants };
