import {
  CollectionSchema,
  type Collection,
  type CollectionInsert,
} from "@onelink/entities/models";
import type { ICollectionsService } from "../../application/services/collections.interface";
import { CollectionRepository } from "../repositories/collections.repository";
import { DatabaseOperationError } from "@onelink/entities/errros";
import { CollectionDTO } from "../dtos/collections.dto";
import crypto from "node:crypto";
import logger from "../../helpers/logger";
export default class CollectionsService implements ICollectionsService {
  constructor(private collectionRepository = new CollectionRepository()) {}

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
      const hash = crypto
        .createHash("sha256")
        .update(data.password)
        .digest("hex");
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

    const deletedCollection = await this.collectionRepository.deleteCollection(
      data.id,
      data.owner_id,
    );
    if (!deletedCollection) {
      throw new DatabaseOperationError("Cannot delete collection");
    }
    return { id: deletedCollection };
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
    if (collection && password) {
      const verifyHash = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
      console.log(verifyHash);
      console.log("_______");
      console.log(collection.password);
      return verifyHash === collection.password;
    }
    return false;
  }
}
