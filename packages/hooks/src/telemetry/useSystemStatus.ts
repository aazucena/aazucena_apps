import { useState, useEffect } from 'react';
import { useTelemetryConfig } from '@aazucena/context/telemetry';
import type { SystemStatus } from '@aazucena/types';

/**
 * useSystemStatus Hook
 * Fetches the global system status from the analytics API.
 *
 * Meta-Framework Agnostic: Uses TelemetryContext for configuration.
 * Ensure TelemetryProvider is set up with your framework's env vars.
 */
export function useSystemStatus() {
  const [status, setStatus] = useState<SystemStatus>('LOADING');
  const { baseUrl } = useTelemetryConfig();

  useEffect(() => {
    if (!baseUrl) {
      setStatus('UNKNOWN');
      return;
    }

    const controller = new AbortController();

    fetch(`${baseUrl}/api/health/public`, {
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(5000)]),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.system) {
          setStatus(json.system.overall);
        } else {
          setStatus('UNKNOWN');
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setStatus('UNKNOWN');
      });

    return () => controller.abort();
  }, [baseUrl]);

  return { status, baseUrl };
}
