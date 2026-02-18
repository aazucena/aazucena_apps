'use client';

/** @shadcn standard component */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const emptyVariants = cva(
  'flex min-w-0 flex-1 flex-col items-center justify-center text-balance transition-all duration-500',
  {
    variants: {
      variant: {
        default: 'gap-6 rounded-lg border-dashed p-6 text-center md:p-12',
        archive: 'py-20 text-center',
        fullscreen: 'min-h-[60vh] text-center',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Empty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof emptyVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="empty"
    className={cn(emptyVariants({ variant }), className)}
    {...props}
  />
));
Empty.displayName = 'Empty';

const EmptyHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="empty-header"
      className={cn('flex max-w-sm flex-col items-center gap-2 text-center', className)}
      {...props}
    />
  ),
);
EmptyHeader.displayName = 'EmptyHeader';

const emptyMediaVariants = cva(
  'mb-2 flex shrink-0 items-center justify-center transition-all duration-300 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
        branded:
          'inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-muted text-muted-foreground mb-8 border border-border group-hover:scale-110',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const EmptyMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof emptyMediaVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="empty-media"
    className={cn(emptyMediaVariants({ variant }), className)}
    {...props}
  />
));
EmptyMedia.displayName = 'EmptyMedia';

const emptyTitleVariants = cva('font-medium tracking-tight transition-colors', {
  variants: {
    size: {
      default: 'text-lg',
      lg: 'text-2xl font-bold opacity-90 mb-2',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const EmptyTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & VariantProps<typeof emptyTitleVariants>
>(({ className, size, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="empty-title"
    className={cn(emptyTitleVariants({ size }), className)}
    {...props}
  />
));
EmptyTitle.displayName = 'EmptyTitle';

const EmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="empty-description"
    className={cn(
      'text-muted-foreground [&>a:hover]:text-primary mx-auto max-w-xs text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4',
      className,
    )}
    {...props}
  />
));
EmptyDescription.displayName = 'EmptyDescription';

const EmptyContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="empty-content"
      className={cn(
        'flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance',
        className,
      )}
      {...props}
    />
  ),
);
EmptyContent.displayName = 'EmptyContent';

export { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia };
