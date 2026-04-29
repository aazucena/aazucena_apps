"use client";

import { SYSTEM_STATUS_METADATA } from "@aazucena/constants";
import { TelemetryProvider } from "@aazucena/context";
import { useSystemStatus } from "@aazucena/hooks";
import { Shield } from "@aazucena/icons";
import { cn } from "@aazucena/utils";

interface IntegrityBadgeProps {
  className?: string;
  showLabel?: boolean;
}

function IntegrityBadgeInner({
  className,
  showLabel = true,
}: IntegrityBadgeProps) {
  const { status, baseUrl } = useSystemStatus();
  const { label, colorClass } = SYSTEM_STATUS_METADATA[status];

  return (
    <a
      href={baseUrl ? `${baseUrl}/status` : "/status"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-black tracking-[0.2em] uppercase transition-all hover:bg-white hover:shadow-lg active:scale-95 dark:hover:bg-gray-800",
        colorClass,
        className,
      )}
    >
      <Shield
        size={12}
        className={cn(status === "OPERATIONAL" && "animate-pulse")}
      />
      {showLabel && <span>{label}</span>}
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
