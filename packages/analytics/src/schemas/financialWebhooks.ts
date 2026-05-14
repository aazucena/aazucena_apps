import { z } from 'zod';

/**
 * Financial Webhook Schemas
 * Validation schemas for Stripe and Ko-fi payment webhooks
 */

// --- STRIPE ---

// Minimal schema for Stripe Checkout Session Completed event
export const StripeCheckoutSessionSchema = z.object({
  id: z.string(),
  object: z.literal('checkout.session'),
  amount_total: z.number().nullable(), // Amount in cents
  currency: z.string().nullable(),
  payment_status: z.string(),
  status: z.string().nullable(),
  customer_details: z
    .object({
      email: z.string().email().nullable().optional(),
    })
    .nullable()
    .optional(),
  metadata: z.record(z.string(), z.any()).nullable().optional(),
  created: z.number(), // Unix timestamp (seconds)
});

// Generic Stripe Event wrapper
export const StripeEventSchema = z.object({
  id: z.string(),
  object: z.literal('event'),
  type: z.string(),
  created: z.number(),
  data: z.object({
    object: StripeCheckoutSessionSchema.passthrough(), // Allow other fields for flexibility
  }),
});

// --- KO-FI ---

// Schema for Ko-fi webhook payload
// Ko-fi sends data as JSON or x-www-form-urlencoded depending on configuration.
// We target the JSON structure.
export const KofiWebhookSchema = z.object({
  message_id: z.string(),
  timestamp: z.string(), // ISO string usually
  type: z.string(), // "Tip", "Subscription", "Commission", "Shop Order"
  is_public: z.boolean().nullish(),
  from_name: z.string().nullish(),
  message: z.string().nullish(),
  amount: z.string().or(z.number()), // Can be string or number
  currency: z.string(),
  email: z.string().email().nullish(),
  url: z.string().url().nullish(),
  kofi_transaction_id: z.string().nullish(),
  verification_token: z.string().nullish(),
  // Subscription-specific fields
  is_subscription_payment: z.boolean().nullish(),
  is_first_subscription_payment: z.boolean().nullish(),
  tier_name: z.string().nullish(),
  // Shop order-specific fields
  shop_items: z.array(z.object({ direct_link_code: z.string().nullish() }).passthrough()).nullish(),
});

export type StripeEvent = z.infer<typeof StripeEventSchema>;
export type KofiEvent = z.infer<typeof KofiWebhookSchema>;
