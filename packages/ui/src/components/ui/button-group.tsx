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
        'bg-background/5 dark:bg-state rounded-card border border-border/10 w-fit items-stretch [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none overflow-hidden',
      cyber:
        'bg-background/40 dark:bg-panel rounded-control border border-signal/30 w-fit items-stretch [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none overflow-hidden',
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
        cta: 'px-10 py-5 rounded-card bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase tracking-[0.2em]',
        outline:
          'px-10 py-5 rounded-card border border-border bg-background hover:bg-state text-foreground text-xs uppercase tracking-[0.2em]',
        glass:
          'px-10 py-5 rounded-card bg-background/10 dark:bg-state border border-border/20 text-foreground hover:bg-panel-raised text-xs uppercase tracking-[0.2em]',
        cyber:
          'px-10 py-5 rounded-card bg-background border border-signal/40 text-signal hover:border-signal text-xs uppercase tracking-[0.2em]',
        gradient:
          'px-10 py-5 rounded-card text-foreground hover:opacity-90 text-xs uppercase tracking-[0.2em]',
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
  "flex items-center gap-2 rounded-control border px-4 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none transition-all duration-300",
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground border-border',
        glass: 'bg-background/10 dark:bg-state text-foreground border-border/20',
        cyber:
          'bg-primary/10 dark:bg-signal/10 text-primary dark:text-signal border-border dark:border-signal/30 font-black uppercase tracking-widest italic',
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
