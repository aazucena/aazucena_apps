import type { RestClient, AssetsQuery, DirectusFile } from "@directus/sdk";
import { 
  readAssetRaw,
  readAssetBlob,
  readAssetArrayBuffer,
  queryToParams
} from "@directus/sdk";
import { createRestHandler } from "../utils";
import type { ExtendedQuery } from "types";

export default function handleAssets<Schema>(client: RestClient<Schema>) {
  const handler = createRestHandler(client);
  return {
    readUrl: (key: DirectusFile<Schema>["id"], query?: ExtendedQuery<Schema, AssetsQuery>) => `${client.url}assets/${key}${query ? "?"+queryToParams(query) : ""}`,
    readRaw: (key: DirectusFile<Schema>["id"], query?: AssetsQuery) => handler(readAssetRaw(key, query)),
    readBlob: (key: DirectusFile<Schema>["id"], query?: AssetsQuery) => handler(readAssetBlob(key, query)),
    readArrayBuffer: (key: DirectusFile<Schema>["id"], query?: AssetsQuery) => handler(readAssetArrayBuffer(key, query)),
  };
}