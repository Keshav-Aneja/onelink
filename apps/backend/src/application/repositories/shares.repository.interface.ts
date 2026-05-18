import type { Share, ShareInsert, ShareUpdate } from "@onelink/entities/models";
import { ShareType } from "@onelink/entities";

export interface ISharesRepository {
  shareCollection(data: ShareInsert): Promise<Share>;
  updateShare(share_id: string, data: ShareUpdate): Promise<Share>;
  getMySharedCollections(owner_id: string): Promise<Share[] | undefined>;
  deleteShare(share_id: string, owner_id: string): Promise<string>;
  findByCollectionAndUser(collection_id: string, user_id: string): Promise<Share | undefined>;
  getCollectionInvitees(collection_id: string): Promise<Share[]>;
  updateCollectionShareType(collection_id: string, owner_id: string, share_type: ShareType): Promise<void>;
  getSharedWithMe(user_id: string): Promise<Share[]>;
}
