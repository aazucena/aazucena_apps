import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod'; // Import z and ZodError
import { createHmac } from 'crypto';
import { mainClickhouseClient } from '@/lib/services'; // Assuming this exports mainClickhouseClient
import {
  SentryWebhookPayloadSchema,
  ErrorTraceClickHouseSchema,
  SentryWebhookPayload,
} from '@/lib/schemas/sentryWebhook';

const SENTRY_WEBHOOK_SECRET = process.env.SENTRY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!SENTRY_WEBHOOK_SECRET) {
    console.error('[SentryWebhook] SENTRY_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ message: 'Webhook secret not configured.' }, { status: 500 });
  }

  try {
    const sentrySignature = req.headers.get('sentry-api-signature');
    if (!sentrySignature) {
      return NextResponse.json({ message: 'No Sentry signature header.' }, { status: 401 });
    }

    const rawBody = await req.text(); // Read raw body for signature verification

    // Verify signature
    const [signatureHeader, timestampHeader] = sentrySignature.split(',');
    const signature = signatureHeader.split('=')[1];
    const timestamp = timestampHeader.split('=')[1];

    const hmac = createHmac('sha256', SENTRY_WEBHOOK_SECRET);
    const signedPayload = `${timestamp}:${rawBody}`;
    const expectedSignature = hmac.update(signedPayload).digest('hex');

    if (signature !== expectedSignature) {
      console.warn('[SentryWebhook] Invalid Sentry signature.');
      return NextResponse.json({ message: 'Invalid Sentry signature.' }, { status: 403 });
    }

    // Parse and validate the payload using Zod
    const payload: SentryWebhookPayload = SentryWebhookPayloadSchema.parse(JSON.parse(rawBody));

    // Filter for issue events (you might want to adjust based on Sentry's event types)
    // Sentry can send various webhook types (e.g., issue, error, comment, release)
    // For error_traces table, we care about issue events.
    // The plan states 'issue_id' so we assume it's for 'issue' type webhooks.
    if (payload.type !== 'error' && payload.type !== 'default') {
      // 'default' type often indicates an unhandled error
      console.warn(`[SentryWebhook] Ignoring non-error/default event type: ${payload.type}`);
      return NextResponse.json(
        { message: `Ignoring event type: ${payload.type}` },
        { status: 200 },
      );
    }

    // Transform to ClickHouse schema
    const errorTrace: z.infer<typeof ErrorTraceClickHouseSchema> = {
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '), // Current ingestion time
      issue_id: payload.issue_id,
      level: payload.level,
      message: payload.message,
      culprit: payload.culprit || null,
      release: payload.release || null,
      environment: payload.environment || null,
      url: payload.url,
      user_id: payload.user?.id || null,
      tags: payload.tags
        ? Object.entries(payload.tags).map(([key, value]) => `${key}:${value}`)
        : [],
      sentry_url: payload.url,
    };

    // Insert into ClickHouse (non-blocking)
    mainClickhouseClient
      .insert({
        table: 'analytics.error_traces',
        values: [errorTrace],
        format: 'JSONEachRow',
      })
      .catch((e: unknown) => console.error('[SentryWebhook] ClickHouse insertion error:', e));

    console.warn(
      `[SentryWebhook] Successfully processed event for issue: ${payload.issue_id} (${payload.message})`,
    );
    return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('[SentryWebhook] Error processing webhook:', error);
    if (error instanceof ZodError) {
      const zodError = error as ZodError; // Cast once to ZodError
      if ('errors' in zodError) {
        // Explicitly check for 'errors' property existence
        return NextResponse.json(
          { message: 'Invalid payload format', errors: zodError.errors },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { message: 'Invalid payload format', errors: 'Unknown Zod error details.' },
        { status: 400 },
      );
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
