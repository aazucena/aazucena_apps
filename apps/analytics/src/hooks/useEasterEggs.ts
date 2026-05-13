'use client';

import { useQuery } from '@tanstack/react-query';

export interface EasterEggSummary {
  total_completions: number;
  unique_eggs: number;
  avg_completion_ms: number;
  avg_attempts: number;
}

export interface EggBreakdown {
  egg_id: string;
  egg_name: string;
  completions: number;
  avg_ms: number;
  avg_attempts: number;
}

export interface TriggerBreakdown {
  trigger_type: string;
  completions: number;
}

export interface EggTrend {
  date: string;
  completions: number;
}

export interface RecentCompletion {
  egg_id: string;
  egg_name: string;
  trigger_type: string;
  completion_time_ms: number;
  attempt_count: number;
  country: string;
  device_type: string;
  timestamp: string;
}

export interface EasterEggsData {
  summary: EasterEggSummary;
  byEgg: EggBreakdown[];
  byTrigger: TriggerBreakdown[];
  trend: EggTrend[];
  recent: RecentCompletion[];
}

async function fetchEasterEggs(): Promise<{ data: EasterEggsData }> {
  const res = await fetch('/api/stats/easter-eggs');
  if (!res.ok) throw new Error('Failed to fetch easter egg stats');
  return res.json();
}

export function useEasterEggs() {
  return useQuery({
    queryKey: ['easter-eggs'],
    queryFn: fetchEasterEggs,
    staleTime: 60_000,
  });
}
