import { z } from 'zod';

// =============================================================================
// SCHEDULING SCHEMAS
// =============================================================================

/**
 * Booking Schema (session/appointment)
 */
export const bookingSchema = z.object({
  // Step 1: Service & Slot
  serviceType: z.string().min(1, 'Service type is required'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  preferredSlot: z.string().min(1, 'Please select a time slot'),
  // Step 2: Contact
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  notes: z.string().max(500).optional(),
});

/**
 * Consultation Schema (discovery/strategy call)
 */
export const consultationSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional(),
  goals: z.string().min(20, 'Please describe your goals').max(1000),
  budget: z.string().min(1, 'Budget range is required').max(100),
  preferredDate: z.string().min(1, 'Preferred date/time is required'),
  howFound: z.string().max(200).optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
export type ConsultationFormData = z.infer<typeof consultationSchema>;

// =============================================================================
// SCHEDULING (NEW — Phase 1 expansion)
// =============================================================================

/**
 * Availability Setup Schema
 */
export const availabilitySetupSchema = z.object({
  timezone: z.string().min(1, 'Timezone is required').default('UTC'),
  weekdays: z.array(z.string()).min(1, 'Select at least one day'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  bufferBetween: z.enum(['0', '5', '10', '15', '30']).default('15'),
  advanceNotice: z.number().min(0).max(72).default(24),
  maxPerDay: z.number().min(1).max(20).default(5),
});

/**
 * Rescheduling Schema
 */
export const reschedulingSchema = z.object({
  appointmentId: z.string().min(1, 'Appointment ID is required'),
  newDate: z.string().min(1, 'New date is required'),
  newTimeSlot: z.string().min(1, 'New time slot is required'),
  reason: z.enum(['conflict', 'illness', 'travel', 'work', 'personal', 'other']),
  notifyParticipants: z.boolean().default(true),
  additionalNote: z.string().max(500).optional(),
});

/**
 * Group Meeting Poll Schema (2-step: slots → invitees)
 */
export const groupMeetingPollSchema = z.object({
  title: z.string().min(3, 'Meeting title is required').max(200),
  description: z.string().max(1000).optional(),
  proposedSlots: z.string().min(1, 'Add at least one time slot').max(2000),
  inviteeEmails: z.string().min(1, 'Add at least one invitee').max(2000),
  deadline: z.string().min(1, 'Voting deadline is required'),
  votingMethod: z.enum(['first_available', 'majority', 'unanimous']).default('majority'),
});

/**
 * Recurring Session Schema
 */
export const recurringSessionSchema = z.object({
  sessionType: z.enum(['standup', 'one_on_one', 'team_sync', 'retrospective', 'workshop']),
  startDate: z.string().min(1, 'Start date is required'),
  time: z.string().min(1, 'Session time is required'),
  recurrence: z.enum(['weekly', 'biweekly', 'monthly']).default('weekly'),
  occurrences: z.number().min(1).max(52).optional(),
  endDate: z.string().optional(),
  participants: z.string().min(1, 'At least one participant is required').max(1000),
  notes: z.string().max(500).optional(),
});

export type AvailabilitySetupFormData = z.infer<typeof availabilitySetupSchema>;
export type ReschedulingFormData = z.infer<typeof reschedulingSchema>;
export type GroupMeetingPollFormData = z.infer<typeof groupMeetingPollSchema>;
export type RecurringSessionFormData = z.infer<typeof recurringSessionSchema>;
