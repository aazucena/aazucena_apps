/**
 * AwardsSection Component
 * Awards and certifications with hexagonal grid layout
 */

import type { JSX } from 'react';
import { useSectionData } from '~/contexts/animations';
import { useModal } from '~/hooks/animations';
import { AwardModal } from '~/components/ui';
import { HexagonCard, SectionLabel } from '~/components/ui/awards';
import { SectionLayout } from './layouts';
import type { SectionProps } from './types';
import type { Award } from '~/lib/transformers/awards';

export interface AwardsSectionProps extends SectionProps {}

export function AwardsSection({ title = 'Awards & Certifications', subtitle = 'Recognition & Achievements' }: AwardsSectionProps): JSX.Element {
  const { awards: data } = useSectionData();
  const certifications = data.filter(award => award.type === 'certification');
  const achievementAwards = data.filter(award => award.type === 'award');

  const {
    isOpen: isAwardModalOpen,
    data: selectedAward,
    open: openAwardModal,
    close: closeAwardModal,
    modalRef
  } = useModal<Award>();

  return (
    <>
      <SectionLayout
        title={title}
        subtitle={subtitle}
        contentWidth="medium"
      >
        {/* Hexagonal Grid Layout */}
        <div className="relative mt-16 flex items-center justify-center min-h-[600px]">
          <div className="relative w-full max-w-4xl">
            {/* Certifications Section */}
            <SectionLabel text="Certifications" color="cyan" className="mb-8" />
            <div className="flex justify-center gap-4 mb-[-30px]">
              {certifications.map((cert) => (
                <HexagonCard key={cert.id} award={cert} onClick={() => openAwardModal(cert)} />
              ))}
            </div>

            {/* Awards Section */}
            <SectionLabel text="Awards" color="yellow" className="mb-8 mt-12" />
            <div className="flex justify-center gap-4">
              {achievementAwards.map((award) => (
                <HexagonCard key={award.id} award={award} dashed onClick={() => openAwardModal(award)} />
              ))}
            </div>
          </div>
        </div>
      </SectionLayout>

      {/* Award Modal - Outside container to avoid z-index issues */}
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
