/// <reference types="astro/client" />
import type { RestClient, AuthClient } from "@astro/directus/adapter";

declare global {
  namespace App {
    interface Locals {
      client: RestClient,
      auth: AuthClient,
    }
  }
}
