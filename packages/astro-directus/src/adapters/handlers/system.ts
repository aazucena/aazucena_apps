
import { createRestHandler } from "../utils";
import type { RestClient, DirectusSettings, Query } from "@directus/sdk";
import { readOpenApiSpec, readSettings, schemaSnapshot, serverInfo, serverPing, serverHealth } from "@directus/sdk";
export default function handleSystem<Schema>(client: RestClient<Schema>) {
  const handler = createRestHandler(client);
  return {
    app: {
      info: (query?: Query<Schema, DirectusSettings<Schema>>) => handler(readSettings(query)),
      schema: () => handler(schemaSnapshot<Schema>()),
      oas: () => handler(readOpenApiSpec<Schema>())
    },
    server: {
      info: () => handler(serverInfo<Schema>()),
      ping: () => handler(serverPing<Schema>()),
      healthCheck: () => handler(serverHealth<Schema>()),
    }
  };
}