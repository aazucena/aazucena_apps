/**
 * AwardsSection Component
 * Awards and certifications with hexagonal grid layout
 */

import { type JSX } from "react";
import { useSectionData } from "~/contexts";
import { useModal } from "@aazucena/hooks";
import { HexagonCard, SectionLabel } from "~/components/ui/awards";
import { SectionLayout } from "./SectionLayout";
import type { SectionProps } from "./types";
import type { Award } from "@aazucena/types";
import { AwardModal } from "~/components/ui/AwardModal";

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
        <div className="relative mt-4 flex min-h-0 items-start justify-center md:mt-16 md:min-h-[600px] md:items-center">
          <div className="relative w-full max-w-4xl">
            {/* Certifications Section */}
            <SectionLabel
              text="Certifications"
              color="cyan"
              className="mb-4 md:mb-8"
            />
            <div className="mb-[-30px] flex flex-wrap justify-center gap-3">
              {certifications.map((cert) => (
                <HexagonCard
                  key={cert.id}
                  award={cert}
                  onClick={() => openAwardModal(cert)}
                />
              ))}
            </div>

            {/* Awards Section */}
            <SectionLabel
              text="Awards"
              color="yellow"
              className="mt-6 mb-4 md:mt-12 md:mb-8"
            />
            <div className="flex flex-wrap justify-center gap-3">
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

      {/* Award Modal - outside container to avoid z-index issues */}
      {isAwardModalOpen && selectedAward && (
        <AwardModal
          award={selectedAward}
          onClose={closeAwardModal}
          modalRef={modalRef as any}
        />
      )}
    </>
  );
}
