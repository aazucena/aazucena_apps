'use client';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReduxStoreProvider } from '@/store';
export function RootProvider({ children }: { children: React.ReactNode }) {
  // TanStack Query Client
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000,
        refetchInterval: 5000,
      },
    },
  }));


  return (
    <ReduxStoreProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* DevTools: Shows floating button to inspect queries (Hidden in Prod) */}
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      </QueryClientProvider>
    </ReduxStoreProvider>
  );
}
