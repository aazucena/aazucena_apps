import { type JSX, useState } from "react";
import { ChevronDown } from "@aazucena/icons";
import { IconRenderer, MarkdownRenderer } from "@aazucena/ui";
import { cn } from "@aazucena/utils";
import type { Service } from "@aazucena/types";

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

const CATEGORY_GRADIENTS: Record<string, string> = {
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

function ServicePanel({ service }: { service: Service }): JSX.Element {
  const gradient =
    CATEGORY_GRADIENTS[service.category] ?? "from-cyan-400 to-blue-500";
  const categoryLabel = CATEGORY_LABELS[service.category] ?? service.category;

  return (
    <div className="flex flex-col gap-3 sm:gap-5">
      {/* Header: icon + title + badge */}
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
          <h3 className="text-base font-bold text-gray-900 sm:text-lg dark:text-white">
            {service.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full bg-gradient-to-r px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white uppercase",
                gradient,
              )}
            >
              {categoryLabel}
            </span>
            {service.price && (
              <span className="rounded-full border border-gray-100 bg-white px-2.5 py-0.5 text-[10px] font-black tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
                {service.price}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {service.description ? (
        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 [&_p]:text-[11px] [&_p]:leading-relaxed sm:[&_p]:text-xs md:[&_p]:text-sm">
          <MarkdownRenderer content={service.description} />
        </div>
      ) : (
        <p className="text-[11px] leading-relaxed text-gray-600 sm:text-xs md:text-sm dark:text-gray-400">
          {service.shortDescription}
        </p>
      )}

      {/* Feature list */}
      {service.features.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {service.features.map((feature, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-xs text-gray-600 sm:text-sm dark:text-gray-400"
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
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90 sm:px-4 sm:py-2",
              service.cta.variant === "primary" ||
                service.cta.variant === "secondary"
                ? cn("bg-gradient-to-r text-white", gradient)
                : "border border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300",
            )}
          >
            {!!service.cta.icon && (
              <IconRenderer
                icon={service.cta.icon as string}
                size={12}
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

interface ServiceTabsProps {
  services: Service[];
}

export function ServiceTabs({ services }: ServiceTabsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState(services[0]?.id ?? 0);
  const activeService = services.find((s) => s.id === activeTab) ?? services[0];

  return (
    <div className="flex w-full flex-col gap-4" data-toc-exclude>
      {/* Service selector dropdown — all screen sizes */}
      <div className="relative w-full">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(Number(e.target.value))}
          className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white py-3 pr-10 pl-4 text-sm font-semibold text-gray-900 shadow-sm transition-colors focus:border-gray-400 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:border-gray-400 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-900 dark:[&>option]:text-white"
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden
        />
      </div>

      {/* Active panel */}
      {activeService && (
        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900/30">
          <ServicePanel service={activeService} />
        </div>
      )}
    </div>
  );
}
