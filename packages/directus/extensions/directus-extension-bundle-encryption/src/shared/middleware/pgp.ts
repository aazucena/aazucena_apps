import type { EndpointExtensionContext } from "@directus/extensions";
import { PGPEncryptionHandler as PGPEncryption } from '../handlers';
import { checkAccountability } from '../utils';
import { RequestHandler } from 'express-serve-static-core';

class PGPEncryptionMiddleware extends PGPEncryption {
  constructor(ctx: EndpointExtensionContext) {
    super(ctx);
  }
  checkAccountability: RequestHandler = (req, _res, next) => {
    if (!req.originalUrl.startsWith('/pgp/api')) {
      const accountability = req.accountability;
      // this ensures public or unauthenticated calls will get forbidden error
      checkAccountability(accountability, next!);
    }
    if (next) {
      next();
    }
  };
};

export default PGPEncryptionMiddleware;