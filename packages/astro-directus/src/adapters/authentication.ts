import type { RestClient, AuthenticationClient } from "@directus/sdk";
import { handleAuth } from "./handlers";

export type AuthClient<Schema> = RestClient<Schema> & AuthenticationClient<Schema>;

export default function adapter<Schema>(client: AuthClient<Schema>) {
  return handleAuth<Schema>(client);
}

export type AuthAdapter = ReturnType<typeof adapter>;