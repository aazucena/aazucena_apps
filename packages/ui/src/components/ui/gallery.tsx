'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

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
}

const Gallery = React.forwardRef<HTMLDivElement, GalleryProps>(
  ({ className, variant = 'default', columns, gap, items, ...props }, ref) => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);
    const v = variant ?? 'default';

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (openIndex === null) return;
        if (e.key === 'Escape') setOpenIndex(null);
        if (e.key === 'ArrowRight') setOpenIndex((openIndex + 1) % items.length);
        if (e.key === 'ArrowLeft') setOpenIndex((openIndex - 1 + items.length) % items.length);
      },
      [openIndex, items.length],
    );

    return (
      <>
        <div
          ref={ref}
          className={cn('grid', galleryVariants({ variant, columns, gap }), className)}
          {...props}
        >
          {items.map((item, i) => (
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
          ))}
        </div>

        {/* Lightbox */}
        {openIndex !== null && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setOpenIndex(null)}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            ref={(el) => el?.focus()}
          >
            <div
              className="relative max-h-[85vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={items[openIndex]!.src}
                alt={items[openIndex]!.alt ?? ''}
                className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
              />
              {/* Close */}
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                className="bg-background text-foreground absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full shadow-lg"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
              {/* Nav */}
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setOpenIndex((openIndex - 1 + items.length) % items.length)}
                    className="bg-background/80 text-foreground absolute top-1/2 -left-12 -translate-y-1/2 rounded-full p-2 shadow-lg"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenIndex((openIndex + 1) % items.length)}
                    className="bg-background/80 text-foreground absolute top-1/2 -right-12 -translate-y-1/2 rounded-full p-2 shadow-lg"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {items.length > 1 && (
              <div className="absolute bottom-4 flex gap-1.5">
                {items.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenIndex(i);
                    }}
                    className={cn(
                      'h-12 w-12 overflow-hidden rounded border-2 transition-all',
                      i === openIndex
                        ? 'border-white opacity-100'
                        : 'border-transparent opacity-50 hover:opacity-80',
                    )}
                  >
                    <img
                      src={item.thumbnail ?? item.src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </>
    );
  },
);
Gallery.displayName = 'Gallery';

export { Gallery, galleryVariants };
