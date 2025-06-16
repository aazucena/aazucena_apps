import type { RestClient, RestCommand } from "@directus/sdk";
import { createRestHandler } from "../utils";

export default function handleRequest<Schema>(client: RestClient<Schema>) {
  const handler = createRestHandler(client);
  return <Output = never>(command: RestCommand<Output, Schema>) => handler(command);
}