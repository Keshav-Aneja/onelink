import type { Share, ShareUpdate } from "@onelink/entities/models";

export interface ISharesRepository {
  shareCollection(data: Share): Promise<Share>;
  updateShare(share_id: string, data: ShareUpdate): Promise<Share>;
  getMySharedCollections(owner_id: string): Promise<Share[] | undefined>;
  deleteShare(share_id: string, owner_id: string): Promise<string>;
}
