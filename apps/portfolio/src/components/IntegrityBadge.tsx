"use client";

import { SYSTEM_STATUS_METADATA } from "@aazucena/constants";
import { TelemetryProvider } from "@aazucena/context";
import { useSystemStatus } from "@aazucena/hooks";
import { Shield } from "@aazucena/icons";
import { Badge } from "@aazucena/ui";
import { cn } from "@aazucena/utils";

interface IntegrityBadgeProps {
  className?: string;
  showLabel?: boolean;
}

type BadgeStyle = {
  variant: "success" | "warning" | "outline" | "cyber";
  /** Marker the status grammar requires (warnings carry a diamond). */
  marker?: string;
};

/** Maps the system status onto the Avra status grammar. */
const STATUS_BADGE: Record<string, BadgeStyle> = {
  OPERATIONAL: { variant: "success" },
  DEGRADED: { variant: "warning", marker: "◆" },
  UNKNOWN: { variant: "outline" },
  LOADING: { variant: "cyber" },
};

function IntegrityBadgeInner({
  className,
  showLabel = true,
}: IntegrityBadgeProps) {
  const { status: reported, baseUrl } = useSystemStatus();
  // The health API can send a status the metadata doesn't list.
  const status = Object.hasOwn(SYSTEM_STATUS_METADATA, reported)
    ? reported
    : "UNKNOWN";
  const { label } = SYSTEM_STATUS_METADATA[status];
  const style = STATUS_BADGE[status] ?? STATUS_BADGE.UNKNOWN!;

  return (
    <a
      href={baseUrl ? `${baseUrl}/status` : "/status"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "focus-visible:outline-signal rounded-badge inline-flex focus-visible:outline-1 focus-visible:outline-offset-2",
        className,
      )}
    >
      <Badge variant={style.variant} size="md" className="hover:bg-state">
        <Shield
          size={12}
          className={cn(status === "LOADING" && "motion-safe:animate-pulse")}
        />
        {showLabel && (
          <span>
            {style.marker ? `${style.marker} ` : ""}
            {label}
          </span>
        )}
      </Badge>
    </a>
  );
}

export function IntegrityBadge(props: IntegrityBadgeProps) {
  const baseUrl = import.meta.env.PUBLIC_ANALYTICS_API_URL || "";

  return (
    <TelemetryProvider config={{ baseUrl }}>
      <IntegrityBadgeInner {...props} />
    </TelemetryProvider>
  );
}
