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

const ownerIdSchema = CollectionSchema.shape.owner_id;
const createCollectionSchema = CollectionSchema.omit({ id: true });
const deleteCollectionSchema = CollectionSchema.pick({ owner_id: true, id: true });
const getChildCollectionsSchema = CollectionSchema.pick({ parent_id: true, owner_id: true });
const getCollectionsCountSchema = CollectionSchema.pick({ owner_id: true, parent_id: true });
const verifyPasswordSchema = CollectionSchema.pick({ id: true, owner_id: true });

export default class CollectionsService implements ICollectionsService {
  constructor(
    private readonly collectionRepository = new CollectionRepository(),
    private readonly linksRepository = new LinksRepository(),
  ) {}

  async getAllCollections(ownerId: string): Promise<Collection[] | undefined> {
    const owner_id = ownerIdSchema.parse(ownerId);
    return this.collectionRepository.getAllCollections(owner_id);
  }

  async createCollection(collection: CollectionInsert): Promise<Collection> {
    const data = createCollectionSchema.parse(collection);
    if (data.is_protected && data.password) {
      data["password"] = await bcrypt.hash(data.password, 12);
    } else {
      data.is_protected = false;
      delete data["password"];
    }
    const newCollection = await this.collectionRepository.createCollection(CollectionDTO.toDB(data));
    if (!newCollection) {
      throw new DatabaseOperationError("Cannot create collection");
    }
    return CollectionDTO.fromObject(newCollection).toObject();
  }

  async deleteCollection(collectionId: string, ownerId: string): Promise<{ id: string }> {
    const data = deleteCollectionSchema.parse({ owner_id: ownerId, id: collectionId });
    const allIds = await this.collectionRepository.getAllDescendantIds(data.id, data.owner_id);
    await this.linksRepository.deleteLinksByParentIds(allIds, data.owner_id);
    await this.collectionRepository.deleteCollectionsByIds(allIds, data.owner_id);
    return { id: data.id };
  }

  async getAllChildCollections(parentId: string | null, ownerId: string): Promise<Collection[] | undefined> {
    const data = getChildCollectionsSchema.parse({ parent_id: parentId, owner_id: ownerId });
    const collections = await this.collectionRepository.getAllCollectionsOfCollection(data.parent_id, data.owner_id);
    if (!collections) return undefined;
    return collections.map((c) => CollectionDTO.fromObject(c).toObject());
  }

  async getCollectionsCount(owner_id: string, collection_id: string | null): Promise<number> {
    const data = getCollectionsCountSchema.parse({ owner_id, parent_id: collection_id });
    return this.collectionRepository.getChildCollectionsCount(data.parent_id, data.owner_id);
  }

  async verifyPassword(collection_id: string | null, owner_id: string, password: string): Promise<boolean> {
    const data = verifyPasswordSchema.parse({ id: collection_id, owner_id });
    const collection = await this.collectionRepository.getCollectionById(data.id, data.owner_id);
    if (collection && password && collection.password) {
      return bcrypt.compare(password, collection.password);
    }
    return false;
  }
}
