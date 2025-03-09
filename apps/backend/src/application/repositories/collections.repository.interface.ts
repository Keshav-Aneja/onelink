import type {
  Collection,
  CollectionInsert,
  CollectionUpdate,
} from "@onelink/entities/models";

export interface ICollectionRepository {
  getCollectionById(
    collection_id: string,
    owner_id: string,
  ): Promise<Collection | undefined>;
  createCollection(data: CollectionInsert): Promise<Collection>;
  deleteCollection(collection_id: string, owner_id: string): Promise<string>;
  updateCollection(
    data: CollectionUpdate,
    collection_id: string,
    owner_id: string,
  ): Promise<Collection>;
  getAllCollections(owner_id: string): Promise<Collection[] | undefined>;
  getAllCollectionsOfCollection(
    parent_collection_id: string | null,
    owner_id: string,
  ): Promise<Collection[] | undefined>;
}
