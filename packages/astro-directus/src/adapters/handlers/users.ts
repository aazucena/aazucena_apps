import type { NestedPartial, DirectusUser, RestClient, Query, QueryItem, AllCollections as AnyCollections } from "@directus/sdk";
import { 
  createUser,
  createUsers,
  readUser,
  readUsers,
  readMe,
  updateUser,
  updateUsers,
  updateUsersBatch,
  updateMe,
  deleteUser,
  deleteUsers,
} from "@directus/sdk";
import handleAggregate from "./aggregate";
import { createRestHandler } from "../utils";

export default function handleUsers<Schema>(client: RestClient<Schema>) {
  const collection = "directus_users" as AnyCollections<Schema>;
  const handler = createRestHandler(client);
  return {
    createOne: (user: Partial<DirectusUser<Schema>>, query?: Query<Schema, DirectusUser<Schema>>) => handler(createUser(user, query)),
    createMany: (users: Partial<DirectusUser<Schema>>[], query?: Query<Schema, DirectusUser<Schema>>) => handler(createUsers(users, query)),
    readOne: (key: DirectusUser<Schema>["id"], query?: QueryItem<Schema, DirectusUser<Schema>>) => handler(readUser(key, query)),
    readAll: (query?: QueryItem<Schema, DirectusUser<Schema>>) => handler(readUsers(query)),
    updateOne: (key: DirectusUser<Schema>["id"], user: Partial<DirectusUser<Schema>>, query?: Query<Schema, DirectusUser<Schema>>) => handler(updateUser(key, user, query)),
    updateBatch: (users: NestedPartial<DirectusUser<Schema>>[], query?: Query<Schema, DirectusUser<Schema>>) => handler(updateUsersBatch(users, query)),
    updateMany: (keys: DirectusUser<Schema>["id"][], user: Partial<DirectusUser<Schema>>, query?: Query<Schema, DirectusUser<Schema>>) => handler(updateUsers(keys, user, query)),
    deleteOne: (key: DirectusUser<Schema>["id"]) => handler(deleteUser(key)),
    deleteMany: (keys: DirectusUser<Schema>["id"][]) => handler(deleteUsers(keys)),
    current: {
      read: (query?: Query<Schema, DirectusUser<Schema>>) => handler(readMe(query)),
      update: (user: Partial<DirectusUser<Schema>>, query?: Query<Schema, DirectusUser<Schema>>) => handler(updateMe(user, query)),
    },
    aggregate: handleAggregate<Schema>(client, collection),
  };
}