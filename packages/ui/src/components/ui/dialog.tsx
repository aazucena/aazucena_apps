'use client';

/** @shadcn standard component */
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { X as Cross2Icon } from '@aazucena/icons';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-scrim fixed inset-0 z-(--z-overlay)',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogContentVariants = cva(
  'fixed top-1/2 left-1/2 z-(--z-modal) grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border duration-200 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-closed:slide-out-to-left-1/2 data-closed:slide-out-to-top-[48%] data-open:slide-in-from-left-1/2 data-open:slide-in-from-top-[48%] overflow-hidden transition-all',
  {
    variants: {
      variant: {
        default: 'bg-panel-raised rounded-card p-6 text-foreground',
        glass: 'glass text-foreground rounded-card p-6',
        cyber: 'border-signal/40 bg-panel-raised text-foreground rounded-card p-6',
      },
      size: {
        default: 'max-w-lg',
        sm: 'max-w-sm',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[95vw] h-[90vh]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
    VariantProps<typeof dialogContentVariants>
>(({ className, children, variant, size, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants({ variant, size }), className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="rounded-control text-muted-foreground hover:bg-state hover:text-foreground focus-visible:outline-signal absolute top-3 right-3 z-10 p-2 transition-colors outline-none focus-visible:outline-1 focus-visible:outline-solid disabled:pointer-events-none">
        <Cross2Icon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogHero = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'cyber' }
>(({ className, variant, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex h-32 items-end overflow-hidden p-6',
      variant === 'cyber'
        ? 'border-border/10 bg-background/40 dark:border-signal/20 dark:bg-panel-raised/40 border-b'
        : '',
      className,
    )}
    {...props}
  >
    <div className="bg-grid-white/[0.02] absolute inset-0 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
    {children}
  </div>
));
DialogHero.displayName = 'DialogHero';

const DialogIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'cyber' }
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-card flex h-16 w-16 items-center justify-center border-4 text-3xl transition-transform duration-500 hover:scale-110',
      variant === 'cyber'
        ? 'bg-background border-signal/20 text-signal'
        : 'text-primary border-border/20 bg-panel dark:bg-panel-raised',
      className,
    )}
    {...props}
  />
));
DialogIcon.displayName = 'DialogIcon';

const DialogBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('custom-scrollbar overflow-y-auto p-6', className)} {...props} />
  ),
);
DialogBody.displayName = 'DialogBody';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'border-border flex flex-col-reverse border-t p-6 sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg leading-none font-bold tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-muted-foreground text-sm opacity-70', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogHero,
  DialogIcon,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
