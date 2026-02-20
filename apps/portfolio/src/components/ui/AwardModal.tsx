/**
 * AwardModal Component
 * Modal for displaying award/certification details
 */

import { useEffect, type JSX, type RefObject } from "react";
import type { Award } from "~/lib/transformers/awards";
import { toTitleCase } from "~/lib/utils/text";
import { getCompanyLogoGradient } from "~/lib/utils/experiences";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { darkBlockRenderers } from "~/components/blocks/BlockRenderers";

export interface AwardModalProps {
  award: Award;
  onClose: () => void;
  modalRef: RefObject<HTMLDivElement>;
}

export function AwardModal({
  award,
  onClose,
  modalRef,
}: AwardModalProps): JSX.Element {
  // Lock body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Get scrollbar width to prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // Lock scroll
    document.body.style.overflow = "hidden";
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
        className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/20 bg-gradient-to-br from-gray-900 to-black p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-white"
          aria-label="Close modal"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6 flex items-start gap-4">
          <div
            className={`h-16 w-16 flex-shrink-0 bg-gradient-to-br ${getCompanyLogoGradient(award.organization)} flex items-center justify-center rounded-xl text-2xl font-bold text-white shadow-lg`}
          >
            <svg
              className="h-10 w-10 text-white"
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
          <div className="flex-grow">
            <div className="mb-2 inline-block">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${award.type === "certification" ? "bg-cyan-400/20 text-cyan-400" : "bg-yellow-400/20 text-yellow-400"}`}
              >
                {award.type === "certification" ? "Certification" : "Award"}
              </span>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
              {toTitleCase(award.title)}
            </h2>
            <p className="mb-1 text-lg text-gray-300">
              {toTitleCase(award.organization)}
            </p>
            <p className="text-sm text-cyan-400">{award.year}</p>
          </div>
        </div>

        {/* Description */}
        {award.description && (
          <div className="mb-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">About</h3>
            <div className="prose prose-invert max-w-none text-sm leading-relaxed text-gray-300 md:text-base">
              <BlocksRenderer
                content={award.description}
                blocks={darkBlockRenderers}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
