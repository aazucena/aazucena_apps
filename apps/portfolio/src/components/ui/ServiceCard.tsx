import { Badge, Button, IconRenderer, Panel } from "@aazucena/ui";
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

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const categoryLabel = CATEGORY_LABELS[service.category] ?? service.category;

  return (
    <Panel className="border-rule p-panel flex flex-col gap-5 border">
      {/* Header: icon + title + tags */}
      <div className="flex items-start gap-4">
        {!!service.icon && (
          <div className="border-rule bg-state text-signal rounded-control flex h-12 w-12 flex-shrink-0 items-center justify-center border">
            <IconRenderer icon={service.icon as string} size={22} aria-hidden />
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-foreground text-lg font-semibold">
            {service.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{categoryLabel}</Badge>
            {service.price && (
              <Badge variant="secondary">{service.price}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed">
        {service.shortDescription}
      </p>

      {/* Feature list */}
      {service.features.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {service.features.map((feature, i) => (
            <li
              key={i}
              className="text-muted-foreground flex items-center gap-2.5 text-sm"
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
        <div className="mt-auto pt-1">
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
    </Panel>
  );
}
