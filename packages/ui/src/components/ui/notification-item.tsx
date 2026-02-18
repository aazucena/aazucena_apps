'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const notificationItemVariants = cva(
  'flex items-start gap-3 rounded-md px-3 py-2 transition-colors hover:bg-accent/50',
  {
    variants: {
      variant: {
        default: '',
        glass: 'hover:bg-white/5',
        cyber: 'hover:bg-cyan-500/5',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface NotificationItemData {
  id: string;
  title: string;
  description?: string;
  time?: string;
  read?: boolean;
  icon?: React.ReactNode;
}

export interface NotificationItemProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof notificationItemVariants> {
  notification: NotificationItemData;
  onRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

const NotificationItem = React.forwardRef<HTMLDivElement, NotificationItemProps>(
  ({ className, variant, notification, onRead, onDismiss, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(notificationItemVariants({ variant }), className)}
        onClick={() => !notification.read && onRead?.(notification.id)}
        role="button"
        tabIndex={0}
        {...props}
      >
        {!notification.read && <span className="bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full" />}
        {notification.icon && <span className="mt-0.5 shrink-0">{notification.icon}</span>}
        <div className="min-w-0 flex-1">
          <p className={cn('text-sm font-medium', !notification.read && 'font-semibold')}>
            {notification.title}
          </p>
          {notification.description && (
            <p className="text-muted-foreground line-clamp-2 text-xs">{notification.description}</p>
          )}
          {notification.time && (
            <p className="text-muted-foreground mt-0.5 text-[10px]">{notification.time}</p>
          )}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(notification.id);
            }}
            className="text-muted-foreground hover:text-foreground shrink-0 rounded p-0.5"
            aria-label="Dismiss"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
NotificationItem.displayName = 'NotificationItem';

export { NotificationItem, notificationItemVariants };
