/**
 * Custom Testimonial Routes
 *
 * Additional routes for approval workflow actions
 * These work alongside the default CRUD routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/testimonials/pending',
      handler: 'testimonial-actions.findPending',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'GET',
      path: '/testimonials/statistics',
      handler: 'testimonial-actions.getStatistics',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/testimonials/:id/approve',
      handler: 'testimonial-actions.approve',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/testimonials/:id/reject',
      handler: 'testimonial-actions.reject',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/testimonials/:id/publish',
      handler: 'testimonial-actions.publish',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/testimonials/:id/unpublish',
      handler: 'testimonial-actions.unpublish',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
};
