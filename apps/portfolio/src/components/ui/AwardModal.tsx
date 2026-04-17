/**
 * AwardModal Component
 * Modal for displaying award/certification details
 */

import { type JSX, type RefObject } from "react";
import type { Award } from "@aazucena/types";
import { toTitleCase } from "@aazucena/utils";
import { getCompanyLogoGradient, getGradientColors } from "@aazucena/utils";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { darkBlockRenderers } from "~/components/blocks/BlockRenderers";
// TEST 12: stub @aazucena/ui barrel import
// import { Dialog, DialogContent, DialogBody } from "@aazucena/ui";
const Dialog = ({
  children,
}: {
  children: React.ReactNode;
  open?: boolean;
}) => <div>{children}</div>;
const DialogContent = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);
const DialogBody = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);
import React from "react";

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
  const { from, to } = getGradientColors(
    getCompanyLogoGradient(award.organization),
  );

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        ref={modalRef}
        size="lg"
        className="max-h-[80vh] overflow-hidden border-white/20 bg-gradient-to-br from-gray-900 to-black p-0 shadow-2xl"
      >
        <DialogBody className="overflow-y-auto p-8">
          {/* Header */}
          <div className="mb-6 flex items-start gap-4">
            <div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl text-2xl font-bold text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
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
          {(award.description as
            | import("@strapi/blocks-react-renderer").BlocksContent
            | undefined) && (
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">About</h3>
              <div className="prose prose-invert max-w-none text-sm leading-relaxed text-gray-300 md:text-base">
                <BlocksRenderer
                  content={
                    award.description as import("@strapi/blocks-react-renderer").BlocksContent
                  }
                  blocks={darkBlockRenderers}
                />
              </div>
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
