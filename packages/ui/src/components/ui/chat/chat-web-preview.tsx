'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { ExternalLink } from '@aazucena/icons'; // Assuming ExternalLink icon is available

const chatWebPreviewVariants = cva(
  'flex flex-col gap-2 rounded-md border bg-background text-foreground transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border-input',
        glass: 'glass border-input/20',
        cyber:
          'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] text-cyan-400',
      },
      size: {
        default: 'max-w-md',
        sm: 'max-w-xs',
        lg: 'max-w-lg',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface WebPreviewData {
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
  url: string;
}

export interface ChatWebPreviewProps
  extends
    React.HTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof chatWebPreviewVariants> {
  url: string;
  previewData?: WebPreviewData; // Pre-fetched data
  placeholder?: React.ReactNode;
}

const ChatWebPreview = React.forwardRef<HTMLAnchorElement, ChatWebPreviewProps>(
  (
    {
      className,
      variant,
      size,
      url,
      previewData,
      placeholder = (
        <div className="flex h-24 items-center justify-center text-muted-foreground">
          Loading preview...
        </div>
      ),
      ...props
    },
    ref,
  ) => {
    // In a real application, you'd fetch metadata here if not provided
    // For this component, we assume previewData is either provided or we show placeholder
    const data = previewData;

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        ref={ref}
        className={cn(chatWebPreviewVariants({ variant, size }), className)}
        {...props}
      >
        {data ? (
          <>
            {data.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.image}
                alt={data.title}
                className="h-32 w-full rounded-t-md object-cover"
              />
            )}
            <div className="p-3">
              <h4 className="text-base font-semibold">{data.title}</h4>
              {data.description && (
                <p className="line-clamp-2 text-sm text-muted-foreground">{data.description}</p>
              )}
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                {data.favicon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.favicon} alt="Favicon" className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate">{new URL(data.url).hostname}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </div>
            </div>
          </>
        ) : (
          placeholder
        )}
      </a>
    );
  },
);
ChatWebPreview.displayName = 'ChatWebPreview';

export { ChatWebPreview, chatWebPreviewVariants };
