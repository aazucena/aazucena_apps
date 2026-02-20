'use client';

/** @shadcn standard component */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Input } from './input.js';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './sheet.js';
import { useSidebar } from './sidebar-context.js';
import { SIDEBAR_WIDTH_MOBILE } from './sidebar-provider.js';

export const sidebarVariants = cva('flex h-full flex-col transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-sidebar text-sidebar-foreground',
      glass:
        'bg-background/5 dark:bg-white/5 backdrop-blur-xl border-r border-border/10 text-foreground',
      cyber:
        'bg-background/90 dark:bg-black/90 border-r border-border/10 dark:border-cyan-500/40 text-foreground shadow-[0_0_30px_rgba(6,182,212,0.1)]',
      floating: 'bg-sidebar text-sidebar-foreground',
      inset: 'bg-sidebar text-sidebar-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> &
    VariantProps<typeof sidebarVariants> & {
      side?: 'left' | 'right';
      collapsible?: 'offcanvas' | 'icon' | 'none';
    }
>(
  (
    {
      side = 'left',
      variant = 'default',
      collapsible = 'offcanvas',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === 'none') {
      return (
        <div
          className={cn(sidebarVariants({ variant }), 'w-[--sidebar-width]', className)}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            variant={variant === 'glass' ? 'glass' : variant === 'cyber' ? 'cyber' : 'default'}
            className="w-[--sidebar-width] p-0 [&>button]:hidden"
            style={{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
            side={side}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block"
        data-state={state}
        data-collapsible={state === 'collapsed' ? collapsible : ''}
        data-variant={variant}
        data-side={side}
      >
        <div
          className={cn(
            'relative w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear',
            'group-data-[collapsible=offcanvas]:w-0',
            'group-data-[side=right]:rotate-180',
            variant === 'floating' || (variant as any) === 'inset'
              ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
              : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]',
          )}
        />
        <div
          className={cn(
            'fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex',
            side === 'left'
              ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
              : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
            variant === 'floating' || (variant as any) === 'inset'
              ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
              : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]',
            className,
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className={cn(
              sidebarVariants({ variant }),
              'flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow',
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);
Sidebar.displayName = 'Sidebar';

export const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => (
  <Input
    ref={ref}
    data-sidebar="input"
    className={cn(
      'bg-background focus-visible:ring-sidebar-ring h-8 w-full shadow-none focus-visible:ring-2',
      className,
    )}
    {...props}
  />
));
SidebarInput.displayName = 'SidebarInput';

export * from './sidebar-context.js';
export * from './sidebar-provider.js';
export * from './sidebar-menu.js';
export * from './sidebar-group.js';
export * from './sidebar-actions.js';
export * from './sidebar-layout.js';
export * from './sidebar-block.js';
