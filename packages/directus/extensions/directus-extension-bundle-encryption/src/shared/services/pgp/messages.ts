import { createMessage, decrypt, readMessage, encrypt } from "openpgp";
import { ExtensionCtx, ContentType, MessagePacketFormat, FactoryFunction, Message, Accountability, MessageParam, PublicKeyParam, PrivateKeyParam, EncryptMessageFormat, EncryptedMessage, DecryptMessageResult } from "../../types";
import { generateRetrieveCurrentUser, generateRetrieveCurrentUserID } from "./users";

type CreateMessageParams = [content: ContentType, filename?: string, format?: MessagePacketFormat];
const generateCreateMessage: FactoryFunction<Message, CreateMessageParams> = (ctx) => {
  return async(content, filename, format = undefined) => {
    if (typeof content === 'string') {
      return await createMessage({ text: content, filename, format });
    } else if (content instanceof Uint8Array) {
      return await createMessage({ binary: content, filename, format });
    }
    throw new Error('Invalid message content');
  }
}

const generateReadMessage: FactoryFunction<Message, [input: ContentType]> = (ctx) => {
  return async(input) => {
    if (typeof input === 'string') {
      return await readMessage({ armoredMessage: input });
    } else if (input instanceof Uint8Array) {
      return await readMessage({ binaryMessage: input });
    }
    throw new Error('Invalid message input');
  }
}

type EncryptMessageParams = [
  accountability: Accountability,
  message: MessageParam,
  encryptionKeys: PublicKeyParam,
  signingKeys?: PrivateKeyParam,
  passwords?: string | string[],
  format?: EncryptMessageFormat
];
const generateEncryptMessage: FactoryFunction<EncryptedMessage, EncryptMessageParams> = (ctx: ExtensionCtx) => {
  const { env } = ctx;
  const currentUser = generateRetrieveCurrentUser(ctx);
  const retrieveCurrentUserID = generateRetrieveCurrentUserID(ctx);
  const createMessage = generateCreateMessage(ctx);
  return async(accountability, message, encryptionKeys, signingKeys, passwords = [], format = 'armored') => {
    const user = await currentUser(accountability);
    const userID = await retrieveCurrentUserID(accountability);
    
    let passwordList = [
      ...user.password ? [user.password]: [],
      ...passwords ? (Array.isArray(passwords) ? passwords : [passwords]) : []
    ];

    if (typeof message === 'string' || message instanceof Uint8Array) {
      message = await createMessage(message);
    }

    return await encrypt({
      message: message,
      encryptionKeys,
      signingKeys: signingKeys,
      passwords: passwordList,
      encryptionUserIDs: [
        userID
      ],
      signingUserIDs: [
        userID
      ],
      format: env['PGP_MESSAGE_ENCRYPT_FORMAT'] || format
    })
  }
}

type DecryptMessageParams = [
  accountability: Accountability,
  message: MessageParam,
  verificationKeys?: PublicKeyParam,
  decryptionKeys?: PrivateKeyParam,
  passwords?: string | string[],

];
const generateDecryptMessage: FactoryFunction<DecryptMessageResult, DecryptMessageParams> = (ctx) => {
  const currentUser = generateRetrieveCurrentUser(ctx);
  const readMessage = generateReadMessage(ctx);
  return async(accountability, message, verificationKeys, decryptionKeys, passwords) => {
    const user = await currentUser(accountability);
    
    const format = (message instanceof Uint8Array) ? 'binary' : 'utf8';
    
    const passwordList = [
      ...user.password ? [user.password]: [],
      ...passwords ? (Array.isArray(passwords) ? passwords : [passwords]) : []
    ];

    if (typeof message === 'string' || message instanceof Uint8Array) {
      message = await readMessage(message);
    }
    return decrypt({
      message,
      verificationKeys,
      decryptionKeys,
      passwords: passwordList,
      format
    })
  }
}

const initMessages = (ctx: ExtensionCtx) => {
  return {
    create: generateCreateMessage(ctx),
    read: generateReadMessage(ctx),
    encrypt: generateEncryptMessage(ctx),
    decrypt: generateDecryptMessage(ctx)
  }
}

export default initMessages
export type PGPEncryptionMessageService = ReturnType<typeof initMessages>