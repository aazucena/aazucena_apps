import type { RestClient, AllCollections, AggregationOptions } from "@directus/sdk";
import {
  aggregate,
} from '@directus/sdk';
import { createRestHandler } from  "../utils";

export default function handleAggregate<Schema>(client: RestClient<Schema>, collection: AllCollections<Schema>) {
  const handler = createRestHandler(client);
  return (query: AggregationOptions<Schema, AllCollections<Schema>>) => handler(aggregate(collection, query));
}