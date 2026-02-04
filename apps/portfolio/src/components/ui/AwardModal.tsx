/**
 * AwardModal Component
 * Modal for displaying award/certification details
 */

import { useEffect, type JSX, type RefObject } from 'react';
import type { Award } from '~/lib/transformers/awards';
import { getBadgeClasses } from '~/lib/utils/animations/colors';
import { toTitleCase } from '~/lib/utils/text';
import { getCompanyLogoGradient } from '~/lib/utils/experiences';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { darkBlockRenderers } from '~/components/blocks/BlockRenderers';

export interface AwardModalProps {
  award: Award;
  onClose: () => void;
  modalRef: RefObject<HTMLDivElement>;
}

export function AwardModal({ award, onClose, modalRef }: AwardModalProps): JSX.Element {
  // Lock body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Lock scroll
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Cleanup: restore original overflow when modal closes
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${getCompanyLogoGradient(award.organization)} rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="flex-grow">
            <div className="inline-block mb-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${award.type === 'certification' ? 'bg-cyan-400/20 text-cyan-400' : 'bg-yellow-400/20 text-yellow-400'}`}>
                {award.type === 'certification' ? 'Certification' : 'Award'}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {toTitleCase(award.title)}
            </h2>
            <p className="text-lg text-gray-300 mb-1">{toTitleCase(award.organization)}</p>
            <p className="text-sm text-cyan-400">{award.year}</p>
          </div>
        </div>

        {/* Description */}
        {award.description && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-white">About</h3>
            <div className="text-gray-300 text-sm md:text-base leading-relaxed prose prose-invert max-w-none">
              <BlocksRenderer content={award.description} blocks={darkBlockRenderers} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
