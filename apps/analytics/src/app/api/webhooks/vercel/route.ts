import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { ZodError } from 'zod';
import { UAParser } from 'ua-parser-js';
import { ingestClickhouseClient } from '@/lib/services';
import { VercelLogDrainPayloadSchema } from '@/lib/schemas/vercelAnalyticsWebhook';

const VERCEL_LOG_DRAIN_SECRET = process.env.VERCEL_LOG_DRAIN_SECRET;

export async function POST(req: NextRequest) {
  let jsonBody;

  // 1. Signature Verification
  if (VERCEL_LOG_DRAIN_SECRET) {
    const signature = req.headers.get('x-vercel-signature');
    if (!signature) {
      // Vercel's drain setup probe is unsigned — acknowledge it so the drain connects,
      // but skip insertion so unauthenticated requests can't inject data.
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    const body = await req.text();
    const computedSignature = createHmac('sha1', VERCEL_LOG_DRAIN_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== computedSignature) {
      console.warn('[VercelWebhook] Invalid signature.');
      return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
    }

    try {
      jsonBody = JSON.parse(body);
    } catch {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }
  } else {
    // No secret configured — parse JSON directly (dev / pre-secret setup)
    try {
      jsonBody = await req.json();
    } catch {
      return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }
  }

  try {
    // 2. Validate Payload
    const logs = VercelLogDrainPayloadSchema.parse(jsonBody);

    // Diagnostic: log the first entry's geo structure so we can verify
    // what Vercel actually sends. Remove once geo is confirmed working.
    if (logs.length > 0) {
      const sample = logs[0];
      console.warn(
        '[VercelWebhook] proxy sample:',
        JSON.stringify({
          proxy_path: sample.proxy?.path,
          proxy_region: sample.proxy?.region,
          has_proxy: !!sample.proxy,
        }),
      );
    }

    // 3. Transform & Filter
    const rows = logs
      .filter((log) => log.proxy) // Ensure it's a proxy request log
      .map((log) => {
        const proxy = log.proxy!;
        // proxy.userAgent is always an array per Vercel log drain docs
        const uaString = proxy.userAgent?.[0] ?? '';

        // Parse UA for enrichment
        const parser = new UAParser(uaString);
        const browser = parser.getBrowser().name || 'unknown';
        const os = parser.getOS().name || 'unknown';
        const device = parser.getDevice().type || 'desktop';

        // proxy.path is the actual URL (e.g. /about?ref=home).
        // Top-level log.path is the route pattern (/[slug]) — not useful for traffic analysis.
        // Strip query string for clean path storage.
        const rawPath = proxy.path || log.path || '';
        const path = rawPath.split('?')[0] || '/';

        return {
          timestamp: new Date(log.timestamp || Date.now())
            .toISOString()
            .slice(0, 19)
            .replace('T', ' '),
          id: log.id || '',
          source: log.source || 'unknown',
          host: proxy.host || log.host || '',
          path,
          ua: uaString,
          country: 'XX', // Vercel log drain does not include geo — no proxy.geo field
          city: '',
          browser,
          os,
          device,
          referer: proxy.referer || '',
          project_id: log.projectId || '',
          environment: log.environment || 'production',
        };
      });

    // 4. Insert into ClickHouse
    if (rows.length > 0) {
      await ingestClickhouseClient.insert({
        table: 'analytics.vercel_analytics_events',
        values: rows,
        format: 'JSONEachRow',
      });
      console.warn(`[VercelWebhook] Ingested ${rows.length} events.`);
    }

    return NextResponse.json({ message: 'Ingested' }, { status: 200 });
  } catch (error: unknown) {
    console.error('[VercelWebhook] Error:', error);
    if (error instanceof ZodError) {
      const zodError = error as ZodError;
      if ('errors' in zodError) {
        return NextResponse.json(
          { message: 'Invalid payload', errors: zodError.errors },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { message: 'Invalid payload', errors: 'Unknown validation error' },
        { status: 400 },
      );
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
