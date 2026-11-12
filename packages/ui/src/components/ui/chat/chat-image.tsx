'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Dialog, DialogContent, DialogTrigger } from '../dialog'; // For click-to-enlarge functionality

const chatImageVariants = cva(
  'group relative flex flex-col gap-2 rounded-control border bg-background p-2 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border-input',
        glass: 'glass border-input/20',
        cyber: 'bg-background/40 dark:bg-scrim border-signal/30 text-signal',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface ChatImageProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatImageVariants> {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  enlargeable?: boolean;
}

const ChatImage = React.forwardRef<HTMLDivElement, ChatImageProps>(
  (
    {
      className,
      variant,
      src,
      alt,
      caption,
      width = 400,
      height = 300,
      enlargeable = true,
      ...props
    },
    ref,
  ) => {
    const content = (
      <>
        {/* Next.js Image component */}
        <img
          src={src}
          alt={alt}
          className="rounded-control h-auto w-full object-cover"
          style={{ maxWidth: width, maxHeight: height }}
        />
        {caption && <p className="text-muted-foreground text-sm">{caption}</p>}
      </>
    );

    return (
      <div ref={ref} className={cn(chatImageVariants({ variant }), className)} {...props}>
        {enlargeable ? (
          <Dialog>
            <DialogTrigger asChild>
              <div className="cursor-pointer">
                {content}
                <div className="rounded-control bg-scrim text-foreground absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  Click to Enlarge
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-[calc(100vw-40px)] p-0">
              <img src={src} alt={alt} className="max-h-[calc(100vh-40px)] object-contain" />
            </DialogContent>
          </Dialog>
        ) : (
          content
        )}
      </div>
    );
  },
);
ChatImage.displayName = 'ChatImage';

export { ChatImage, chatImageVariants };
