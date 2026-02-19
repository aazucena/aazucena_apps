'use client';

/** @shadcn standard component */
import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@aazucena/utils';
import { buttonVariants } from './button.js';

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 z-50 bg-background/80 dark:bg-black/80 backdrop-blur-sm',
      className,
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const alertDialogContentVariants = cva(
  'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-closed:slide-out-to-left-1/2 data-closed:slide-out-to-top-[48%] data-open:slide-in-from-left-1/2 data-open:slide-in-from-top-[48%] sm:rounded-lg',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        glass: 'glass text-foreground shadow-2xl',
        cyber: 'glass bg-primary-100 border-cyan-500/30 text-foreground shadow-[0_0_30px_rgba(6,182,212,0.2)] dark:bg-zinc-950/90 dark:text-cyan-50',
      },
      size: {
        default: 'max-w-lg',
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-[95vw]',
      },
      shaking: {
        true: '[animation:pulse-scale_0.3s_ease-in-out] [@keyframes_pulse-scale]:[0%,100%_=>_translate(-50%,-50%)_scale(1)][50%_=>_translate(-50%,-50%)_scale(1.02)]',
        false: '',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shaking: false,
    },
  },
);

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> &
    VariantProps<typeof alertDialogContentVariants>
>(({ className, variant, size, ...props }, ref) => {
  const [shake, setShake] = React.useState(false);

  const handleInteractOutside = React.useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  }, []);

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay onPointerDown={handleInteractOutside} />
      <AlertDialogPrimitive.Content
        ref={ref}
        onEscapeKeyDown={handleInteractOutside}
        className={cn(alertDialogContentVariants({ variant, size, shaking: shake }), className)}
        {...props}
      />
    </AlertDialogPortal>
  );
});
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const alertDialogFooterVariants = cva(
  'flex flex-col-reverse sm:flex-row sm:space-x-2',
  {
    variants: {
      alignment: {
        start: 'sm:justify-start sm:space-x-reverse sm:flex-row-reverse',
        center: 'sm:justify-center',
        end: 'sm:justify-end',
        between: 'sm:justify-between sm:flex-row-reverse',
        stacked: 'flex-col space-y-2 space-y-reverse',
      },
    },
    defaultVariants: {
      alignment: 'end',
    },
  },
);

const AlertDialogFooter = ({ 
  className, 
  alignment,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertDialogFooterVariants>) => (
  <div
    className={cn(alertDialogFooterVariants({ alignment }), className)}
    {...props}
  />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
