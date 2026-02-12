import { useState, useEffect } from 'react';
import { useTelemetryConfig } from '@aazucena/context';
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
    // Fetch Public Health Status
    fetch(`${baseUrl}/api/health/public`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.system) {
          setStatus(json.system.overall);
        } else {
          setStatus('UNKNOWN');
        }
      })
      .catch(() => setStatus('UNKNOWN'));
  }, [baseUrl]);

  return { status, baseUrl };
}
