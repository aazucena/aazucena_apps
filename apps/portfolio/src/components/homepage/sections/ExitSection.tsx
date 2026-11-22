import type { JSX } from "react";
import { ArrowRight } from "@aazucena/icons";
import { cn } from "@aazucena/utils";
import { SectionLayout } from "./SectionLayout";

const GRID_DESTINATIONS = [
  {
    label: "About",
    description: "The story behind the work",
    href: "/about",
  },
  {
    label: "Projects",
    description: "Full portfolio of shipped work",
    href: "/projects",
  },
  {
    label: "Journey",
    description: "Interactive career timeline",
    href: "/journey",
  },
  {
    label: "Blog",
    description: "Writing on engineering and craft",
    href: "/blog",
  },
] as const;

const CTA_DESTINATION = {
  label: "Contact",
  description: "Let's work together",
  href: "/contact",
} as const;

function DestinationCard({
  label,
  description,
  href,
  highlight = false,
}: {
  label: string;
  description: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn(
        "press group rounded-card bg-panel hover:bg-state focus-visible:outline-signal flex items-center justify-between border p-3.5 transition-colors duration-(--motion-base) focus-visible:outline-1 focus-visible:outline-offset-2 sm:p-5",
        highlight ? "border-signal" : "border-rule hover:border-rule-strong",
      )}
    >
      <div className="text-left">
        <p className="text-foreground text-sm font-bold sm:text-base">
          {label}
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
          {description}
        </p>
      </div>
      <ArrowRight
        size={16}
        className="text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground hover-nudge flex-shrink-0 [--nudge-x:4px] [--transition-also:color] sm:size-[18px]"
      />
    </a>
  );
}

export function ExitSection(): JSX.Element {
  return (
    <SectionLayout
      title="What's next?"
      subtitle="Keep exploring"
      contentWidth="medium"
    >
      <div className="mt-8 space-y-4 md:mt-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {GRID_DESTINATIONS.map(({ label, description, href }) => (
            <DestinationCard
              key={href}
              label={label}
              description={description}
              href={href}
            />
          ))}
        </div>
        <DestinationCard
          label={CTA_DESTINATION.label}
          description={CTA_DESTINATION.description}
          href={CTA_DESTINATION.href}
          highlight
        />
      </div>
    </SectionLayout>
  );
}
