export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  transfer: {
    remote: {
      // Use Railway's naming convention (disable flag, not enable flag)
      // Set to false in Railway to ENABLE remote data transfer
      enabled: !env.bool('STRAPI_DISABLE_REMOTE_DATA_TRANSFER', false),
    },
  },
});
