export default ({ env }) => ({
  // ========================================
  // Custom Field Plugins
  // ========================================
  'icons-field': {
    enabled: true,
    config: {
      publicPath: 'icons'
    },
  },
  'color-picker': {
    enabled: true,
  },
  'multi-select': {
    enabled: true,
  },

  // ========================================
  // API & Documentation Plugins
  // ========================================
  'documentation': {
    enabled: true,
    config: {
      restrictedAccess: false, // Set to true in production with auth
    },
  },
  'graphql': {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      depthLimit: 10,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },

  // ========================================
  // SEO & Metadata Plugins
  // ========================================
  'seo': {
    enabled: true,
  },

  // ========================================
  // Workflow & Publishing Plugins
  // ========================================
  'config-sync': {
    enabled: true,
    config: {
      excludedConfig: [
        'core-store.plugin_users-permissions_grant',
        'core-store.plugin_upload_metrics',
        'core-store.strapi_content_types_schema',
        'core-store.ee_information',
      ],
    },
  },
  'duplicate-button': {
    enabled: true,
  },
  'navigation': {
    enabled: true,
  },
  'preview-button': {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: 'api::page.page',
          draft: {
            url: env('FRONTEND_URL', 'http://localhost:4321') + '/preview',
            query: {
              type: 'page',
              slug: '{slug}',
            },
          },
          published: {
            url: env('FRONTEND_URL', 'http://localhost:4321') + '/{slug}',
          },
        },
      ],
    },
  },
  'publisher': {
    enabled: true,
  },

  // ========================================
  // Utility Plugins
  // ========================================
  'strapi-advanced-uuid': {
    enabled: true,
  },

  // ========================================
  // Monitoring & Error Tracking
  // ========================================
  'sentry': {
    enabled: true,
    config: {
      dsn: env('NODE_ENV') === 'production' ? env('SENTRY_DSN') : null,
      sendMetadata: true,
    },
  },

  // ========================================
  // Cloud & Deployment
  // ========================================
  'cloud': {
    enabled: false, // Enable only if using Strapi Cloud
  },

  // ========================================
  // Caching & Performance
  // ========================================
  redis: {
    config: {
      settings: {
        debug: false,
        debugIORedis: false,
        redlockConfig: {
          driftFactor: 0.01,
          retryCount: 10,
          retryDelay: 200,
          retryJitter: 200,
        },
        enableRedlock: false,
        lockDelay: null,
        lockTTL: 5000,
      },
      connections: {
        default: {
          connection: {
            host: env('REDIS_HOST', '127.0.0.1'),
            port: env.int('REDIS_PORT', 6379),
            db: 0,
          },
        },
      },
    },
  },
  "rest-cache": {
    config: {
      provider: {
          name: "redis",
          options: {
              // The name of the connection as defined in the Redis plugin.
              connection: "default",
              // The time to live in milliseconds. This is the maximum amount of time that an item can be in the cache before it is removed.
              ttl: 3600 * 1000
          },
      },
    }
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
