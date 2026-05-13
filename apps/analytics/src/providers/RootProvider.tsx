'use client';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReduxStoreProvider } from '@/store';
import { SocketProvider } from './SocketProvider';
import { ConfirmationProvider } from './ConfirmationProvider';
import { useSocketListener } from '@/hooks/useSocketListener';
import { TelemetryProvider } from '@aazucena/context/telemetry';
import { Toaster } from '@aazucena/ui';
import { NewFormWatcher } from '@/components/common/NewFormWatcher';

const telemetryConfig = {
  baseUrl: process.env.NEXT_PUBLIC_ANALYTICS_API_URL ?? '',
  secretKey: process.env.ANALYTICS_SECRET_KEY,
  defaultPollingInterval: 30000, // 30s (was 15s — too aggressive on constrained hardware)
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
            staleTime: 2 * 60 * 1000, // 2 min — reduces on-mount background refetches
            gcTime: 5 * 60 * 1000, // 5 min — keeps cache across normal navigation
            refetchInterval: false,
            refetchOnWindowFocus: false, // prevents mass refetch on every tab switch
            refetchOnReconnect: false, // prevents mass refetch on network reconnect
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
            <ConfirmationProvider>
              <SocketListener />
              <NewFormWatcher />
              {children}
              <Toaster richColors closeButton />
            </ConfirmationProvider>
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
