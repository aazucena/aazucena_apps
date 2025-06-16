import { sequence } from "astro:middleware";
import handlers from "./server";
export const onRequest = sequence(...handlers ?? []);
