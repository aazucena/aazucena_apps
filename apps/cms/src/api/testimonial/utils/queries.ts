/**
 * Testimonial Query Helpers
 *
 * Provides convenient query methods that respect the hybrid approval + publish workflow
 */

import type { Core } from '@strapi/strapi';

/**
 * Get testimonials that are approved AND published (live on site)
 * Use this for the public frontend
 */
export async function getPublicTestimonials(strapi: Core.Strapi, options = {}) {
  return await strapi.db.query('api::testimonial.testimonial').findMany({
    where: {
      approvalStatus: 'Approved',
      publishedAt: {
        $notNull: true,
      },
    },
    orderBy: { publishedAt: 'desc' },
    ...options,
  });
}

/**
 * Get testimonials pending approval
 * Use this for admin review queue
 */
export async function getPendingTestimonials(strapi: Core.Strapi, options = {}) {
  return await strapi.db.query('api::testimonial.testimonial').findMany({
    where: {
      approvalStatus: 'Pending',
    },
    orderBy: { submittedAt: 'desc' },
    ...options,
  });
}

/**
 * Get all approved testimonials (published + unpublished)
 * Use this for admin management (includes items temporarily hidden for editing)
 */
export async function getApprovedTestimonials(strapi: Core.Strapi, options = {}) {
  return await strapi.db.query('api::testimonial.testimonial').findMany({
    where: {
      approvalStatus: 'Approved',
    },
    orderBy: { approvedAt: 'desc' },
    ...options,
  });
}

/**
 * Get rejected testimonials
 * Use this for audit trail and analytics
 */
export async function getRejectedTestimonials(strapi: Core.Strapi, options = {}) {
  return await strapi.db.query('api::testimonial.testimonial').findMany({
    where: {
      approvalStatus: 'Rejected',
    },
    orderBy: { approvedAt: 'desc' },
    ...options,
  });
}

/**
 * Get testimonials currently being edited (approved but unpublished)
 * Use this to see what's temporarily hidden
 */
export async function getTestimonialsBeingEdited(strapi: Core.Strapi, options = {}) {
  return await strapi.db.query('api::testimonial.testimonial').findMany({
    where: {
      approvalStatus: 'Approved',
      publishedAt: {
        $null: true,
      },
    },
    orderBy: { approvedAt: 'desc' },
    ...options,
  });
}

/**
 * Get approval statistics
 * Use this for admin dashboard analytics
 */
export async function getApprovalStatistics(strapi: Core.Strapi) {
  const [total, pending, approved, rejected] = await Promise.all([
    strapi.db.query('api::testimonial.testimonial').count(),
    strapi.db.query('api::testimonial.testimonial').count({
      where: { approvalStatus: 'Pending' },
    }),
    strapi.db.query('api::testimonial.testimonial').count({
      where: { approvalStatus: 'Approved' },
    }),
    strapi.db.query('api::testimonial.testimonial').count({
      where: { approvalStatus: 'Rejected' },
    }),
  ]);

  const published = await strapi.db.query('api::testimonial.testimonial').count({
    where: {
      approvalStatus: 'Approved',
      publishedAt: { $notNull: true },
    },
  });

  return {
    total,
    pending,
    approved,
    rejected,
    published,
    beingEdited: approved - published,
    approvalRate: total > 0 ? ((approved / total) * 100).toFixed(2) : '0.00',
  };
}

/**
 * Approve a testimonial
 * Sets approvalStatus, approvedBy, and approvedAt
 */
export async function approveTestimonial(
  strapi: Core.Strapi,
  testimonialId: number | string,
  approvedBy: string
) {
  return await strapi.db.query('api::testimonial.testimonial').update({
    where: { id: testimonialId },
    data: {
      approvalStatus: 'Approved',
      approvedBy,
      approvedAt: new Date(),
    },
  });
}

/**
 * Reject a testimonial
 * Sets approvalStatus, rejectionReason, and auto-unpublishes
 */
export async function rejectTestimonial(
  strapi: Core.Strapi,
  testimonialId: number | string,
  rejectionReason: string,
  rejectedBy: string
) {
  return await strapi.db.query('api::testimonial.testimonial').update({
    where: { id: testimonialId },
    data: {
      approvalStatus: 'Rejected',
      rejectionReason,
      approvedBy: rejectedBy, // Track who rejected it
      approvedAt: new Date(), // Track when rejected
      publishedAt: null, // Auto-unpublish
    },
  });
}

/**
 * Publish an approved testimonial
 * Only works if testimonial is already approved
 */
export async function publishTestimonial(strapi: Core.Strapi, testimonialId: number | string) {
  // Verify it's approved first
  const testimonial = await strapi.db.query('api::testimonial.testimonial').findOne({
    where: { id: testimonialId },
    select: ['approvalStatus'],
  });

  if (!testimonial) {
    throw new Error(`Testimonial #${testimonialId} not found`);
  }

  if (testimonial.approvalStatus !== 'Approved') {
    throw new Error(
      `Cannot publish testimonial #${testimonialId}. ` +
        `Status is "${testimonial.approvalStatus}" but must be "Approved"`
    );
  }

  return await strapi.db.query('api::testimonial.testimonial').update({
    where: { id: testimonialId },
    data: {
      publishedAt: new Date(),
    },
  });
}

/**
 * Unpublish a testimonial (for editing)
 * Keeps approval status unchanged
 */
export async function unpublishTestimonial(strapi: Core.Strapi, testimonialId: number | string) {
  return await strapi.db.query('api::testimonial.testimonial').update({
    where: { id: testimonialId },
    data: {
      publishedAt: null,
    },
  });
}
