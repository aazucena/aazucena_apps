/**
 * AwardModal Component
 * Modal for displaying award/certification details (ui Dialog: focus trap, Escape, labelled)
 */

import { type JSX, type RefObject } from "react";
import type { Award } from "@aazucena/types";
import { toTitleCase } from "@aazucena/utils";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { darkBlockRenderers } from "~/components/blocks/BlockRenderers";
import {
  Badge,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@aazucena/ui";

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
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      {/* The homepage is always dark and the block renderers are light-on-dark, so the
          dialog binds the dark tokens even though it portals outside the dark wrapper. */}
      <DialogContent
        ref={modalRef}
        size="lg"
        data-testid="award-modal"
        className="dark max-h-[80vh] overflow-hidden p-0"
      >
        <DialogBody className="overflow-y-auto p-8">
          {/* Header */}
          <div className="mb-6 flex items-start gap-4">
            <div className="border-rule bg-state text-signal rounded-control flex h-16 w-16 flex-shrink-0 items-center justify-center border">
              <svg
                className="h-10 w-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
                <Badge
                  variant={award.type === "certification" ? "sky" : "indigo"}
                >
                  {award.type === "certification" ? "Certification" : "Award"}
                </Badge>
              </div>
              <DialogTitle className="text-foreground mb-2 text-2xl font-semibold md:text-3xl">
                {toTitleCase(award.title)}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mb-1 text-lg">
                {toTitleCase(award.organization)}
              </DialogDescription>
              <p className="micro-label text-signal">{award.year}</p>
            </div>
          </div>

          {/* Description */}
          {(award.description as
            | import("@strapi/blocks-react-renderer").BlocksContent
            | undefined) && (
            <div className="mb-6 space-y-4">
              <h3 className="micro-label text-muted-foreground">About</h3>
              <div className="prose max-w-none text-sm leading-relaxed md:text-base">
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
