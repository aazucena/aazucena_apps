import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { ZodError } from 'zod';
import { UAParser } from 'ua-parser-js';
import { mainClickhouseClient } from '@/lib/services';
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

    // 3. Transform & Filter
    const rows = logs
      .filter((log) => log.proxy) // Ensure it's a proxy request log
      .map((log) => {
        const proxy = log.proxy!;
        const geo = proxy.geo || {};
        const uaString = Array.isArray(proxy.userAgent)
          ? proxy.userAgent[0]
          : proxy.userAgent || '';

        // Parse UA for enrichment
        const parser = new UAParser(uaString);
        const browser = parser.getBrowser().name || 'unknown';
        const os = parser.getOS().name || 'unknown';
        const device = parser.getDevice().type || 'desktop';

        return {
          timestamp: new Date(log.timestamp || Date.now())
            .toISOString()
            .slice(0, 19)
            .replace('T', ' '),
          id: log.id || '',
          source: log.source || 'unknown',
          host: log.host || '',
          path: log.path || '',
          ua: uaString,
          country: geo.country || 'XX',
          city: geo.city || '',
          browser: browser,
          os: os,
          device: device,
          referer: proxy.referer || '',
          project_id: log.projectId || '',
          environment: 'production',
        };
      });

    // 4. Insert into ClickHouse
    if (rows.length > 0) {
      await mainClickhouseClient.insert({
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
