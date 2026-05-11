import { z } from 'zod';

// =============================================================================
// LEGAL / COMPLIANCE SCHEMAS
// =============================================================================

/**
 * Consent Schema (GDPR/analytics/marketing)
 */
export const consentSchema = z.object({
  analyticsConsent: z.boolean().default(false),
  marketingConsent: z.boolean().default(false),
  functionalConsent: z.boolean().default(true),
  timestamp: z.string().optional(),
});

export type ConsentFormData = z.infer<typeof consentSchema>;

// =============================================================================
// LEGAL (NEW — Phase 1 expansion)
// =============================================================================

/**
 * Terms Update Schema
 */
export const termsUpdateSchema = z.object({
  hasRead: z.boolean().refine((v) => v === true, 'You must confirm you have read the changes'),
  acceptAll: z.boolean().refine((v) => v === true, 'You must accept the updated terms'),
  specificConsents: z.array(z.string()).optional(),
  signature: z.string().min(2, 'Please type your full name as signature').max(100),
});

/**
 * Data Deletion Request Schema
 */
export const dataDeletionSchema = z.object({
  requestType: z.enum(['full', 'partial']).default('full'),
  dataCategories: z.array(z.string()).min(1, 'Select at least one data category'),
  reason: z.string().min(5, 'Please state your reason').max(500),
  confirmIdentity: z.boolean().refine((v) => v === true, 'Identity confirmation is required'),
  retainForLegal: z.boolean().default(false),
});

/**
 * Data Export Request Schema
 */
export const dataExportSchema = z.object({
  format: z.enum(['json', 'csv', 'pdf', 'all']).default('json'),
  dataCategories: z.array(z.string()).min(1, 'Select at least one data category'),
  deliveryMethod: z.enum(['email', 'download_link']).default('email'),
  encryptExport: z.boolean().default(false),
  verifyIdentity: z.boolean().refine((v) => v === true, 'Identity verification is required'),
});

/**
 * Copyright Claim Schema (2-step: claimant → infringement)
 */
export const copyrightClaimSchema = z.object({
  claimantName: z.string().min(2, 'Claimant name is required').max(100),
  claimantEmail: z.string().email('Invalid email address'),
  ownershipProof: z.string().min(20, 'Please describe your ownership proof').max(2000),
  infringingUrl: z.string().url('Must be a valid URL'),
  originalWorkUrl: z.string().url().optional().or(z.literal('')),
  goodFaithStatement: z.boolean().refine((v) => v === true, 'Good faith statement is required'),
  signature: z.string().min(2, 'Please type your full name as signature').max(100),
});

export type TermsUpdateFormData = z.infer<typeof termsUpdateSchema>;
export type DataDeletionFormData = z.infer<typeof dataDeletionSchema>;
export type DataExportFormData = z.infer<typeof dataExportSchema>;
export type CopyrightClaimFormData = z.infer<typeof copyrightClaimSchema>;
