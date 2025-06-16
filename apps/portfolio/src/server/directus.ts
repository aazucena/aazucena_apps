import type { APIContext } from "astro";
import { defineMiddleware } from "astro:middleware";
import { directusClient, directusAuthClient } from "directus:client";
import { RestClientAdapter, AuthClientAdapter } from "@astro/directus/adapter";

const directusHandler = defineMiddleware(({ locals }: APIContext, next) => {
  locals.client = RestClientAdapter(directusClient);
  locals.auth = AuthClientAdapter(directusAuthClient);

  return next();
})

export default directusHandler;
