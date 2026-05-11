/** @shadcn standard component */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, Dots as MoreHorizontal } from '@aazucena/icons';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = 'Breadcrumb';

const breadcrumbListVariants = cva(
  'flex flex-wrap items-center gap-1.5 break-words text-sm sm:gap-2.5',
  {
    variants: {
      variant: {
        default: 'text-muted-foreground',
        glass: 'text-muted-foreground dark:text-white/60',
        cyber: 'text-cyan-600 dark:text-cyan-500/60',
        intel: 'text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'> & VariantProps<typeof breadcrumbListVariants>
>(({ className, variant, ...props }, ref) => (
  <ol ref={ref} className={cn(breadcrumbListVariants({ variant }), className)} {...props} />
));
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
  ),
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

const breadcrumbLinkVariants = cva('transition-colors', {
  variants: {
    variant: {
      default: 'hover:text-foreground',
      glass: 'hover:text-foreground dark:hover:text-white',
      cyber: 'hover:text-cyan-700 dark:hover:text-cyan-400',
      intel: 'hover:text-primary',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> &
    VariantProps<typeof breadcrumbLinkVariants> & {
      asChild?: boolean;
    }
>(({ asChild, className, variant, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp ref={ref} className={cn(breadcrumbLinkVariants({ variant }), className)} {...props} />
  );
});
BreadcrumbLink.displayName = 'BreadcrumbLink';

const breadcrumbPageVariants = cva('font-normal', {
  variants: {
    variant: {
      default: 'text-foreground',
      glass: 'text-foreground dark:text-white',
      cyber: 'text-cyan-600 dark:text-cyan-400',
      intel: 'text-primary',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'> & VariantProps<typeof breadcrumbPageVariants>
>(({ className, variant, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn(breadcrumbPageVariants({ variant }), className)}
    {...props}
  />
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

const breadcrumbSeparatorVariants = cva('[&>svg]:w-3.5 [&>svg]:h-3.5', {
  variants: {
    variant: {
      default: '',
      glass: 'text-muted-foreground/40 dark:text-white/40',
      cyber: 'text-foreground0/40',
      intel: 'text-muted-foreground/40 font-normal',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const BreadcrumbSeparator = ({
  children,
  className,
  variant,
  ...props
}: React.ComponentProps<'li'> & VariantProps<typeof breadcrumbSeparatorVariants>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn(breadcrumbSeparatorVariants({ variant }), className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const breadcrumbEllipsisVariants = cva('flex h-9 w-9 items-center justify-center', {
  variants: {
    variant: {
      default: '',
      glass: 'text-foreground/60',
      cyber: 'text-foreground0/60',
      intel: 'text-muted-foreground/60',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const BreadcrumbEllipsis = ({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof breadcrumbEllipsisVariants>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(breadcrumbEllipsisVariants({ variant }), className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
