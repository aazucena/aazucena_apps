/**
 * SkillsSection Component
 * Mobile: user-swipeable pill strip with hint
 * Desktop: phone dial tabs
 */

import { PhoneDialTabs } from "@/components/ui/PhoneDialTabs";
import { ArrowLeftRight as ArrowsHorizontal } from "@aazucena/icons";
import type { JSX } from "react";
import { useState } from "react";
import { useAnimation } from "@aazucena/context";
import { useSectionData } from "~/contexts";
import {
  SkillBadgeList,
  mapGradientToVariant,
} from "~/components/ui/SkillBadgeList";
import { Badge } from "~/components/ui/common/Badge";
import { SectionLayout } from "./SectionLayout";
import type { SectionProps } from "./types";
import { IconRenderer } from "@aazucena/ui";
import { cn } from "@aazucena/utils";

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
    count: category.skills.length,
    icon: (
      <IconRenderer
        icon={
          category.icon as
            import("@aazucena/types").IconComponent | null | undefined
        }
      />
    ),
    content: (
      <SkillBadgeList
        skills={category.skills}
        variant={mapGradientToVariant(category.gradient ?? "")}
      />
    ),
  }));

  const [mobileActiveTab, setMobileActiveTab] = useState(
    categories[0]?.name ?? "",
  );
  const [mobileSkillsExpanded, setMobileSkillsExpanded] = useState(false);

  const MOBILE_MAX_SKILLS = 8;
  const activeMobileCategory = categories.find(
    (c) => c.name === mobileActiveTab,
  );
  const allMobileSkills = activeMobileCategory?.skills ?? [];
  const mobileSkills = mobileSkillsExpanded
    ? allMobileSkills
    : allMobileSkills.slice(0, MOBILE_MAX_SKILLS);
  const hiddenSkillsCount = allMobileSkills.length - MOBILE_MAX_SKILLS;

  return (
    <div className="w-full">
      <SectionLayout title={title} subtitle={subtitle} contentWidth="medium">
        {/* ── Mobile: swipeable pill strip ── */}
        <div className="md:hidden">
          {/* Swipe hint — mirrors projects section pattern */}
          <div className="mb-3 text-center">
            <p className="text-muted-foreground flex animate-pulse items-center justify-center gap-2 text-sm">
              <ArrowsHorizontal className="h-5 w-5" />
              Swipe to explore categories
            </p>
          </div>

          {/* Strip */}
          <div
            className="mb-6 flex gap-3 overflow-x-auto px-3 py-2 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setMobileActiveTab(tab.name);
                  setMobileSkillsExpanded(false);
                }}
                style={{ scrollSnapAlign: "center" }}
                aria-pressed={mobileActiveTab === tab.name}
                className={cn(
                  "press rounded-control h-control focus-visible:outline-signal flex flex-shrink-0 items-center gap-2 border px-4 text-sm font-medium whitespace-nowrap transition-colors duration-(--motion-base) focus-visible:outline-1 focus-visible:outline-offset-2",
                  mobileActiveTab === tab.name
                    ? "border-signal bg-state text-foreground"
                    : "border-rule bg-panel text-muted-foreground",
                )}
              >
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active category skill badges — capped to keep strip position stable */}
          {activeMobileCategory && (
            <div className="flex flex-wrap justify-center gap-2">
              <SkillBadgeList
                skills={mobileSkills}
                variant={mapGradientToVariant(
                  activeMobileCategory.gradient ?? "",
                )}
                size="sm"
              />
              {!mobileSkillsExpanded && hiddenSkillsCount > 0 && (
                <Badge
                  variant="gray"
                  size="sm"
                  onClick={() => setMobileSkillsExpanded(true)}
                >
                  +{hiddenSkillsCount} more
                </Badge>
              )}
              {mobileSkillsExpanded && (
                <Badge
                  variant="gray"
                  size="sm"
                  onClick={() => setMobileSkillsExpanded(false)}
                >
                  Show less
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* ── Desktop: phone dial tabs (unchanged) ── */}
        <div className="hidden md:block">
          <PhoneDialTabs
            tabs={tabs}
            defaultTab="frontend"
            isSoundMuted={isSoundMuted}
          />
        </div>
      </SectionLayout>
    </div>
  );
}
