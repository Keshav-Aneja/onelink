import {
  CollectionSchema,
  type Collection,
  type CollectionInsert,
} from "@onelink/entities/models";
import type { ICollectionsService } from "../../application/services/collections.interface";
import { CollectionRepository } from "../repositories/collections.repository";
import { DatabaseOperationError } from "@onelink/entities/errros";
import { CollectionDTO } from "../dtos/collections.dto";
import bcrypt from "bcryptjs";
import logger from "../../helpers/logger";
import { LinksRepository } from "../repositories/links.repository";
export default class CollectionsService implements ICollectionsService {
  constructor(
    private readonly collectionRepository = new CollectionRepository(),
    private readonly linksRepository = new LinksRepository(),
  ) {}

  async getAllCollections(ownerId: string): Promise<Collection[] | undefined> {
    const ownerIdSchema = CollectionSchema.shape.owner_id;
    const owner_id = ownerIdSchema.parse(ownerId);
    const collections =
      await this.collectionRepository.getAllCollections(owner_id);
    return collections;

    //TODO:  In the response layer, in the error part handle the logic for zod Validation errors also
    // if(error instance of z.ZodError){
    //     error:error.errors
    // }
  }

  async createCollection(collection: CollectionInsert): Promise<Collection> {
    const data = CollectionSchema.omit({ id: true }).parse(collection);
    if (data.is_protected && data.password) {
      const hash = await bcrypt.hash(data.password, 12);
      data["password"] = hash;
    } else {
      data.is_protected = false;
      delete data["password"];
    }
    const newCollection = await this.collectionRepository.createCollection(
      CollectionDTO.toDB(data),
    );
    if (!newCollection) {
      throw new DatabaseOperationError("Cannot create collection");
    }
    const collectionDTO = CollectionDTO.fromObject(newCollection);
    return collectionDTO.toObject();
  }

  async deleteCollection(
    collectionId: string,
    ownerId: string,
  ): Promise<{ id: string }> {
    const deleteCollectionSchema = CollectionSchema.pick({
      owner_id: true,
      id: true,
    });
    const data = deleteCollectionSchema.parse({
      owner_id: ownerId,
      id: collectionId,
    });

    // Fetch all descendant IDs in one recursive CTE query, then batch delete
    const allIds = await this.collectionRepository.getAllDescendantIds(
      data.id,
      data.owner_id,
    );

    await this.linksRepository.deleteLinksByParentIds(allIds, data.owner_id);

    // Batch delete all collections (children first via FK, so delete all at once)
    await this.collectionRepository.deleteCollectionsByIds(allIds, data.owner_id);

    return { id: data.id };
  }

  async getAllChildCollections(
    parentId: string | null,
    ownerId: string,
  ): Promise<Collection[] | undefined> {
    const getCollectionSchema = CollectionSchema.pick({
      parent_id: true,
      owner_id: true,
    });
    const data = getCollectionSchema.parse({
      parent_id: parentId,
      owner_id: ownerId,
    });
    const collections =
      await this.collectionRepository.getAllCollectionsOfCollection(
        data.parent_id,
        data.owner_id,
      );
    if (!collections) return undefined;

    return collections.map((collection) =>
      CollectionDTO.fromObject(collection).toObject(),
    );
  }

  async getCollectionsCount(
    owner_id: string,
    collection_id: string | null,
  ): Promise<number> {
    const getCollectionStatsSchema = CollectionSchema.pick({
      owner_id: true,
      parent_id: true,
    });
    const data = getCollectionStatsSchema.parse({
      owner_id,
      parent_id: collection_id,
    });

    const collections =
      await this.collectionRepository.getChildCollectionsCount(
        data.parent_id,
        data.owner_id,
      );
    return collections;
  }

  async verifyPassword(
    collection_id: string | null,
    owner_id: string,
    password: string,
  ): Promise<boolean> {
    const getCollectionStatsSchema = CollectionSchema.pick({
      id: true,
      owner_id: true,
    });
    const data = getCollectionStatsSchema.parse({
      id: collection_id,
      owner_id,
    });

    const collection = await this.collectionRepository.getCollectionById(
      data.id,
      data.owner_id,
    );
    if (collection && password && collection.password) {
      return bcrypt.compare(password, collection.password);
    }
    return false;
  }
}
