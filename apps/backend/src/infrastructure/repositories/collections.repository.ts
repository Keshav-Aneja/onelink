import type { Collection, CollectionUpdate } from "@onelink/entities/models";
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
  async createCollection(data: Collection): Promise<Collection> {
    const [collection] = await db("collections").insert(data).select("*");
    if (!collection) {
      throw new DatabaseOperationError("Cannot create collection");
    }
    return collection;
  }
  async deleteCollection(
    collection_id: string,
    owner_id: string,
  ): Promise<string | undefined> {
    const [collection] = await db("collections")
      .where({ id: collection_id, owner_id })
      .delete()
      .returning("id");
    return collection?.id;
  }
  async updateCollection(
    data: CollectionUpdate,
    collection_id: string,
    owner_id: string,
  ): Promise<Collection | undefined> {
    const [collection] = await db("collections")
      .where({
        owner_id,
        id: collection_id,
      })
      .update(data)
      .returning("*");

    return collection;
  }
  async getAllCollections(owner_id: string): Promise<Collection[] | undefined> {
    const collections = await db("collections").where({ owner_id }).select("*");
    return collections;
  }
}
