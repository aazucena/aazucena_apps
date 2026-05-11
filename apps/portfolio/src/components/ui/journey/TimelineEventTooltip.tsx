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
    | (string | { name: string })[]
    | undefined;
  const skills = rawSkills?.map((s) => (typeof s === "string" ? s : s.name));

  const isExperience = type === "experience";
  const isEducation = type === "education";
  const subtitle = company || institution || event.subtitle || "";

  const badgeClass = isExperience
    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
    : isEducation
      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

  const skillChipClass = isExperience
    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
    : "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400";

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
      className="rounded-xl border border-gray-200 bg-white/95 p-4 shadow-2xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/95"
    >
      {/* Type badge + duration */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <span
          className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${badgeClass}`}
        >
          {type}
        </span>
        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
          {formatDate(event.date)}
          {event.endDate ? ` → ${formatDate(event.endDate)}` : " → Present"}
          {" · "}
          {calcDuration(event.date, event.endDate)}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-1 text-sm leading-tight font-bold text-gray-900 dark:text-white">
        {event.name}
      </h3>

      {/* Subtitle */}
      {subtitle && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
          {subtitle}
        </p>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="border-t border-gray-100 pt-3 dark:border-gray-700">
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 5).map((s, idx) => (
              <span
                key={idx}
                className={`rounded-full px-2 py-0.5 text-[10px] ${skillChipClass}`}
              >
                {s}
              </span>
            ))}
            {skills.length > 5 && (
              <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] text-gray-500 dark:bg-gray-800">
                +{skills.length - 5}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Experience: link to detail page */}
      {isExperience && slug && (
        <p className="mt-3 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
          Click node to view details →
        </p>
      )}

      {/* Education: field, GPA, honors */}
      {isEducation && (field || gpa || honors) && (
        <div className="mt-2 space-y-1 border-t border-gray-100 pt-2 dark:border-gray-700">
          {field && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">Field:</span> {field}
            </p>
          )}
          {gpa && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">GPA:</span> {gpa.toFixed(2)}
            </p>
          )}
          {honors && (
            <p className="text-xs font-medium text-green-600 dark:text-green-400">
              🏆 {honors}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
