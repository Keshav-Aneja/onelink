import type {
  Collection,
  CollectionInsert,
  CollectionUpdate,
} from "@onelink/entities/models";
import type { ICollectionRepository } from "../../application/repositories/collections.repository.interface";
import db from "@onelink/db";
import { DatabaseOperationError } from "@onelink/entities/errros";

export class CollectionRepository implements ICollectionRepository {
  async getCollectionById(
    collection_id: string,
    owner_id: string,
  ): Promise<Collection | undefined> {
    const [collection] = await db("collections")
      .where({ id: collection_id, owner_id })
      .select("*");

    return collection;
  }
  async createCollection(data: CollectionInsert): Promise<Collection> {
    const [collection] = await db("collections").insert(data).select("*");
    if (!collection) {
      throw new DatabaseOperationError("Cannot create collection");
    }
    return collection;
  }
  async deleteCollection(
    collection_id: string,
    owner_id: string,
  ): Promise<string> {
    const [collection] = await db("collections")
      .where({ id: collection_id, owner_id })
      .delete()
      .returning("id");
    if (!collection?.id) {
      throw new DatabaseOperationError("Cannot delete collection");
    }
    return collection.id;
  }
  async updateCollection(
    data: CollectionUpdate,
    collection_id: string,
    owner_id: string,
  ): Promise<Collection> {
    const [collection] = await db("collections")
      .where({
        owner_id,
        id: collection_id,
      })
      .update(data)
      .returning("*");
    if (!collection) {
      throw new DatabaseOperationError("Cannot update collection");
    }
    return collection;
  }
  async getAllCollections(owner_id: string): Promise<Collection[] | undefined> {
    const collections = await db("collections").where({ owner_id }).select("*");
    return collections;
  }
  async getAllCollectionsOfCollection(
    parent_collection_id: string,
    owner_id: string,
  ): Promise<Collection[] | undefined> {
    const collections = await db("collections")
      .where({
        owner_id,
        parent_id: parent_collection_id,
      })
      .select("*");

    return collections;
  }
}
