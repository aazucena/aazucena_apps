/**
 * AwardsSection Component
 * Awards and certifications with hexagonal grid layout
 * Phase 3 Task #5: AwardModal lazy-loaded for bundle optimization
 */

import { lazy, Suspense, type JSX } from "react";
import { useSectionData } from "~/contexts";
import { useModal } from "@aazucena/hooks";
import { HexagonCard, SectionLabel } from "~/components/ui/awards";
import { SectionLayout } from "./SectionLayout";
import type { SectionProps } from "./types";
import type { Award } from "@aazucena/types";

// Lazy load AwardModal — wrapper file avoids .then(({default:m.X})) reserved-word issue
const AwardModal = lazy(() => import("~/components/ui/AwardModal.lazy"));


export interface AwardsSectionProps extends SectionProps {}

export function AwardsSection({
  title = "Awards & Certifications",
  subtitle = "Recognition & Achievements",
}: AwardsSectionProps): JSX.Element {
  const { awards: data } = useSectionData();
  const certifications = data.filter((award) => award.type === "certification");
  const achievementAwards = data.filter((award) => award.type === "award");

  const {
    isOpen: isAwardModalOpen,
    data: selectedAward,
    open: openAwardModal,
    close: closeAwardModal,
    modalRef,
  } = useModal<Award>();

  return (
    <>
      <SectionLayout title={title} subtitle={subtitle} contentWidth="medium">
        {/* Hexagonal Grid Layout */}
        <div className="relative mt-16 flex min-h-[600px] items-center justify-center">
          <div className="relative w-full max-w-4xl">
            {/* Certifications Section */}
            <SectionLabel text="Certifications" color="cyan" className="mb-8" />
            <div className="mb-[-30px] flex justify-center gap-4">
              {certifications.map((cert) => (
                <HexagonCard
                  key={cert.id}
                  award={cert}
                  onClick={() => openAwardModal(cert)}
                />
              ))}
            </div>

            {/* Awards Section */}
            <SectionLabel text="Awards" color="yellow" className="mt-12 mb-8" />
            <div className="flex justify-center gap-4">
              {achievementAwards.map((award) => (
                <HexagonCard
                  key={award.id}
                  award={award}
                  dashed
                  onClick={() => openAwardModal(award)}
                />
              ))}
            </div>
          </div>
        </div>
      </SectionLayout>

      {/* Award Modal - Lazy loaded, outside container to avoid z-index issues */}
      {isAwardModalOpen && selectedAward && (
        <Suspense fallback={<div className="sr-only">Loading...</div>}>
          <AwardModal
            award={selectedAward}
            onClose={closeAwardModal}
            modalRef={modalRef as any}
          />
        </Suspense>
      )}
    </>
  );
}
