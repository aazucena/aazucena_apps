import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { ingestClickhouseClient } from '@/lib/services';
import { StripeEventSchema } from '@/lib/schemas/financialWebhooks';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_TIMESTAMP_TOLERANCE_S = 300;

function verifyStripeSignature(body: string, header: string, secret: string): boolean {
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=')));
  const timestamp = parts['t'];
  const v1 = parts['v1'];
  if (!timestamp || !v1) return false;

  const age = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10);
  if (age > STRIPE_TIMESTAMP_TOLERANCE_S) return false;

  const signed = `${timestamp}.${body}`;
  const expected = createHmac('sha256', secret).update(signed).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('[StripeWebhook] STRIPE_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ message: 'Stripe secret not configured' }, { status: 500 });
  }

  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  if (!sig) {
    return NextResponse.json({ message: 'Missing stripe-signature header' }, { status: 400 });
  }

  if (!verifyStripeSignature(body, sig, STRIPE_WEBHOOK_SECRET)) {
    console.warn('[StripeWebhook] Signature verification failed.');
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  try {
    const json = JSON.parse(body);
    const event = StripeEventSchema.parse(json);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const row = {
        timestamp: new Date(event.created * 1000).toISOString().slice(0, 19).replace('T', ' '),
        transaction_id: session.id,
        provider: 'STRIPE',
        amount: (session.amount_total || 0) / 100, // Convert cents to dollars/units
        currency: (session.currency || 'USD').toUpperCase(),
        type: 'ONE_TIME', // Can logic be added to detect subscription vs one-time?
        status: (session.payment_status || 'unknown').toUpperCase(),
        sessionId: session.metadata?.sessionId || '',
        customer_email: session.customer_details?.email || '',
        metadata: session.metadata || {},
      };

      await ingestClickhouseClient.insert({
        table: 'analytics.financial_ledger',
        values: [row],
        format: 'JSONEachRow',
      });

      console.warn(`[StripeWebhook] Ingested transaction ${session.id} for $${row.amount}`);
    } else {
      console.warn(`[StripeWebhook] Ignored event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`[StripeWebhook] Error processing webhook:`, err);
    return NextResponse.json({ message: 'Webhook handler failed' }, { status: 400 });
  }
}
