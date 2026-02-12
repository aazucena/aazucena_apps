/**
 * AwardModal Component
 * Modal for displaying award/certification details
 */

import { useEffect, type JSX, type RefObject } from 'react';
import type { Award } from '@aazucena/types';
import { toTitleCase } from '@aazucena/utils';
import { getCompanyLogoGradient } from '@aazucena/utils';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { darkBlockRenderers } from '../blocks/BlockRenderers.js';
import { cn } from '@aazucena/utils';

import { X } from '@aazucena/icons';
import { AwardBadgeIcon } from '@aazucena/icons';

export interface AwardModalProps {
  award: Award;
  onClose: () => void;
  modalRef: RefObject<HTMLDivElement | null>;
  className?: string;
}

export function AwardModal({ award, onClose, modalRef, className }: AwardModalProps): JSX.Element {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', className)}>
      {/* Backdrop - Purely decorative overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />

      {/* Invisible button for close logic - Full screen clickable area */}
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default border-none bg-transparent outline-none"
        onClick={onClose}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="award-modal-title"
        className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/20 bg-gradient-to-br from-gray-900 to-black p-8 shadow-2xl"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
        tabIndex={-1}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-white"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6 flex items-start gap-4">
          <div
            className={cn(
              `flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl font-bold text-white shadow-lg`,
              getCompanyLogoGradient(award.issuer || 'AAZUCENA'),
            )}
          >
            <AwardBadgeIcon size={40} className="text-white" />
          </div>
          <div className="flex-grow">
            <h2 id="award-modal-title" className="mb-2 text-2xl font-bold text-white md:text-3xl">
              {toTitleCase(award.title)}
            </h2>
            <p className="mb-1 text-lg text-gray-300">{toTitleCase(award.issuer || 'AAZUCENA')}</p>
            <p className="text-sm text-cyan-400">{award.date}</p>
          </div>
        </div>

        {(award.description as any) && (
          <div className="mb-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">About</h3>
            <div className="prose prose-invert max-w-none text-sm leading-relaxed text-gray-300 md:text-base">
              <BlocksRenderer content={award.description as any} blocks={darkBlockRenderers} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
