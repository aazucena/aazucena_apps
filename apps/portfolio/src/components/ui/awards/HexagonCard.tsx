/**
 * HexagonCard Component
 * Specialized hexagonal award/certification card with SVG gradients and hover effects
 */

import React, { type JSX } from "react";
import type { Award } from "@aazucena/types";

export interface HexagonCardProps {
  /** Award data */
  award: Award;
  /** Use dashed border (for awards vs certifications) */
  dashed?: boolean;
  /** Click handler */
  onClick: () => void;
}

/** Certifications take series 1, awards series 3; the type is also written in the tooltip. */
const AWARD_HUE = {
  certification: { stroke: "stroke-series-1", text: "text-series-1" },
  award: { stroke: "stroke-series-3", text: "text-series-3" },
} as const;

/**
 * HexagonCard
 * SVG hexagonal card on a flat panel fill with a series-hue outline
 * Intentionally NOT using Panel - custom hexagonal design
 */
export function HexagonCard({
  award,
  dashed = false,
  onClick,
}: HexagonCardProps): JSX.Element {
  const hue = AWARD_HUE[award.type];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${award.title}, ${award.organization}, ${award.year}`}
      className="group focus-visible:outline-signal relative flex h-52 w-48 cursor-pointer items-center justify-center focus-visible:outline-1 focus-visible:outline-offset-2"
    >
      {/* Hexagon SVG */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 110"
        aria-hidden="true"
      >
        <polygon
          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
          strokeWidth="2"
          strokeDasharray={dashed ? "8,4" : undefined}
          className={`fill-panel group-hover:fill-state group-focus-visible:fill-state transition-[fill] duration-(--motion-base) group-hover:stroke-[3] group-focus-visible:stroke-[3] motion-safe:transition-[fill,stroke-width] ${hue.stroke}`}
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center p-6 text-center">
        <div
          className={`hover-grow border-rule bg-state rounded-control mb-3 flex h-16 w-16 items-center justify-center border ${hue.text}`}
        >
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        </div>
        <h3 className="text-foreground mb-1 text-sm font-semibold">
          {award.shortTitle}
        </h3>
        <p className={`micro-label ${hue.text}`}>{award.year}</p>
      </div>

      {/* Tooltip on hover or keyboard focus */}
      <div
        className={`border-rule-strong bg-panel rounded-card pointer-events-none absolute top-full left-1/2 z-20 mt-4 w-64 -translate-x-1/2 border p-4 text-left opacity-0 transition-opacity duration-(--motion-base) group-hover:opacity-100 group-focus-visible:opacity-100`}
      >
        <h4 className="text-foreground mb-2 text-base font-semibold">
          {award.title}
        </h4>
        <p className={`micro-label mb-2 ${hue.text}`}>
          {award.organization} • {award.year}
        </p>
        <p className="text-muted-foreground text-xs">
          {award.description as React.ReactNode}
        </p>
      </div>
    </button>
  );
}
