'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Lightbox } from './lightbox.js';

const galleryVariants = cva('w-full', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    columns: {
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
    },
    gap: {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-4',
    },
  },
  defaultVariants: { variant: 'default', columns: 3, gap: 'md' },
});

const thumbStyles: Record<string, string> = {
  default: 'rounded-md bg-muted ring-ring hover:ring-2',
  glass: 'glass rounded-xl ring-white/30 hover:ring-2',
  cyber: 'rounded-md border border-cyan-500/20 bg-black/50 ring-cyan-400 hover:ring-1',
};

export interface GalleryItem {
  src: string;
  alt?: string;
  thumbnail?: string;
}

export interface GalleryProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof galleryVariants> {
  items: GalleryItem[];
  /** Enable the built-in lightbox overlay (default true) */
  lightbox?: boolean;
}

const Gallery = React.forwardRef<HTMLDivElement, GalleryProps>(
  ({ className, variant = 'default', columns, gap, items, lightbox = true, ...props }, ref) => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);
    const v = variant ?? 'default';

    return (
      <>
        <div
          ref={ref}
          className={cn('grid', galleryVariants({ variant, columns, gap }), className)}
          {...props}
        >
          {items.map((item, i) =>
            lightbox ? (
              <button
                key={i}
                type="button"
                onClick={() => setOpenIndex(i)}
                className={cn(
                  'relative aspect-square overflow-hidden transition-all focus-visible:outline-none',
                  thumbStyles[v],
                )}
              >
                <img
                  src={item.thumbnail ?? item.src}
                  alt={item.alt ?? ''}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            ) : (
              <div
                key={i}
                className={cn(
                  'relative aspect-square overflow-hidden',
                  thumbStyles[v],
                )}
              >
                <img
                  src={item.thumbnail ?? item.src}
                  alt={item.alt ?? ''}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            ),
          )}
        </div>

        {lightbox && openIndex !== null && (
          <Lightbox
            images={items}
            variant={variant}
            open={openIndex !== null}
            initialIndex={openIndex}
            onOpenChange={(isOpen) => {
              if (!isOpen) setOpenIndex(null);
            }}
            onIndexChange={(idx) => setOpenIndex(idx)}
          />
        )}
      </>
    );
  },
);
Gallery.displayName = 'Gallery';

export { Gallery, galleryVariants };
