import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Generic WebSocket interface (not Socket.io-specific)
 * Allows dependency injection of any WebSocket library
 */
export interface WebSocketClient {
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
  disconnect: () => void;
  connected: boolean;
}

/**
 * WebSocket provider configuration
 */
export interface WebSocketConfig<T extends WebSocketClient = WebSocketClient> {
  /**
   * Factory function to create WebSocket client
   * Enables dependency injection of any WebSocket library (Socket.io, native WebSocket, etc.)
   */
  createClient: () => T;

  /**
   * Optional logger for connection events
   */
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;

  /**
   * Enable automatic reconnection
   */
  autoReconnect?: boolean;
}

interface WebSocketContextValue<T extends WebSocketClient = WebSocketClient> {
  client: T | null;
  isConnected: boolean;
  error: Error | null;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export interface WebSocketProviderProps<T extends WebSocketClient = WebSocketClient> {
  children: ReactNode;
  config: WebSocketConfig<T>;
}

/**
 * WebSocketProvider
 * Framework-agnostic WebSocket context provider
 *
 * @example
 * ```tsx
 * import { io } from 'socket.io-client';
 *
 * <WebSocketProvider
 *   config={{
 *     createClient: () => io('http://localhost:3001'),
 *     onConnect: () => console.log('Connected'),
 *     onError: (err) => console.error(err),
 *   }}
 * >
 *   <App />
 * </WebSocketProvider>
 * ```
 */
export function WebSocketProvider<T extends WebSocketClient = WebSocketClient>({
  children,
  config,
}: WebSocketProviderProps<T>) {
  const [client, setClient] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const wsClient = config.createClient();

      // Setup connection handlers
      const handleConnect = () => {
        setIsConnected(true);
        setError(null);
        config.onConnect?.();
      };

      const handleDisconnect = () => {
        setIsConnected(false);
        config.onDisconnect?.();
      };

      const handleError = (err: any) => {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        config.onError?.(error);
      };

      // Attach listeners
      wsClient.on('connect', handleConnect);
      wsClient.on('disconnect', handleDisconnect);
      wsClient.on('connect_error', handleError);
      wsClient.on('error', handleError);

      setClient(wsClient);

      return () => {
        wsClient.off('connect', handleConnect);
        wsClient.off('disconnect', handleDisconnect);
        wsClient.off('connect_error', handleError);
        wsClient.off('error', handleError);
        wsClient.disconnect();
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      config.onError?.(error);
    }
  }, [config]);

  return (
    <WebSocketContext.Provider value={{ client, isConnected, error }}>
      {children}
    </WebSocketContext.Provider>
  );
}

/**
 * Hook to access WebSocket client
 */
export function useWebSocket<
  T extends WebSocketClient = WebSocketClient,
>(): WebSocketContextValue<T> {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context as WebSocketContextValue<T>;
}
