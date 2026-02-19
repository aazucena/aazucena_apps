/**
 * Custom Testimonial Actions Controller
 *
 * Provides custom endpoints for approval workflow operations
 * These complement the default CRUD endpoints
 */

import { factories } from '@strapi/strapi';
import {
  approveTestimonial,
  rejectTestimonial,
  publishTestimonial,
  unpublishTestimonial,
  getPendingTestimonials,
  getApprovalStatistics,
} from '../utils/queries';

export default factories.createCoreController('api::testimonial.testimonial', ({ strapi }) => ({
  /**
   * GET /api/testimonials/pending
   * Get all testimonials awaiting approval
   */
  async findPending(ctx) {
    try {
      const testimonials = await getPendingTestimonials(strapi, {
        populate: ['avatar'],
      });

      return ctx.send({
        data: testimonials,
        meta: { count: testimonials.length },
      });
    } catch (error) {
      ctx.throw(500, `Failed to fetch pending testimonials: ${(error as Error).message}`);
    }
  },

  /**
   * GET /api/testimonials/statistics
   * Get approval workflow statistics
   */
  async getStatistics(ctx) {
    try {
      const stats = await getApprovalStatistics(strapi);
      return ctx.send({ data: stats });
    } catch (error) {
      ctx.throw(500, `Failed to fetch statistics: ${(error as Error).message}`);
    }
  },

  /**
   * POST /api/testimonials/:id/approve
   * Approve a testimonial
   */
  async approve(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be authenticated to approve testimonials');
    }

    try {
      const updated = await approveTestimonial(strapi, id, user.email || user.username);

      return ctx.send({
        data: updated,
        message: `Testimonial #${id} approved successfully`,
      });
    } catch (error) {
      ctx.throw(500, `Failed to approve testimonial: ${(error as Error).message}`);
    }
  },

  /**
   * POST /api/testimonials/:id/reject
   * Reject a testimonial with a reason
   *
   * Body: { rejectionReason: string }
   */
  async reject(ctx) {
    const { id } = ctx.params;
    const { rejectionReason } = ctx.request.body;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be authenticated to reject testimonials');
    }

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return ctx.badRequest('Rejection reason is required');
    }

    try {
      const updated = await rejectTestimonial(
        strapi,
        id,
        rejectionReason,
        user.email || user.username
      );

      return ctx.send({
        data: updated,
        message: `Testimonial #${id} rejected successfully`,
      });
    } catch (error) {
      ctx.throw(500, `Failed to reject testimonial: ${(error as Error).message}`);
    }
  },

  /**
   * POST /api/testimonials/:id/publish
   * Publish an approved testimonial
   */
  async publish(ctx) {
    const { id } = ctx.params;

    try {
      const updated = await publishTestimonial(strapi, id);

      return ctx.send({
        data: updated,
        message: `Testimonial #${id} published successfully`,
      });
    } catch (error) {
      // This will catch the "not approved" error from publishTestimonial helper
      ctx.throw(400, (error as Error).message);
    }
  },

  /**
   * POST /api/testimonials/:id/unpublish
   * Unpublish a testimonial (for editing)
   */
  async unpublish(ctx) {
    const { id } = ctx.params;

    try {
      const updated = await unpublishTestimonial(strapi, id);

      return ctx.send({
        data: updated,
        message: `Testimonial #${id} unpublished successfully (can now be edited)`,
      });
    } catch (error) {
      ctx.throw(500, `Failed to unpublish testimonial: ${(error as Error).message}`);
    }
  },
}));
