'use client';

import { ExternalLink } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const linkMenuVariants = cva('flex flex-col', {
  variants: {
    variant: {
      default: 'space-y-4',
      card: 'rounded-card border p-6 bg-card border-border space-y-6',
      glass:
        'rounded-card border p-6 bg-background/5 dark:bg-state border-border/10 text-foreground space-y-6',
      cyber:
        'rounded-card border p-6 bg-background/80 dark:bg-panel border-signal/30 text-foreground space-y-6',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const LinkMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof linkMenuVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(linkMenuVariants({ variant }), className)} {...props} />
));
LinkMenu.displayName = 'LinkMenu';

const LinkMenuHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mb-2 flex items-center justify-between border-b border-current/10 pb-3',
        className,
      )}
      {...props}
    />
  ),
);
LinkMenuHeader.displayName = 'LinkMenuHeader';

const LinkMenuTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-bold tracking-tight opacity-90', className)}
    {...props}
  />
));
LinkMenuTitle.displayName = 'LinkMenuTitle';

const LinkMenuList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('space-y-3', className)} {...props} />
  ),
);
LinkMenuList.displayName = 'LinkMenuList';

const linkMenuItemVariants = cva(
  'group flex items-start gap-3 rounded-card border border-transparent p-3 transition-colors duration-(--motion-base)',
  {
    variants: {
      variant: {
        default: 'hover:border-border hover:bg-muted',
        glass: 'hover:border-border/20 hover:bg-background/10 dark:bg-state',
        cyber:
          'hover:border-border/40 dark:hover:border-signal/40 hover:bg-primary/10 dark:hover:bg-signal/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const LinkMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('', className)} {...props} />,
);
LinkMenuItem.displayName = 'LinkMenuItem';

const LinkMenuLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
    VariantProps<typeof linkMenuItemVariants> & { label?: string }
>(({ className, variant, label, ...props }, ref) => (
  <a
    ref={ref}
    aria-label={label || (typeof props.children === 'string' ? props.children : undefined)}
    className={cn(linkMenuItemVariants({ variant }), className)}
    {...props}
  />
));
LinkMenuLink.displayName = 'LinkMenuLink';

const linkMenuIconVariants = cva(
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-control transition duration-(--motion-base) group-hover:scale-110',
  {
    variants: {
      variant: {
        default: 'bg-muted text-foreground group-hover:text-primary',
        glass: 'bg-background/10 dark:bg-state text-foreground',
        cyber:
          'bg-primary/20 dark:bg-signal/20 text-primary dark:text-signal border border-border/10 dark:border-signal/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const LinkMenuIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof linkMenuIconVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(linkMenuIconVariants({ variant }), className)} {...props} />
));
LinkMenuIcon.displayName = 'LinkMenuIcon';

const LinkMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)} {...props} />
  ),
);
LinkMenuContent.displayName = 'LinkMenuContent';

const LinkMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'group-hover:text-primary truncate text-sm font-bold opacity-90 transition-colors',
        className,
      )}
      {...props}
    />
  ),
);
LinkMenuLabel.displayName = 'LinkMenuLabel';

const LinkMenuDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('line-clamp-2 text-xs leading-relaxed opacity-60', className)}
    {...props}
  />
));
LinkMenuDescription.displayName = 'LinkMenuDescription';

const LinkMenuExternal = React.forwardRef<
  SVGSVGElement,
  React.ComponentPropsWithoutRef<typeof ExternalLink>
>(({ className, ...props }, ref) => (
  <ExternalLink
    ref={ref}
    size={14}
    className={cn('ml-auto opacity-0 transition-opacity group-hover:opacity-40', className)}
    {...props}
  />
));
LinkMenuExternal.displayName = 'LinkMenuExternal';

export {
  LinkMenu,
  LinkMenuContent,
  LinkMenuDescription,
  LinkMenuExternal,
  LinkMenuHeader,
  LinkMenuIcon,
  linkMenuIconVariants,
  LinkMenuItem,
  linkMenuItemVariants,
  LinkMenuLabel,
  LinkMenuLink,
  LinkMenuList,
  LinkMenuTitle,
  linkMenuVariants,
};
