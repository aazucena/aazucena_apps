import { z } from 'zod';
import { FormTypeEnum } from '@aazucena/api';
import { baseFormSchema } from './base.js';

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

// =============================================================================
// PORTFOLIO-SPECIFIC SCHEMAS (NEW)
// =============================================================================

/**
 * Project Inquiry Schema (new project collaboration)
 */
export const projectInquirySchema = z.object({
  // Step 1: Project Scope
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional(),
  projectTitle: z.string().min(5, 'Project title is required').max(200),
  projectDescription: z.string().min(30, 'Please describe your project').max(3000),
  techRequirements: z.string().max(1000).optional(),
  // Step 2: Timeline & Budget
  startDate: z.string().min(1, 'Expected start date is required'),
  duration: z.string().min(1, 'Project duration is required').max(100),
  budget: z.string().min(1, 'Budget range is required').max(100),
  additionalNotes: z.string().max(2000).optional(),
});

/**
 * Mentorship Request Schema
 */
export const mentorshipRequestSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  background: z.string().min(20, 'Please describe your background').max(1000),
  goals: z.string().min(20, 'Please describe your goals').max(1000),
  format: z.enum(['1:1 Video', 'Async', 'Group', 'Text-based']).default('1:1 Video'),
  topics: z.array(z.string()).min(1, 'Select at least one topic'),
  commitmentLevel: z
    .enum(['1-2 hrs/month', '4-8 hrs/month', '10+ hrs/month'])
    .default('4-8 hrs/month'),
});

export type ProjectInquiryFormData = z.infer<typeof projectInquirySchema>;
export type MentorshipRequestFormData = z.infer<typeof mentorshipRequestSchema>;

// =============================================================================
// ADDITIONAL PORTFOLIO SCHEMAS
// =============================================================================

/**
 * Guestbook Schema (casual public wall entry)
 */
export const guestbookSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  message: z.string().min(5, 'Message must be at least 5 characters').max(500),
  website: z.string().url().optional().or(z.literal('')),
  mood: z.string().max(10).optional(),
  publicConsent: z.boolean().refine((val) => val === true, 'You must consent to public display'),
});

/**
 * Docs Feedback Schema (page-level helpfulness rating)
 */
export const docsFeedbackSchema = z.object({
  helpful: z.enum(['yes', 'no']),
  pageUrl: z.string().url().optional().or(z.literal('')),
  category: z.enum(['unclear', 'incomplete', 'outdated', 'typo', 'other']).default('other'),
  comment: z.string().max(1000).optional(),
});

/**
 * Tutorial Request Schema
 */
export const tutorialRequestSchema = z.object({
  topic: z.string().min(5, 'Topic must be at least 5 characters').max(200),
  format: z.enum(['video', 'written', 'interactive', 'all']).default('written'),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  urgency: z.enum(['no rush', 'within a month', 'this week', 'asap']).default('no rush'),
  additionalContext: z.string().max(1000).optional(),
});

/**
 * Technical Audit Request Schema
 */
export const technicalAuditSchema = z.object({
  projectUrl: z.string().url('Must be a valid URL').min(1, 'Project URL is required'),
  techStack: z.string().min(5, 'Please describe your tech stack').max(500),
  auditScope: z
    .enum(['security', 'performance', 'architecture', 'accessibility', 'all'])
    .default('all'),
  painPoints: z.string().min(20, 'Please describe your pain points').max(2000),
  timeline: z.string().min(1, 'Timeline is required').max(100),
  budget: z.string().max(100).optional(),
});

export type GuestbookFormData = z.infer<typeof guestbookSchema>;
export type DocsFeedbackFormData = z.infer<typeof docsFeedbackSchema>;
export type TutorialRequestFormData = z.infer<typeof tutorialRequestSchema>;
export type TechnicalAuditFormData = z.infer<typeof technicalAuditSchema>;
