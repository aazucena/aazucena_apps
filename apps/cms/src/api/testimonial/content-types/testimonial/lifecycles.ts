/**
 * Testimonial Lifecycle Hooks
 *
 * Manages hybrid approval + publish workflow:
 * - approvalStatus: Quality gate (Pending → Approved/Rejected)
 * - publishedAt: Visibility control (can toggle for edits)
 *
 * State Rules:
 * - Only approved testimonials can be published
 * - Rejected testimonials are auto-unpublished
 * - Pending testimonials cannot be published
 */

export default {
  /**
   * Before Create Hook
   * Validates initial state when testimonial is created
   */
  async beforeCreate(event: any) {
    const { data } = event.params;

    // Rule 1: New testimonials default to Pending if not specified
    if (!data.approvalStatus) {
      data.approvalStatus = 'Pending';
    }

    // Rule 2: Cannot create a published testimonial that isn't approved
    if (data.publishedAt && data.approvalStatus !== 'Approved') {
      throw new Error(
        `Cannot publish testimonial with status "${data.approvalStatus}". Must be "Approved" first.`
      );
    }

    // Rule 3: Set submission timestamp if not provided
    if (!data.submittedAt) {
      data.submittedAt = new Date();
    }
  },

  /**
   * Before Update Hook
   * Enforces state transition rules
   */
  async beforeUpdate(event: any) {
    const { data, where } = event.params;

    // Fetch current state to check transitions
    // Note: 'strapi' global instance is available in Strapi v5 lifecycles
    const current = await strapi.db.query('api::testimonial.testimonial').findOne({
      where: { id: where.id },
      select: ['approvalStatus', 'publishedAt']
    });

    if (!current) {
      return; // Entity doesn't exist, let Strapi handle error
    }

    // Rule 1: Cannot publish if not approved
    const willBePublished = data.publishedAt !== undefined && data.publishedAt !== null;
    const currentApprovalStatus = data.approvalStatus ?? current.approvalStatus;

    if (willBePublished && currentApprovalStatus !== 'Approved') {
      throw new Error(
        `Cannot publish testimonial with status "${currentApprovalStatus}". Must be "Approved" first.`
      );
    }

    // Rule 2: If approvalStatus changes to Rejected, auto-unpublish
    if (data.approvalStatus === 'Rejected') {
      data.publishedAt = null;

      // Require rejection reason when rejecting
      if (!data.rejectionReason && !current.rejectionReason) {
        throw new Error('Rejection reason is required when rejecting a testimonial');
      }
    }

    // Rule 3: Track approval metadata when status changes to Approved
    if (data.approvalStatus === 'Approved' && current.approvalStatus !== 'Approved') {
      // Get authenticated user from event state (if available)
      const user = event.state?.user;

      data.approvedBy = user?.email || user?.username || 'system';
      data.approvedAt = new Date();
    }

    // Rule 4: Prevent approval status from going backwards
    if (current.approvalStatus === 'Approved' && data.approvalStatus === 'Pending') {
      throw new Error(
        'Cannot move testimonial from Approved back to Pending. Use Rejected if needed.'
      );
    }

    // Rule 5: If changing from Rejected to Approved, clear rejection reason
    if (data.approvalStatus === 'Approved' && current.approvalStatus === 'Rejected') {
      data.rejectionReason = null;
    }
  },

  /**
   * After Update Hook
   * Log approval state changes for audit trail
   */
  async afterUpdate(event: any) {
    const { result, params } = event;

    // Log approval state changes
    if (params.data.approvalStatus) {
      strapi.log.info(
        `Testimonial #${result.id} approval status changed to: ${result.approvalStatus}` +
        (result.approvedBy ? ` by ${result.approvedBy}` : '')
      );
    }

    // Log publish state changes
    if ('publishedAt' in params.data) {
      const action = result.publishedAt ? 'published' : 'unpublished';
      strapi.log.info(`Testimonial #${result.id} ${action}`);
    }
  },

  /**
   * Before Delete Hook
   * Optional: Prevent deletion of approved testimonials (soft delete instead)
   */
  async beforeDelete(event: any) {
    const { where } = event.params;

    const testimonial = await strapi.db.query('api::testimonial.testimonial').findOne({
      where: { id: where.id },
      select: ['approvalStatus', 'author']
    });

    if (!testimonial) {
      return;
    }

    // Optional: Log deletion of approved testimonials
    if (testimonial.approvalStatus === 'Approved') {
      strapi.log.warn(
        `Deleting approved testimonial #${where.id} from ${testimonial.author}. ` +
        `Consider using "Rejected" status instead for audit trail.`
      );
    }
  }
};
