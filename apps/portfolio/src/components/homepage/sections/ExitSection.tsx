import type { JSX } from "react";
import { ArrowRight } from "@aazucena/icons";
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
      className={`group flex items-center justify-between rounded-2xl border p-3.5 transition-all duration-300 active:scale-[0.98] sm:p-5 ${
        highlight
          ? "border-cyan-400/30 bg-cyan-400/10 hover:border-cyan-400/50 hover:bg-cyan-400/15"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
      }`}
    >
      <div className="text-left">
        <p className="text-sm font-bold text-white sm:text-base">{label}</p>
        <p className="mt-0.5 text-xs text-white/50 sm:text-sm">{description}</p>
      </div>
      <ArrowRight
        size={16}
        className="flex-shrink-0 text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white/60 sm:size-[18px]"
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
