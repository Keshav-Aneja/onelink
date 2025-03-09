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
}
