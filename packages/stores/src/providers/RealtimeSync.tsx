import { useEffect } from 'react';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useWebSocket } from './WebSocketProvider';

/**
 * Signal handler function signature
 */
export type SignalHandler<TSignal = any> = (
  signal: TSignal,
  queryClient: QueryClient,
) => void | Promise<void>;

/**
 * Real-time synchronization configuration
 */
export interface RealtimeSyncConfig<TSignal = any> {
  /**
   * WebSocket event name to listen for
   */
  eventName: string;

  /**
   * Handler function for incoming signals
   * Receives signal data and QueryClient for cache updates
   */
  onSignal: SignalHandler<TSignal>;

  /**
   * Error handler for signal processing
   */
  onError?: (error: Error) => void;

  /**
   * Enable sync (default: true)
   */
  enabled?: boolean;
}

export interface RealtimeSyncProps<TSignal = any> {
  config: RealtimeSyncConfig<TSignal>;
}

/**
 * RealtimeSync
 * Framework-agnostic real-time data synchronization component
 * Listens for WebSocket events and updates query cache
 *
 * @example
 * ```tsx
 * <RealtimeSync
 *   config={{
 *     eventName: 'telemetry_signal',
 *     onSignal: (signal, queryClient) => {
 *       queryClient.setQueryData(['logs'], (old: any[]) =>
 *         [signal, ...old].slice(0, 100)
 *       );
 *       queryClient.invalidateQueries({ queryKey: ['summary'] });
 *     },
 *     onError: (err) => console.error('Sync error:', err),
 *   }}
 * />
 * ```
 */
export function RealtimeSync<TSignal = any>({ config }: RealtimeSyncProps<TSignal>) {
  const { client, isConnected } = useWebSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!client || !isConnected || config.enabled === false) return;

    const handleSignal = async (signal: TSignal) => {
      try {
        await config.onSignal(signal, queryClient);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        config.onError?.(err);
      }
    };

    client.on(config.eventName, handleSignal);

    return () => {
      client.off(config.eventName, handleSignal);
    };
  }, [client, isConnected, config, queryClient]);

  return null;
}
