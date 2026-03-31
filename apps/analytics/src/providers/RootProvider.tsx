'use client';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReduxStoreProvider } from '@/store';
import { SocketProvider } from './SocketProvider';
import { useSocketListener } from '@/hooks/useSocketListener';
import { TelemetryProvider } from '@aazucena/context/telemetry';

const telemetryConfig = {
  baseUrl: process.env.NEXT_PUBLIC_ANALYTICS_API_URL ?? '',
  secretKey: process.env.ANALYTICS_SECRET_KEY,
  defaultPollingInterval: 15000,
};

function SocketListener() {
  useSocketListener();
  return null;
}

export function RootProvider({ children }: { children: React.ReactNode }) {
  // TanStack Query Client
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30000,
            refetchInterval: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <TelemetryProvider config={telemetryConfig}>
      <ReduxStoreProvider>
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <SocketListener />
            {children}
          </SocketProvider>
          {/* DevTools: only bundled and rendered in development */}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
          )}
        </QueryClientProvider>
      </ReduxStoreProvider>
    </TelemetryProvider>
  );
}
