import type { Link, LinkInsert, LinkUpdate } from "@onelink/entities/models";
import type { SearchFilters } from "../../infrastructure/search/link-search-query.builder";
import type { GetLinksQuery } from "../../helpers/format-query";

export interface ILinkRepository {
  createLink(data: LinkInsert): Promise<Link>;
  getLinkById(link_id: string, owner_id: string): Promise<Link | undefined>;
  getAllLinksOfCollection(
    parent_id: string | null,
    owner_id: string,
    requestQuery: GetLinksQuery,
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
  getSearchLinks(owner_id: string, search_query: string, filters?: SearchFilters): Promise<Link[] | undefined>;
  deleteLinksByParentIds(parent_ids: string[], owner_id: string): Promise<void>;
  getLinksByParentId(parent_id: string): Promise<Link[]>;
  getLinksByParentIds(parent_ids: string[]): Promise<Link[]>;
}
