/**
 * ServicesSection Component
 * Adaptive tabs layout: horizontal for ≤3 services, vertical sidebar for >3.
 */

import { type JSX, useState, useCallback } from "react";
import { ArrowLeftRight as ArrowsHorizontal } from "@aazucena/icons";
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
  research: "Research",
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
  research: "from-sky-400 to-cyan-600",
};

function getCategoryGradient(category: string): string {
  return CATEGORY_COLORS[category] ?? "from-cyan-400 to-blue-500";
}

const FEATURES_CAP = 6;

function ServicePanel({ service }: { service: Service }): JSX.Element {
  const gradient = getCategoryGradient(service.category);
  const categoryLabel = CATEGORY_LABELS[service.category] ?? service.category;
  const [featuresExpanded, setFeaturesExpanded] = useState(false);
  const hasMore = service.features.length > FEATURES_CAP;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const visibleFeatures =
    featuresExpanded || !isMobile
      ? service.features
      : service.features.slice(0, FEATURES_CAP);
  const toggleFeatures = useCallback(
    () => setFeaturesExpanded((prev) => !prev),
    [],
  );

  return (
    <div className="flex flex-col gap-3 text-left sm:gap-5">
      {/* Header: icon + title + category badge */}
      <div className="flex items-start gap-3">
        {!!service.icon && (
          <div
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white sm:h-12 sm:w-12",
              gradient,
            )}
          >
            <IconRenderer icon={service.icon as string} size={20} aria-hidden />
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-base font-bold text-white sm:text-lg md:text-xl">
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
        <MarkdownRenderer
          content={service.description}
          className="text-gray-300 [&_li]:text-[11px] sm:[&_li]:text-xs md:[&_li]:text-sm [&_p]:text-[11px] [&_p]:leading-relaxed sm:[&_p]:text-xs md:[&_p]:text-sm"
        />
      ) : (
        <p className="text-[11px] leading-relaxed text-gray-400 sm:text-xs md:text-sm">
          {service.shortDescription}
        </p>
      )}

      {/* Feature bullets */}
      {service.features.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <ul className="flex flex-col gap-1.5">
            {visibleFeatures.map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-xs text-gray-300 sm:text-sm"
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
          {hasMore && (
            <button
              onClick={toggleFeatures}
              className={cn(
                "mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs font-medium transition-all hover:border-white/20 hover:bg-white/5 active:scale-[0.98] md:hidden",
                "bg-gradient-to-r bg-clip-text text-transparent",
                gradient,
              )}
            >
              {featuresExpanded
                ? "Show less"
                : `Show all ${service.features.length} features`}
            </button>
          )}
        </div>
      )}

      {/* CTA */}
      {service.cta && (
        <div className="mt-auto pt-2">
          <a
            href={service.cta.url}
            target={service.cta.openInNewTab ? "_blank" : undefined}
            rel={service.cta.openInNewTab ? "noopener noreferrer" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity duration-200 hover:opacity-90 sm:px-4 sm:py-2",
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
        {/* Scroll hint — mobile only */}
        <div className="mb-2 text-center md:hidden">
          <p className="flex animate-pulse items-center justify-center gap-2 text-sm text-gray-400">
            <ArrowsHorizontal className="h-4 w-4" />
            Swipe to explore services
          </p>
        </div>

        {/* Tab buttons — horizontal scroll strip on mobile, vertical sidebar on md+ */}
        <div
          className={cn(
            "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1",
            isVertical
              ? "md:mx-0 md:min-w-[160px] md:flex-col md:overflow-x-visible md:px-0 md:pb-0"
              : "flex-wrap justify-center overflow-x-visible",
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
                  "flex flex-shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all",
                  isVertical
                    ? "justify-start md:w-full"
                    : "justify-center px-5",
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
                <span>{service.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active panel */}
        {activeService && (
          <div
            className={cn(
              "rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-6",
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
