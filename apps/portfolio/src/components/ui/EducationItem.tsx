/**
 * EducationItem.tsx
 * An expandable education card showing degree, institution, and detailed description.
 */

import { Calendar, ChevronDown, ClockCircle as Clock } from "@aazucena/icons";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useId, useState } from "react";
import { MarkdownRenderer } from "@aazucena/ui";
import { calculateDuration } from "@aazucena/utils";

interface EducationItemProps {
  edu: {
    id?: number;
    slug?: string;
    startDate: string;
    graduationDate?: string | null;
    current: boolean;
    degree: string;
    institution: string;
    institutionLogoUrl?: string;
    description?: string | null;
  };
}

function getInstitutionInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

export function EducationItem({ edu }: EducationItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const uid = useId();
  const buttonId = `${uid}-toggle`;
  const panelId = `${uid}-details`;

  const formatEduDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const duration = calculateDuration(
    edu.startDate,
    edu.graduationDate || undefined,
    edu.current,
  );

  return (
    <div className="border-rule relative border-l pb-8 pl-8 last:pb-0">
      {/* Timeline Node */}
      <div className="border-signal bg-background absolute top-0 -left-[6px] z-10 size-[11px] rounded-full border-2"></div>

      {/* A real button inside the heading toggles the details; its ::after stretches over
          the header so the whole header still clicks. The details sit outside the button,
          so their links work and the heading stays a heading. Focus shows the site's
          global ring on the button. */}
      <div className="group relative mb-2 flex items-start gap-4">
        {/* Institution Logo */}
        <div
          className={`rounded-control border-rule flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden border font-mono ${edu.institutionLogoUrl ? "bg-(--logo-plate)" : "bg-state text-signal text-xs"}`}
        >
          {edu.institutionLogoUrl ? (
            <img
              src={edu.institutionLogoUrl}
              alt={edu.institution}
              className="h-full w-full object-contain p-1.5"
            />
          ) : (
            getInstitutionInitials(edu.institution)
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="space-y-1">
            <h3
              id={edu.slug}
              className="text-foreground group-hover:text-signal text-xl font-semibold transition-colors"
            >
              <button
                type="button"
                id={buttonId}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => setIsExpanded((v) => !v)}
                className="flex cursor-pointer items-center gap-2 text-left after:absolute after:inset-0"
              >
                {edu.degree}
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className={`text-muted-foreground shrink-0 transition-transform duration-(--motion-base) ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </h3>
            <p className="text-signal text-sm">{edu.institution}</p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="rounded-badge border-rule bg-state micro-label text-muted-foreground flex items-center gap-1.5 border px-2 py-0.5">
                <Calendar size={12} />
                {formatEduDate(edu.startDate)} —{" "}
                {edu.graduationDate
                  ? formatEduDate(edu.graduationDate)
                  : "Present"}
              </div>
              <div className="rounded-badge border-signal/60 bg-signal-faint micro-label text-signal flex items-center gap-1.5 border px-2 py-0.5">
                <Clock size={12} />
                {duration}
              </div>
            </div>
          </div>
        </div>
      </div>

      <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-rule mt-4 border-t py-4">
                {edu.description ? (
                  <div className="prose prose-sm dark:prose-invert text-muted-foreground max-w-none leading-relaxed">
                    <MarkdownRenderer content={edu.description} />
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm italic">
                    No additional details provided.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </div>
  );
}
