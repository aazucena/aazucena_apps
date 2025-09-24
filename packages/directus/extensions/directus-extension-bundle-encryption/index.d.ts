import type { Accountability } from "@directus/types";

declare global {
  namespace Express {
		export interface Request {
			accountability: Accountability; 
		}
	}
}
