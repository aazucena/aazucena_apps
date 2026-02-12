/**
 * HexagonCard Component
 * Specialized hexagonal award/certification card
 */

import type { JSX } from 'react';
import { getGradientColors } from '@aazucena/utils';
import type { Award } from '@aazucena/types';
import { cn } from '@aazucena/utils';
import { AwardBadgeIcon } from '@aazucena/icons';
import { cva, type VariantProps } from 'class-variance-authority';

const hexagonIconVariants = cva(
  'mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl',
  {
    variants: {
      type: {
        certification: 'from-cyan-400 to-blue-500',
        award: 'from-yellow-400 to-orange-500',
      },
    },
    defaultVariants: {
      type: 'award',
    },
  },
);

export interface HexagonCardProps extends VariantProps<typeof hexagonIconVariants> {
  /** Award data */
  award: Award;
  /** Use dashed border */
  dashed?: boolean;
  /** Click handler */
  onClick: () => void;
  /** Additional className */
  className?: string;
}

/**
 * HexagonCard
 */
export function HexagonCard({
  award,
  dashed = false,
  onClick,
  className,
}: HexagonCardProps): JSX.Element {
  const rawAward = award as any;
  const type = (rawAward.type || 'award') as 'certification' | 'award';
  const gradientClass =
    type === 'certification' ? 'from-cyan-400 to-blue-500' : 'from-yellow-400 to-orange-500';
  const colors = getGradientColors(gradientClass);
  const shortTitle = rawAward.shortTitle || award.title;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'group relative flex h-52 w-48 cursor-pointer items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        className,
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${award.title}`}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 110">
        <defs>
          <linearGradient id={`grad-${award.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.from, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: colors.to, stopOpacity: 0.3 }} />
          </linearGradient>
          <linearGradient id={`grad-hover-${award.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.from, stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: colors.to, stopOpacity: 0.6 }} />
          </linearGradient>
        </defs>
        <polygon
          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
          fill={`url(#grad-${award.id})`}
          stroke={colors.from}
          strokeWidth="2"
          strokeDasharray={dashed ? '8,4' : undefined}
          className="transition-all duration-300 group-hover:stroke-[3]"
          style={{ transition: 'all 0.3s ease' }}
        />
        <polygon
          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
          fill={`url(#grad-hover-${award.id})`}
          stroke={colors.from}
          strokeWidth="3"
          strokeDasharray={dashed ? '8,4' : undefined}
          className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </svg>

      <div
        className="absolute inset-0 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle, ${colors.from}40 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10 flex flex-col items-center p-6 text-center">
        <div className={cn(hexagonIconVariants({ type }))}>
          <AwardBadgeIcon size={32} className="text-white" />
        </div>
        <h3 className="mb-1 text-sm font-bold text-white">{shortTitle}</h3>
        <p className="text-xs transition-colors duration-300" style={{ color: colors.from }}>
          {award.date}
        </p>
      </div>

      <div
        className="pointer-events-none absolute top-full left-1/2 z-20 mt-4 w-64 -translate-x-1/2 transform rounded-lg bg-gray-900/95 p-4 opacity-0 shadow-2xl backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
        style={{ borderWidth: '2px', borderColor: colors.from }}
      >
        <h4 className="mb-2 text-base font-bold text-white">{award.title}</h4>
        <p className="mb-2 text-xs" style={{ color: colors.from }}>
          {award.issuer} • {award.date}
        </p>
        {(award.description as any) && (
          <p className="line-clamp-3 text-xs text-gray-300">
            {typeof award.description === 'string' ? award.description : 'Award description'}
          </p>
        )}
      </div>
    </div>
  );
}
