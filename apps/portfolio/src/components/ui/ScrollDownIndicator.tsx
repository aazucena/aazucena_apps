/**
 * ScrollDownIndicator Component
 * Animated down arrow to prompt user to scroll
 */

import { useState, useEffect, type JSX } from 'react';

export interface ScrollDownIndicatorProps {
  visible: boolean;
  onClick?: () => void;
  timeout?: number;
}

export function ScrollDownIndicator({ visible, onClick, timeout = 2000 }: ScrollDownIndicatorProps): JSX.Element {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (visible) {
      // Delay the appearance by 2 seconds
      const timer = setTimeout(() => {
        setShowIndicator(true);
      }, timeout);
      return () => clearTimeout(timer);
    } else {
      setShowIndicator(false);
    }
  }, [visible]);

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 text-white/80 hover:text-white transition-opacity duration-1000 cursor-pointer group ${
        showIndicator ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Scroll down"
    >
      <span className="text-sm font-medium tracking-wider">SCROLL</span>

      {/* Double Chevron Down - Animated */}
      <div className="relative w-8 h-8 animate-bounce">
        <svg
          className="w-8 h-8 absolute top-0 left-0 opacity-70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <svg
          className="w-8 h-8 absolute top-2 left-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Pulse Animation */}
      <div className="absolute -z-10 w-12 h-12 bg-cyan-400/20 rounded-full blur-xl group-hover:bg-cyan-400/30 transition-all"></div>
    </button>
  );
}
