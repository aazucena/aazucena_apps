'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const videoVariants = cva('relative overflow-hidden group', {
  variants: {
    variant: {
      default: 'bg-muted rounded-control',
      glass: 'glass rounded-card',
      cyber: 'border border-signal/20 bg-panel rounded-control',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface VideoProps
  extends React.VideoHTMLAttributes<HTMLVideoElement>, VariantProps<typeof videoVariants> {
  thumbnail?: string;
  aspectRatio?: string;
}

const Video = React.forwardRef<HTMLVideoElement, VideoProps>(
  ({ className, variant, thumbnail, aspectRatio = '16/9', src, style, ...props }, ref) => {
    const internalRef = React.useRef<HTMLVideoElement>(null);
    const videoRef = (ref as React.RefObject<HTMLVideoElement>) ?? internalRef;
    const [playing, setPlaying] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);

    const handlePlay = () => {
      const el = videoRef.current;
      if (!el) return;
      if (el.paused) {
        el.play();
        setPlaying(true);
      } else {
        el.pause();
        setPlaying(false);
      }
    };

    return (
      <div className={cn(videoVariants({ variant }), className)} style={{ aspectRatio, ...style }}>
        {!loaded && <div className="bg-muted absolute inset-0 animate-pulse" />}
        {thumbnail && !playing && (
          <img src={thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          src={src}
          onLoadedData={() => setLoaded(true)}
          onEnded={() => setPlaying(false)}
          className="h-full w-full object-cover"
          {...props}
        />
        {/* Play overlay */}
        {!playing && (
          <button
            type="button"
            aria-label="Play video"
            onClick={handlePlay}
            className={cn(
              'bg-scrim group-hover:bg-scrim absolute inset-0 flex items-center justify-center transition-opacity',
              variant === 'cyber' && 'bg-panel',
            )}
          >
            <div
              className={cn(
                'flex size-14 items-center justify-center rounded-full transition-transform group-hover:scale-110',
                variant === 'cyber'
                  ? 'bg-signal text-signal-foreground'
                  : 'bg-panel-raised text-foreground',
              )}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}
      </div>
    );
  },
);
Video.displayName = 'Video';

export { Video, videoVariants };
