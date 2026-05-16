import type { PublicShare, PublicShareInsert, PublicShareUpdate } from "@onelink/entities/models";
import type { IPublicSharesRepository } from "../../application/repositories/public-shares.repository.interface";
import db from "@onelink/db";
import { DatabaseOperationError } from "@onelink/entities/errros";

export class PublicSharesRepository implements IPublicSharesRepository {
  async create(data: PublicShareInsert): Promise<PublicShare> {
    const [row] = await db("public_shares").insert(data).returning("*");
    if (!row) throw new DatabaseOperationError("Failed to create public share");
    return row;
  }

  async findByToken(token: string): Promise<PublicShare | undefined> {
    return db("public_shares").where({ token, is_active: true }).first();
  }

  async findByCollectionId(collection_id: string): Promise<PublicShare | undefined> {
    return db("public_shares").where({ collection_id }).first();
  }

  async update(id: string, owner_id: string, data: PublicShareUpdate): Promise<PublicShare> {
    const [row] = await db("public_shares")
      .where({ id, owner_id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning("*");
    if (!row) throw new DatabaseOperationError("Share not found or access denied");
    return row;
  }

  async delete(id: string, owner_id: string): Promise<void> {
    const count = await db("public_shares").where({ id, owner_id }).delete();
    if (count === 0) throw new DatabaseOperationError("Share not found");
  }
}
