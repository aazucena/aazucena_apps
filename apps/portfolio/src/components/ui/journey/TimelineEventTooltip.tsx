/**
 * TimelineEventTooltip
 *
 * Hover card for the InteractiveTimeline on the Journey page.
 * Rendered via the `hoverPopup` render prop — package owns positioning,
 * this component owns content.
 *
 * Positioned using the SVG-relative {x, y} coordinates supplied by the
 * onEventHover callback inside useInteractiveTimeline.
 */

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

const TYPE_BADGE: Record<string, string> = {
  experience:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  education:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

export function TimelineEventTooltip({
  event,
  pos,
}: TimelineEventTooltipProps) {
  if (!event || !pos) return null;

  const type = String((event as any).type || "");
  const company = (event as any).company as string | undefined;
  const institution = (event as any).institution as string | undefined;
  // skills can be string[] or SkillWithCategory[] — normalise to plain strings
  const rawSkills = (event as any).skills as
    | (string | { name: string })[]
    | undefined;
  const skills = rawSkills?.map((s) => (typeof s === "string" ? s : s.name));
  const subtitle = company || institution || "";
  const badgeClass =
    TYPE_BADGE[type] ??
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

  // Position card above the hovered bar, centred horizontally
  const style: React.CSSProperties = {
    position: "absolute",
    left: pos.x,
    top: pos.y - 8, // 8px gap above the bar
    transform: "translate(-50%, -100%)",
    zIndex: 20,
    maxWidth: "240px",
    width: "max-content",
    pointerEvents: "none",
  };

  return (
    <div
      style={style}
      className="rounded-xl border border-gray-100 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900"
    >
      {/* Type badge */}
      {type && (
        <span
          className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${badgeClass}`}
        >
          {type}
        </span>
      )}

      {/* Title */}
      <p className="text-sm leading-tight font-bold text-gray-900 dark:text-white">
        {event.name}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      )}

      {/* Dates + duration */}
      <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
        {formatDate(event.date)}
        {event.endDate && ` → ${formatDate(event.endDate)}`}
        {" · "}
        <span className="font-semibold">
          {calcDuration(event.date, event.endDate)}
        </span>
      </p>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {skills.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              {s}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              +{skills.length - 4}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
