export default ({ env }) => ({
  // ========================================
  // Custom Field Plugins
  // ========================================
  'advanced-fields': {
    enabled: true,
  },
  'combobox': {
    enabled: true
  },
  'liquid-templates': {
    enabled: true,
  },
  'multiselect-field': {
    enabled: true,
  },
  'sortable-entries': {
    enabled: true,
  },
  'strapi-code-editor-custom-field': {
    enabled: true,
  },
  'strapi-country-select': {
    enabled: true
  },
  'strapi-location-picker': {
    enabled: true,
  },
  'strapi-phone-validator-5': {
    enabled: true
  },
  'strapi-plugin-sortable-list': {
    enabled: true,
  },
  // 'strapi-reservations': {
  //   enabled: true,
  // },
  'table-field': {
    enabled: true,
  },
  'tagsinput': {
    enabled: true,
  },
  'timezone-select': {
    enabled: true,
  },
  'video-field':{
    enabled: true
  },
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
    config: {
      additionalFields: [
        {
          name: 'label',
          type: 'string',
          label: 'Display Label',
          description: 'Custom display text (overrides title)',
          placeholder: 'Projects Portfolio'
        },
        {
          name: 'icon',
          type: 'string',
          label: 'Icon Name',
          description: 'MynaUI icon name (e.g., "briefcase", "clock-circle")',
          placeholder: 'briefcase'
        },
        {
          name: 'buttonStyle',
          type: 'string',
          label: 'Button Style',
          description: 'If set, renders as button. Options: "primary", "secondary", "outline"',
          placeholder: 'primary'
        },
        {
          name: 'description',
          type: 'string',
          label: 'Description',
          description: 'Optional description for accessibility',
        },
        {
          name: 'cssClass',
          type: 'string',
          label: 'CSS Class',
          description: 'Optional custom CSS class',
        }
      ],
      allowedLevels: 2,
      gql: {
        navigationItemRelated: []
      }
    }
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
            password: env('REDIS_PASSWORD', ''),
            db: env.int('REDIS_DB', 0),
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
  'cloudinary-media-library': {
    enabled: true,
    config: {
      cloudName: env('CLOUDINARY_NAME'),
      apiKey: env('CLOUDINARY_KEY'),
      encryptionKey: env('CLOUDINARY_SECRET'),
    },
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
        upload: {
          ...env('CLOUDINARY_UPLOAD_PRESET') ? {
            upload_preset: env('CLOUDINARY_UPLOAD_PRESET')
          } : {},
        },
        uploadStream: {
          ...env('CLOUDINARY_UPLOAD_PRESET') ? {
            upload_preset: env('CLOUDINARY_UPLOAD_PRESET')
          } : {},
        },
        delete: {},
      },
    },
  },
});
