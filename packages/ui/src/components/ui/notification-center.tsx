'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { ScrollArea } from './scroll-area';
import { Badge } from './badge';
import { NotificationItem, type NotificationItemData } from './notification-item';

export * from './notification-item';

const notificationCenterVariants = cva('', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface NotificationCenterProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof notificationCenterVariants> {
  notifications: NotificationItemData[];
  onRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onMarkAllRead?: () => void;
  trigger?: React.ReactNode;
}

const NotificationCenter = React.forwardRef<HTMLDivElement, NotificationCenterProps>(
  (
    { className, variant, notifications, onRead, onDismiss, onMarkAllRead, trigger, ...props },
    ref,
  ) => {
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
      <div ref={ref} className={cn(notificationCenterVariants({ variant }), className)} {...props}>
        <Popover>
          <PopoverTrigger asChild>
            {trigger ?? (
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground relative rounded-md p-2 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <Badge
                    size="xs"
                    className="absolute -top-1 -right-1 h-4 min-w-[16px] justify-center px-1"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </button>
            )}
          </PopoverTrigger>
          <PopoverContent variant={variant} className="w-80 p-0" align="end">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h4 className="text-sm font-semibold">Notifications</h4>
              {unreadCount > 0 && onMarkAllRead && (
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
            <ScrollArea className="max-h-80">
              {notifications.length === 0 ? (
                <p className="text-muted-foreground px-4 py-8 text-center text-sm">
                  No notifications
                </p>
              ) : (
                <div className="p-1">
                  {notifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      variant={variant}
                      onRead={onRead}
                      onDismiss={onDismiss}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);
NotificationCenter.displayName = 'NotificationCenter';

export { NotificationCenter, notificationCenterVariants };
