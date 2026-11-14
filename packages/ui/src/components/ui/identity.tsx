'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const identityVariants = cva('flex flex-col md:flex-row items-center md:items-start gap-12', {
  variants: {
    variant: {
      default: '',
      glass: 'text-foreground',
      cyber: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Identity = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof identityVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(identityVariants({ variant }), className)} {...props} />
));
Identity.displayName = 'Identity';

const IdentityProfile = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { src?: string; alt?: string }
>(({ className, src, alt, ...props }, ref) => (
  <div ref={ref} className={cn('group relative flex-shrink-0', className)} {...props}>
    <div className="rounded-card absolute inset-0 opacity-20 blur-2xl transition-opacity duration-(--motion-base) group-hover:opacity-40" />
    <div className="border-border rounded-card relative h-48 w-48 overflow-hidden border-2 md:h-64 md:w-64">
      {src && (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      )}
    </div>
  </div>
));
IdentityProfile.displayName = 'IdentityProfile';

const IdentityContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('my-auto flex-1 space-y-6 text-center md:text-left', className)}
      {...props}
    />
  ),
);
IdentityContent.displayName = 'IdentityContent';

const identityNameVariants = cva(
  'text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        cyber: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const IdentityName = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & VariantProps<typeof identityNameVariants>
>(({ className, variant, children, ...props }, ref) => (
  <h1 ref={ref} className={cn(identityNameVariants({ variant }), className)} {...props}>
    {children}
  </h1>
));
IdentityName.displayName = 'IdentityName';

const IdentityFirst = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('text-signal', className)} {...props} />
  ),
);
IdentityFirst.displayName = 'IdentityFirst';

const IdentityOccupation = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-2xl font-bold tracking-tight opacity-50 md:text-3xl', className)}
    {...props}
  />
));
IdentityOccupation.displayName = 'IdentityOccupation';

export {
  Identity,
  IdentityProfile,
  IdentityContent,
  IdentityName,
  IdentityFirst,
  IdentityOccupation,
  identityVariants,
  identityNameVariants,
};
