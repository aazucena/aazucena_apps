export default ({ env }) => ({
  'icons-field': {
    enabled: true,
    config: {
      publicPath: 'icons'
    },
  },
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
