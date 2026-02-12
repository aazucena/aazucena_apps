import { z } from 'zod';
import { FormTypeEnum } from '@aazucena/api';

/**
 * Shared Base Schema for all Forms
 */
export const baseFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

/**
 * 1. Contact Form Schema
 */
export const contactFormSchema = baseFormSchema.extend({
  formType: z.literal(FormTypeEnum.Values.Contact),
});

/**
 * 2. Feedback Form Schema
 */
export const feedbackFormSchema = baseFormSchema.extend({
  formType: z.literal(FormTypeEnum.Values.Feedback),
  rating: z.number().min(1).max(5).optional(),
  category: z.enum(['UI/UX', 'Performance', 'Content', 'General']).default('General'),
});

/**
 * 3. Testimonial Form Schema
 */
export const testimonialFormSchema = baseFormSchema.extend({
  formType: z.literal(FormTypeEnum.Values.Testimonial),
  company: z.string().min(2).max(100).optional(),
  jobTitle: z.string().min(2).max(100).optional(),
  relationship: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
});

/**
 * 4. Bug Report Schema
 */
export const bugReportSchema = baseFormSchema.extend({
  formType: z.literal(FormTypeEnum.Values['Bug Report']),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']).default('Medium'),
  browser: z.string().optional(),
  os: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
});

/**
 * 5. Feature Request Schema
 */
export const featureRequestSchema = baseFormSchema.extend({
  formType: z.literal(FormTypeEnum.Values['Feature Request']),
  impact: z.enum(['Nice to have', 'Useful', 'Important', 'Critical']).default('Useful'),
});

/**
 * 6. Collaboration Schema
 */
export const collaborationSchema = baseFormSchema.extend({
  formType: z.literal(FormTypeEnum.Values.Collaboration),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

/**
 * 7. Referral Schema
 */
export const referralSchema = baseFormSchema.extend({
  formType: z.literal(FormTypeEnum.Values.Referral),
  referralName: z.string().min(2),
  referralEmail: z.string().email(),
});

/**
 * 8. Music Feedback Schema
 */
export const musicFeedbackSchema = baseFormSchema.extend({
  formType: z.literal(FormTypeEnum.Values['Music Feedback']),
  trackTitle: z.string().optional(),
  elements: z.array(z.string()).optional(), // e.g. ['Mix', 'Arrangement', 'Melody']
});

/**
 * Union type for all possible forms
 */
export const anyFormSchema = z.discriminatedUnion('formType', [
  contactFormSchema,
  feedbackFormSchema,
  testimonialFormSchema,
  bugReportSchema,
  featureRequestSchema,
  collaborationSchema,
  referralSchema,
  musicFeedbackSchema,
]);

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type FeedbackFormData = z.infer<typeof feedbackFormSchema>;
export type TestimonialFormData = z.infer<typeof testimonialFormSchema>;
export type BugReportFormData = z.infer<typeof bugReportSchema>;
export type FeatureRequestFormData = z.infer<typeof featureRequestSchema>;
export type CollaborationFormData = z.infer<typeof collaborationSchema>;
export type ReferralFormData = z.infer<typeof referralSchema>;
export type MusicFeedbackFormData = z.infer<typeof musicFeedbackSchema>;

export type AnyFormData = z.infer<typeof anyFormSchema>;
