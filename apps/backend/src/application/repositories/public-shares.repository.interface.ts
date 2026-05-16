import type { PublicShare, PublicShareInsert, PublicShareUpdate } from "@onelink/entities/models";

export interface IPublicSharesRepository {
  create(data: PublicShareInsert): Promise<PublicShare>;
  findByToken(token: string): Promise<PublicShare | undefined>;
  findByCollectionId(collection_id: string): Promise<PublicShare | undefined>;
  update(id: string, owner_id: string, data: PublicShareUpdate): Promise<PublicShare>;
  delete(id: string, owner_id: string): Promise<void>;
}
