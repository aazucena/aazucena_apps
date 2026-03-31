'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useFinancial } from '@aazucena/hooks';

export function useFinanceStats() {
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);
  return useFinancial({ isLive });
}
