'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const shellVariants = cva('flex h-screen w-full overflow-hidden transition-colors duration-500', {
  variants: {
    variant: {
      default: 'bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100',
      cyber: 'bg-background dark:bg-black text-foreground',
      glass: 'bg-background text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Shell = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof shellVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(shellVariants({ variant }), className)} {...props} />
));
Shell.displayName = 'Shell';

const ShellSidebar = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn('flex h-full shrink-0 flex-col border-r border-current/5', className)}
      {...props}
    />
  ),
);
ShellSidebar.displayName = 'ShellSidebar';

const ShellView = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative flex h-full min-w-0 flex-1 flex-col', className)}
      {...props}
    />
  ),
);
ShellView.displayName = 'ShellView';

const shellHeaderVariants = cva(
  'h-14 shrink-0 z-40 flex items-center px-6 border-b transition-all duration-300',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-md border-zinc-200 dark:border-zinc-800',
        glass: 'bg-background/20 backdrop-blur-xl border-border/10',
        cyber:
          'bg-background/80 dark:bg-black/80 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const ShellHeader = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & VariantProps<typeof shellHeaderVariants>
>(({ className, variant, ...props }, ref) => (
  <header ref={ref} className={cn(shellHeaderVariants({ variant }), className)} {...props} />
));
ShellHeader.displayName = 'ShellHeader';

const ShellMain = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <main
      ref={ref}
      className={cn('custom-scrollbar relative flex-1 overflow-y-auto', className)}
      {...props}
    />
  ),
);
ShellMain.displayName = 'ShellMain';

const ShellContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  }
>(({ className, maxWidth = '7xl', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mx-auto w-full p-8',
      maxWidth === 'sm' && 'max-w-md',
      maxWidth === 'md' && 'max-w-2xl',
      maxWidth === 'lg' && 'max-w-4xl',
      maxWidth === 'xl' && 'max-w-5xl',
      maxWidth === '2xl' && 'max-w-6xl',
      maxWidth === '7xl' && 'max-w-7xl',
      maxWidth === 'full' && 'max-w-none',
      className,
    )}
    {...props}
  />
));
ShellContent.displayName = 'ShellContent';

export {
  Shell,
  ShellSidebar,
  ShellView,
  ShellHeader,
  ShellMain,
  ShellContent,
  shellVariants,
  shellHeaderVariants,
};
