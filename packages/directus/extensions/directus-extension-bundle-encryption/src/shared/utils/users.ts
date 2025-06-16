import { ExtensionCtx } from "../types";
import { AbstractServiceOptions } from "@directus/api/dist/types";


export const getUsersService = async(ctx: ExtensionCtx, options?: Partial<AbstractServiceOptions>) => {
  const { services: { UsersService }, getSchema, database } = ctx;
  const schema = await getSchema({ database });
  return new UsersService({ ...options ?? {}, knex: database, schema });
};