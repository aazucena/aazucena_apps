import type { RestClient, Query, QueryItem, AllCollections as AnyCollections, RegularCollections, CollectionType, SingletonCollections, UnpackList, AggregationOptions } from "@directus/sdk";
import { 
  createItem,
  createItems,
  readItem, 
  readSingleton, 
  readItems,
  updateItem,
  updateSingleton,
  updateItems,
  updateItemsBatch,
  deleteItem,
  deleteItems,
} from "@directus/sdk";
import type { PrimaryKey } from "@directus/types";
import handleAggregate from "./aggregate";
import { createRestHandler } from "../utils";

export default function handleItems<Schema>(client: RestClient<Schema>) {
  const handler = createRestHandler(client);
  return <Collection extends keyof Schema, AnyCollection extends AnyCollections<Schema>, RegularCollection extends RegularCollections<Schema>, SingletonCollection extends SingletonCollections<Schema>>(collection: Collection | AnyCollection | RegularCollection | SingletonCollection) => ({
    createOne: (item: Partial<UnpackList<Schema[Collection]>>, query?: QueryItem<Schema, Schema[Collection]>) => handler(createItem(collection as Collection, item, query)),
    createMany: (items: Partial<UnpackList<Schema[Collection]>>[], query?: QueryItem<Schema, Schema[Collection]>) => handler(createItems(collection as Collection, items, query)),
    readOne: (key: PrimaryKey, query?: QueryItem<Schema, CollectionType<Schema, RegularCollection>>) => handler(readItem(collection as RegularCollection, key, query)),
    readAll: (query?: QueryItem<Schema, CollectionType<Schema, RegularCollection>>) => handler(readItems(collection as RegularCollection, query)),
    readSingleton: (query?: QueryItem<Schema, Schema[SingletonCollection]>) => handler(readSingleton(collection as SingletonCollection, query)),
    updateOne: (key: PrimaryKey, item: Partial<UnpackList<Schema[Collection]>>, query?: QueryItem<Schema, Schema[Collection]>) => handler(updateItem(collection as Collection, key, item, query)),
    updateSingleton: (item: Partial<UnpackList<Schema[SingletonCollection]>>, query?: QueryItem<Schema, Schema[SingletonCollection]>) => handler(updateSingleton(collection as SingletonCollection, item, query)),
    updateMany: (keysOrQuery: string[] | number[] | Query<Schema, Schema[Collection]>, item: Partial<UnpackList<Schema[Collection]>>, query?: Query<Schema, Schema[Collection]>) => handler(updateItems(collection as Collection, keysOrQuery, item, query)),
    updateBatch: (items: Partial<UnpackList<Schema[Collection]>>[], query?: QueryItem<Schema, Schema[Collection]>) => handler(updateItemsBatch(collection as Collection, items, query)),
    deleteOne: (key: PrimaryKey) => handler(deleteItem(collection as Collection, key)),
    deleteMany: (keysOrQuery: string[] | number[] | Query<Schema, Schema[Collection]>) => handler(deleteItems(collection as Collection, keysOrQuery,)),
    aggregate: handleAggregate<Schema>(client, collection as AnyCollection),
  });
}