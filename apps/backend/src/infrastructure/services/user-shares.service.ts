import { ShareType } from "@onelink/entities";
import type { Share, ShareInsert } from "@onelink/entities/models";
import { RequestError } from "@onelink/entities/errros";
import { SharesRepository } from "../repositories/shares.repository";
import { CollectionRepository } from "../repositories/collections.repository";
import { UsersRepository } from "../repositories/users.repository";
import db from "@onelink/db";

type InviteeInfo = {
  share_id: string;
  email: string;
  name: string | null;
  profile_url: string | null;
  share_type: string;
};

type SharedCollectionItem = {
  collection: {
    id: string;
    name: string;
    color: string;
    description: string | null;
  };
  share_id: string;
  share_type: string;
  shared_by_email: string;
};

export class UserSharesService {
  constructor(
    private sharesRepo = new SharesRepository(),
    private collectionsRepo = new CollectionRepository(),
    private usersRepo = new UsersRepository(),
  ) {}

  async inviteByEmail(
    owner_id: string,
    collection_id: string,
    email: string,
    share_type: ShareType,
  ): Promise<Share> {
    const collection = await this.collectionsRepo.getCollectionById(collection_id, owner_id);
    if (!collection) throw new RequestError("Collection not found or access denied", 403);

    const owner = await this.usersRepo.getUser(owner_id as any);
    if (owner?.email === email) throw new RequestError("You cannot invite yourself", 400);

    const invitee = await this.usersRepo.findByEmail(email);
    if (!invitee) {
      throw new RequestError("No Onelink account with this email. They need to sign up first.", 404);
    }

    const existing = await this.sharesRepo.findByCollectionAndUser(collection_id, invitee.id);
    if (existing) throw new RequestError("This user already has access", 409);

    const data: ShareInsert = {
      collection_id,
      shared_with: invitee.id,
      shared_by: owner_id,
      share_type,
    };
    return this.sharesRepo.shareCollection(data);
  }

  async removeInvite(share_id: string, owner_id: string): Promise<string> {
    return this.sharesRepo.deleteShare(share_id, owner_id);
  }

  async listInvitees(collection_id: string, owner_id: string): Promise<InviteeInfo[]> {
    const collection = await this.collectionsRepo.getCollectionById(collection_id, owner_id);
    if (!collection) throw new RequestError("Collection not found or access denied", 403);

    const shares = await this.sharesRepo.getCollectionInvitees(collection_id);
    const results: InviteeInfo[] = await Promise.all(
      shares.map(async (share) => {
        const user = await this.usersRepo.getUser(share.shared_with as any);
        return {
          share_id: share.id,
          email: user?.email ?? "",
          name: user?.name ?? null,
          profile_url: user?.profile_url ?? null,
          share_type: share.share_type,
        };
      }),
    );
    return results;
  }

  async updateDepth(collection_id: string, owner_id: string, share_type: ShareType): Promise<void> {
    const collection = await this.collectionsRepo.getCollectionById(collection_id, owner_id);
    if (!collection) throw new RequestError("Collection not found or access denied", 403);
    await this.sharesRepo.updateCollectionShareType(collection_id, owner_id, share_type);
  }

  async viewSharedCollection(user_id: string, collection_id: string) {
    const share = await this.sharesRepo.findByCollectionAndUser(collection_id, user_id);
    if (!share) throw new RequestError("You do not have access to this collection", 403);

    const [collection] = await db("collections").where({ id: collection_id }).select("*");
    if (!collection) throw new RequestError("Collection not found", 404);

    const owner = await this.usersRepo.getUser(share.shared_by as any);
    const links = await db("links").where({ parent_id: collection_id }).select("*");

    const safeCollection = {
      id: collection.id,
      name: collection.name,
      color: collection.color,
      description: collection.description,
    };

    if (share.share_type === ShareType.Shallow) {
      return {
        share_type: "SHALLOW",
        collection: safeCollection,
        links,
        children: [],
        shared_by_email: owner?.email ?? "",
      };
    }

    const children = await this.loadChildrenRecursive(collection_id);
    return {
      share_type: "DEEP",
      collection: safeCollection,
      links,
      children,
      shared_by_email: owner?.email ?? "",
    };
  }

  private async loadChildrenRecursive(parent_id: string): Promise<any[]> {
    const subs = await db("collections").where({ parent_id }).select("*");
    return Promise.all(
      subs.map(async (col: any) => ({
        collection: { id: col.id, name: col.name, color: col.color, description: col.description },
        links: await db("links").where({ parent_id: col.id }).select("*"),
        children: await this.loadChildrenRecursive(col.id),
      })),
    );
  }

  async sharedWithMe(user_id: string): Promise<SharedCollectionItem[]> {
    const shares = await this.sharesRepo.getSharedWithMe(user_id);
    const results: SharedCollectionItem[] = await Promise.all(
      shares.map(async (share) => {
        const [collection] = await db("collections").where({ id: share.collection_id }).select("*");
        const owner = await this.usersRepo.getUser(share.shared_by as any);
        return {
          collection: {
            id: collection?.id ?? share.collection_id,
            name: collection?.name ?? "",
            color: collection?.color ?? "",
            description: collection?.description ?? null,
          },
          share_id: share.id,
          share_type: share.share_type,
          shared_by_email: owner?.email ?? "",
        };
      }),
    );
    return results;
  }
}
