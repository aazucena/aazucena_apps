'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const musicPlayerVariants = cva('w-full overflow-hidden rounded-xl', {
  variants: {
    variant: {
      default: 'border border-border bg-background shadow-sm',
      glass: 'glass',
      cyber: 'border border-cyan-500/30 bg-black/80',
    },
    size: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-5',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

function formatTime(s: number): string {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export interface MusicPlayerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof musicPlayerVariants> {
  src: string;
  title?: string;
  artist?: string;
  artwork?: string;
  autoPlay?: boolean;
  loop?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const MusicPlayer = React.forwardRef<HTMLDivElement, MusicPlayerProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      src,
      title,
      artist,
      artwork,
      autoPlay,
      loop,
      onPlay,
      onPause,
      onEnded,
      ...props
    },
    ref,
  ) => {
    const v = variant ?? 'default';
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = React.useState(false);
    const [current, setCurrent] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [volume, setVolume] = React.useState(1);

    const toggle = () => {
      const a = audioRef.current;
      if (!a) return;
      if (playing) {
        a.pause();
        onPause?.();
      } else {
        a.play();
        onPlay?.();
      }
      setPlaying(!playing);
    };

    const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const a = audioRef.current;
      if (!a) return;
      const t = Number(e.target.value);
      a.currentTime = t;
      setCurrent(t);
    };

    const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
      const a = audioRef.current;
      if (!a) return;
      const val = Number(e.target.value);
      a.volume = val;
      setVolume(val);
    };

    return (
      <div ref={ref} className={cn(musicPlayerVariants({ variant, size }), className)} {...props}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio
          ref={audioRef}
          src={src}
          autoPlay={autoPlay}
          loop={loop}
          onTimeUpdate={() => setCurrent(audioRef.current?.currentTime ?? 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
          onEnded={() => {
            setPlaying(false);
            onEnded?.();
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <div className="flex items-center gap-3">
          {/* Artwork */}
          {artwork && (
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
              <img src={artwork} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            {/* Track info */}
            {(title || artist) && (
              <div className="mb-2">
                {title && (
                  <p
                    className={cn(
                      'truncate text-sm font-semibold',
                      v === 'cyber' && 'font-mono text-cyan-50',
                    )}
                  >
                    {title}
                  </p>
                )}
                {artist && (
                  <p
                    className={cn(
                      'truncate text-xs',
                      v === 'cyber' ? 'text-cyan-500/60' : 'text-muted-foreground',
                    )}
                  >
                    {artist}
                  </p>
                )}
              </div>
            )}
            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
                  v === 'cyber'
                    ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90',
                )}
              >
                {playing ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              {/* Progress */}
              <div className="flex flex-1 items-center gap-2">
                <span
                  className={cn(
                    'w-8 text-right text-[10px] tabular-nums',
                    v === 'cyber' ? 'font-mono text-cyan-500/60' : 'text-muted-foreground',
                  )}
                >
                  {formatTime(current)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={current}
                  onChange={seek}
                  className={cn(
                    'h-1 flex-1 cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
                    v === 'cyber'
                      ? 'bg-cyan-500/20 [&::-webkit-slider-thumb]:bg-cyan-400'
                      : 'bg-muted [&::-webkit-slider-thumb]:bg-primary',
                  )}
                />
                <span
                  className={cn(
                    'w-8 text-[10px] tabular-nums',
                    v === 'cyber' ? 'font-mono text-cyan-500/60' : 'text-muted-foreground',
                  )}
                >
                  {formatTime(duration)}
                </span>
              </div>
              {/* Volume */}
              <div className="hidden items-center gap-1 sm:flex">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={cn(v === 'cyber' ? 'text-cyan-500/40' : 'text-muted-foreground')}
                >
                  <path d="M11 5 6 9H2v6h4l5 4V5z" />
                  {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
                </svg>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={changeVolume}
                  className={cn(
                    'h-1 w-16 cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
                    v === 'cyber'
                      ? 'bg-cyan-500/20 [&::-webkit-slider-thumb]:bg-cyan-400'
                      : 'bg-muted [&::-webkit-slider-thumb]:bg-primary',
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
MusicPlayer.displayName = 'MusicPlayer';

export { MusicPlayer, musicPlayerVariants };
