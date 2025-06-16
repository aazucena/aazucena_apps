import type { DirectusFile, FileFormat, Query, RestClient } from "@directus/sdk";
import { sleep, generateHash, verifyHash, generateUid, randomString, utilsImport, utilsExport, formatFields, queryToParams } from "@directus/sdk";
import type { ExtendedQuery } from "types";
import { createRestHandler } from "../utils";

export default function handleUtils<Schema>(client: RestClient<Schema>) {
  const handler = createRestHandler(client);
  return {
    hash: {
      generate: (string: string) => handler(generateHash(string)),
      verify: (string: string, hash: string) => handler(verifyHash(string, hash)),
    },
    uuid: {
      generate: () => generateUid(),
    },
    random: {
      string: (length?: number) => handler(randomString(length)),
    },
    formatFields: (fields: string[]) => formatFields(fields),
    queryToParams: <Item>(query: ExtendedQuery<Schema, Item>) => queryToParams(query),
    import: (collection: keyof Schema, data: FormData) => handler(utilsImport(collection, data)),
    export: (collection: keyof Schema, format: FileFormat, query: Query<Schema, Schema[keyof Schema]>, data: Partial<DirectusFile<Schema>>) => handler(utilsExport(collection, format, query, data)),
    sleep: (ms: number) => sleep(ms),
  };
}