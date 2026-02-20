/**
 * ToolbarButton Component
 * Reusable toolbar button with tooltip
 */

import type { JSX, ReactNode } from "react";

export interface ToolbarButtonProps {
  onClick: () => void;
  label: string;
  icon: ReactNode;
  isActive?: boolean;
  className?: string;
}

export function ToolbarButton({
  onClick,
  label,
  icon,
  isActive = false,
  className = "",
}: ToolbarButtonProps): JSX.Element {
  const baseClasses =
    "group relative w-14 h-14 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110";
  const activeClasses = isActive
    ? "bg-cyan-500/20 border border-cyan-400/40 hover:bg-cyan-500/30 hover:border-cyan-400/60"
    : "bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${activeClasses} ${className}`}
      aria-label={label}
    >
      {icon}

      {/* Tooltip */}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform rounded-lg bg-black/80 px-3 py-1.5 text-xs whitespace-nowrap text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
        {label}
        <div className="absolute top-full left-1/2 -mt-1 -translate-x-1/2 transform border-4 border-transparent border-t-black/80"></div>
      </div>
    </button>
  );
}
