import { decryptKey, generateKey, readKey, readKeys, readPrivateKey, readPrivateKeys } from "openpgp";
import { getUsersService } from "../../utils/users";
import { Accountability, ContentType, EllipticCurveName, ExtensionCtx, FactoryFunction, GenerateKeyFormat, GenerateKeyOptions, GenerateKeysOptions, Key, KeyPairResponse, KeyPairType, PrivateKey, User } from "../../types";
import { formatUserID, generateRetrieveCurrentUser, generateRetrieveCurrentUserID, generateRetrieveUser, generateRetrieveUserByEmail, generateRetrieveUserIDs } from "./users";


type GenerateKeysParams = [
  accountability: Accountability,
  opts?: GenerateKeysOptions
];

const generateGenerateKeysByID: FactoryFunction<KeyPairResponse, [user: string | User, ...GenerateKeysParams]> = (ctx) => {
  const { env } = ctx;
  const retrieveUser = generateRetrieveUser(ctx);
  const retrieveUserIDs = generateRetrieveUserIDs(ctx);
  return async(id, accountability, opts) => {
    const user = await retrieveUser(id, accountability);
    const userID = formatUserID(user);
    const userIDs = await retrieveUserIDs(accountability, opts?.users ?? []);

    const type: KeyPairType = opts?.type || env['PGP_KEYPAIR_TYPE'] || 'curve25519';
    const curve: EllipticCurveName = opts?.curve || env['PGP_KEYPAIR_CURVE'] || 'curve25519Legacy';
    const rsaBits: number = opts?.rsaBits || env['PGP_KEYPAIR_RSA_BITS'];
    const keyExpirationTime: number = opts?.keyExpirationTime || env['PGP_KEYPAIR_KEY_EXPIRATION_TIME'];
    const format: GenerateKeyFormat = opts?.format || 'armored';

    const payload: GenerateKeyOptions = {
      type,
      curve,
      userIDs: [userID, ...userIDs],
      passphrase: opts?.passphrase || user.password!,
      format: format as 'armored',
    };
    if (type === "rsa" && rsaBits > 0) {
      payload.rsaBits = rsaBits || 2048;
    }
    if (keyExpirationTime) {
      payload.keyExpirationTime = keyExpirationTime || 0;
    }

    const keys = await generateKey(payload);
    return keys
  }
}
const generateGenerateKeysByCurrentUser: FactoryFunction<KeyPairResponse, GenerateKeysParams> = (ctx) => {
  const { env } = ctx;
  const currentUser = generateRetrieveCurrentUser(ctx);
  const retrieveCurrentUserID = generateRetrieveCurrentUserID(ctx);
  const retrieveUserIDs = generateRetrieveUserIDs(ctx);
  return async(accountability, opts) => {
    const user = await currentUser(accountability);
    const userID = await retrieveCurrentUserID(accountability);
    const userIDs = await retrieveUserIDs(accountability, opts?.users ?? []);

    const type: KeyPairType = opts?.type || env['PGP_KEYPAIR_TYPE'] || 'curve25519';
    const curve: EllipticCurveName = opts?.curve || env['PGP_KEYPAIR_CURVE'] || 'curve25519Legacy';
    const rsaBits: number = opts?.rsaBits || env['PGP_KEYPAIR_RSA_BITS'];
    const keyExpirationTime: number = opts?.keyExpirationTime || env['PGP_KEYPAIR_KEY_EXPIRATION_TIME'];
    const format: GenerateKeyFormat = opts?.format || 'armored';

    const payload: GenerateKeyOptions = {
      type,
      curve,
      userIDs: [userID, ...userIDs],
      passphrase: opts?.passphrase || user.password!,
      format: format as 'armored',
    };
    if (type === "rsa" && rsaBits > 0) {
      payload.rsaBits = rsaBits || 2048;
    }
    if (keyExpirationTime) {
      payload.keyExpirationTime = keyExpirationTime || 0;
    }

    const keys = await generateKey(payload);
    return keys
  }
  
}

const generateGenerateKeys: FactoryFunction<KeyPairResponse, [email?: string, ...GenerateKeysParams]> = (ctx) => {
  const { env } = ctx;
  const retrieveUserIDs = generateRetrieveUserIDs(ctx);
  const retrieveUserByEmail = generateRetrieveUserByEmail(ctx);
  return async(email = undefined, accountability, opts) => {
    const userIDs = await retrieveUserIDs(accountability, opts?.users ?? []);

    const type: KeyPairType = opts?.type || env['PGP_KEYPAIR_TYPE'] || 'curve25519';
    const curve: EllipticCurveName = opts?.curve || env['PGP_KEYPAIR_CURVE'] || 'curve25519Legacy';
    const rsaBits: number = opts?.rsaBits || env['PGP_KEYPAIR_RSA_BITS'];
    const keyExpirationTime: number = opts?.keyExpirationTime || env['PGP_KEYPAIR_KEY_EXPIRATION_TIME'];
    const format: GenerateKeyFormat = opts?.format || 'armored';

    const payload: GenerateKeyOptions & { format: 'armored' } = {
      type,
      curve,
      userIDs: [],
      passphrase: opts?.passphrase,
      format: format as 'armored',
    };
    if (Array.isArray(payload.userIDs)) {
      if (email) {
        const user = await retrieveUserByEmail(email, accountability);
        if (user && user !== null && Array.isArray(payload.userIDs)) {
          payload.userIDs.push(formatUserID(user));
        } else {
          payload.userIDs = [
            {
              email: email
            }
          ];
        }
      } 
      if (userIDs && userIDs.length > 0) {
        payload.userIDs.push(...userIDs);
      }
    }

    if (type === "rsa" && rsaBits > 0) {
      payload.rsaBits = rsaBits || 2048;
    }
    if (keyExpirationTime) {
      payload.keyExpirationTime = keyExpirationTime || 0;
    }

    const keys = await generateKey(payload);

    return keys
  }
}

type ReadKeyParams = [key: ContentType];
const generateReadKey: FactoryFunction<Key, ReadKeyParams> = (ctx) => {
  return async(key) => {
    if (typeof key === 'string') {
      return await readKey({ armoredKey: key });
    } else if (key instanceof Uint8Array) {
      return await readKey({ binaryKey: key });
    }
    throw new Error('Invalid key');
  }
}
const generateReadPrivateKey: FactoryFunction<PrivateKey, ReadKeyParams> = (ctx) => {
  return async(key) => {
    if (typeof key === 'string') {
      return await readPrivateKey({ armoredKey: key });
    } else if (key instanceof Uint8Array) {
      return await readPrivateKey({ binaryKey: key });
    }
    throw new Error('Invalid key');
  }
}

type ReadKeysParams = [keys: ContentType];
const generateReadKeys: FactoryFunction<Key[], ReadKeysParams> = (ctx) => {
  return async(keys) => {
    if (!Array.isArray(keys) || keys.length === 0) {
      throw new Error('Invalid keys');
    }

    if (typeof keys[0] === 'string') {
      return await readKeys({ armoredKeys: keys as string });
    } else if (keys[0] instanceof Uint8Array) {
      return await readKeys({ binaryKeys: keys as Uint8Array });
    }
    throw new Error('Invalid key');
  }
}
const generateReadPrivateKeys: FactoryFunction<PrivateKey[], ReadKeysParams> = (ctx) => {
  return async(keys) => {
    if (!Array.isArray(keys) || keys.length === 0) {
      throw new Error('Invalid keys');
    }

    if (typeof keys[0] === 'string') {
      return await readPrivateKeys({ armoredKeys: keys as string });
    } else if (keys[0] instanceof Uint8Array) {
      return await readPrivateKeys({ binaryKeys: keys as Uint8Array });
    }
    throw new Error('Invalid key');
  }
}

type DecryptPrivateKeyParams = [key: ContentType, accountability: Accountability, paraphrase?: string];
const generateDecryptPrivateKey: FactoryFunction<PrivateKey, DecryptPrivateKeyParams> = (ctx) => {
  const readOne = generateReadPrivateKey(ctx);
  
  return async(key, accountability, paraphrase = undefined) => {
    const service = await getUsersService(ctx, { accountability });
    
    const user = await service.readOne(accountability.user!) as User;
    const privateKey = await readOne(key);
    
    return await decryptKey({
      privateKey: privateKey,
      passphrase: paraphrase || user.password!
    })
  }
}

const initKeys = (ctx: ExtensionCtx) => {
  return {
    retrieve: generateGenerateKeysByCurrentUser(ctx),
    create: generateGenerateKeys(ctx),
    createOne: generateGenerateKeysByID(ctx),
    readOne: generateReadKey(ctx),
    readMany: generateReadKeys(ctx),
    private: {
      readOne: generateReadPrivateKey(ctx),
      readMany: generateReadPrivateKeys(ctx),
      decrypt: generateDecryptPrivateKey(ctx)
    },
  }
}

export default initKeys