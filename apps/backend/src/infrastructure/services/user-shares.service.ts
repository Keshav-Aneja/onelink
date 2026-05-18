import { ShareType } from "@onelink/entities";
import type { Share, ShareInsert } from "@onelink/entities/models";
import { RequestError } from "@onelink/entities/errros";
import { SharesRepository } from "../repositories/shares.repository";
import { CollectionRepository } from "../repositories/collections.repository";
import { UsersRepository } from "../repositories/users.repository";
import { LinksRepository } from "../repositories/links.repository";

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

type CollectionNode = {
  collection: { id: string; name: string; color: string; description: string | null | undefined };
  links: unknown[];
  children: CollectionNode[];
};

export class UserSharesService {
  constructor(
    private readonly sharesRepo = new SharesRepository(),
    private readonly collectionsRepo = new CollectionRepository(),
    private readonly usersRepo = new UsersRepository(),
    private readonly linksRepo = new LinksRepository(),
  ) {}

  async inviteByEmail(
    owner_id: string,
    collection_id: string,
    email: string,
    share_type: ShareType,
  ): Promise<Share> {
    const collection = await this.collectionsRepo.getCollectionById(collection_id, owner_id);
    if (!collection) throw new RequestError("Collection not found or access denied", 403);

    const owner = await this.usersRepo.getUser(owner_id);
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
        const user = await this.usersRepo.getUser(share.shared_with);
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

    const [collection, owner, rootLinks] = await Promise.all([
      this.collectionsRepo.getCollectionById(collection_id, share.shared_by),
      this.usersRepo.getUser(share.shared_by),
      this.linksRepo.getLinksByParentId(collection_id),
    ]);
    if (!collection) throw new RequestError("Collection not found", 404);

    const safeCollection = {
      id: collection.id,
      name: collection.name,
      color: collection.color,
      description: collection.description,
    };

    if (share.share_type === ShareType.Shallow) {
      return { share_type: "SHALLOW", collection: safeCollection, links: rootLinks, children: [], shared_by_email: owner?.email ?? "" };
    }

    const allDescendants = await this.collectionsRepo.getAllDescendants(collection_id, share.shared_by);
    const descendantIds = allDescendants.map((c) => c.id);
    const allLinks = descendantIds.length > 0 ? await this.linksRepo.getLinksByParentIds(descendantIds) : [];

    const linksByParent = new Map<string, typeof allLinks>();
    for (const link of allLinks) {
      const arr = linksByParent.get(link.parent_id!) ?? [];
      arr.push(link);
      linksByParent.set(link.parent_id!, arr);
    }

    const childrenByParent = new Map<string, typeof allDescendants>();
    for (const col of allDescendants) {
      const arr = childrenByParent.get(col.parent_id!) ?? [];
      arr.push(col);
      childrenByParent.set(col.parent_id!, arr);
    }

    const buildNode = (col: (typeof allDescendants)[0]): CollectionNode => ({
      collection: { id: col.id, name: col.name, color: col.color, description: col.description },
      links: linksByParent.get(col.id) ?? [],
      children: (childrenByParent.get(col.id) ?? []).map(buildNode),
    });

    const children = (childrenByParent.get(collection_id) ?? []).map(buildNode);
    return { share_type: "DEEP", collection: safeCollection, links: rootLinks, children, shared_by_email: owner?.email ?? "" };
  }

  async sharedWithMe(user_id: string): Promise<SharedCollectionItem[]> {
    const shares = await this.sharesRepo.getSharedWithMe(user_id);
    if (shares.length === 0) return [];

    const collectionIds = [...new Set(shares.map((s) => s.collection_id))];
    const ownerIds = [...new Set(shares.map((s) => s.shared_by))];

    const [collections, owners] = await Promise.all([
      Promise.all(collectionIds.map((id) => this.collectionsRepo.getCollectionByIdOnly(id))),
      Promise.all(ownerIds.map((id) => this.usersRepo.getUser(id))),
    ]);

    const collectionById = new Map(collections.filter(Boolean).map((c) => [c!.id, c!]));
    const ownerById = new Map(owners.filter(Boolean).map((o) => [o!.id, o!]));

    return shares.map((share) => {
      const collection = collectionById.get(share.collection_id);
      const owner = ownerById.get(share.shared_by);
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
    });
  }
}
