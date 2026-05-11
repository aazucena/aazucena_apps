'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Button } from './button';
import {
  InfoCircleSolid,
  DangerCircleSolid,
  CheckCircleSolid,
  DangerTriangleSolid,
  X,
  ChevronDown,
} from '@aazucena/icons';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

const announcementVariants = cva(
  'relative w-full flex items-center justify-center gap-4 px-4 py-2 text-sm font-medium transition-all duration-300 border-b',
  {
    variants: {
      variant: {
        default: 'bg-muted/50 border-border text-foreground',
        info: 'bg-blue-500 border-blue-600 text-white dark:bg-blue-900/80 dark:border-blue-800',
        success:
          'bg-emerald-500 border-emerald-600 text-white dark:bg-emerald-900/80 dark:border-emerald-800',
        warning:
          'bg-amber-500 border-amber-600 text-white dark:bg-amber-900/80 dark:border-amber-800',
        destructive:
          'bg-rose-500 border-rose-600 text-white dark:bg-rose-900/80 dark:border-rose-800',
        glass: 'glass border-white/10 text-white backdrop-blur-md',
        cyber:
          'bg-black border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] font-mono',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const getIconForVariant = (variant: AnnouncementProps['variant']) => {
  switch (variant) {
    case 'info':
      return <InfoCircleSolid className="size-4" />;
    case 'success':
      return <CheckCircleSolid className="size-4" />;
    case 'warning':
      return <DangerTriangleSolid className="size-4" />;
    case 'destructive':
      return <DangerCircleSolid className="size-4" />;
    default:
      return null;
  }
};

export interface AnnouncementProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof announcementVariants> {
  message: string;
  actionText?: string;
  onAction?: () => void;
  details?: React.ReactNode;
  dismissable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
}

const Announcement = React.forwardRef<HTMLDivElement, AnnouncementProps>(
  (
    {
      className,
      variant,
      message,
      actionText,
      onAction,
      details,
      dismissable = false,
      onClose,
      icon,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const IconComponent = icon !== undefined ? icon : getIconForVariant(variant);

    if (!isVisible) return null;

    const handleClose = () => {
      setIsVisible(false);
      onClose?.();
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(announcementVariants({ variant }), className)}
        {...props}
      >
        <div className="flex flex-1 items-center justify-center gap-3 overflow-hidden">
          {IconComponent && <span className="shrink-0">{IconComponent}</span>}

          <div className="flex items-center gap-2 truncate">
            <span className="truncate">{message}</span>
            {actionText && (
              <Button
                variant="link"
                size="sm"
                onClick={onAction}
                className={cn(
                  'h-auto p-0 font-bold text-current underline decoration-current/30 hover:decoration-current',
                  variant === 'cyber' && 'text-cyan-300',
                )}
              >
                {actionText}
              </Button>
            )}
          </div>

          {details && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 text-current hover:bg-current/10"
                >
                  <ChevronDown className="size-3 transition-transform duration-200 data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="absolute top-full left-0 z-50 w-full border-b bg-inherit p-4 shadow-xl">
                {details}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        {dismissable && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="size-8 shrink-0 text-current hover:bg-current/10"
            aria-label="Close announcement"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    );
  },
);
Announcement.displayName = 'Announcement';

export { Announcement, announcementVariants };
