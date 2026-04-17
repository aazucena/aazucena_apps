import { Users, Zap, Message } from "@aazucena/icons";
import { InteractiveCard } from "./InteractiveCard";
// TEST 13: stub @aazucena/ui barrel import
// import { IconRenderer } from "@aazucena/ui";
const IconRenderer = ({
  icon: _icon,
}: {
  icon?: unknown;
  className?: string;
}) => null;
import { getWorkingStyleColor } from "@aazucena/utils";
import type { WorkingStyleItem } from "@aazucena/types";

interface WorkingStyleSectionProps {
  workingStyle?: WorkingStyleItem[];
}

// Fallback data for when CMS is not configured
const defaultWorkingStyle = [
  {
    title: "Collaborative Architect",
    subtitle: "Teamwork & Communication",
    description:
      "I believe the best code comes from diverse perspectives. I prioritize clear documentation and constructive code reviews to elevate the whole team.",
    icon: Users,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Pragmatic Problem Solver",
    subtitle: "Strategy & Execution",
    description:
      "I focus on shipping value. I balance technical excellence with business requirements, ensuring we solve the right problems at the right time.",
    icon: Zap,
    color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
  },
  {
    title: "Continuous Mentor",
    subtitle: "Growth & Culture",
    description:
      "Sharing knowledge is as important as writing code. I actively participate in mentorship and knowledge-sharing sessions to foster technical growth.",
    icon: Message,
    color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
  },
];

// Map string icon to React component for CMS icons
const getIconComponent = (iconString?: string | null) => {
  if (!iconString) return Users;

  // If icon is from CMS (SVG string), return a wrapper component
  if (typeof iconString === "string" && iconString.includes("<svg")) {
    return ({ size }: { size: number }) => (
      <IconRenderer icon={iconString} size={size} />
    );
  }

  // Fallback to default icon
  return Users;
};

export function WorkingStyleSection({
  workingStyle,
}: WorkingStyleSectionProps) {
  // Use CMS data if available, otherwise fallback to hardcoded data
  const items =
    workingStyle && workingStyle.length > 0
      ? workingStyle.map((style) => ({
          title: style.title,
          subtitle: style.subtitle,
          description: style.description,
          icon: getIconComponent(style.icon as string | null | undefined),
          color: getWorkingStyleColor(style.variant || "blue-cyan"),
        }))
      : defaultWorkingStyle;

  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((style, index) => (
        <InteractiveCard
          key={index}
          title={style.title}
          subtitle={style.subtitle}
          description={style.description}
          icon={style.icon}
          color={style.color}
        />
      ))}
    </div>
  );
}
