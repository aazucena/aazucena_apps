'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { IconRenderer } from './icon-renderer';
import { Astro, React as ReactIcon, Tailwind, Vite } from '@aazucena/icons';

const techStackVariants = cva('flex items-center gap-6 transition-all duration-300', {
  variants: {
    variant: {
      default: 'opacity-40 hover:opacity-100',
      bright: 'opacity-100',
      cyber: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const TechStack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof techStackVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(techStackVariants({ variant }), className)} {...props} />
));
TechStack.displayName = 'TechStack';

const TechStackGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-wrap items-center gap-5', className)} {...props} />
  ),
);
TechStackGroup.displayName = 'TechStackGroup';

const techStackItemVariants = cva(
  'transition-all duration-300 cursor-default flex items-center gap-2',
  {
    variants: {
      variant: {
        default: 'hover:text-foreground grayscale hover:grayscale-0',
        cyber: 'hover:text-cyan-400 hover:scale-110',
        color: 'grayscale-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const TechStackItem = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof techStackItemVariants>
>(({ className, variant, ...props }, ref) => (
  <span ref={ref} className={cn(techStackItemVariants({ variant }), className)} {...props} />
));
TechStackItem.displayName = 'TechStackItem';

const TechStackIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { name: string; iconUrl?: string }
>(({ className, name, iconUrl, ...props }, ref) => {
  // Built-in SVG fallbacks for common technologies
  const builtInIcons: Record<string, any> = {
    Astro: Astro,
    React: ReactIcon,
    Tailwind: Tailwind,
    Vite: Vite,
  };

  const Icon = builtInIcons[name] || builtInIcons[name.replace(' CSS', '')];

  return (
    <div ref={ref} className={cn('h-5 w-5', className)} {...props}>
      <IconRenderer icon={iconUrl || Icon} className="h-full w-full" />
    </div>
  );
});
TechStackIcon.displayName = 'TechStackIcon';

const TechStackLabel = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('text-[10px] font-bold tracking-wider uppercase', className)}
      {...props}
    />
  ),
);
TechStackLabel.displayName = 'TechStackLabel';

export {
  TechStack,
  TechStackGroup,
  TechStackItem,
  TechStackIcon,
  TechStackLabel,
  techStackVariants,
  techStackItemVariants,
};
