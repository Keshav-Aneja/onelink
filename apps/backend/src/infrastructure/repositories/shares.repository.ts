import type { Share, ShareInsert, ShareUpdate } from "@onelink/entities/models";
import type { ISharesRepository } from "../../application/repositories/shares.repository.interface";
import db from "@onelink/db";
import { DatabaseOperationError } from "@onelink/entities/errros";

export class SharesRepository implements ISharesRepository {
  async shareCollection(data: ShareInsert): Promise<Share> {
    const [shares] = await db("shares").insert(data).returning("*");
    if (!shares) {
      throw new DatabaseOperationError("Failed to share collection");
    }
    return shares;
  }
  async getMySharedCollections(owner_id: string): Promise<Share[] | undefined> {
    const shares = await db("shares")
      .where({ shared_with: owner_id })
      .select("*");
    return shares;
  }
  async updateShare(share_id: string, data: ShareUpdate): Promise<Share> {
    const [shares] = await db("shares")
      .where({ id: share_id })
      .update(data)
      .returning("*");
    if (!shares) {
      throw new DatabaseOperationError("Cannot updated shared collection");
    }
    return shares;
  }
  async deleteShare(share_id: string, owner_id: string): Promise<string> {
    const [shares] = await db("shares")
      .where({ id: share_id, shared_by: owner_id })
      .delete()
      .returning("*");
    if (!shares?.id) {
      throw new DatabaseOperationError("Cannot remove shared access");
    }
    return shares.id;
  }
}
