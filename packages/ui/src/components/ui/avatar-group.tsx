'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Avatar, AvatarFallback } from './avatar.js';

const avatarGroupVariants = cva('flex items-center', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    size: {
      sm: '-space-x-2',
      default: '-space-x-3',
      lg: '-space-x-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const sizeMap = { sm: 'sm', default: 'default', lg: 'lg' } as const;

export interface AvatarGroupProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarGroupVariants> {
  max?: number;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, variant, size, max = 5, children, ...props }, ref) => {
    const items = React.Children.toArray(children);
    const visible = items.slice(0, max);
    const overflow = items.length - max;

    return (
      <div ref={ref} className={cn(avatarGroupVariants({ variant, size }), className)} {...props}>
        {visible.map((child, i) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<{ variant?: string; size?: string }>, {
                variant: variant ?? undefined,
                size: sizeMap[size ?? 'default'],
              })
            : child,
        )}
        {overflow > 0 && (
          <Avatar variant={variant} size={sizeMap[size ?? 'default']}>
            <AvatarFallback className="text-xs font-medium">+{overflow}</AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  },
);
AvatarGroup.displayName = 'AvatarGroup';

export { AvatarGroup, avatarGroupVariants };
