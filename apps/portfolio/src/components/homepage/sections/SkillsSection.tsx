/**
 * SkillsSection Component
 * Skills and technologies with tabbed interface
 */

import { PhoneDialTabs } from "@/components/ui/PhoneDialTabs";
import type { JSX } from "react";
import { useAnimation } from "@aazucena/context";
import { useSectionData } from "~/contexts";
import {
  SkillBadgeList,
  mapGradientToVariant,
} from "~/components/ui/SkillBadgeList";
import { SectionLayout } from "./SectionLayout";
import type { SectionProps } from "./types";
// TEST 11: comment out @aazucena/ui barrel import to isolate CJS source
// import { IconRenderer } from "@aazucena/ui";
const IconRenderer = ({ icon }: { icon: string }) => <span>{icon}</span>;
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
    icon: (
      <IconRenderer
        icon={
          category.icon as
            | import("@aazucena/types").IconComponent
            | null
            | undefined
        }
      />
    ),
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
