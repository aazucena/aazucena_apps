import { useEffect, useState } from "react";

interface CountUpProps {
  start?: number;
  end: number;
  decimals?: number;
  duration?: number;
  suffix?: string;
}

export function CountUp({
  start = 0,
  end,
  decimals = 0,
  duration = 2,
  suffix = "",
}: CountUpProps) {
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (start === end) return;
    let startTime: number | null = null;
    let rafId: number = 0;
    const totalMs = duration * 1000;

    const tick = (ts: number) => {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / totalMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(start + (end - start) * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [start, end, duration]);

  return (
    <span>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
