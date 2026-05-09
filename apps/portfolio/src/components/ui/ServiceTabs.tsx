import { type JSX, useState } from "react";
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
};

function ServicePanel({ service }: { service: Service }): JSX.Element {
  const gradient =
    CATEGORY_GRADIENTS[service.category] ?? "from-cyan-400 to-blue-500";
  const categoryLabel = CATEGORY_LABELS[service.category] ?? service.category;

  return (
    <div className="flex flex-col gap-5">
      {/* Header: icon + title + badge */}
      <div className="flex items-start gap-4">
        {!!service.icon && (
          <div
            className={cn(
              "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white",
              gradient,
            )}
          >
            <IconRenderer icon={service.icon as string} size={22} aria-hidden />
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
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
        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
          <MarkdownRenderer content={service.description} />
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {service.shortDescription}
        </p>
      )}

      {/* Feature list */}
      {service.features.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {service.features.map((feature, i) => (
            <li
              key={i}
              className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400"
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
        <div className="mt-auto pt-1">
          <a
            href={service.cta.url}
            target={service.cta.openInNewTab ? "_blank" : undefined}
            rel={service.cta.openInNewTab ? "noopener noreferrer" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-90",
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
    <div className="flex flex-col gap-6">
      {/* Tab buttons — same pattern as JourneyDashboard */}
      <div className="flex flex-wrap justify-center gap-2">
        {services.map((service) => {
          const gradient =
            CATEGORY_GRADIENTS[service.category] ?? "from-cyan-400 to-blue-500";
          return (
            <button
              key={service.id}
              onClick={() => setActiveTab(service.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition-all sm:px-6",
                activeTab === service.id
                  ? cn(
                      "bg-gradient-to-r text-white shadow-lg dark:shadow-none",
                      gradient,
                    )
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700",
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
              <span className="sm:hidden">
                {CATEGORY_LABELS[service.category] ?? service.category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      {activeService && (
        <div className="rounded-3xl border border-gray-100 bg-gray-50/50 p-8 dark:border-gray-800 dark:bg-gray-900/30">
          <ServicePanel service={activeService} />
        </div>
      )}
    </div>
  );
}
