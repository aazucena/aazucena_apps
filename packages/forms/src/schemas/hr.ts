import { z } from 'zod';

// =============================================================================
// HR / EVENTS SCHEMAS
// =============================================================================

/**
 * Client Application Schema (reverse: employer/client applies to Aldrin)
 */
export const clientApplicationSchema = z.object({
  // Step 1: Screening
  companyName: z.string().min(2, 'Company name is required').max(100),
  projectTitle: z.string().min(5, 'Project title is required').max(200),
  contactName: z.string().min(2, 'Contact name is required').max(100),
  email: z.string().email('Invalid email address'),
  website: z.string().url().optional().or(z.literal('')),
  // Step 2: Requirements
  techStack: z.string().min(10, 'Please list the tech stack').max(500),
  teamSize: z.enum(['Solo', '2-5', '6-15', '15+']).default('2-5'),
  teamCulture: z.string().min(20, 'Describe your team culture').max(1000),
  budget: z.string().min(1, 'Budget range is required').max(100),
  whyAldrin: z.string().min(30, 'Please explain why you want to work with Aldrin').max(2000),
});

/**
 * Hire Inquiry Schema (lead capture for inbound role interest)
 */
export const hireInquirySchema = z.object({
  company: z.string().min(2, 'Company name is required').max(100),
  contactName: z.string().min(2, 'Contact name is required').max(100),
  email: z.string().email('Invalid email address'),
  roleType: z.enum(['Full-time', 'Contract', 'Freelance', 'Part-time']).default('Contract'),
  roleTitle: z.string().min(5, 'Role title is required').max(200),
  compensationRange: z.string().min(1, 'Compensation range is required').max(100),
  workMode: z.enum(['Remote', 'Hybrid', 'On-site']).default('Remote'),
  startDate: z.string().min(1, 'Expected start date is required'),
});

/**
 * Event Registration Schema
 */
export const eventRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  ticketType: z.enum(['General', 'VIP', 'Student', 'Speaker']).default('General'),
  dietaryRequirements: z.string().max(200).optional(),
  emergencyContact: z.string().max(200).optional(),
  organization: z.string().max(100).optional(),
});

/**
 * Letter of Recommendation Request Schema
 */
export const letterOfRecommendationSchema = z.object({
  requesterName: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  relationship: z
    .enum(['Employer', 'Colleague', 'Client', 'Mentee', 'Student', 'Other'])
    .default('Colleague'),
  context: z.string().min(30, 'Please describe the context of your relationship').max(1000),
  desiredTone: z.enum(['Professional', 'Warm', 'Technical', 'Leadership']).default('Professional'),
  deadline: z.string().min(1, 'Deadline is required'),
  platform: z.enum(['LinkedIn', 'PDF/Email', 'Application Portal', 'Other']).default('LinkedIn'),
});

export type ClientApplicationFormData = z.infer<typeof clientApplicationSchema>;
export type HireInquiryFormData = z.infer<typeof hireInquirySchema>;
export type EventRegistrationFormData = z.infer<typeof eventRegistrationSchema>;
export type LetterOfRecommendationFormData = z.infer<typeof letterOfRecommendationSchema>;
