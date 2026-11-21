/**
 * RelatedLinks.tsx
 * Displays a list of related links (WebLink objects) with icons, in a ui Panel.
 */

import { ExternalLink, getIconComponent } from "@aazucena/icons";
import type { WebLink } from "@aazucena/types";
import { Panel, PanelHeader, PanelBody } from "@aazucena/ui";
import type { JSX } from "react";

interface RelatedLinksProps {
  links?: WebLink[];
  /** Panel label in the copy voice. */
  title?: string;
  className?: string;
}

export function RelatedLinks({
  links,
  title = "RELATED // LINKS",
  className,
}: RelatedLinksProps): JSX.Element | null {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <Panel className={className}>
      <PanelHeader label={title} />
      <PanelBody>
        <ul className="flex flex-col gap-1">
          {links.map((link, index) => {
            // Determine icon: Use CMS icon if provided, otherwise fallback to ExternalLink
            const Icon = (
              (link.icon as { name?: string } | null | undefined)?.name
                ? getIconComponent((link.icon as { name: string }).name)
                : ExternalLink
            ) as React.ElementType | string;

            return (
              <li key={index}>
                <a
                  href={link.url}
                  target={link.openInNewTab ? "_blank" : undefined}
                  rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                  className="group rounded-control hover:bg-state focus-visible:outline-signal flex items-start gap-3 p-2 transition-colors focus-visible:outline-1"
                >
                  <span className="text-signal mt-0.5">
                    {typeof Icon === "string" ? (
                      <span dangerouslySetInnerHTML={{ __html: Icon }} />
                    ) : (
                      <Icon size={16} aria-hidden="true" />
                    )}
                  </span>
                  <div>
                    <div className="text-signal text-sm font-medium group-hover:underline">
                      {link.text}
                    </div>
                    {link.description && (
                      <div className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                        {link.description}
                      </div>
                    )}
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </PanelBody>
    </Panel>
  );
}
