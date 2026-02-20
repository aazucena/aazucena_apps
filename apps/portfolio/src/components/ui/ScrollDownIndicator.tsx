/**
 * ScrollDownIndicator Component
 * Animated down arrow to prompt user to scroll
 */

import { useState, useEffect, type JSX } from "react";

export interface ScrollDownIndicatorProps {
  visible: boolean;
  onClick?: () => void;
  timeout?: number;
}

export function ScrollDownIndicator({
  visible,
  onClick,
  timeout = 2000,
}: ScrollDownIndicatorProps): JSX.Element {
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
      className={`group fixed bottom-12 left-1/2 z-40 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-white/80 transition-opacity duration-1000 hover:text-white ${
        showIndicator ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-label="Scroll down"
    >
      <span className="text-sm font-medium tracking-wider">SCROLL</span>

      {/* Double Chevron Down - Animated */}
      <div className="relative h-8 w-8 animate-bounce">
        <svg
          className="absolute top-0 left-0 h-8 w-8 opacity-70"
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
          className="absolute top-2 left-0 h-8 w-8"
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
      <div className="absolute -z-10 h-12 w-12 rounded-full bg-cyan-400/20 blur-xl transition-all group-hover:bg-cyan-400/30"></div>
    </button>
  );
}
