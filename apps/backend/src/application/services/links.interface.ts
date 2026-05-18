import type { Link, LinkInsert, LinkUpdate } from "@onelink/entities/models";
import type { RSSFeed } from "@onelink/scraper/rss";
import type { SearchFilters } from "../../infrastructure/search/link-search-query.builder";
import type { GetLinksQuery } from "../../helpers/format-query";
export default interface ILinksService {
  getAllChildLinks(
    parent_id: string | null,
    owner_id: string,
    requestQuery: GetLinksQuery,
  ): Promise<Link[] | undefined>;
  createLink(link: LinkInsert): Promise<Link>;
  getRSSFeed(
    owner_id: string,
    sinceDays?: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<RSSFeed[] | undefined>;
  updateLink(
    ownerId: string,
    linkId: string,
    data: Partial<LinkUpdate>,
  ): Promise<Link>;
  deleteLink(ownerId: string, linkId: string): Promise<{ id: string }>;
  findRSSFeedLink(link: string): Promise<string | undefined>;
  getStarredLinks(owner_id: string): Promise<Link[] | undefined>;
  getLinksCount(owner_id: string, parent_id: string): Promise<number>;
  searchLinks(owner_id: string, search_query: string, filters?: SearchFilters): Promise<Link[] | undefined>;
}
