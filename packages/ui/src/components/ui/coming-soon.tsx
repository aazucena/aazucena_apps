'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, Zap, Lock, X } from '@aazucena/icons';
import { Button } from './button';

const comingSoonVariants = cva(
  'relative group overflow-hidden border transition-all duration-500 flex flex-col items-center justify-center text-center p-12 min-h-[300px]',
  {
    variants: {
      variant: {
        default: 'bg-muted/10 border-border rounded-xl',
        glass: 'glass border-white/10 rounded-[2rem] text-white',
        cyber:
          'bg-black border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] text-cyan-400 font-mono rounded-none',
      },
      size: {
        default: 'w-full',
        sm: 'w-full max-w-md',
        lg: 'w-full min-h-[500px]',
      },
      fullScreen: {
        true: 'fixed inset-0 z-[9999] border-none rounded-none min-h-screen',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullScreen: false,
    },
  },
);

const GLITCH_CHARS = '!<>-_/[]{}—=+*^?#________';

/**
 * A sub-component that handles the "decryption" character swap animation.
 */
const GlitchText = ({ text, isHovered }: { text: string; isHovered: boolean }) => {
  const [displayText, setDisplayText] = React.useState(text);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const startGlitch = React.useCallback(() => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        prev
          .split('')
          .map((_, index) => {
            if (index < iteration) return text[index];
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join(''),
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current!);
      }
      iteration += 1 / 3;
    }, 30);
  }, [text]);

  React.useEffect(() => {
    if (isHovered) {
      startGlitch();
    } else {
      setDisplayText(text);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, text, startGlitch]);

  return <span>{displayText}</span>;
};

/**
 * An infinitely scrolling background of hexadecimal data.
 */
const BitStream = ({ variant, isHovered }: { variant: string; isHovered: boolean }) => {
  const columns = Array.from({ length: 15 });
  const streamData = React.useMemo(
    () =>
      Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 255)
          .toString(16)
          .toUpperCase()
          .padStart(2, '0'),
      ),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex justify-around overflow-hidden opacity-10 select-none">
      {columns.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: 0 }}
          animate={{ y: '-50%' }}
          transition={{
            duration: isHovered ? 5 : 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex flex-col gap-2 font-mono text-[10px]"
        >
          {[...streamData, ...streamData].map((hex, j) => (
            <span key={j} className={variant === 'cyber' ? 'text-cyan-500' : ''}>
              {hex}
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export interface ComingSoonProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof comingSoonVariants> {
  /** The name of the upcoming feature */
  title?: string;
  /** Brief description of what is being built */
  description?: string;
  /** Estimated arrival time (e.g. "Q4 2026") */
  expectedDate?: string;
  /** Unique Packet ID for telemetry aesthetic */
  packetId?: string;
  /** Whether the component should cover the entire screen */
  fullScreen?: boolean;
  /** Callback triggered when clicking the close button in fullScreen mode */
  onClose?: () => void;
}

/**
 * A high-fidelity "Coming Soon" wrapper component.
 * Features character-swap animations, background bit-streams, and technical telemetry.
 * Can be used inline or as a full-screen overlay.
 */
const ComingSoon = React.forwardRef<HTMLDivElement, ComingSoonProps>(
  (
    {
      className,
      variant = 'default',
      size,
      fullScreen = false,
      onClose,
      title = 'SIGNAL_INCOMING',
      description = 'Intercepting and decrypting upcoming feature protocols.',
      expectedDate = 'TBD_2026',
      packetId = '0xAA-00',
      children,
      ...props
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const v = variant || 'default';

    const content = (
      <div
        ref={ref}
        className={cn(comingSoonVariants({ variant: v, size, fullScreen }), className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Background Data Stream */}
        <BitStream variant={v} isHovered={isHovered || fullScreen} />

        {/* L-Bracket Corners (Cyber Variant or FullScreen) */}
        {(v === 'cyber' || fullScreen) && (
          <>
            <div className="absolute top-0 left-0 size-8 border-t-2 border-l-2 border-cyan-500/40" />
            <div className="absolute top-0 right-0 size-8 border-t-2 border-r-2 border-cyan-500/40" />
            <div className="absolute bottom-0 left-0 size-8 border-b-2 border-l-2 border-cyan-500/40" />
            <div className="absolute right-0 bottom-0 size-8 border-r-2 border-b-2 border-cyan-500/40" />
          </>
        )}

        {/* Top Telemetry */}
        <div
          className={cn(
            'absolute inset-x-8 top-6 flex items-center justify-between text-[10px] font-bold tracking-widest uppercase opacity-40',
            fullScreen && 'inset-x-12 top-10',
          )}
        >
          <div className="flex items-center gap-3">
            <Activity className="size-4" />
            <span>Status: Encrypted</span>
          </div>
          <div className="flex items-center gap-4">
            <span>PKT_ID: {packetId}</span>
            {fullScreen && onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full hover:bg-white/10"
                onClick={onClose}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-primary/5 border-primary/10 mb-4 inline-flex rounded-full border p-4"
          >
            <Lock className={cn('size-8', v === 'cyber' && 'text-cyan-400')} />
          </motion.div>

          <h3
            className={cn(
              'text-3xl font-black tracking-tighter uppercase md:text-5xl',
              v === 'cyber' && 'text-cyan-400',
            )}
          >
            <GlitchText text={title} isHovered={isHovered || fullScreen} />
          </h3>

          <p className="text-muted-foreground mx-auto max-w-xl px-6 text-base leading-relaxed opacity-80">
            {description}
          </p>

          <div className="flex items-center justify-center gap-6 pt-8">
            <motion.div
              animate={{ width: isHovered || fullScreen ? 60 : 32 }}
              className={cn('bg-border h-px', v === 'cyber' && 'bg-cyan-500/50')}
            />
            <span className="text-xs font-black tracking-[0.4em] uppercase opacity-60">
              {expectedDate}
            </span>
            <motion.div
              animate={{ width: isHovered || fullScreen ? 60 : 32 }}
              className={cn('bg-border h-px', v === 'cyber' && 'bg-cyan-500/50')}
            />
          </div>
        </div>

        {/* Bottom Telemetry */}
        <div
          className={cn(
            'absolute inset-x-8 bottom-6 flex items-center justify-between text-[10px] font-bold tracking-widest uppercase opacity-40',
            fullScreen && 'inset-x-12 bottom-10',
          )}
        >
          <div className="flex items-center gap-3">
            <Zap className="size-4" />
            <span>Signal: {isHovered || fullScreen ? 'Strong' : 'Weak'}</span>
          </div>
          <div className="flex items-center gap-3 text-right">
            <Shield className="size-4" />
            <span>Auth: Required</span>
          </div>
        </div>

        {/* Scanline Overlay */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-30" />
      </div>
    );

    if (fullScreen) {
      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999]"
          >
            {content}
          </motion.div>
        </AnimatePresence>
      );
    }

    return content;
  },
);
ComingSoon.displayName = 'ComingSoon';

export { ComingSoon, comingSoonVariants };
