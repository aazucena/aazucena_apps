import type { RestClient, QueryItem, DirectusRole, AllCollections as AnyCollections } from "@directus/sdk";
import { 
  readRole,
  readRoles,
} from "@directus/sdk";
import handleAggregate from "./aggregate";
import { createRestHandler } from "../utils";

export default function handleRoles<Schema>(client: RestClient<Schema>) {
  const collection = "directus_roles" as AnyCollections<Schema>;
    const handler = createRestHandler(client);
  return {
    readOne: (key: DirectusRole<Schema>["id"], query?: QueryItem<Schema, DirectusRole<Schema>>) => handler(readRole(key, query)),
    readAll: (query?: QueryItem<Schema, DirectusRole<Schema>>) => handler(readRoles(query)),
    aggregate: handleAggregate<Schema>(client, collection),
  };
}