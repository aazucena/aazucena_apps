export default {
  async checkEnv(ctx) {
    const adminConfig = strapi.config.get('admin');

    ctx.body = {
      env: {
        STRAPI_DISABLE_REMOTE_DATA_TRANSFER: process.env.STRAPI_DISABLE_REMOTE_DATA_TRANSFER,
        NODE_ENV: process.env.NODE_ENV,
      },
      adminConfig: {
        transfer: adminConfig.transfer,
      },
    };
  },
};
