import type { Link, LinkInsert } from "@onelink/entities/models";

export interface ILinkRepository {
  createLink(data: LinkInsert): Promise<Link>;
  getLinkById(link_id: string, owner_id: string): Promise<Link | undefined>;
  getAllLinksOfCollection(
    parent_id: string | null,
    owner_id: string,
  ): Promise<Link[] | undefined>;
  getAllLinks(owner_id: string): Promise<Link[] | undefined>;
  deleteLink(link_id: string, owner_id: string): Promise<string>;
  getRSSLinks(
    owner_id: string,
  ): Promise<Array<Pick<Link, "rss" | "link">> | undefined>;
}
