'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Card } from './card';

const ContentCard = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Card>>(
  ({ className, variant, padding = 'md', radius = '2xl', hover = true, ...props }, ref) => (
    <Card
      ref={ref}
      variant={variant}
      padding={padding}
      radius={radius}
      hover={hover}
      className={cn('flex flex-col overflow-hidden', className)}
      {...props}
    />
  ),
);
ContentCard.displayName = 'ContentCard';

const ContentCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4 flex flex-col gap-2', className)} {...props} />
  ),
);
ContentCardHeader.displayName = 'ContentCardHeader';

const contentCardTitleVariants = cva('font-bold transition-colors leading-tight tracking-tighter', {
  variants: {
    size: {
      sm: 'text-lg',
      default: 'text-xl',
      lg: 'text-2xl',
      xl: 'text-3xl',
      '2xl': 'text-4xl md:text-5xl',
    },
    variant: {
      default: 'text-foreground group-hover:text-primary',
      glass: 'text-foreground group-hover:text-cyan-400',
      cyber: 'text-foreground group-hover:text-cyan-400',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
});

const ContentCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & VariantProps<typeof contentCardTitleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <h3 ref={ref} className={cn(contentCardTitleVariants({ variant, size }), className)} {...props} />
));
ContentCardTitle.displayName = 'ContentCardTitle';

const ContentCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('line-clamp-3 text-sm leading-relaxed font-medium opacity-70', className)}
    {...props}
  />
));
ContentCardDescription.displayName = 'ContentCardDescription';

const ContentCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('z-10 flex-1', className)} {...props} />
  ),
);
ContentCardContent.displayName = 'ContentCardContent';

const ContentCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mt-auto flex items-center justify-between gap-4 border-t border-current/10 pt-6',
        className,
      )}
      {...props}
    />
  ),
);
ContentCardFooter.displayName = 'ContentCardFooter';

const contentCardImageVariants = cva('relative overflow-hidden transition-all duration-500', {
  variants: {
    aspect: {
      video: 'aspect-video',
      square: 'aspect-square',
      wide: 'aspect-[16/10]',
      auto: 'h-auto',
    },
    rounded: {
      default: 'rounded-xl',
      lg: 'rounded-[2rem]',
      none: 'rounded-none',
    },
  },
  defaultVariants: {
    aspect: 'video',
    rounded: 'default',
  },
});

const ContentCardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof contentCardImageVariants> & { src?: string; alt?: string }
>(({ className, src, alt, aspect, rounded, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(contentCardImageVariants({ aspect, rounded }), className)}
    {...props}
  >
    {src && (
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    )}
  </div>
));
ContentCardImage.displayName = 'ContentCardImage';

const ContentCardOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }
>(({ className, position = 'top-left', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute z-20 flex flex-col gap-2',
      position === 'top-left'
        ? 'top-6 left-6'
        : position === 'top-right'
          ? 'top-6 right-6'
          : position === 'bottom-left'
            ? 'bottom-6 left-6'
            : 'right-6 bottom-6',
      className,
    )}
    {...props}
  />
));
ContentCardOverlay.displayName = 'ContentCardOverlay';

const ContentCardGlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { color?: string }
>(({ className, color = 'glass bg-primary-100', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100',
      color,
      className,
    )}
    {...props}
  />
));
ContentCardGlow.displayName = 'ContentCardGlow';

const ContentCardMeta = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mb-4 flex items-center gap-4 text-[10px] font-black tracking-[0.2em] uppercase opacity-40',
        className,
      )}
      {...props}
    />
  ),
);
ContentCardMeta.displayName = 'ContentCardMeta';

export {
  ContentCard,
  ContentCardHeader,
  ContentCardTitle,
  ContentCardDescription,
  ContentCardContent,
  ContentCardFooter,
  ContentCardImage,
  ContentCardOverlay,
  ContentCardGlow,
  ContentCardMeta,
  contentCardTitleVariants,
  contentCardImageVariants,
};
