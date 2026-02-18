'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Avatar, AvatarImage, AvatarFallback } from './avatar.js';

const userVariants = cva('inline-flex items-center gap-2.5 transition-all', {
  variants: {
    variant: {
      default: 'text-foreground',
      glass: 'text-foreground',
      cyber: 'text-cyan-50 font-mono',
    },
    size: {
      sm: '',
      default: '',
      lg: 'gap-3',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

const avatarSizeMap: Record<string, 'sm' | 'default' | 'lg'> = {
  sm: 'sm',
  default: 'default',
  lg: 'lg',
};

export interface UserProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof userVariants> {
  name: string;
  description?: string;
  avatarSrc?: string;
  avatarFallback?: string;
}

const User = React.forwardRef<HTMLDivElement, UserProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      name,
      description,
      avatarSrc,
      avatarFallback,
      ...props
    },
    ref,
  ) => {
    const v = variant ?? 'default';
    const s = size ?? 'default';
    const initials =
      avatarFallback ??
      name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
      <div ref={ref} className={cn(userVariants({ variant, size }), className)} {...props}>
        <Avatar variant={v} size={avatarSizeMap[s] ?? 'default'}>
          {avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span
            className={cn(
              'leading-tight font-medium',
              s === 'sm' ? 'text-xs' : s === 'lg' ? 'text-base' : 'text-sm',
            )}
          >
            {name}
          </span>
          {description && (
            <span
              className={cn(
                'text-muted-foreground leading-tight',
                s === 'sm' ? 'text-[10px]' : s === 'lg' ? 'text-sm' : 'text-xs',
                v === 'cyber' && 'text-cyan-400/60',
              )}
            >
              {description}
            </span>
          )}
        </div>
      </div>
    );
  },
);
User.displayName = 'User';

export { User, userVariants };
