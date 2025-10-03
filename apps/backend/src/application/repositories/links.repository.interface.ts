import type { Link, LinkInsert, LinkUpdate } from "@onelink/entities/models";

export interface ILinkRepository {
  createLink(data: LinkInsert): Promise<Link>;
  getLinkById(link_id: string, owner_id: string): Promise<Link | undefined>;
  getAllLinksOfCollection(
    parent_id: string | null,
    owner_id: string,
    requestQuery: Record<string, any>,
  ): Promise<Link[] | undefined>;
  getAllLinks(owner_id: string): Promise<Link[] | undefined>;
  deleteLink(link_id: string, owner_id: string): Promise<string>;
  getRSSLinks(
    owner_id: string,
  ): Promise<Array<Pick<Link, "rss" | "link">> | undefined>;
  updateLink(
    owner_id: string,
    link_id: string,
    data: Partial<LinkUpdate>,
  ): Promise<Link>;
  getStarredLinks(owner_id: string): Promise<Link[] | undefined>;
  getLinksCountByCollection(
    owner_id: string,
    parent_id: string | null,
  ): Promise<number>;
  getSearchLinks(search_query: string): Promise<Link[] | undefined>;
}
