import type { NestedPartial, RestClient, Query, QueryItem, DirectusFile, AllCollections as AnyCollections } from "@directus/sdk";
import { 
  importFile,
  uploadFiles,
  readFile,
  readFiles,
  updateFile,
  updateFiles,
  updateFilesBatch,
  deleteFile,
  deleteFiles,
} from "@directus/sdk";
import handleAssets from "./assets";
import handleAggregate from "./aggregate";
import { createRestHandler } from "../utils";

export default function handleFiles<Schema>(client: RestClient<Schema>) {
  const collection = "directus_files" as AnyCollections<Schema>;
  const handler = createRestHandler(client);
  return {
    import: (url: string, data?: Partial<DirectusFile<Schema>>, query?: Query<Schema, DirectusFile<Schema>>) => handler(importFile(url, data, query)),
    upload: (data: FormData, query?: Query<Schema, DirectusFile<Schema>>) => handler(uploadFiles(data, query)),
    readOne: (key: DirectusFile<Schema>["id"], query?: QueryItem<Schema, DirectusFile<Schema>>) => handler(readFile(key, query)),
    readAll: (query?: QueryItem<Schema, DirectusFile<Schema>>) => handler(readFiles(query)),
    updateOne: (key: DirectusFile<Schema>["id"], item: Partial<DirectusFile<Schema>>, query?: Query<Schema, DirectusFile<Schema>>) => handler(updateFile(key, item, query)),
    updateMany: (keys: DirectusFile<Schema>["id"][], item: Partial<DirectusFile<Schema>>, query?: Query<Schema, DirectusFile<Schema>>) => handler(updateFiles(keys, item, query)),
    updateBatch: (items: NestedPartial<DirectusFile<Schema>>[], query?: Query<Schema, DirectusFile<Schema>>) => handler(updateFilesBatch(items, query)),
    deleteOne: (key: DirectusFile<Schema>["id"]) => handler(deleteFile(key)),
    deleteMany: (keys: DirectusFile<Schema>["id"][]) => handler(deleteFiles(keys)),
    // assets: handleAssets<Schema>(client),
    aggregate: handleAggregate<Schema>(client, collection),
  };
}