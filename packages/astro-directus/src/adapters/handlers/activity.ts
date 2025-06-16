import type { DirectusActivity, RestClient, QueryItem, AllCollections as AnyCollections } from "@directus/sdk";
import {
  readActivity,
  readActivities,
} from '@directus/sdk';
import handleAggregate from "./aggregate";
import { createRestHandler } from "../utils";

export default function handleActivity<Schema>(client: RestClient<Schema>) {
  const collection = "directus_activity" as AnyCollections<Schema>;
  const handler = createRestHandler(client);
  return {
    readOne: (key: DirectusActivity<Schema>["id"], query?: QueryItem<Schema, DirectusActivity<Schema>>) => handler(readActivity(key, query)),
    readAll: (query?: QueryItem<Schema, DirectusActivity<Schema>>) => handler(readActivities(query)),
    aggregate: handleAggregate<Schema>(client, collection),
  };
}