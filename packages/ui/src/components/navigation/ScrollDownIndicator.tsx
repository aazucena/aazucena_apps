/**
 * ScrollDownIndicator Component
 * Animated down arrow to prompt user to scroll
 */

import { useState, useEffect, type JSX } from 'react';
import { cn } from '@aazucena/utils';
import { ScrollDownIcon } from '@aazucena/icons';

export interface ScrollDownIndicatorProps {
  visible: boolean;
  onClick?: () => void;
  timeout?: number;
  className?: string;
}

export function ScrollDownIndicator({
  visible,
  onClick,
  timeout = 2000,
  className,
}: ScrollDownIndicatorProps): JSX.Element {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setShowIndicator(true);
      }, timeout);
      return () => clearTimeout(timer);
    } else if (showIndicator) {
      setShowIndicator(false);
    }
  }, [visible, timeout, showIndicator]);

  return (
    <button
      onClick={onClick}
      className={cn(
        'group fixed bottom-12 left-1/2 z-40 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-white/80 transition-opacity duration-1000 hover:text-white',
        showIndicator ? 'opacity-100' : 'pointer-events-none opacity-0',
        className,
      )}
      aria-label="Scroll down"
    >
      <span className="text-sm font-medium tracking-wider">SCROLL</span>

      {/* Double Chevron Down - Animated */}
      <div className="relative h-8 w-8 animate-bounce">
        <ScrollDownIcon size={32} className="text-white" />
      </div>

      {/* Pulse Animation */}
      <div className="absolute -z-10 h-12 w-12 rounded-full bg-cyan-400/20 blur-xl transition-all group-hover:bg-cyan-400/30"></div>
    </button>
  );
}
