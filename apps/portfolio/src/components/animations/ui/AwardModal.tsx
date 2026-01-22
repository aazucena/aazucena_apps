/**
 * AwardModal Component
 * Modal for displaying award/certification details
 */

import { useEffect, type JSX, type RefObject } from 'react';
import type { Award } from '../sections/data/awards';
import { getBadgeClasses } from '../utilities/colors';

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
          <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${award.gradient} rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
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
              {award.title}
            </h2>
            <p className="text-lg text-gray-300 mb-1">{award.organization}</p>
            <p className="text-sm text-cyan-400">{award.year}</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-white">About</h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            {award.description}
          </p>
        </div>

        {/* Details - only show if available */}
        {award.details && award.details.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-lg font-semibold text-white">Highlights</h3>
            <ul className="space-y-3">
              {award.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <span className="text-cyan-400 mt-1 flex-shrink-0">•</span>
                  <span className="text-sm md:text-base leading-relaxed">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills - only show if available */}
        {award.skills && award.skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Related Skills</h3>
            <div className="flex flex-wrap gap-2">
              {award.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className={getBadgeClasses(award.gradient)}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
