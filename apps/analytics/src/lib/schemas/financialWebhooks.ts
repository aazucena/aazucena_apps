// apps/analytics/src/lib/schemas/financialWebhooks.ts
import { z } from 'zod';

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
  metadata: z.record(z.string(), z.any()).nullable().optional(), // Specified valueType as z.any()
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
// We'll target the JSON structure.
export const KofiWebhookSchema = z.object({
  message_id: z.string(),
  timestamp: z.string(), // ISO string usually
  type: z.string(), // "Donation", "Subscription", "Shop Order"
  is_public: z.boolean().optional(),
  from_name: z.string().optional(),
  message: z.string().optional(),
  amount: z.string().or(z.number()), // Can be string or number
  currency: z.string(),
  email: z.string().email().optional(),
  url: z.string().url().optional(),
  kofi_transaction_id: z.string().optional(),
  verification_token: z.string().optional(), // Used for simple verification
});

export type StripeEvent = z.infer<typeof StripeEventSchema>;
export type KofiEvent = z.infer<typeof KofiWebhookSchema>;
