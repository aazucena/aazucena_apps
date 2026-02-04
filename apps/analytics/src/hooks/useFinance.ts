// apps/analytics/src/hooks/useFinance.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface FinanceStatsData {
  summary: {
    total_revenue: number;
    avg_transaction: number;
    transaction_count: number;
  };
  trends: { date: string; revenue: number; provider: string; }[];
  history: {
    timestamp: string;
    transaction_id: string;
    provider: string;
    amount: number;
    currency: string;
    type: string;
    customer_email: string;
    metadata: Record<string, string>;
  }[];
}

export function useFinanceStats() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);

  return useQuery<FinanceStatsData>({
    queryKey: ['finance-stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats/finance');
      if (!res.ok) throw new Error('FAILED_FINANCE_FETCH');
      const json = await res.json();
      return json.data;
    },
    refetchInterval: isLive ? 30000 : false,
  });
}
