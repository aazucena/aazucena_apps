/**
 * ServicesSection Component
 * Adaptive tabs layout: horizontal for ≤3 services, vertical sidebar for >3.
 */

import { type JSX, useState, useCallback, useEffect } from "react";
import { ArrowLeftRight as ArrowsHorizontal } from "@aazucena/icons";
import { useSectionData } from "~/contexts";
import { SectionLayout } from "./SectionLayout";
import type { SectionProps } from "./types";
import type { Service } from "@aazucena/types";
import {
  Badge,
  Button,
  IconRenderer,
  Panel,
  MarkdownRenderer,
} from "@aazucena/ui";
import { cn } from "@aazucena/utils";
import { categoryTone } from "~/lib/utils/series-tone";

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

const FEATURES_CAP = 3;

function ServicePanel({ service }: { service: Service }): JSX.Element {
  const categoryLabel = CATEGORY_LABELS[service.category] ?? service.category;
  const tone = categoryTone(service.category);
  const [featuresExpanded, setFeaturesExpanded] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const hasMore = service.features.length > FEATURES_CAP;
  const longDesc = (service.description?.length ?? 0) > 220;

  useEffect(() => {
    setDescExpanded(false);
    setFeaturesExpanded(false);
  }, [service.id]);
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
            className="text-background rounded-control flex h-10 w-10 flex-shrink-0 items-center justify-center sm:h-12 sm:w-12"
            style={{ backgroundColor: tone }}
          >
            <IconRenderer icon={service.icon as string} size={20} aria-hidden />
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-foreground text-base font-bold sm:text-lg md:text-xl">
            {service.title}
          </h3>
          <Badge variant="outline" className="w-fit">
            {categoryLabel}
          </Badge>
        </div>
      </div>

      {/* Price hint (optional) */}
      {service.price && (
        <p className="text-muted-foreground text-xs font-medium">
          {service.price}
        </p>
      )}

      {/* Description */}
      {service.description ? (
        <div className="flex flex-col gap-1">
          <div
            className={cn(
              !descExpanded &&
                longDesc &&
                "max-h-[6.5rem] overflow-hidden md:max-h-none md:overflow-visible",
            )}
          >
            <MarkdownRenderer
              content={service.description}
              className="text-muted-foreground [&_a]:break-words [&_img]:max-w-full [&_li]:text-[11px] sm:[&_li]:text-xs md:[&_li]:text-sm [&_p]:text-[11px] [&_p]:leading-relaxed sm:[&_p]:text-xs md:[&_p]:text-sm [&_pre]:overflow-x-auto"
            />
          </div>
          {longDesc && (
            <button
              onClick={() => setDescExpanded((prev) => !prev)}
              className="text-muted-foreground hover:text-foreground focus-visible:outline-signal mt-0.5 self-start text-xs font-medium transition-colors focus-visible:outline-1 focus-visible:outline-offset-2 md:hidden"
            >
              {descExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground text-[11px] leading-relaxed sm:text-xs md:text-sm">
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
                className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: tone }}
                />
                {feature}
              </li>
            ))}
          </ul>
          {hasMore && (
            <button
              onClick={toggleFeatures}
              className="border-rule text-signal hover:bg-state rounded-control focus-visible:outline-signal mt-1 flex w-full items-center justify-center gap-1.5 border py-2 text-xs font-medium transition-colors focus-visible:outline-1 focus-visible:outline-offset-2 md:hidden"
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
          <Button
            asChild
            size="sm"
            className="press"
            variant={
              service.cta.variant === "primary" ||
              service.cta.variant === "secondary"
                ? "default"
                : "outline"
            }
          >
            <a
              href={service.cta.url}
              target={service.cta.openInNewTab ? "_blank" : undefined}
              rel={service.cta.openInNewTab ? "noopener noreferrer" : undefined}
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
          </Button>
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
          <p className="text-muted-foreground flex animate-pulse items-center justify-center gap-2 text-sm">
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
            const isActive = activeId === service.id;
            return (
              <button
                key={service.id}
                onClick={() => setActiveId(service.id)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-control focus-visible:outline-signal h-control flex flex-shrink-0 items-center gap-2 border px-3 text-sm font-medium transition-colors duration-(--motion-base) focus-visible:outline-1 focus-visible:outline-offset-2",
                  isVertical
                    ? "justify-start md:w-full"
                    : "justify-center px-5",
                  isActive
                    ? "border-signal bg-state text-foreground"
                    : "border-rule bg-panel text-muted-foreground hover:bg-state hover:text-foreground",
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
          <Panel
            label={`SERVICE // ${activeService.title}`}
            className={cn(
              "border-rule min-w-0 overflow-hidden border",
              isVertical && "md:flex-1",
            )}
          >
            <ServicePanel service={activeService} />
          </Panel>
        )}
      </div>
    </SectionLayout>
  );
}
