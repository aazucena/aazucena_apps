/**
 * TestimonialsSection Component
 * Testimonials carousel
 */

import type { JSX } from 'react';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { testimonials as staticTestimonials } from './data/testimonials';
import type { TestimonialData } from '~/types/portfolio';

export interface TestimonialsSectionProps {
  testimonials?: TestimonialData[];
}

export function TestimonialsSection({ testimonials = staticTestimonials }: TestimonialsSectionProps): JSX.Element {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="w-full text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
          Testimonials
          <span className="block text-3xl md:text-4xl mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            What People Say
          </span>
        </h2>

        <div className="mt-12">
          <InfiniteMovingCards
            items={testimonials}
            direction="left"
            speed="slow"
            pauseOnHover={true}
          />
        </div>
      </div>
    </div>
  );
}
