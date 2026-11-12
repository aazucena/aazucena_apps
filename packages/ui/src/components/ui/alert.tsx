/** @shadcn standard component */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@aazucena/utils';
import { IconRenderer } from './icon-renderer';
import { X } from '@aazucena/icons';

const alertVariants = cva(
  'relative w-full rounded-card border px-4 py-3 text-sm transition-all duration-300 flex gap-3',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&_svg]:text-destructive',
        error:
          'border-destructive/50 text-destructive dark:border-destructive [&_svg]:text-destructive',
        success: 'border-success/50 text-success [&_svg]:text-success dark:[_svg]:text-success',
        warning: 'border-warning/50 text-warning [&_svg]:text-warning dark:[_svg]:text-warning',
        info: 'border-signal/50 text-signal [&_svg]:text-signal dark:[_svg]:text-signal',
        glass: 'glass border-l-4 border-l-primary dark:text-foreground dark:border-l-rule',
        cyber:
          'glass bg-signal-faint border-signal/30 text-foreground [&_svg]:text-signal border-l-4 border-l-signal dark:bg-background/80 dark:bg-panel dark:text-signal',
        dashboard: 'bg-background/5 dark:bg-panel-raised dark:bg-panel/30 border border-rule',
      },
      borderAccent: {
        true: 'border-l-4',
        false: '',
      },
      compact: {
        true: 'items-center py-2.5',
        false: 'items-start',
      },
    },
    compoundVariants: [
      { borderAccent: true, variant: 'default', className: 'border-l-primary' },
      { borderAccent: true, variant: 'destructive', className: 'border-l-destructive' },
      { borderAccent: true, variant: 'error', className: 'border-l-destructive' },
      { borderAccent: true, variant: 'success', className: 'border-l-success' },
      { borderAccent: true, variant: 'warning', className: 'border-l-warning' },
      { borderAccent: true, variant: 'info', className: 'border-l-signal' },
    ],
    defaultVariants: {
      variant: 'default',
      borderAccent: false,
      compact: false,
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants> & {
      icon?: any;
      dismissible?: boolean;
      onClose?: () => void;
    }
>(
  (
    { className, variant, icon, children, dismissible, onClose, borderAccent, compact, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant, borderAccent, compact, className }))}
      {...props}
    >
      {icon && (
        <IconRenderer
          icon={icon}
          className={cn(
            'mt-0.5 h-4 w-4 shrink-0',
            compact && 'mt-0',
            variant === 'cyber' && 'text-signal',
            variant === 'destructive' && 'text-destructive',
          )}
        />
      )}
      <div className="min-w-0 flex-1">{children}</div>
      {dismissible && (
        <button
          onClick={onClose}
          className={cn(
            'focus:ring-ring rounded-control shrink-0 p-1 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:outline-none',
            !compact && '-mt-1',
          )}
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  ),
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 leading-none font-medium tracking-tight', className)}
      {...props}
    >
      {children || 'Alert'}
    </h5>
  ),
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
