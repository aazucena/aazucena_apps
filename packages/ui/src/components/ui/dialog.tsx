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
      'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 z-50 bg-background/80 dark:bg-black/80 backdrop-blur-sm',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogContentVariants = cva(
  'fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border shadow-lg duration-200 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-closed:slide-out-to-left-1/2 data-closed:slide-out-to-top-[48%] data-open:slide-in-from-left-1/2 data-open:slide-in-from-top-[48%] overflow-hidden transition-all',
  {
    variants: {
      variant: {
        default: 'bg-background rounded-lg p-6 text-foreground',
        glass: 'glass text-foreground dark:text-white shadow-2xl rounded-[2rem] p-6',
        cyber:
          'bg-primary/5 border-cyan-500/40 text-foreground shadow-[0_0_30px_rgba(6,182,212,0.2)] rounded-3xl p-6 dark:bg-black/90 dark:text-cyan-50',
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
      <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-open:bg-accent data-open:text-muted-foreground absolute top-4 right-4 z-50 rounded-full bg-background/10 dark:bg-white/10 p-2 text-foreground opacity-70 transition-all hover:scale-110 hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
        <Cross2Icon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-1.5 p-6 text-center sm:text-left', className)}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogHero = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'cyber' }
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex h-32 items-end overflow-hidden p-6',
      variant === 'cyber'
        ? 'border-b border-border/10 dark:border-cyan-500/20 bg-background/40 dark:bg-cyan-950/40'
        : 'from-primary/20 bg-gradient-to-r via-blue-600/20 to-purple-600/20',
      className,
    )}
    {...props}
  >
    <div className="bg-grid-white/[0.02] absolute inset-0 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
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
      'flex h-16 w-16 items-center justify-center rounded-xl border-4 text-3xl shadow-xl transition-transform duration-500 hover:scale-110',
      variant === 'cyber'
        ? 'border-cyan-500/20 bg-background dark:bg-black text-cyan-400'
        : 'text-primary border-border/20 bg-white dark:bg-gray-800',
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
      'flex flex-col-reverse border-t border-border p-6 sm:flex-row sm:justify-end sm:space-x-2',
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
