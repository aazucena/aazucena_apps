export default {
  routes: [
    {
      method: 'GET',
      path: '/debug/env',
      handler: 'debug.checkEnv',
      config: {
        auth: false,
      },
    },
  ],
};
