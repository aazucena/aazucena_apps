import type { JSX } from "react";
import {
  Badge,
  Button,
  IconRenderer,
  MarkdownRenderer,
  Panel,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@aazucena/ui";
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

function ServicePanel({ service }: { service: Service }): JSX.Element {
  const categoryLabel = CATEGORY_LABELS[service.category] ?? service.category;

  return (
    <div className="flex flex-col gap-3 sm:gap-5">
      {/* Header: icon + title + badge */}
      <div className="flex items-start gap-3">
        {!!service.icon && (
          <div className="border-rule bg-state text-signal rounded-control flex h-10 w-10 flex-shrink-0 items-center justify-center border sm:h-12 sm:w-12">
            <IconRenderer icon={service.icon as string} size={20} aria-hidden />
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{categoryLabel}</Badge>
            {service.price && (
              <Badge variant="secondary">{service.price}</Badge>
            )}
          </div>
          {service.shortDescription && (
            <h3 className="text-foreground text-lg font-semibold tracking-tight sm:text-xl">
              {service.shortDescription}
            </h3>
          )}
          {/* Description sits tight under the short description */}
          {service.description ? (
            <div className="prose prose-sm text-muted-foreground max-w-none [&_p]:text-[11px] [&_p]:leading-relaxed sm:[&_p]:text-xs md:[&_p]:text-sm">
              <MarkdownRenderer content={service.description} />
            </div>
          ) : null}
        </div>
      </div>

      {/* Features */}
      {service.features.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {service.features.map((feature, i) => (
            <li
              key={i}
              className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm"
            >
              <span
                className="bg-signal h-1.5 w-1.5 flex-shrink-0"
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      {service.cta && (
        <div className="mt-auto pt-2">
          <Button
            asChild
            size="sm"
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
                  size={12}
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

interface ServiceTabsProps {
  services: Service[];
}

export function ServiceTabs({ services }: ServiceTabsProps): JSX.Element {
  const first = services[0];
  if (!first) return <></>;

  return (
    <Tabs
      defaultValue={String(first.id)}
      className="flex w-full flex-col gap-4"
      data-toc-exclude
    >
      <TabsList
        aria-label="Services"
        className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0"
      >
        {services.map((service) => (
          <TabsTrigger
            key={service.id}
            value={String(service.id)}
            className="micro-label border-rule text-muted-foreground data-[state=active]:border-signal data-[state=active]:bg-state data-[state=active]:text-foreground h-control border px-3"
          >
            {service.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {services.map((service) => (
        <TabsContent
          key={service.id}
          value={String(service.id)}
          className="mt-0"
        >
          <Panel className="border-rule border p-4 sm:p-6">
            <ServicePanel service={service} />
          </Panel>
        </TabsContent>
      ))}
    </Tabs>
  );
}
