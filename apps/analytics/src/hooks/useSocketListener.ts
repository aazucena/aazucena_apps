'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/providers/SocketProvider';
import { LogEntry } from '@/components/logs/TelemetryFeed';

/**
 * Hook to listen for real-time telemetry signals via WebSocket
 * and manually update the TanStack Query cache.
 */
export function useSocketListener() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleSignal = (newLog: LogEntry) => {
      console.log('[Socket] Received signal:', newLog);

      // 1. Update the telemetry stream cache
      queryClient.setQueryData(['telemetry-stream'], (oldLogs: LogEntry[] | undefined) => {
        if (!oldLogs) return [newLog];
        // Add new log to the beginning and keep last 100
        return [newLog, ...oldLogs].slice(0, 100);
      });

      // 2. Invalidate summary and trends to trigger a background refetch
      // (Optional: we could manually update these too if we wanted ultra-precision)
      queryClient.invalidateQueries({ queryKey: ['system-summary'] });
    };

    socket.on('telemetry_signal', handleSignal);

    return () => {
      socket.off('telemetry_signal', handleSignal);
    };
  }, [socket, queryClient]);
}
