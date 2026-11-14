'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Separator } from './separator';

/**
 * Sidebar Layout Components
 */

export const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<'main'>>(
  ({ className, ...props }, ref) => (
    <main
      ref={ref}
      className={cn(
        'bg-background relative flex w-full flex-1 flex-col',
        'md:peer-data-[variant=inset]:rounded-card md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2',
        className,
      )}
      {...props}
    />
  ),
);
SidebarInset.displayName = 'SidebarInset';

export const sidebarHeaderVariants = cva('flex flex-col gap-2 p-2', {
  variants: {
    variant: {
      default: '',
      glass: 'border-b border-border/10 dark:border-rule bg-background/5 dark:bg-state',
      cyber: 'border-b border-border/10 dark:border-signal/20 bg-background/80 dark:bg-panel',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & VariantProps<typeof sidebarHeaderVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="header"
    className={cn(sidebarHeaderVariants({ variant }), className)}
    {...props}
  />
));
SidebarHeader.displayName = 'SidebarHeader';

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  ),
);
SidebarFooter.displayName = 'SidebarFooter';

export const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    data-sidebar="separator"
    className={cn('bg-sidebar-border mx-2 w-auto', className)}
    {...props}
  />
));
SidebarSeparator.displayName = 'SidebarSeparator';

export const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className,
      )}
      {...props}
    />
  ),
);
SidebarContent.displayName = 'SidebarContent';
