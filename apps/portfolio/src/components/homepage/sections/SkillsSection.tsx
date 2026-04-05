/**
 * SkillsSection Component
 * Skills and technologies with tabbed interface
 */

import { PhoneDialTabs } from "@/components/ui/phone-dial-tabs";
import type { JSX } from "react";
import { useAnimation } from "@aazucena/context";
import { useSectionData } from "~/contexts/animations";
import { SkillBadgeList, mapGradientToVariant } from "~/components/ui/skills";
import { SectionLayout } from "./layouts";
import type { SectionProps } from "./types";
import { IconRenderer } from "~/components/blocks/IconRenderer";
import { getGradientClass } from "@aazucena/utils";

export interface SkillsSectionProps extends SectionProps {}

export function SkillsSection({
  title = "Skills & Technologies",
  subtitle = "Tools I Use to Build Great Products",
}: SkillsSectionProps): JSX.Element {
  const { skills: data } = useSectionData();
  const { isSoundMuted } = useAnimation();

  const categories = data.filter((category) => category.display === "visible");

  const tabs = categories.map((category) => ({
    id: String(category.id),
    name: category.name,
    label: category.label,
    gradient: getGradientClass(category.gradient),
    icon: <IconRenderer icon={category.icon} />,
    content: (
      <SkillBadgeList
        skills={category.skills}
        variant={mapGradientToVariant(category.gradient)}
      />
    ),
  }));

  return (
    <div className="w-full">
      <SectionLayout title={title} subtitle={subtitle} contentWidth="medium">
        <PhoneDialTabs
          tabs={tabs}
          defaultTab="frontend"
          isSoundMuted={isSoundMuted}
        />
      </SectionLayout>
    </div>
  );
}
