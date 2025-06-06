import type { Link, LinkInsert, LinkUpdate } from "@onelink/entities/models";
import type { RSSFeed } from "@onelink/scraper/rss";
export default interface ILinksService {
  getAllChildLinks(
    parent_id: string | null,
    owner_id: string,
    requestQuery: Record<string, any>,
  ): Promise<Link[] | undefined>;
  createLink(link: LinkInsert): Promise<Link>;
  getRSSFeed(
    sinceDays: number,
    owner_id: string,
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
}
