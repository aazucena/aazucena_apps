/**
 * AboutSection Component
 * About me section with description, highlights, stats, and learn more cards
 */

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import type { JSX } from "react";
import { darkBlockRenderers } from "~/components/blocks/BlockRenderers";
import { toTitleCase } from "@aazucena/utils";
import { useSectionData } from "~/contexts";
import {
  StatCard,
  LearnMoreCard,
  HighlightsPanel,
  ResponsiveGrid,
} from "~/components/ui";
import type { IconComponent } from "@aazucena/types";
import type { LearnMoreCardVariant } from "~/components/ui/about/LearnMoreCard";
import { SectionLayout } from "./SectionLayout";
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
      <div className="flex flex-col gap-3 text-center text-sm md:gap-6 md:text-xl">
        {/* Stats — order-2 mobile, order-3 desktop | 2-col → 3-col grid */}
        <ResponsiveGrid
          cols={{ sm: 2, md: 3 }}
          gap="md"
          className="order-2 md:order-3"
        >
          {about.stats.map((stat, index) => (
            <div
              key={index}
              className={
                index === about.stats.length - 1 && about.stats.length % 2 !== 0
                  ? "col-span-2 md:col-span-1"
                  : ""
              }
            >
              <StatCard value={stat.value} label={stat.label} />
            </div>
          ))}
        </ResponsiveGrid>

        {/* Learn More Cards — order-2 mobile, order-4 desktop | stacked → 2-col grid */}
        <ResponsiveGrid
          cols={{ sm: 1, md: 2 }}
          gap="sm"
          className="order-3 md:order-4"
        >
          {about.learnMoreCards.map((card, index) => (
            <LearnMoreCard
              key={index}
              href={card.button.url}
              title={toTitleCase(card.title)}
              variant={card.variant as LearnMoreCardVariant}
              icon={card.icon as IconComponent}
              buttonText={card.button.label}
              buttonIcon={card.button.icon as IconComponent | undefined}
            >
              {card.description}
            </LearnMoreCard>
          ))}
        </ResponsiveGrid>

        {/* Description — order-1 on both | first paragraph on mobile, full on desktop */}
        <div className="order-1">
          <div className="md:hidden">
            <BlocksRenderer
              content={(about.descriptions as BlocksContent).slice(0, 1)}
              blocks={darkBlockRenderers}
            />
          </div>
          <div className="hidden md:block">
            <BlocksRenderer
              content={about.descriptions as BlocksContent}
              blocks={darkBlockRenderers}
            />
          </div>
        </div>

        {/* Highlights Panel — hidden on mobile, order-2 desktop */}
        <div className="hidden md:order-2 md:block">
          <HighlightsPanel highlights={about.highlights} />
        </div>
      </div>
    </SectionLayout>
  );
}
