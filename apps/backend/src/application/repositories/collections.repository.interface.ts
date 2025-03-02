import type { Collection, CollectionUpdate } from "@onelink/entities/models";

export interface ICollectionRepository {
  getCollectionById(
    collection_id: string,
    owner_id: string,
  ): Promise<Collection | undefined>;
  createCollection(data: Collection): Promise<Collection>;
  deleteCollection(
    collection_id: string,
    owner_id: string,
  ): Promise<string | undefined>;
  updateCollection(
    data: CollectionUpdate,
    collection_id: string,
    owner_id: string,
  ): Promise<Collection | undefined>;
  getAllCollections(owner_id: string): Promise<Collection[] | undefined>;
}
