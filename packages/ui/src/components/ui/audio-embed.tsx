'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const audioEmbedVariants = cva('inline-flex w-full items-center rounded-lg', {
  variants: {
    variant: {
      default: 'border border-border bg-muted/30',
      glass: 'glass-m',
      cyber: 'border border-cyan-500/20 bg-black/50',
    },
    size: {
      sm: 'gap-2 p-2',
      md: 'gap-3 p-3',
      lg: 'gap-3 p-4',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

function fmt(s: number): string {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export interface AudioEmbedProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof audioEmbedVariants> {
  src: string;
  title?: string;
}

const AudioEmbed = React.forwardRef<HTMLDivElement, AudioEmbedProps>(
  ({ className, variant = 'default', size = 'md', src, title, ...props }, ref) => {
    const v = variant ?? 'default';
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = React.useState(false);
    const [current, setCurrent] = React.useState(0);
    const [duration, setDuration] = React.useState(0);

    const toggle = () => {
      const a = audioRef.current;
      if (!a) return;
      if (playing) a.pause();
      else a.play();
    };

    const pct = duration > 0 ? (current / duration) * 100 : 0;

    return (
      <div ref={ref} className={cn(audioEmbedVariants({ variant, size }), className)} {...props}>
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={() => setCurrent(audioRef.current?.currentTime ?? 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
        <button
          type="button"
          onClick={toggle}
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors',
            v === 'cyber'
              ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
              : 'bg-primary/10 text-primary hover:bg-primary/20',
          )}
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        {/* Progress bar */}
        <div className="flex flex-1 flex-col gap-1">
          {title && (
            <span
              className={cn(
                'truncate text-xs font-medium',
                v === 'cyber' ? 'font-mono text-cyan-50' : 'text-foreground',
              )}
            >
              {title}
            </span>
          )}
          <div
            className={cn(
              'h-1 w-full overflow-hidden rounded-full',
              v === 'cyber' ? 'bg-cyan-500/10' : 'bg-muted',
            )}
          >
            <div
              className={cn(
                'h-full rounded-full transition-[width] duration-200',
                v === 'cyber' ? 'bg-cyan-500' : 'bg-primary',
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <span
          className={cn(
            'shrink-0 text-[10px] tabular-nums',
            v === 'cyber' ? 'font-mono text-cyan-500/60' : 'text-muted-foreground',
          )}
        >
          {fmt(current)} / {fmt(duration)}
        </span>
      </div>
    );
  },
);
AudioEmbed.displayName = 'AudioEmbed';

export { AudioEmbed, audioEmbedVariants };
