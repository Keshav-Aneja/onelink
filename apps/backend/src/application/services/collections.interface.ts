import type { Collection, CollectionInsert } from "@onelink/entities/models";

export interface ICollectionsService {
  createCollection(collection: CollectionInsert): Promise<Collection>;
  getAllCollections(ownerId: string): Promise<Collection[] | undefined>;
  deleteCollection(
    collectionId: string,
    ownerId: string,
  ): Promise<{ id: string }>;
  getAllChildCollections(
    parentId: string | null,
    ownerId: string,
  ): Promise<Collection[] | undefined>;
  getCollectionsCount(
    owner_id: string,
    collection_id: string | null,
  ): Promise<number>;
  verifyPassword(
    collection_id: string | null,
    owner_id: string,
    password: string,
  ): Promise<boolean>;
}
