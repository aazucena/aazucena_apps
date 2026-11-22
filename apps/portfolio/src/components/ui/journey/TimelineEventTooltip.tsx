/**
 * TimelineEventTooltip
 *
 * Rich hover popup for the journey ChronologyTimeline.
 * Rendered via the `hoverPopup` render prop — package owns positioning,
 * this component owns content.
 *
 * Mirrors the rich popup from the old local InteractiveTimeline:
 * type badge + duration, title, subtitle, skills, experience link /
 * education field+GPA+honors.
 */

import { AwardBadge } from "@aazucena/icons";
import { Badge } from "@aazucena/ui";
import type { TimelineEvent } from "@aazucena/visualizations";

interface TimelineEventTooltipProps {
  event: TimelineEvent | null;
  pos: { x: number; y: number } | null;
}

function formatDate(d: Date | string | undefined): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function calcDuration(start: Date | string, end?: Date | string): string {
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : Date.now();
  const months = Math.round((e - s) / (1000 * 60 * 60 * 24 * 30.44));
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${years}y ${rem}mo` : `${years}y`;
}

export function TimelineEventTooltip({
  event,
  pos,
}: TimelineEventTooltipProps) {
  if (!event || !pos) return null;

  const type = String((event as any).type || "");
  const company = (event as any).company as string | undefined;
  const institution = (event as any).institution as string | undefined;
  const slug = (event as any).slug as string | undefined;
  const field = (event as any).field as string | undefined;
  const gpa = (event as any).gpa as number | null | undefined;
  const honors = (event as any).honors as string | null | undefined;

  const rawSkills = (event as any).skills as
    (string | { name: string })[] | undefined;
  const skills = rawSkills?.map((s) => (typeof s === "string" ? s : s.name));

  const isExperience = type === "experience";
  const isEducation = type === "education";
  const subtitle = company || institution || event.subtitle || "";

  // Position card above the hovered node, centered horizontally
  const style: React.CSSProperties = {
    position: "absolute",
    left: pos.x,
    top: pos.y - 10,
    transform: "translate(-50%, -100%)",
    zIndex: 20,
    maxWidth: "300px",
    minWidth: "240px",
    pointerEvents: "none",
  };

  return (
    <div
      style={style}
      role="tooltip"
      className="border-rule bg-panel-raised text-foreground rounded-control border p-3 font-mono"
    >
      {/* Type + duration */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <Badge variant={isExperience ? "cyber" : "outline"} size="xs">
          {type}
        </Badge>
        <span className="micro-label text-muted-foreground">
          {formatDate(event.date)}
          {event.endDate ? ` → ${formatDate(event.endDate)}` : " → Present"}
          {" · "}
          {calcDuration(event.date, event.endDate)}
        </span>
      </div>

      <h3 className="text-foreground mb-1 text-sm leading-tight font-semibold">
        {event.name}
      </h3>

      {subtitle && (
        <p className="text-muted-foreground mb-3 text-xs">{subtitle}</p>
      )}

      {skills && skills.length > 0 && (
        <div className="border-rule border-t pt-3">
          <ul className="flex flex-wrap gap-1">
            {skills.slice(0, 5).map((s, idx) => (
              <li key={idx}>
                <Badge variant="secondary" size="xs">
                  {s}
                </Badge>
              </li>
            ))}
            {skills.length > 5 && (
              <li>
                <Badge variant="outline" size="xs">
                  +{skills.length - 5}
                </Badge>
              </li>
            )}
          </ul>
        </div>
      )}

      {isExperience && slug && (
        <p className="micro-label text-signal mt-3">
          Click node to view details →
        </p>
      )}

      {isEducation && (field || gpa || honors) && (
        <div className="border-rule mt-2 space-y-1 border-t pt-2">
          {field && (
            <p className="text-muted-foreground text-xs">
              <span className="text-foreground">Field:</span> {field}
            </p>
          )}
          {gpa && (
            <p className="text-muted-foreground text-xs">
              <span className="text-foreground">GPA:</span> {gpa.toFixed(2)}
            </p>
          )}
          {honors && (
            <p className="text-foreground flex items-center gap-1.5 text-xs">
              <AwardBadge
                aria-hidden
                size={14}
                className="text-signal shrink-0"
              />
              {honors}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
