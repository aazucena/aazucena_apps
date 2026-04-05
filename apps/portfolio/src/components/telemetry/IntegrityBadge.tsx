"use client";

import { useEffect, useState } from "react";
import { Shield } from "@mynaui/icons-react";
import { cn } from "@aazucena/utils";

interface IntegrityBadgeProps {
  className?: string;
  showLabel?: boolean;
}

export function IntegrityBadge({
  className,
  showLabel = true,
}: IntegrityBadgeProps) {
  const [status, setStatus] = useState<
    "OPERATIONAL" | "DEGRADED" | "UNKNOWN" | "LOADING"
  >("LOADING");

  useEffect(() => {
    // Determine the base URL for the analytics API
    // In production, this should be https://analytics.aazucena.com
    const baseUrl = import.meta.env.PUBLIC_ANALYTICS_API_URL || "";

    fetch(`${baseUrl}/api/health/public`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.system) {
          setStatus(json.system.overall);
        } else {
          setStatus("UNKNOWN");
        }
      })
      .catch(() => setStatus("UNKNOWN"));
  }, []);

  const colors = {
    OPERATIONAL: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
    DEGRADED: "text-amber-500 bg-amber-500/5 border-amber-500/10",
    UNKNOWN: "text-zinc-500 bg-zinc-500/5 border-zinc-500/10",
    LOADING: "text-blue-500 bg-blue-500/5 border-blue-500/10 animate-pulse",
  };

  const labels = {
    OPERATIONAL: "System: Nominal",
    DEGRADED: "System: Degraded",
    UNKNOWN: "System: Offline",
    LOADING: "System: Auditing",
  };

  return (
    <a
      href={
        import.meta.env.PUBLIC_ANALYTICS_API_URL
          ? `${import.meta.env.PUBLIC_ANALYTICS_API_URL}/status`
          : "/status"
      }
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-black tracking-[0.2em] uppercase transition-all hover:bg-white hover:shadow-lg active:scale-95 dark:hover:bg-gray-800",
        colors[status],
        className,
      )}
    >
      <Shield
        size={12}
        className={cn(status === "OPERATIONAL" && "animate-pulse")}
      />
      {showLabel && <span>{labels[status]}</span>}
    </a>
  );
}
