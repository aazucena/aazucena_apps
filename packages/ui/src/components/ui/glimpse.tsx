'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { FloatingPortal } from '@floating-ui/react';
import { Globe, Link as LinkIcon } from '@aazucena/icons';
import { Image } from './image';
import { Skeleton } from './skeleton';
import { useGlimpse } from '../../hooks/use-glimpse';

const glimpsePreviewVariants = cva(
  'absolute z-50 overflow-hidden rounded-xl border bg-popover shadow-2xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border-border',
        glass: 'glass border-white/10 backdrop-blur-md text-white',
        cyber:
          'bg-black border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] text-cyan-50 font-mono',
      },
      size: {
        default: 'w-72',
        sm: 'w-60',
        lg: 'w-80',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface GlimpseData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

export interface GlimpseProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof glimpsePreviewVariants> {
  children: React.ReactNode;
  url: string;
  data?: GlimpseData;
  isLoading?: boolean;
  delay?: number | { open?: number; close?: number };
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const Glimpse = React.forwardRef<HTMLDivElement, GlimpseProps>(
  (
    {
      children,
      url,
      data,
      isLoading = false,
      delay = { open: 600, close: 100 },
      placement = 'bottom',
      className,
      variant = 'default',
      size,
      ...props
    },
    ref,
  ) => {
    const { isOpen, refs, floatingStyles, getReferenceProps, getFloatingProps, domain } =
      useGlimpse({ url, delay, placement });

    const renderContent = () => {
      if (isLoading) {
        return (
          <div className="flex flex-col gap-2 p-3">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        );
      }

      return (
        <div className="bg-background text-foreground flex flex-col">
          {data?.image && (
            <div className="border-border/10 relative h-32 w-full overflow-hidden border-b">
              <Image
                src={data.image}
                alt={data.title || 'Preview'}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-2 p-4">
            <div className="flex items-center gap-2 opacity-60">
              {data?.favicon ? (
                <img src={data.favicon} className="size-3 rounded-sm" alt="" />
              ) : (
                <Globe className="size-3" />
              )}
              <span className="truncate text-[10px] font-bold tracking-wider uppercase">
                {data?.siteName || domain}
              </span>
            </div>

            <div className="space-y-1">
              <h5
                className={cn(
                  'line-clamp-2 text-sm leading-tight font-bold',
                  variant === 'cyber' && 'text-cyan-400',
                )}
              >
                {data?.title || domain}
              </h5>
              {data?.description && (
                <p className="line-clamp-2 text-[11px] leading-relaxed opacity-70">
                  {data.description}
                </p>
              )}
            </div>

            <div className="border-border/10 mt-1 flex items-center gap-1.5 border-t pt-3 font-mono text-[10px] italic opacity-40">
              <LinkIcon className="size-2.5" />
              <span className="truncate">{url}</span>
            </div>
          </div>
        </div>
      );
    };

    return (
      <>
        <div
          ref={refs.setReference}
          {...getReferenceProps()}
          className={cn(
            'inline-block cursor-help border-b border-dotted border-current/40 transition-colors hover:border-current',
            className,
          )}
          {...props}
        >
          {children}
        </div>
        <FloatingPortal>
          {isOpen && (
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className={cn(glimpsePreviewVariants({ variant, size }))}
            >
              {renderContent()}
            </div>
          )}
        </FloatingPortal>
      </>
    );
  },
);
Glimpse.displayName = 'Glimpse';

export { Glimpse, glimpsePreviewVariants };
