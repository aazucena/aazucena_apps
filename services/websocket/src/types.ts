export interface MonitorConfig {
  id: string;
  url: string;
  type: 'CORE' | 'APP' | 'EXTERNAL';
  timeout?: number;
}

export interface ServiceHealth {
  service: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  latency_ms: number;
  message: string;
}
