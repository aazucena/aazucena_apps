/**
 * AboutSection Component
 * About me section with description, highlights, stats, and learn more cards
 */

import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import type { JSX } from "react";
import { darkBlockRenderers } from "~/components/blocks/BlockRenderers";
import { toTitleCase } from "@aazucena/utils";
import { useSectionData } from "~/contexts/animations";
import {
  StatCard,
  LearnMoreCard,
  HighlightsPanel,
  ResponsiveGrid,
} from "~/components/ui";
import type { LearnMoreCardVariant } from "~/components/ui/about/LearnMoreCard";
import { SectionLayout } from "./layouts";
import type { SectionProps } from "./types";

export interface AboutSectionProps extends SectionProps {}

export function AboutSection({
  title = "About Me",
  subtitle,
}: AboutSectionProps): JSX.Element {
  const { about } = useSectionData();

  return (
    <SectionLayout
      title={title}
      subtitle={subtitle || about.tagline}
      contentWidth="narrow"
    >
      <div className="space-y-6 text-center text-lg md:text-xl">
        {/* Description */}
        <BlocksRenderer
          content={about.descriptions}
          blocks={darkBlockRenderers}
        />

        {/* Highlights Panel */}
        <HighlightsPanel highlights={about.highlights} />

        {/* Stats Grid */}
        <ResponsiveGrid cols={{ sm: 2, md: 3 }} gap="md" className="mt-8">
          {about.stats.map((stat, index) => (
            <StatCard key={index} value={stat.value} label={stat.label} />
          ))}
        </ResponsiveGrid>

        {/* Learn More Cards */}
        <ResponsiveGrid cols={{ sm: 1, md: 2 }} gap="sm" className="mt-8">
          {about.learnMoreCards.map((card, index) => (
            <LearnMoreCard
              key={index}
              href={card.button.url}
              title={toTitleCase(card.title)}
              variant={card.variant as LearnMoreCardVariant}
              icon={card.icon}
              buttonText={card.button.label}
              buttonIcon={card.button.icon}
            >
              {card.description}
            </LearnMoreCard>
          ))}
        </ResponsiveGrid>
      </div>
    </SectionLayout>
  );
}
