import type { PrimaryKey, User } from "./directus"; 
import type { 
  SerializedKeyPair, 
  KeyPair, 
  Key,
  PrivateKey,
  EllipticCurveName,
  UserID,
  GenerateKeyOptions as GenerateKeyOpts,
  Message as GeneratedMessage,
  PublicKey,
  MaybeStream,
  DecryptMessageResult,
} from 'openpgp';
export type { 
  SerializedKeyPair, 
  KeyPair, 
  Key,
  PrivateKey,
  EllipticCurveName,
  UserID,
  PublicKey,
  MaybeStream,
  DecryptMessageResult,
}
export type GenerateKeyFormat = 'armored' | 'object' | 'binary';
export type KeyPairType = 'ecc' | 'rsa' | 'curve25519' | 'curve448';
export type KeyPairResponse = (KeyPair | SerializedKeyPair<string | Uint8Array>) & { revocationCertificate: string };
export type ContentType = string | Uint8Array;
export type MessagePacketFormat = 'utf8'|'binary'|'text'|'mime';
export type EncryptMessageFormat = 'armored' | 'binary' | 'object';
export interface GenerateKeyOptions extends GenerateKeyOpts {
  format?: 'armored'
}
export type Message = GeneratedMessage<ContentType>;
export type KeyParam = Key | Key[];
export type PublicKeyParam = KeyParam | PublicKey | PublicKey[];
export type PrivateKeyParam = PrivateKey | PrivateKey[];
export type EncryptedMessage = MaybeStream<ContentType>;
export type MessageParam = ContentType | Message;
export type GenerateKeysBlacklistFields = 'format' | 'userIDs' | 'type';
export interface GenerateKeysOptions extends Omit<GenerateKeyOpts, GenerateKeysBlacklistFields> { 
  type?: KeyPairType;
  users?: PrimaryKey[] | User[];
  format?: GenerateKeyFormat;
};

export interface KeysRequestBody extends GenerateKeysOptions {
	email?: string;
	password?: string;
};

export interface ParamsDictionary {
  [key: string]: string | string[] | undefined;
}

export interface ErrorResponse {
  status: 'error';
  code: number;
  message: string;
}
export type KeyPairResponseBody<T = KeyPairResponse> = T | ErrorResponse;