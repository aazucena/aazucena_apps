import { z } from 'zod';

// =============================================================================
// RESEARCH SCHEMAS
// =============================================================================

/**
 * Survey Question type
 */
export const surveyQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'rating', 'multiple-choice', 'checkbox', 'textarea']),
  question: z.string(),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(false),
});

/**
 * Survey Schema (dynamic questions from config prop)
 */
export const surveySchema = z.object({
  respondentName: z.string().min(2, 'Name is required').max(100).optional(),
  respondentEmail: z.string().email().optional().or(z.literal('')),
  answers: z.record(z.string(), z.union([z.string(), z.number(), z.array(z.string())])),
  openFeedback: z.string().max(2000).optional(),
});

/**
 * Quiz Question type
 */
export const quizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number(),
  points: z.number().default(1),
});

/**
 * Quiz Schema (scored quiz)
 */
export const quizSchema = z.object({
  participantName: z.string().min(2, 'Name is required').max(100).optional(),
  participantEmail: z.string().email().optional().or(z.literal('')),
  answers: z.record(z.string(), z.number()),
});

export type SurveyQuestion = z.infer<typeof surveyQuestionSchema>;
export type SurveyFormData = z.infer<typeof surveySchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type QuizFormData = z.infer<typeof quizSchema>;

// =============================================================================
// RESEARCH (NEW — Phase 1 expansion)
// =============================================================================

/**
 * NPS (Net Promoter Score) Schema
 */
export const npsSchema = z.object({
  score: z.number().min(0).max(10),
  promoterReason: z.string().max(500).optional(),
  detractorReason: z.string().max(500).optional(),
  improvementSuggestion: z.string().max(1000).optional(),
  contactPermission: z.boolean().default(false),
  email: z.string().email().optional().or(z.literal('')),
});

/**
 * Focus Group Schema
 */
export const focusGroupSchema = z.object({
  researchTopic: z.string().min(5, 'Research topic is required').max(200),
  availableSlot: z.string().min(1, 'Please select an available slot'),
  participantType: z.string().min(2, 'Please select your user persona').max(100),
  occupation: z.string().max(100).optional(),
  yearsExperience: z.string().max(50).optional(),
  compensationAccepted: z.boolean().refine((v) => v === true, 'You must accept the compensation terms'),
  ndaAccepted: z.boolean().default(false),
});

/**
 * User Interview Schema (2-step: background → preferences)
 */
export const userInterviewSchema = z.object({
  role: z.string().min(2, 'Role is required').max(100),
  company: z.string().max(100).optional(),
  howLongUsing: z.enum(['<1_month', '1-6_months', '6-12_months', '1-2_years', '2+_years']),
  primaryGoals: z.string().min(10, 'Please describe your primary goals').max(1000),
  painPoints: z.string().min(10, 'Please describe your pain points').max(1000),
  sessionFormat: z.enum(['video', 'phone', 'async_written']).default('video'),
  schedulingWindow: z.string().min(5, 'Please describe your scheduling window').max(200),
});

/**
 * A/B Test Enrollment Schema
 */
export const abTestEnrollmentSchema = z.object({
  experimentId: z.string().min(1, 'Experiment ID is required'),
  consentToVariant: z.boolean().refine((v) => v === true, 'Consent is required to participate'),
  variantPreference: z.enum(['control', 'variant_a', 'variant_b', 'no_preference']).default('no_preference'),
  dataCollectionConsent: z.boolean().default(false),
  exitSurveyOptIn: z.boolean().default(false),
});

export type NPSFormData = z.infer<typeof npsSchema>;
export type FocusGroupFormData = z.infer<typeof focusGroupSchema>;
export type UserInterviewFormData = z.infer<typeof userInterviewSchema>;
export type ABTestEnrollmentFormData = z.infer<typeof abTestEnrollmentSchema>;
