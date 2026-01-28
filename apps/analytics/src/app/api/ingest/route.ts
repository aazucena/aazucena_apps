import { clickhouse } from '@/lib/clickhouse';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// 1. Define the Schema for incoming telemetry
const IngestSchema = z.object({
  event: z.string().min(1),
  url: z.string().url().optional().or(z.string()),
  sessionId: z.string().min(1),
  data: z.record(z.any()).optional(),
});

// 2. CORS Headers Configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Adjust to your portfolio URL in production
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-secret-key',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    // 3. Security Check: Validate Secret Key
    const secretKey = request.headers.get('x-secret-key');
    if (secretKey !== process.env.INGESTION_SECRET_KEY) {
      console.warn('[INGEST_AUTH_FAILURE] Unauthorized source attempt');
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401, headers: corsHeaders });
    }

    const body = await request.json();
    
    // 4. Validate Data Structure
    const result = IngestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ 
        error: 'INVALID_PAYLOAD', 
        details: result.error.format() 
      }, { status: 400, headers: corsHeaders });
    }

    const { event, url, sessionId, data } = result.data;

    // 5. Enrich with Server-Side Metadata
    const userAgent = request.headers.get('user-agent') || 'UNKNOWN';
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    // Note: Country extraction usually requires a GeoIP helper, 
    // leaving as 'UNKNOWN' for local dev.
    const country = request.headers.get('x-vercel-ip-country') || 'UNKNOWN';

    // 6. Async Insert into ClickHouse
    // We don't 'await' here to ensure the client gets a fast 200 OK, 
    // but for local testing, awaiting is safer to see errors.
    await clickhouse.insert({
      table: 'analytics_events',
      values: [{
        event,
        url: url || 'UNKNOWN',
        session_id: sessionId,
        data: JSON.stringify(data || {}),
        user_agent: userAgent,
        ip_address: ip,
        country: country
      }],
      format: 'JSONEachRow',
    });

    console.log(`[TELEMETRY_INGESTED] ${event} from ${sessionId}`);

    return NextResponse.json({ success: true }, { headers: corsHeaders });

  } catch (error) {
    console.error('[INGEST_CRITICAL_ERROR]', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500, headers: corsHeaders });
  }
}
