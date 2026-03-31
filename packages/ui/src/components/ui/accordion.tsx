'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Plus } from '@aazucena/icons';
import { IconRenderer } from './icon-renderer';

const accordionVariants = cva('flex w-full flex-col', {
  variants: {
    variant: {
      default: '',
      card: 'border border-border rounded-xl bg-card/50 overflow-hidden divide-y divide-border',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

function Accordion({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & VariantProps<typeof accordionVariants>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(accordionVariants({ variant }), className)}
      {...props}
    />
  );
}

const accordionItemVariants = cva('', {
  variants: {
    variant: {
      default: 'border-b last:border-b-0 border-border px-0',
      card: 'border-none px-4 bg-transparent transition-colors hover:bg-muted/30 data-[state=open]:bg-muted/50',
      glass: 'glass rounded-lg px-4 mb-2 border-b-0 shadow-sm dark:text-white',
      cyber:
        'glass bg-primary-100 border-cyan-500/30 text-foreground shadow-[0_0_15px_rgba(6,182,212,0.1)] rounded-lg px-4 mb-2 border-b-0 dark:bg-background/80 dark:bg-black/80 dark:text-cyan-50',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> &
    VariantProps<typeof accordionItemVariants>
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    data-slot="accordion-item"
    className={cn(accordionItemVariants({ variant }), className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const accordionTriggerVariants = cva(
  'focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:after:border-ring rounded-lg py-4 text-left text-sm font-medium hover:underline focus-visible:ring-3 group/accordion-trigger relative flex flex-1 items-center justify-between transition-all outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        card: 'py-5',
        glass: 'hover:text-primary dark:hover:text-white/80',
        cyber: 'hover:text-cyan-600 dark:hover:text-cyan-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> &
    VariantProps<typeof accordionTriggerVariants> & {
      icon?: any;
      openIcon?: any;
      iconAnimation?: 'rotate' | 'rotate-90' | 'rotate-45' | 'flip-v' | 'flip-h' | 'none';
      hideIcon?: boolean;
      headerClassName?: string;
      iconClassName?: string;
    }
>(
  (
    {
      className,
      variant,
      children,
      icon = Plus,
      openIcon,
      iconAnimation = 'rotate',
      hideIcon = false,
      headerClassName,
      iconClassName,
      ...props
    },
    ref,
  ) => {
    const isPlus = icon === Plus || icon === 'Plus';

    // Logic for animation classes
    let animationClass = '';

    if (iconAnimation !== 'none' && !openIcon) {
      switch (iconAnimation) {
        case 'rotate-90':
          animationClass = '[&[data-state=open]_[data-slot=accordion-trigger-icon]]:rotate-90';
          break;
        case 'rotate-45':
          animationClass = '[&[data-state=open]_[data-slot=accordion-trigger-icon]]:rotate-45';
          break;
        case 'flip-v':
          animationClass = '[&[data-state=open]_[data-slot=accordion-trigger-icon]]:scale-y-[-1]';
          break;
        case 'flip-h':
          animationClass = '[&[data-state=open]_[data-slot=accordion-trigger-icon]]:scale-x-[-1]';
          break;
        case 'rotate':
        default:
          animationClass = isPlus
            ? '[&[data-state=open]_[data-slot=accordion-trigger-icon]]:rotate-45'
            : '[&[data-state=open]_[data-slot=accordion-trigger-icon]]:rotate-180';
          break;
      }
    }

    return (
      <AccordionPrimitive.Header className={cn('flex', headerClassName)}>
        <AccordionPrimitive.Trigger
          ref={ref}
          data-slot="accordion-trigger"
          className={cn(accordionTriggerVariants({ variant }), animationClass, className)}
          {...props}
        >
          {children}
          {!hideIcon && (
            <div className="relative flex h-4 w-4 items-center justify-center">
              {openIcon ? (
                <>
                  <IconRenderer
                    icon={icon}
                    data-slot="accordion-trigger-icon"
                    className={cn(
                      'text-muted-foreground pointer-events-none absolute h-4 w-4 shrink-0 transition-all duration-200 group-data-[state=open]/accordion-trigger:scale-0 group-data-[state=open]/accordion-trigger:opacity-0',
                      variant === 'cyber' && 'text-foreground',
                      iconClassName,
                    )}
                  />
                  <IconRenderer
                    icon={openIcon}
                    data-slot="accordion-trigger-icon"
                    className={cn(
                      'text-muted-foreground pointer-events-none absolute h-4 w-4 shrink-0 scale-0 opacity-0 transition-all duration-200 group-data-[state=open]/accordion-trigger:scale-100 group-data-[state=open]/accordion-trigger:opacity-100',
                      variant === 'cyber' && 'text-foreground',
                      iconClassName,
                    )}
                  />
                </>
              ) : (
                <IconRenderer
                  icon={icon}
                  data-slot="accordion-trigger-icon"
                  className={cn(
                    'text-muted-foreground pointer-events-none h-4 w-4 shrink-0 transition-transform duration-200',
                    variant === 'cyber' && 'text-foreground',
                    iconClassName,
                  )}
                />
              )}
            </div>
          )}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  },
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    data-slot="accordion-content"
    className="data-open:animate-accordion-down data-closed:animate-accordion-up overflow-hidden text-sm"
    {...props}
  >
    <div className={cn('pt-0 pb-4', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
