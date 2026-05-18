import { ShareType } from "@onelink/entities";
import type { PublicShare, PublicShareInsert, PublicShareUpdate, Collection, Link } from "@onelink/entities/models";
import { RequestError } from "@onelink/entities/errros";
import { PublicSharesRepository } from "../repositories/public-shares.repository";
import { CollectionRepository } from "../repositories/collections.repository";
import { LinksRepository } from "../repositories/links.repository";
import { UsersRepository } from "../repositories/users.repository";

type SafeCollection = Pick<Collection, "id" | "name" | "color" | "description">;

type CollectionNode = {
  collection: SafeCollection;
  links: Link[];
  children: CollectionNode[];
};

type PublicCollectionView = {
  share_type: string;
  collection: SafeCollection;
  links: Link[];
  children: CollectionNode[];
  shared_by_email: string;
};

export class PublicSharesService {
  constructor(
    private readonly publicRepo = new PublicSharesRepository(),
    private readonly collectionsRepo = new CollectionRepository(),
    private readonly linksRepo = new LinksRepository(),
    private readonly usersRepo = new UsersRepository(),
  ) {}

  async createShare(owner_id: string, collection_id: string, share_type: ShareType): Promise<PublicShare> {
    const collection = await this.collectionsRepo.getCollectionById(collection_id, owner_id);
    if (!collection) throw new RequestError("Collection not found or access denied", 403);

    const existing = await this.publicRepo.findByCollectionId(collection_id);
    if (existing) throw new RequestError("A public share already exists for this collection", 409);

    const data: PublicShareInsert = { collection_id, owner_id, share_type };
    return this.publicRepo.create(data);
  }

  async updateShare(id: string, owner_id: string, data: PublicShareUpdate): Promise<PublicShare> {
    return this.publicRepo.update(id, owner_id, data);
  }

  async deleteShare(id: string, owner_id: string): Promise<void> {
    return this.publicRepo.delete(id, owner_id);
  }

  async getForCollection(collection_id: string, owner_id: string): Promise<PublicShare | null> {
    const collection = await this.collectionsRepo.getCollectionById(collection_id, owner_id);
    if (!collection) throw new RequestError("Collection not found or access denied", 403);
    const share = await this.publicRepo.findByCollectionId(collection_id);
    return share ?? null;
  }

  async resolvePublicShare(token: string): Promise<PublicCollectionView> {
    const share = await this.publicRepo.findByToken(token);
    if (!share) throw new RequestError("This link is no longer active", 404);

    const [collection, owner] = await Promise.all([
      this.collectionsRepo.getCollectionById(share.collection_id, share.owner_id),
      this.usersRepo.getUser(share.owner_id),
    ]);
    if (!collection) throw new RequestError("Collection not found", 404);

    const safeCollection: SafeCollection = {
      id: collection.id,
      name: collection.name,
      color: collection.color,
      description: collection.description,
    };
    const shared_by_email = owner?.email ?? "";
    const rootLinks = await this.linksRepo.getLinksByParentId(share.collection_id);

    if (share.share_type === ShareType.Shallow) {
      return { share_type: "SHALLOW", collection: safeCollection, links: rootLinks, children: [], shared_by_email };
    }

    // Fetch ALL descendant collections in a single recursive CTE, then bulk-fetch links
    const allDescendants = await this.collectionsRepo.getAllDescendants(collection.id, share.owner_id);
    const descendantIds = allDescendants.map((c) => c.id);
    const allLinks = descendantIds.length > 0
      ? await this.linksRepo.getLinksByParentIds(descendantIds)
      : [];

    const linksByParent = new Map<string, Link[]>();
    for (const link of allLinks) {
      const arr = linksByParent.get(link.parent_id!) ?? [];
      arr.push(link);
      linksByParent.set(link.parent_id!, arr);
    }

    const childrenByParent = new Map<string, Collection[]>();
    for (const col of allDescendants) {
      const arr = childrenByParent.get(col.parent_id!) ?? [];
      arr.push(col);
      childrenByParent.set(col.parent_id!, arr);
    }

    const buildNode = (col: Collection): CollectionNode => ({
      collection: { id: col.id, name: col.name, color: col.color, description: col.description },
      links: linksByParent.get(col.id) ?? [],
      children: (childrenByParent.get(col.id) ?? []).map(buildNode),
    });

    const children = (childrenByParent.get(collection.id) ?? []).map(buildNode);
    return { share_type: "DEEP", collection: safeCollection, links: rootLinks, children, shared_by_email };
  }
}
