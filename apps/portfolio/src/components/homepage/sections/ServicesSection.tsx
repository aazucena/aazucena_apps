/**
 * ServicesSection Component
 * Adaptive tabs layout: horizontal for ≤3 services, vertical sidebar for >3.
 */

import { type JSX, useState } from "react";
import { useSectionData } from "~/contexts";
import { SectionLayout } from "./SectionLayout";
import type { SectionProps } from "./types";
import type { Service } from "@aazucena/types";
import { IconRenderer, MarkdownRenderer } from "@aazucena/ui";
import { cn } from "@aazucena/utils";

export interface ServicesSectionProps extends SectionProps {}

const CATEGORY_LABELS: Record<string, string> = {
  engineering: "Engineering",
  consulting: "Consulting",
  design: "Design",
  ai: "AI/ML",
  analytics: "Analytics",
  tutoring: "Tutoring",
  devops: "DevOps",
  creative: "Creative",
};

const CATEGORY_COLORS: Record<string, string> = {
  engineering: "from-cyan-400 to-blue-500",
  consulting: "from-purple-400 to-indigo-500",
  design: "from-pink-400 to-rose-500",
  ai: "from-violet-400 to-purple-600",
  analytics: "from-emerald-400 to-teal-500",
  tutoring: "from-amber-400 to-orange-500",
  devops: "from-slate-400 to-blue-600",
  creative: "from-fuchsia-400 to-pink-500",
};

function getCategoryGradient(category: string): string {
  return CATEGORY_COLORS[category] ?? "from-cyan-400 to-blue-500";
}

function ServicePanel({ service }: { service: Service }): JSX.Element {
  const gradient = getCategoryGradient(service.category);
  const categoryLabel = CATEGORY_LABELS[service.category] ?? service.category;

  return (
    <div className="flex flex-col gap-5">
      {/* Header: icon + title + category badge */}
      <div className="flex items-start gap-4">
        {!!service.icon && (
          <div
            className={cn(
              "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white",
              gradient,
            )}
          >
            <IconRenderer icon={service.icon as string} size={24} aria-hidden />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-white md:text-xl">
            {service.title}
          </h3>
          <span
            className={cn(
              "inline-flex w-fit rounded-full bg-gradient-to-r px-2.5 py-0.5 text-xs font-medium text-white",
              gradient,
            )}
          >
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Price hint (optional) */}
      {service.price && (
        <p className="text-xs font-medium text-gray-400">{service.price}</p>
      )}

      {/* Description */}
      {service.description ? (
        <div className="prose prose-sm prose-invert max-w-none text-gray-300">
          <MarkdownRenderer content={service.description} />
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-gray-400">
          {service.shortDescription}
        </p>
      )}

      {/* Feature bullets */}
      {service.features.length > 0 && (
        <ul className="flex flex-col gap-2">
          {service.features.map((feature, i) => (
            <li
              key={i}
              className="flex items-center gap-2.5 text-sm text-gray-300"
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r",
                  gradient,
                )}
              />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      {service.cta && (
        <div className="mt-auto pt-2">
          <a
            href={service.cta.url}
            target={service.cta.openInNewTab ? "_blank" : undefined}
            rel={service.cta.openInNewTab ? "noopener noreferrer" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity duration-200 hover:opacity-90",
              service.cta.variant === "primary" ||
                service.cta.variant === "secondary"
                ? cn("bg-gradient-to-r text-white", gradient)
                : "border border-white/20 text-white/80 hover:text-white",
            )}
          >
            {!!service.cta.icon && (
              <IconRenderer
                icon={service.cta.icon as string}
                size={14}
                aria-hidden
              />
            )}
            {service.cta.label}
          </a>
        </div>
      )}
    </div>
  );
}

export function ServicesSection({
  title = "What I Do",
  subtitle = "Capabilities & Services",
}: ServicesSectionProps): JSX.Element {
  const { services: servicesData } = useSectionData();
  const { services } = servicesData;

  const [activeId, setActiveId] = useState(services[0]?.id ?? 0);
  const activeService = services.find((s) => s.id === activeId) ?? services[0];

  if (services.length === 0) return <></>;

  const isVertical = services.length > 3;

  return (
    <SectionLayout title={title} subtitle={subtitle} contentWidth="medium">
      <div
        className={cn(
          "mt-6 flex w-full flex-col gap-4",
          isVertical && "md:flex-row md:gap-6",
        )}
      >
        {/* Tab buttons */}
        <div
          className={cn(
            "flex flex-wrap justify-center gap-2",
            isVertical && "md:min-w-[160px] md:flex-col md:justify-start",
          )}
        >
          {services.map((service) => {
            const gradient = getCategoryGradient(service.category);
            const isActive = activeId === service.id;
            return (
              <button
                key={service.id}
                onClick={() => setActiveId(service.id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition-all sm:px-5",
                  isVertical
                    ? "justify-center md:w-full md:justify-start"
                    : "justify-center",
                  isActive
                    ? cn(
                        "bg-gradient-to-r text-white shadow-lg dark:shadow-none",
                        gradient,
                      )
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white",
                )}
              >
                {!!service.icon && (
                  <IconRenderer
                    icon={service.icon as string}
                    size={16}
                    aria-hidden
                  />
                )}
                <span className="hidden sm:inline">{service.title}</span>
                <span className="text-xs sm:hidden">
                  {CATEGORY_LABELS[service.category] ?? service.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active panel */}
        {activeService && (
          <div
            className={cn(
              "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm",
              isVertical && "md:flex-1",
            )}
          >
            <ServicePanel service={activeService} />
          </div>
        )}
      </div>
    </SectionLayout>
  );
}
