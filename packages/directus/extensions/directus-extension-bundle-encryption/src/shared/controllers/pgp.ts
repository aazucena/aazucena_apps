import { EndpointExtensionContext } from '@directus/extensions';
import { RequestHandler } from 'express-serve-static-core';
import { PGPEncryptionHandler as PGPEncryption } from '../handlers';
import { KeysRequestBody } from '../types';


interface GenerateKeyRequestParams { id: string };

class PGPEncryptionController extends PGPEncryption {
  constructor(ctx: EndpointExtensionContext) {
    super(ctx);
  }

  generateKeyByCurrentUser: RequestHandler = async(req, res) => {
    const service = this.useService();
    const accountability = req.accountability
    const opts = req.body as KeysRequestBody;
    try {
      const result = await service.keys.retrieve(accountability, { ...opts, format:'armored' });
      if (!result) {
        res.status(500).send({
          status: 'error',
          message: 'Something went wrong',
          code: 500
        })
      }
      
      res.status(200).send(result)
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: 'Something went wrong',
        code: 500
      })
    }
  };

  generateKeyByUserID: RequestHandler = async(req, res) => {
    const service = this.useService();
    const accountability = req.accountability
    const { id } = req.params as GenerateKeyRequestParams;
    const opts = req.body as KeysRequestBody;
    try {
      const result = await service.keys.createOne(id, accountability, { ...opts, format:'armored' });
      if (!result) {
        res.status(500).send({
          status: 'error',
          message: 'Something went wrong',
          code: 500
        })
      }
      res.status(200).send(result)
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: 'Something went wrong',
        code: 500
      })
    }
  };

  retrieveKey: RequestHandler = async(req, res) => {
    const service = this.useService();
    const accountability = req.accountability;
    const { email, password, ...opts } = req.body as Omit<KeysRequestBody, 'passphrase'>;
    try {
      if (!email) {
        const result = await service.keys.retrieve(accountability, { ...opts, format:'armored', passphrase: password });
        if (!result) {
          res.status(500).send({
            status: 'error',
            message: 'Something went wrong',
            code: 500
          })
        }
        res.status(200).send(result);
      } else {
        const result = await service.keys.create(accountability, email, { ...opts, format:'armored', passphrase: password });
        if (!result) {
          res.status(500).send({
            status: 'error',
            message: 'Something went wrong',
            code: 500
          })
        }
        res.status(200).send(result);
      }
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: 'Something went wrong',
        code: 500
      })
    }
  }
}

export default PGPEncryptionController