import { defineEndpoint } from '@directus/extensions-sdk';
import { createExtensions } from '../shared/factory';
import { GenerateKeysOptions } from '../shared/types';
import { checkAccountability } from '../shared/utils';

interface KeysRequestBody extends GenerateKeysOptions {
	email?: string;
	password?: string;
}

export default defineEndpoint((router, ctx) => {
	const { PGP } = createExtensions(ctx);
  router.use((req, _res, next) => {
		
		if (!req.originalUrl.startsWith('/pgp/api')) {
			const accountability = req.accountability;
			// this ensures public or unauthenticated calls will get forbidden error
			checkAccountability(accountability, next);
		}
	
		next();
	});

	router.get('/', (_req, res) => {
		console.log("🚀 ~ router.get ~ _req:", _req)
		res.send('Hello, World!')
	});

	router.get('/keys', async (req, res) => {
		const accountability = req.accountability

		const opts = req.body as KeysRequestBody;
		

		try {
			const result = await PGP.keys.retrieve(accountability, { ...opts, format:'armored' });

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
	})

	router.get('/keys/:id', async (req, res) => {
		const accountability = req.accountability

		const { id } = req.params;
		const opts = req.body as KeysRequestBody;
		try {
			const result = await PGP.keys.createOne(id, accountability, { ...opts, format:'armored' });
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
	})

	router.post('/keys', async (req, res)=> {
		const accountability = req.accountability
		const { email, password, ...opts } = req.body as Omit<KeysRequestBody, 'paraphrase'>;
		try {
			if (!email) {
				const result = await PGP.keys.retrieve(accountability, { ...opts, format:'armored', passphrase: password });
				if (!result) {
					res.status(500).send({
						status: 'error',
						message: 'Something went wrong',
						code: 500
					})
				}
				res.status(200).send(result);
			} else {
				const result = await PGP.keys.create(email, accountability, { ...opts, format:'armored', passphrase: password });
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
	})


});
