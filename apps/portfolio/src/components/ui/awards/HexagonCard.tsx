/**
 * HexagonCard Component
 * Specialized hexagonal award/certification card with SVG gradients and hover effects
 */

import React, { type JSX } from "react";
import { getGradientColors } from "@aazucena/utils";
import type { Award } from "@aazucena/types";

export interface HexagonCardProps {
  /** Award data */
  award: Award;
  /** Use dashed border (for awards vs certifications) */
  dashed?: boolean;
  /** Click handler */
  onClick: () => void;
}

/**
 * Get gradient string based on award type
 * Certifications use cyan/blue, Awards use yellow/orange
 */
function getAwardGradient(type: "certification" | "award"): string {
  return type === "certification"
    ? "from-cyan-400 to-blue-500"
    : "from-yellow-400 to-orange-500";
}

/**
 * Get Tailwind gradient class based on award type
 */
function getAwardGradientClass(type: "certification" | "award"): string {
  return type === "certification"
    ? "from-cyan-400 to-blue-500"
    : "from-yellow-400 to-orange-500";
}

/**
 * HexagonCard
 * SVG-based hexagonal card with gradient fills, glow effects, and tooltip
 * Intentionally NOT using GlassCard - custom hexagonal design
 */
export function HexagonCard({
  award,
  dashed = false,
  onClick,
}: HexagonCardProps): JSX.Element {
  const gradient = getAwardGradient(award.type);
  const gradientClass = getAwardGradientClass(award.type);
  const colors = getGradientColors(gradient);

  return (
    <div
      className="group relative flex h-52 w-48 cursor-pointer items-center justify-center"
      onClick={onClick}
    >
      {/* Hexagon SVG */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 110">
        <defs>
          <linearGradient
            id={`grad-${award.id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: colors.from, stopOpacity: 0.3 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: colors.to, stopOpacity: 0.3 }}
            />
          </linearGradient>
          <linearGradient
            id={`grad-hover-${award.id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: colors.from, stopOpacity: 0.6 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: colors.to, stopOpacity: 0.6 }}
            />
          </linearGradient>
        </defs>
        <polygon
          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
          fill={`url(#grad-${award.id})`}
          stroke={colors.from}
          strokeWidth="2"
          strokeDasharray={dashed ? "8,4" : undefined}
          className="transition-all duration-300 group-hover:stroke-[3]"
          style={{ transition: "all 0.3s ease" }}
        />
        <polygon
          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
          fill={`url(#grad-hover-${award.id})`}
          stroke={colors.from}
          strokeWidth="3"
          strokeDasharray={dashed ? "8,4" : undefined}
          className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </svg>

      {/* Glow Effect on Hover */}
      <div
        className="absolute inset-0 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle, ${colors.from}40 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center p-6 text-center">
        <div
          className={`h-16 w-16 bg-gradient-to-br ${gradientClass} mb-3 flex items-center justify-center rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl`}
        >
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        </div>
        <h3 className="mb-1 text-sm font-bold text-white">
          {award.shortTitle}
        </h3>
        <p
          className="text-xs transition-colors duration-300"
          style={{ color: colors.from }}
        >
          {award.year}
        </p>
      </div>

      {/* Tooltip on hover */}
      <div
        className="pointer-events-none absolute top-full left-1/2 z-20 mt-4 w-64 -translate-x-1/2 transform rounded-lg bg-gray-900/95 p-4 opacity-0 shadow-2xl backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
        style={{ borderWidth: "2px", borderColor: colors.from }}
      >
        <h4 className="mb-2 text-base font-bold text-white">{award.title}</h4>
        <p className="mb-2 text-xs" style={{ color: colors.from }}>
          {award.organization} • {award.year}
        </p>
        <p className="text-xs text-gray-300">
          {award.description as React.ReactNode}
        </p>
      </div>
    </div>
  );
}
