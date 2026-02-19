// apps/analytics/src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mainClickhouseClient } from '@/lib/services';
import { StripeEventSchema } from '@/lib/schemas/financialWebhooks';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

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

  // NOTE: For production, you MUST verify the signature using the 'stripe' SDK.
  // import Stripe from 'stripe';
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  // const event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);

  try {
    // Parsing directly for ingestion logic demonstration
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

      await mainClickhouseClient.insert({
        table: 'analytics.financial_ledger',
        values: [row],
        format: 'JSONEachRow',
      });

      console.log(`[StripeWebhook] Ingested transaction ${session.id} for $${row.amount}`);
    } else {
      console.log(`[StripeWebhook] Ignored event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`[StripeWebhook] Error processing webhook:`, err);
    return NextResponse.json({ message: 'Webhook handler failed' }, { status: 400 });
  }
}
