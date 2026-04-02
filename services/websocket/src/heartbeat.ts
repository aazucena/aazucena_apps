import http from 'http';
import fs from 'fs';
import path from 'path';
import { MonitorConfig, ServiceHealth } from './types';

// Assuming monitors.json is in the root (copied by Dockerfile)
const CONFIG_PATH = path.join(process.cwd(), 'monitors.json');
const INGEST_URL = process.env.INTERNAL_INGEST_URL || 'http://10.0.0.97:8080/api/ingest';
const SECRET_KEY = process.env.INGESTION_SECRET_KEY || '';

const BOOTSTRAP_CONFIG: MonitorConfig[] = [
  { id: 'strapi', url: 'http://aazucena-cms:1337/_health', type: 'CORE' },
  { id: 'clickhouse', url: 'http://aazucena-clickhouse:8123/ping', type: 'CORE' },
  { id: 'intel-bridge', url: 'http://aazucena-intel-bridge:3001/health', type: 'CORE' },
];

let activeMonitors: MonitorConfig[] = [...BOOTSTRAP_CONFIG];

function loadConfig() {
  try {
    let raw: any = null;
    if (process.env.MONITORS_CONFIG) {
      raw = JSON.parse(process.env.MONITORS_CONFIG);
    } else if (fs.existsSync(CONFIG_PATH)) {
      raw = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    }

    if (Array.isArray(raw)) {
      const valid = raw.filter((m: any) => m.id && m.url);
      if (valid.length > 0) {
        activeMonitors = valid;
        console.log(`✅ Heartbeat: Loaded ${activeMonitors.length} monitor(s).`);
      }
    }
  } catch (e: any) {
    console.error('❌ Heartbeat: Config error, using fallback.', e.message);
  }
}

async function checkService(service: MonitorConfig): Promise<ServiceHealth> {
  const start = Date.now();
  return new Promise((resolve) => {
    const req = http.get(service.url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const latency = Date.now() - start;
        let status: 'UP' | 'DOWN' | 'DEGRADED' =
          res.statusCode && res.statusCode >= 200 && res.statusCode < 300
            ? latency > 500
              ? 'DEGRADED'
              : 'UP'
            : 'DOWN';

        // Deep Inspection: Check JSON response for explicit "status" field
        if (status === 'UP' && res.headers['content-type']?.includes('application/json')) {
          try {
            const json = JSON.parse(data);
            if (json.status && json.status !== 'UP') {
              status = json.status;
            }
          } catch (e) {
            // Invalid JSON ignored
          }
        }

        resolve({
          service: service.id,
          status: status,
          latency_ms: latency,
          message: `HTTP ${res.statusCode}`,
        });
      });
    });

    req.on('error', (e: any) => {
      resolve({
        service: service.id,
        status: 'DOWN',
        latency_ms: Date.now() - start,
        message: e.code || 'CONNECTION_ERROR',
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        service: service.id,
        status: 'DOWN',
        latency_ms: 5000,
        message: 'TIMEOUT',
      });
    });
  });
}

async function runPulse() {
  console.log('💓 System Integrity Pulse...');
  for (const service of activeMonitors) {
    const result = await checkService(service);

    // Post to Ingestion API
    const postData = JSON.stringify({
      type: 'system_integrity',
      ...result,
    });

    const req = http.request(INGEST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': SECRET_KEY,
      },
    });

    req.on('error', (e: any) => {
      console.error(`❌ Heartbeat: Failed to ingest results for ${service.id}:`, e.message);
    });

    req.write(postData);
    req.end();
  }
}

// Initial load and start cycles
loadConfig();
setInterval(loadConfig, 300000); // Sync config every 5 mins
setInterval(runPulse, 60000); // Run checks every 1 min

// Immediate first pulse
runPulse();
