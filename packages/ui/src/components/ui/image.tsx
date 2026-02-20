'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const imageVariants = cva('relative overflow-hidden', {
  variants: {
    variant: {
      default: 'bg-muted',
      glass: 'glass',
      cyber: 'border border-cyan-500/20 bg-black/50',
    },
    radius: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    objectFit: {
      cover: '[&_img]:object-cover',
      contain: '[&_img]:object-contain',
      fill: '[&_img]:object-fill',
      none: '[&_img]:object-none',
    },
  },
  defaultVariants: {
    variant: 'default',
    radius: 'md',
    objectFit: 'cover',
  },
});

export interface ImageProps
  extends
    Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder'>,
    VariantProps<typeof imageVariants> {
  fallback?: React.ReactNode;
  aspectRatio?: string;
}

const ImageComponent = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    { className, variant, radius, objectFit, fallback, aspectRatio, src, alt, style, ...props },
    ref,
  ) => {
    const [status, setStatus] = React.useState<'loading' | 'loaded' | 'error'>('loading');

    React.useEffect(() => {
      if (src) setStatus('loading');
    }, [src]);

    return (
      <div
        className={cn(imageVariants({ variant, radius, objectFit }), className)}
        style={{ aspectRatio, ...style }}
      >
        {/* Skeleton */}
        {status === 'loading' && <div className="bg-muted absolute inset-0 animate-pulse" />}
        {/* Error fallback */}
        {status === 'error' && (
          <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
            {fallback ?? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            )}
          </div>
        )}
        {src && (
          <img
            ref={ref}
            src={src}
            alt={alt ?? ''}
            loading="lazy"
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
            className={cn(
              'h-full w-full transition-opacity duration-300',
              status === 'loaded' ? 'opacity-100' : 'opacity-0',
            )}
            {...props}
          />
        )}
      </div>
    );
  },
);
ImageComponent.displayName = 'Image';

export { ImageComponent as Image, imageVariants };
