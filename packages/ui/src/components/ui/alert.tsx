/** @shadcn standard component */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@aazucena/utils';
import { IconRenderer } from './icon-renderer.js';
import { X } from '@aazucena/icons';

const alertVariants = cva(
  'relative w-full rounded-xl border px-4 py-3 text-sm transition-all duration-300 flex gap-3',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground shadow-sm',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&_svg]:text-destructive',
        error:
          'border-destructive/50 text-destructive dark:border-destructive [&_svg]:text-destructive',
        success:
          'border-emerald-500/50 text-emerald-600 dark:text-emerald-400 [&_svg]:text-emerald-600 dark:[_svg]:text-emerald-400',
        warning:
          'border-amber-500/50 text-amber-600 dark:text-amber-400 [&_svg]:text-amber-600 dark:[_svg]:text-amber-400',
        info:
          'border-blue-500/50 text-blue-600 dark:text-blue-400 [&_svg]:text-blue-600 dark:[_svg]:text-blue-400',
        glass:
          'glass shadow-xl border-l-4 border-l-primary dark:text-white dark:border-l-white/40',
        cyber:
          'glass bg-primary-100 border-cyan-500/30 text-foreground shadow-[0_0_15px_rgba(6,182,212,0.1)] [&_svg]:text-cyan-600 border-l-4 border-l-cyan-500 dark:bg-background/80 dark:bg-black/80 dark:text-cyan-50 dark:[&_svg]:text-cyan-400',
        dashboard:
          'bg-background/5 dark:bg-white/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md shadow-sm',
      },
      borderAccent: {
        true: 'border-l-4',
        false: '',
      },
      compact: {
        true: 'items-center py-2.5',
        false: 'items-start',
      }
    },
    compoundVariants: [
      { borderAccent: true, variant: 'default', className: 'border-l-primary' },
      { borderAccent: true, variant: 'destructive', className: 'border-l-destructive' },
      { borderAccent: true, variant: 'error', className: 'border-l-destructive' },
      { borderAccent: true, variant: 'success', className: 'border-l-emerald-500' },
      { borderAccent: true, variant: 'warning', className: 'border-l-amber-500' },
      { borderAccent: true, variant: 'info', className: 'border-l-blue-500' },
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
>(({ className, variant, icon, children, dismissible, onClose, borderAccent, compact, ...props }, ref) => (
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
          "h-4 w-4 shrink-0 mt-0.5",
          compact && "mt-0",
          variant === 'cyber' && "text-cyan-500",
          variant === 'destructive' && "text-destructive"
        )} 
      />
    )}
    <div className="flex-1 min-w-0">
      {children}
    </div>
    {dismissible && (
      <button
        onClick={onClose}
        className={cn(
          "shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          !compact && "-mt-1"
        )}
        aria-label="Close alert"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
));
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
