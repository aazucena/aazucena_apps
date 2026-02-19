// apps/analytics/src/app/api/webhooks/kofi/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mainClickhouseClient } from '@/lib/services';
import { KofiWebhookSchema } from '@/lib/schemas/financialWebhooks';

const KOFI_WEBHOOK_SECRET = process.env.KOFI_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    let payload;
    const contentType = req.headers.get('content-type') || '';

    // Handle different content types from Ko-fi
    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      const dataStr = formData.get('data');
      if (typeof dataStr === 'string') {
        payload = JSON.parse(dataStr);
      }
    }

    if (!payload) {
      return NextResponse.json({ message: 'Invalid payload or content-type' }, { status: 400 });
    }

    const event = KofiWebhookSchema.parse(payload);

    // Security: Verify Token
    if (KOFI_WEBHOOK_SECRET && event.verification_token !== KOFI_WEBHOOK_SECRET) {
      console.warn('[KofiWebhook] Invalid verification token.');
      return NextResponse.json({ message: 'Invalid verification token' }, { status: 403 });
    }

    const row = {
      timestamp: new Date(event.timestamp || Date.now())
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
      transaction_id: event.kofi_transaction_id || event.message_id,
      provider: 'KOFI',
      amount: parseFloat(String(event.amount)),
      currency: (event.currency || 'USD').toUpperCase(),
      type: (event.type || 'DONATION').toUpperCase(),
      status: 'SUCCEEDED', // Ko-fi alerts are generally for successful transactions
      sessionId: '', // Hard to correlate session ID with Ko-fi unless passed in custom fields (if supported)
      customer_email: event.email || '',
      metadata: {
        from_name: event.from_name || '',
        message: event.message || '',
        url: event.url || '',
        is_public: String(event.is_public || false),
      },
    };

    await mainClickhouseClient.insert({
      table: 'analytics.financial_ledger',
      values: [row],
      format: 'JSONEachRow',
    });

    console.log(
      `[KofiWebhook] Ingested ${row.type} of $${row.amount} from ${row.metadata.from_name}`,
    );
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`[KofiWebhook] Error:`, err);
    return NextResponse.json({ message: 'Webhook handler failed' }, { status: 400 });
  }
}
