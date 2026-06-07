import type { JSX } from "react";
import { ArrowRight } from "@aazucena/icons";
import { SectionLayout } from "./SectionLayout";

const EXIT_DESTINATIONS = [
  {
    label: "About",
    description: "The story behind the work",
    href: "/about",
    highlight: false,
  },
  {
    label: "Projects",
    description: "Full portfolio of shipped work",
    href: "/projects",
    highlight: false,
  },
  {
    label: "Journey",
    description: "Interactive career timeline",
    href: "/journey",
    highlight: false,
  },
  {
    label: "Contact",
    description: "Let's work together",
    href: "/contact",
    highlight: true,
  },
] as const;

export function ExitSection(): JSX.Element {
  return (
    <SectionLayout
      title="What's next?"
      subtitle="Keep exploring"
      contentWidth="medium"
    >
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-12">
        {EXIT_DESTINATIONS.map(({ label, description, href, highlight }) => (
          <a
            key={href}
            href={href}
            className={`group flex items-center justify-between rounded-2xl border p-5 transition-all duration-300 active:scale-[0.98] ${
              highlight
                ? "border-cyan-400/30 bg-cyan-400/10 hover:border-cyan-400/50 hover:bg-cyan-400/15"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
            }`}
          >
            <div className="text-left">
              <p className="text-base font-bold text-white">{label}</p>
              <p className="mt-0.5 text-sm text-white/50">{description}</p>
            </div>
            <ArrowRight
              size={18}
              className="flex-shrink-0 text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white/60"
            />
          </a>
        ))}
      </div>
    </SectionLayout>
  );
}
