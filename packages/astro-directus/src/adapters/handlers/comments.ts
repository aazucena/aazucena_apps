import type { DirectusComment, RestClient, Query, QueryItem, AllCollections as AnyCollections } from "@directus/sdk";
import { 
  createComment,
  createComments,
  readComment,
  readComments,
  updateComment,
  updateComments,
  deleteComment,
  deleteComments,
} from "@directus/sdk";
import handleAggregate from "./aggregate";
import { createRestHandler } from "../utils";

export default function handleComments<Schema>(client: RestClient<Schema>) {
  const collection = "directus_comments" as AnyCollections<Schema>;
  const handler = createRestHandler(client);
  return {
    createOne: (comment: Partial<DirectusComment<Schema>>, query?: Query<Schema, DirectusComment<Schema>>) => handler(createComment(comment, query)),
    createMany: (comments: Partial<DirectusComment<Schema>>[], query?: Query<Schema, DirectusComment<Schema>>) => handler(createComments(comments, query)),
    readOne: (key: DirectusComment<Schema>["id"], query?: QueryItem<Schema, DirectusComment<Schema>>) => handler(readComment(key, query)),
    readAll: (query?: QueryItem<Schema, DirectusComment<Schema>>) => handler(readComments(query)),
    updateOne: (key: DirectusComment<Schema>["id"], comment: Partial<DirectusComment<Schema>>, query?: Query<Schema, DirectusComment<Schema>>) => handler(updateComment(key, comment, query)),
    updateMany: (keys: DirectusComment<Schema>["id"][], comment: Partial<DirectusComment<Schema>>, query?: Query<Schema, DirectusComment<Schema>>) => handler(updateComments(keys, comment, query)),
    deleteOne: (key: DirectusComment<Schema>["id"]) => handler(deleteComment(key)),
    deleteMany: (keys: DirectusComment<Schema>["id"][]) => handler(deleteComments(keys)),
    aggregate: handleAggregate<Schema>(client, collection),
  };
}