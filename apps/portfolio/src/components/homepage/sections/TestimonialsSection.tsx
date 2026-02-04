/**
 * TestimonialsSection Component
 * Testimonials carousel
 */

import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import type { JSX } from 'react';
import { useSectionData } from '~/contexts/animations';
import { SectionLayout } from './layouts';
import type { SectionProps } from './types';

export interface TestimonialsSectionProps extends SectionProps {}

export function TestimonialsSection({ title = 'Testimonials', subtitle = 'What People Say' }: TestimonialsSectionProps): JSX.Element {
  const { testimonials: data } = useSectionData();
  return (
    <SectionLayout
      title={title}
      subtitle={subtitle}
      contentWidth="full"
      headerClassName="w-full text-center"
    >
      <div className="mt-12">
        <InfiniteMovingCards
          items={data}
          direction="left"
          speed="slow"
          pauseOnHover={true}
        />
      </div>
    </SectionLayout>
  );
}
