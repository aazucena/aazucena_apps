'use client';

import { Activity, DangerCircle, DangerTriangle } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const errorPageVariants = cva(
  'min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 text-center rounded-[3rem] border',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800',
        glass:
          'bg-background/5 dark:bg-white/5 backdrop-blur-xl border-border/10 text-foreground shadow-2xl',
        cyber:
          'bg-background dark:bg-black border-cyan-500/30 text-foreground shadow-[0_0_30px_rgba(6,182,212,0.15)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const ErrorPage = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & VariantProps<typeof errorPageVariants>
>(({ className, variant, ...props }, ref) => (
  <main ref={ref} className={cn(errorPageVariants({ variant }), className)} {...props} />
));
ErrorPage.displayName = 'ErrorPage';

const ErrorPageContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative z-10 mx-auto max-w-3xl px-6 py-16', className)}
      {...props}
    />
  ),
);
ErrorPageContent.displayName = 'ErrorPageContent';

const errorPageStatusMap: Record<
  number,
  { code: string; label: string; color: 'primary' | 'secondary' | 'destructive' }
> = {
  400: { code: '400', label: 'BAD_REQUEST', color: 'secondary' },
  401: { code: '401', label: 'UNAUTHORIZED', color: 'destructive' },
  403: { code: '403', label: 'ACCESS_DENIED', color: 'destructive' },
  404: { code: '404', label: 'SIGNAL_NOT_FOUND', color: 'primary' },
  408: { code: '408', label: 'REQUEST_TIMEOUT', color: 'secondary' },
  429: { code: '429', label: 'RATE_LIMITED', color: 'secondary' },
  500: { code: '500', label: 'KERNEL_PANIC', color: 'destructive' },
  502: { code: '502', label: 'BAD_GATEWAY', color: 'destructive' },
  503: { code: '503', label: 'SERVICE_UNAVAILABLE', color: 'secondary' },
};

const ErrorPageVisual = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    status?: number;
    code?: string;
    label?: string;
    color?: 'primary' | 'secondary' | 'destructive';
  }
>(({ className, status, code, label, color, ...props }, ref) => {
  const preset = status ? errorPageStatusMap[status] : undefined;
  const resolvedCode = code ?? preset?.code;
  const resolvedLabel = label ?? preset?.label;
  const resolvedColor = color ?? preset?.color ?? 'primary';

  return (
    <div className={cn('group relative mb-12 inline-block', className)} {...props}>
      <div
        className={cn(
          'absolute inset-0 scale-150 rounded-full opacity-0 blur-[80px] transition-opacity duration-1000 group-hover:opacity-100',
          resolvedColor === 'primary'
            ? 'bg-primary-500/20'
            : resolvedColor === 'secondary'
              ? 'bg-secondary-500/20'
              : 'bg-rose-500/20',
        )}
      />

      <div className="relative">
        <h1 className="font-mono text-[10rem] leading-none font-black tracking-tighter text-zinc-900 drop-shadow-2xl md:text-[15rem] dark:text-zinc-100">
          {resolvedCode}
        </h1>
        {resolvedLabel && (
          <div
            className={cn(
              'text-foreground absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg border px-4 py-1.5 text-[10px] font-black tracking-[0.3em] whitespace-nowrap uppercase shadow-xl transition-transform',
              resolvedColor === 'primary'
                ? 'bg-primary-600 border-primary-400/30 rotate-[-2deg]'
                : resolvedColor === 'secondary'
                  ? 'bg-secondary-600 border-secondary-400/30 rotate-[2deg]'
                  : 'rotate-0 border-rose-400/30 bg-rose-600',
            )}
          >
            {resolvedColor === 'destructive' ? (
              <DangerCircle size={14} className="animate-pulse" />
            ) : (
              <DangerTriangle size={14} />
            )}
            {resolvedLabel}
          </div>
        )}
      </div>
    </div>
  );
});
ErrorPageVisual.displayName = 'ErrorPageVisual';

const ErrorPageHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-12 space-y-6', className)} {...props} />
  ),
);
ErrorPageHeader.displayName = 'ErrorPageHeader';

const ErrorPageTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'text-3xl font-black tracking-tight text-zinc-900 uppercase md:text-5xl dark:text-zinc-100',
      className,
    )}
    {...props}
  />
));
ErrorPageTitle.displayName = 'ErrorPageTitle';

const ErrorPageDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-muted-foreground mx-auto max-w-sm font-mono text-sm leading-relaxed tracking-wider uppercase md:text-base dark:text-zinc-400',
      className,
    )}
    {...props}
  />
));
ErrorPageDescription.displayName = 'ErrorPageDescription';

const ErrorPageActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-20 flex flex-col items-center justify-center gap-4 sm:flex-row', className)}
      {...props}
    />
  ),
);
ErrorPageActions.displayName = 'ErrorPageActions';

const ErrorPageFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex w-full flex-col items-center gap-4 border-t border-current/10 pt-10',
        className,
      )}
      {...props}
    />
  ),
);
ErrorPageFooter.displayName = 'ErrorPageFooter';

const ErrorPageBeacon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { label?: string }
>(({ className, label, ...props }, ref) => (
  <div className={cn('flex flex-col items-center gap-4', className)} {...props}>
    <div className="flex items-center gap-3">
      <Activity size={14} className="text-secondary-500 animate-pulse" />
      <h3 className="font-mono text-[10px] font-black tracking-[0.4em] text-zinc-400 uppercase dark:text-zinc-600">
        {label || 'Incident_Protocol_Active'}
      </h3>
    </div>
  </div>
));
ErrorPageBeacon.displayName = 'ErrorPageBeacon';

export {
  ErrorPage,
  ErrorPageActions,
  ErrorPageBeacon,
  ErrorPageContent,
  ErrorPageDescription,
  ErrorPageFooter,
  ErrorPageHeader,
  errorPageStatusMap,
  ErrorPageTitle,
  errorPageVariants,
  ErrorPageVisual,
};
