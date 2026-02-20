import { validateStrapiToken } from "./utils";

const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN;
validateStrapiToken(STRAPI_TOKEN);

export * from "./utils/strapi";
