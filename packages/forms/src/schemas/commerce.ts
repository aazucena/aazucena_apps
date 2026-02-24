import { z } from 'zod';

// =============================================================================
// COMMERCE SCHEMAS
// =============================================================================

/**
 * Payment Schema (Stripe Elements-ready)
 */
export const paymentSchema = z.object({
  // Step 1: Billing
  billingName: z.string().min(2, 'Name must be at least 2 characters'),
  billingEmail: z.string().email('Invalid email address'),
  billingAddress: z.string().min(5, 'Address is required'),
  billingCity: z.string().min(2, 'City is required'),
  billingPostalCode: z.string().min(3, 'Postal code is required'),
  billingCountry: z.string().min(2, 'Country is required'),
  // Step 2: Payment (Stripe token provided externally)
  stripeToken: z.string().optional(),
});

/**
 * Order Schema
 */
export const orderSchema = z.object({
  // Step 1: Items (dynamic, managed externally)
  orderNote: z.string().max(500).optional(),
  // Step 2: Shipping
  shippingName: z.string().min(2, 'Name is required'),
  shippingAddress: z.string().min(5, 'Address is required'),
  shippingCity: z.string().min(2, 'City is required'),
  shippingPostalCode: z.string().min(3, 'Postal code is required'),
  shippingCountry: z.string().min(2, 'Country is required'),
  // Step 3: Payment
  billingEmail: z.string().email('Invalid email address'),
  stripeToken: z.string().optional(),
});

/**
 * Donation Schema (Ko-fi/Stripe one-time or recurring)
 */
export const donationSchema = z.object({
  amount: z.number().min(1, 'Minimum donation is $1').max(10000),
  customAmount: z.number().min(1).optional(),
  frequency: z.enum(['one-time', 'monthly']).default('one-time'),
  message: z.string().max(500).optional(),
  anonymous: z.boolean().default(false),
  email: z.string().email('Invalid email address'),
  name: z.string().min(2).max(100).optional(),
});

/**
 * Sponsorship Inquiry Schema
 */
export const sponsorshipSchema = z.object({
  company: z.string().min(2, 'Company name is required').max(100),
  contactName: z.string().min(2, 'Contact name is required').max(100),
  email: z.string().email('Invalid email address'),
  scope: z.enum(['banner', 'newsletter', 'video', 'podcast', 'event', 'custom']).default('custom'),
  audienceReach: z.string().min(1, 'Audience reach is required'),
  budgetRange: z.enum(['<$500', '$500-$2k', '$2k-$10k', '$10k+']).default('$500-$2k'),
  deliverables: z.string().min(10, 'Please describe desired deliverables').max(1000),
  campaignTimeline: z.string().min(5, 'Campaign timeline is required').max(200),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type DonationFormData = z.infer<typeof donationSchema>;
export type SponsorshipFormData = z.infer<typeof sponsorshipSchema>;

// =============================================================================
// COMMERCE (NEW — Phase 1 expansion)
// =============================================================================

/**
 * Quote Request Schema (2-step: scope → contact)
 */
export const quoteRequestSchema = z.object({
  projectType: z.string().min(2, 'Project type is required').max(100),
  scope: z.string().min(10, 'Please describe the project scope').max(2000),
  deliverables: z.array(z.string()).min(1, 'Select at least one deliverable'),
  timeline: z.string().min(1, 'Timeline is required').max(100),
  budgetRange: z.enum(['<$5k', '$5k-$20k', '$20k-$100k', '$100k+']).default('$5k-$20k'),
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
});

/**
 * Refund Request Schema
 */
export const refundRequestSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required').max(100),
  items: z.array(z.string()).min(1, 'Select at least one item'),
  reason: z.enum(['defective', 'not_as_described', 'changed_mind', 'duplicate', 'other']),
  reasonDetail: z.string().max(1000).optional(),
  preferredResolution: z.enum(['refund', 'store_credit', 'replacement']).default('refund'),
});

/**
 * Subscription Change Schema
 */
export const subscriptionChangeSchema = z.object({
  newPlan: z.enum(['starter', 'pro', 'team', 'enterprise']),
  billingCycle: z.enum(['monthly', 'annual']).default('monthly'),
  effectiveDate: z.enum(['immediate', 'next_cycle']).default('next_cycle'),
  cancellationFeedback: z.string().max(500).optional(),
});

/**
 * Affiliate Application Schema (2-step: channel → payment)
 */
export const affiliateApplicationSchema = z.object({
  website: z.string().url().optional().or(z.literal('')),
  channel: z.string().min(2, 'Channel/platform is required').max(200),
  audienceSize: z.string().min(1, 'Audience size is required').max(50),
  niche: z.string().min(2, 'Niche is required').max(100),
  promotionMethods: z.array(z.string()).min(1, 'Select at least one promotion method'),
  paymentMethod: z.enum(['bank_transfer', 'paypal', 'stripe', 'crypto']).default('paypal'),
  taxInfo: z.string().min(5, 'Tax information is required').max(200),
});

/**
 * Invoice Dispute Schema
 */
export const invoiceDisputeSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required').max(100),
  disputeType: z.enum(['incorrect_amount', 'duplicate', 'not_received', 'service_not_rendered', 'other']),
  amountDisputed: z.number().min(0, 'Amount must be non-negative').optional(),
  explanation: z.string().min(20, 'Please explain the dispute').max(2000),
});

export type QuoteRequestFormData = z.infer<typeof quoteRequestSchema>;
export type RefundRequestFormData = z.infer<typeof refundRequestSchema>;
export type SubscriptionChangeFormData = z.infer<typeof subscriptionChangeSchema>;
export type AffiliateApplicationFormData = z.infer<typeof affiliateApplicationSchema>;
export type InvoiceDisputeFormData = z.infer<typeof invoiceDisputeSchema>;
