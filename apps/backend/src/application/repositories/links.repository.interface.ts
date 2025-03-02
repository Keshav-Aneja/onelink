import type { Link } from "@onelink/entities/models";

export interface ILinkRepository {
  createLink(data: Link): Promise<Link>;
  getLinkById(link_id: string, owner_id: string): Promise<Link | undefined>;
  getAllLinksOfCollection(
    parent_id: string,
    owner_id: string,
  ): Promise<Link[] | undefined>;
  getAllLinks(owner_id: string): Promise<Link[] | undefined>;
  deleteLink(link_id: string, owner_id: string): Promise<string>;
}
