# Payment Integration (Stripe + Ko-fi)

📍 **Full Documentation:**
- [ROADMAP.md Section 3.17](../../ROADMAP.md#317-payment-processing--monetization-)
- [ROADMAP.md Section 3.19 (Ko-fi)](../../ROADMAP.md#319-additional-api-integrations--creative-features-)

## Overview

Monetize your portfolio with payment processing for consultations, music downloads, and digital products using Stripe and Ko-fi.

**Estimated Effort:** 3-4 days (3-4 days for Stripe + 15-30 min for Ko-fi)

## Strategy: Ko-fi + Stripe Together

### Ko-fi (Simple & Quick)
- **Best for:** Tips, donations, music appreciation, general support
- **Advantages:** No backend needed, quick setup, lower fees
- **You already have an account!** ✅

### Stripe (Full Control)
- **Best for:** Music downloads, consultation bookings, digital products
- **Advantages:** Full control, webhooks, subscription management
- **Requires:** Backend integration, more setup

## Ko-fi Integration (15-30 minutes)

**Since you already have a Ko-fi account, this is the quickest win!**

### Implementation

```tsx
// components/KofiButton.tsx
import { Coffee } from '@mynaui/icons-react';

interface KofiButtonProps {
  variant?: 'widget' | 'button' | 'minimal';
  trackName?: string; // For music page tips
  color?: string;
}

export function KofiButton({
  variant = 'button',
  trackName,
  color = '#FF5E5B'
}: KofiButtonProps) {
  const kofiUrl = trackName
    ? `https://ko-fi.com/yourusername?message=${encodeURIComponent(`Loved "${trackName}"!`)}`
    : 'https://ko-fi.com/yourusername';

  if (variant === 'widget') {
    // Ko-fi floating widget script
    return (
      <script
        src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'
        data-kofi-username="yourusername"
        data-kofi-color={color}
        data-kofi-text="Support Me"
      />
    );
  }

  if (variant === 'minimal') {
    return (
      <a
        href={kofiUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm hover:text-primary transition"
      >
        <Coffee className="w-4 h-4" />
        Buy me a coffee
      </a>
    );
  }

  return (
    <a
      href={kofiUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF5E5B] hover:bg-[#e54d4a] text-white font-medium transition"
    >
      <Coffee className="w-5 h-5" />
      Buy me a coffee
    </a>
  );
}
```

### Usage Examples

```tsx
// 1. Floating widget (bottom-right corner, all pages)
<KofiButton variant="widget" />

// 2. Music page (after each track)
<KofiButton
  variant="button"
  trackName={composition.title}
/>

// 3. Footer (minimal link)
<KofiButton variant="minimal" />

// 4. Blog posts (end of article)
<KofiButton variant="button" />
```

### Ko-fi Features to Leverage

1. **Membership Tiers** - Patreon alternative
   - Exclusive Strudel patterns
   - Early music access
   - Behind-the-scenes content

2. **Goal Widgets** - Fundraising
   - "Help me buy a new synth!"
   - "Fund my next album"

3. **Ko-fi Shop** - Digital products
   - Sheet music (PDF)
   - Strudel pattern templates
   - Project source files

4. **Commissions** - Custom work
   - Custom compositions
   - Code consultations

---

## Stripe Integration (3-4 days)

### Phase 1: Stripe Setup (0.5 day)

```bash
pnpm add stripe @stripe/stripe-js
```

```env
# Environment variables
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Phase 2: Music Download Payments (1.5 days)

```tsx
// components/music/DownloadButton.tsx
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function DownloadButton({
  compositionId,
  price,
  title,
}: {
  compositionId: string;
  price: number;
  title: string;
}) {
  const handleDownload = async () => {
    const stripe = await stripePromise;

    // Create checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compositionId,
        price,
        title,
      }),
    });

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    await stripe?.redirectToCheckout({ sessionId });
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Download ${price}
    </button>
  );
}
```

```typescript
// pages/api/create-checkout-session.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { compositionId, price, title } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${title} - MP3 Download`,
              description: 'High-quality music download',
            },
            unit_amount: price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/music/download-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/music/${compositionId}`,
      metadata: {
        compositionId,
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Phase 3: Webhook Handler (1 day)

```typescript
// pages/api/stripe-webhook.ts
import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;

      // Send download link via email
      await sendDownloadEmail(
        session.customer_email!,
        session.metadata?.compositionId!
      );

      // Log purchase in database
      await logPurchase(session);

      break;

    case 'payment_intent.succeeded':
      // Handle successful payment
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}
```

### Phase 4: Consultation Bookings (1 day)

```tsx
// components/ConsultationBooking.tsx
export function ConsultationBooking() {
  const consultationTypes = [
    { name: '30-min Quick Chat', price: 50 },
    { name: '1-hour Deep Dive', price: 100 },
    { name: '2-hour Workshop', price: 180 },
  ];

  const handleBook = async (type) => {
    const response = await fetch('/api/create-consultation-session', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });

    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {consultationTypes.map((type) => (
        <div key={type.name} className="border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold">{type.name}</h3>
          <p className="text-3xl font-bold my-4">${type.price}</p>
          <button
            onClick={() => handleBook(type)}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
          >
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Strategic Placement

### Music Page
```tsx
<div className="composition-card">
  <h3>{composition.title}</h3>
  <audio src={composition.audioUrl} />

  <div className="flex gap-2 mt-4">
    {/* Ko-fi for tips */}
    <KofiButton
      variant="button"
      trackName={composition.title}
    />

    {/* Stripe for downloads */}
    {composition.downloadEnabled && (
      <DownloadButton
        compositionId={composition.id}
        price={0.99}
      />
    )}
  </div>
</div>
```

### Footer
```tsx
<footer>
  {/* Ko-fi minimal link */}
  <KofiButton variant="minimal" />

  {/* Or floating widget on all pages */}
  <KofiButton variant="widget" />
</footer>
```

### Dedicated `/support` Page
```tsx
<div className="grid md:grid-cols-2 gap-8">
  {/* Ko-fi Card */}
  <div className="border border-gray-700 rounded-lg p-6">
    <h3>Buy Me a Coffee</h3>
    <p>Support my work with a one-time tip</p>
    <KofiButton variant="button" />
  </div>

  {/* Stripe Consultation Card */}
  <div className="border border-gray-700 rounded-lg p-6">
    <h3>Book a Consultation</h3>
    <p>1-on-1 sessions for your project</p>
    <ConsultationBooking />
  </div>
</div>
```

---

## Timeline

| Task | Duration |
|------|----------|
| **Ko-fi Integration** | **15-30 min** ⚡ Quick win! |
| Stripe Setup | 0.5 day |
| Music Download Payments | 1.5 days |
| Webhook Handler | 1 day |
| Consultation Bookings | 1 day |

**Total:** 3-4 days (Stripe) + 15-30 min (Ko-fi)

---

## Revenue Streams

### Ko-fi
- ☕ Tips after listening to music
- 💎 Membership tiers ($5-$20/month)
- 🎼 Digital sheet music sales
- 🎨 Custom composition commissions

### Stripe
- 💿 Music downloads ($0.99-$2.99 per track)
- 📚 Course/tutorial sales ($29-$99)
- 💼 Consultation bookings ($50-$180/hour)
- 📦 Digital product bundles ($49-$199)

---

## Next Steps

1. **Immediate:** Add Ko-fi button (15-30 min) ⚡
   - Floating widget to footer
   - Button on music page
   - Links in bio

2. **Week 1:** Set up Stripe
   - Create Stripe account
   - Implement download payments
   - Add webhook handler

3. **Week 2:** Launch consultation bookings
   - Create booking page
   - Test payment flow
   - Announce availability

---

**Related Documentation:**
- [ROADMAP.md - Stripe Integration](../../ROADMAP.md#317-payment-processing--monetization-)
- [ROADMAP.md - Ko-fi Integration](../../ROADMAP.md#319-additional-api-integrations--creative-features-)
- [Music Player](./music-player.md)
