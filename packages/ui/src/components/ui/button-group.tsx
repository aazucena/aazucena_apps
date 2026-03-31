'use client';

/** @shadcn standard component */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Separator } from './separator';

const buttonGroupVariants = cva('flex items-center transition-all duration-300', {
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
    variant: {
      default:
        'w-fit items-stretch [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none',
      actions: 'flex-col sm:flex-row items-center justify-center gap-4 mt-6 w-full sm:w-auto',
      inline: 'flex-row gap-2 items-center',
      glass:
        'bg-background/5 dark:bg-white/5 backdrop-blur-md rounded-xl border border-border/10 w-fit items-stretch [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none overflow-hidden',
      cyber:
        'bg-background/40 dark:bg-black/40 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] w-fit items-stretch [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none overflow-hidden',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'default',
  },
});

const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof buttonGroupVariants>
>(({ className, orientation, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    className={cn(buttonGroupVariants({ orientation, variant }), className)}
    {...props}
  />
));
ButtonGroup.displayName = 'ButtonGroup';

const buttonGroupItemVariants = cva(
  'inline-flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer font-bold',
  {
    variants: {
      variant: {
        default: '',
        cta: 'px-10 py-5 rounded-[1.5rem] bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 text-xs uppercase tracking-[0.2em]',
        outline:
          'px-10 py-5 rounded-[1.5rem] border border-border bg-background hover:bg-accent text-foreground text-xs uppercase tracking-[0.2em]',
        glass:
          'px-10 py-5 rounded-[1.5rem] bg-background/10 dark:bg-white/10 backdrop-blur-md border border-border/20 text-foreground hover:bg-white/20 shadow-xl text-xs uppercase tracking-[0.2em]',
        cyber:
          'px-10 py-5 rounded-[1.5rem] bg-background dark:bg-black border border-cyan-500/40 text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] shadow-[0_0_10px_rgba(6,182,212,0.1)] text-xs uppercase tracking-[0.2em]',
        gradient:
          'px-10 py-5 rounded-[1.5rem] bg-gradient-to-r from-cyan-400 to-blue-500 text-foreground hover:opacity-90 shadow-lg shadow-cyan-400/20 text-xs uppercase tracking-[0.2em]',
      },
      size: {
        sm: 'px-6 py-2 text-[10px]',
        default: '',
        lg: 'px-12 py-6 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const ButtonGroupItem = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  any & VariantProps<typeof buttonGroupItemVariants>
>(({ className, variant, size, as: Component = 'button', ...props }, ref) => (
  <Component
    ref={ref}
    className={cn(buttonGroupItemVariants({ variant, size }), className)}
    {...props}
  />
));
ButtonGroupItem.displayName = 'ButtonGroupItem';

const buttonGroupTextVariants = cva(
  "shadow-xs flex items-center gap-2 rounded-md border px-4 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none transition-all duration-300",
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground border-border',
        glass: 'bg-background/10 dark:bg-white/10 text-foreground border-border/20',
        cyber:
          'bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-400 border-border dark:border-cyan-500/30 font-black uppercase tracking-widest italic',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function ButtonGroupText({
  className,
  asChild = false,
  variant,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof buttonGroupTextVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'div';

  return <Comp className={cn(buttonGroupTextVariants({ variant }), className)} {...props} />;
}

function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        'bg-input relative !m-0 self-stretch data-[orientation=vertical]:h-auto',
        className,
      )}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupItem,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
  buttonGroupItemVariants,
};
