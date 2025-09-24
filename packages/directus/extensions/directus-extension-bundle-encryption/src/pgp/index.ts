import { defineEndpoint } from '@directus/extensions-sdk';
import { PGPEncryptionController } from '../shared/controllers';
import { PGPEncryptionMiddleware } from '../shared/middleware';
import swaggerUi from 'swagger-ui-express';
import { RequestHandler } from 'express-serve-static-core';

export default defineEndpoint({
  id: 'pgp',
  handler: (router, ctx) => {
    const controller = new PGPEncryptionController(ctx);
    const middleware = new PGPEncryptionMiddleware(ctx);
    router.use(middleware.checkAccountability);
    router.get('/', (_req, res) => {
      console.log("🚀 ~ router.get ~ _req:", _req)
      res.send('Hello, World!')
    });
    router.use('/api-docs', swaggerUi.serve as RequestHandler[], swaggerUi.setup({}, {
      swaggerUrl: '/pgp/api-docs'
    }) as RequestHandler[]);
    router.post('/keys/generate', controller.generateKeyByCurrentUser);

    router.post('/keys/generate/:id', controller.generateKeyByUserID);

    router.get('/keys', controller.retrieveKey);
  }
});
