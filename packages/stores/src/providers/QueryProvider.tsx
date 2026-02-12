import { useState, type ReactNode } from 'react';
import {
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
  type QueryClientConfig,
} from '@tanstack/react-query';

/**
 * Query provider configuration
 */
export interface QueryProviderConfig {
  /**
   * TanStack Query client configuration
   */
  clientConfig?: QueryClientConfig;

  /**
   * Custom QueryClient instance (optional)
   * If not provided, creates new instance with clientConfig
   */
  client?: QueryClient;

  /**
   * Callback when client is created
   */
  onClientCreated?: (client: QueryClient) => void;
}

export interface QueryProviderProps {
  children: ReactNode;
  config?: QueryProviderConfig;
}

/**
 * QueryProvider
 * Framework-agnostic TanStack Query provider
 *
 * @example
 * ```tsx
 * <QueryProvider
 *   config={{
 *     clientConfig: {
 *       defaultOptions: {
 *         queries: {
 *           staleTime: 5000,
 *           refetchInterval: 5000,
 *         },
 *       },
 *     },
 *   }}
 * >
 *   <App />
 * </QueryProvider>
 * ```
 */
export function QueryProvider({ children, config = {} }: QueryProviderProps) {
  const [queryClient] = useState(() => {
    const client = config.client ?? new QueryClient(config.clientConfig);
    config.onClientCreated?.(client);
    return client;
  });

  return <TanStackQueryClientProvider client={queryClient}>{children}</TanStackQueryClientProvider>;
}
