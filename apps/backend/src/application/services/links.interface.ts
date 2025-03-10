import type { Link, LinkInsert } from "@onelink/entities/models";
import type { RSSFeed } from "@onelink/scraper/rss";
export default interface ILinksService {
  getAllChildLinks(
    parent_id: string | null,
    owner_id: string,
  ): Promise<Link[] | undefined>;
  createLink(link: LinkInsert): Promise<Link>;
  getRSSFeed(
    sinceDays: number,
    owner_id: string,
  ): Promise<RSSFeed[] | undefined>;
}
