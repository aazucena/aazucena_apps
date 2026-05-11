import { z } from 'zod';

// =============================================================================
// SUPPORT SCHEMAS
// =============================================================================

/**
 * Customer Support Schema
 */
export const customerSupportSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  category: z.enum(['Billing', 'Technical', 'Account', 'Feature', 'Other']).default('Other'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).default('Medium'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  description: z.string().min(20, 'Please provide more detail').max(5000),
});

export type CustomerSupportFormData = z.infer<typeof customerSupportSchema>;

// =============================================================================
// ADDITIONAL SUPPORT SCHEMAS
// =============================================================================

/**
 * Vulnerability Disclosure Schema (responsible security disclosure)
 */
export const vulnerabilityDisclosureSchema = z.object({
  affectedComponent: z.string().min(2, 'Affected component is required').max(200),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  description: z.string().min(30, 'Please provide a detailed description').max(5000),
  reproductionSteps: z.string().min(20, 'Steps to reproduce are required').max(5000),
  cvssScore: z.number().min(0).max(10).optional(),
  affectedVersions: z.string().min(1, 'Affected versions are required').max(200),
  patchSuggestion: z.string().max(2000).optional(),
  responsibleDisclosureAgreement: z
    .boolean()
    .refine((val) => val === true, 'You must agree to responsible disclosure'),
});

export type VulnerabilityDisclosureFormData = z.infer<typeof vulnerabilityDisclosureSchema>;

// =============================================================================
// SUPPORT (NEW — Phase 1 expansion)
// =============================================================================

/**
 * Access Request Schema
 */
export const accessRequestSchema = z.object({
  resourceType: z.enum(['repo', 'environment', 'database', 'dashboard', 'tool']),
  resourceId: z.string().min(1, 'Resource ID is required').max(200),
  accessLevel: z.enum(['read', 'write', 'admin']).default('read'),
  justification: z.string().min(20, 'Please justify the access request').max(2000),
  duration: z.enum(['temporary', 'permanent']).default('permanent'),
  approver: z.string().max(100).optional(),
});

/**
 * Escalation Schema
 */
export const escalationSchema = z.object({
  ticketId: z.string().min(1, 'Ticket ID is required').max(100),
  currentSeverity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  requestedSeverity: z.enum(['medium', 'high', 'critical']),
  businessImpact: z.string().min(20, 'Please describe the business impact').max(2000),
  revenueEstimate: z.string().max(100).optional(),
  escalationReason: z.enum([
    'sla_breach',
    'customer_at_risk',
    'data_loss',
    'security',
    'regulatory',
  ]),
  executiveSponsor: z.string().max(100).optional(),
});

/**
 * Maintenance Window Schema
 */
export const maintenanceWindowSchema = z.object({
  environment: z.enum(['staging', 'production', 'all']).default('staging'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  description: z.string().min(10, 'Please describe the maintenance').max(1000),
  affectedServices: z.array(z.string()).min(1, 'Select at least one affected service'),
  notifyUsers: z.boolean().default(true),
  rollbackPlan: z.string().max(2000).optional(),
});

/**
 * Status Subscription Schema
 */
export const statusSubscriptionSchema = z.object({
  email: z.string().email('Invalid email address'),
  notifyOn: z
    .array(z.enum(['incident', 'maintenance', 'resolved']))
    .min(1, 'Select at least one event type'),
  services: z.array(z.string()).min(1, 'Select at least one service'),
  deliveryMethod: z.enum(['email', 'webhook', 'sms']).default('email'),
  webhookUrl: z.string().url().optional().or(z.literal('')),
});

export type AccessRequestFormData = z.infer<typeof accessRequestSchema>;
export type EscalationFormData = z.infer<typeof escalationSchema>;
export type MaintenanceWindowFormData = z.infer<typeof maintenanceWindowSchema>;
export type StatusSubscriptionFormData = z.infer<typeof statusSubscriptionSchema>;
