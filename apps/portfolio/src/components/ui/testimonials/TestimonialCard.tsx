/**
 * TestimonialCard Component
 * Individual testimonial card with quote, author info, and avatar
 */

import type { JSX } from 'react';
import { GlassCard } from '../common/GlassCard';

export interface TestimonialCardProps {
  /** Testimonial quote text */
  quote: string;
  /** Author name */
  name: string;
  /** Author title/position */
  title: string;
  /** Avatar text (usually initials) */
  avatar: string;
  /** Gradient class for avatar background */
  gradient: string;
}

/**
 * TestimonialCard
 * Displays a testimonial with quote, author info, and gradient avatar
 */
export function TestimonialCard({
  quote,
  name,
  title,
  avatar,
  gradient,
}: TestimonialCardProps): JSX.Element {
  return (
    <GlassCard
      as="li"
      padding="lg"
      className="w-[350px] max-w-full rounded-2xl md:w-[450px] flex flex-col min-h-[280px]"
    >
      <blockquote className="flex flex-col h-full">
        <div
          aria-hidden="true"
          className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
        ></div>
        <div className="relative z-20 flex flex-col justify-between pt-8 h-full">
          {/* Quote Text */}
          <span className="text-base leading-[1.6] text-gray-300 font-normal flex-grow">
            {quote}
          </span>

          {/* Author Info & Avatar */}
          <div className="flex flex-row justify-between items-center gap-4 mt-auto">
            {/* Author Details */}
            <div className="flex flex-col *:text-left gap-1">
              <span className="text-base font-semibold leading-[1.6] text-white">
                {name}
              </span>
              <span className="text-sm leading-[1.6] text-gray-400 font-normal">
                {title}
              </span>
            </div>

            {/* Avatar */}
            <div
              className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
            >
              {avatar}
            </div>
          </div>
        </div>
      </blockquote>
    </GlassCard>
  );
}
