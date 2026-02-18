'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const lightboxOverlayVariants = cva(
  'fixed inset-0 z-50 flex items-center justify-center',
  {
    variants: {
      variant: {
        default: 'bg-black/80 backdrop-blur-sm',
        glass: 'bg-black/40 backdrop-blur-xl',
        cyber: 'bg-black/90 backdrop-blur-sm',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

const lightboxCloseVariants = cva(
  'absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition-opacity hover:opacity-80',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        glass: 'bg-white/20 text-white backdrop-blur-sm border border-white/20',
        cyber: 'bg-black text-cyan-400 border border-cyan-500/40',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

const lightboxNavVariants = cva(
  'absolute top-1/2 -translate-y-1/2 rounded-full p-2 shadow-lg transition-opacity hover:opacity-80',
  {
    variants: {
      variant: {
        default: 'bg-background/80 text-foreground',
        glass: 'bg-white/20 text-white backdrop-blur-sm border border-white/20',
        cyber: 'bg-black/80 text-cyan-400 border border-cyan-500/40',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

const lightboxCaptionVariants = cva(
  'absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-sm max-w-sm text-center',
  {
    variants: {
      variant: {
        default: 'bg-black/60 text-white backdrop-blur-sm',
        glass: 'bg-white/10 text-white backdrop-blur-md border border-white/20',
        cyber: 'bg-black/80 text-cyan-300 border border-cyan-500/30 font-mono text-xs',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
  thumbnail?: string;
}

export interface LightboxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'>,
    VariantProps<typeof lightboxOverlayVariants> {
  images: LightboxImage[];
  /** Controlled open state */
  open?: boolean;
  /** Uncontrolled default open (default false) */
  defaultOpen?: boolean;
  /** Starting image index (default 0) */
  initialIndex?: number;
  onOpenChange?: (open: boolean) => void;
  onIndexChange?: (index: number) => void;
  showThumbnails?: boolean;
  showCaption?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Lightbox = React.forwardRef<HTMLDivElement, LightboxProps>(
  (
    {
      className,
      variant = 'default',
      images,
      open: controlledOpen,
      defaultOpen = false,
      initialIndex = 0,
      onOpenChange,
      onIndexChange,
      showThumbnails = true,
      showCaption = true,
      ...props
    },
    ref,
  ) => {
    // Uncontrolled state
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

    // Controlled vs uncontrolled
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

    // Touch swipe tracking
    const touchStart = React.useRef<number | null>(null);

    const close = React.useCallback(() => {
      setInternalOpen(false);
      onOpenChange?.(false);
    }, [onOpenChange]);

    const goTo = React.useCallback(
      (index: number) => {
        const next = (index + images.length) % images.length;
        setCurrentIndex(next);
        onIndexChange?.(next);
      },
      [images.length, onIndexChange],
    );

    const goNext = React.useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
    const goPrev = React.useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

    // Keyboard handler
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
      },
      [close, goNext, goPrev],
    );

    // Native touch swipe
    const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
      touchStart.current = e.touches[0]?.clientX ?? null;
    }, []);

    const handleTouchEnd = React.useCallback(
      (e: React.TouchEvent) => {
        if (touchStart.current === null) return;
        const deltaX = (e.changedTouches[0]?.clientX ?? 0) - touchStart.current;
        if (Math.abs(deltaX) > 50) {
          if (deltaX < 0) goNext();
          else goPrev();
        }
        touchStart.current = null;
      },
      [goNext, goPrev],
    );

    if (!isOpen) return null;

    const current = images[currentIndex];
    if (!current) return null;

    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
        className={cn(lightboxOverlayVariants({ variant }), className)}
        onClick={close}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        ref={(el) => {
          // Focus trap
          el?.focus();
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        {...props}
      >
        {/* Image container — stop propagation so clicking image doesn't close */}
        <div
          className="relative max-h-[85vh] max-w-[90vw]"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={current.src}
            alt={current.alt ?? ''}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
          />

          {/* Caption */}
          {showCaption && current.caption && (
            <div className={lightboxCaptionVariants({ variant })}>
              {current.caption}
            </div>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={close}
            aria-label="Close lightbox"
            className={lightboxCloseVariants({ variant })}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          {/* Nav arrows — only when multiple images */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goPrev()}
                aria-label="Previous image"
                className={cn(lightboxNavVariants({ variant }), '-left-12')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => goNext()}
                aria-label="Next image"
                className={cn(lightboxNavVariants({ variant }), '-right-12')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {showThumbnails && images.length > 1 && (
          <div
            className="absolute bottom-4 flex gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
                className={cn(
                  'h-12 w-12 overflow-hidden rounded border-2 transition-all',
                  i === currentIndex
                    ? 'border-white opacity-100'
                    : 'border-transparent opacity-50 hover:opacity-80',
                )}
              >
                <img
                  src={img.thumbnail ?? img.src}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
Lightbox.displayName = 'Lightbox';

export { Lightbox, lightboxOverlayVariants };
