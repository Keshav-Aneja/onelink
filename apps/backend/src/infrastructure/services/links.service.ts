import {
  LinkSchema,
  RSSInputSchema,
  type Link,
  type LinkInsert,
} from "@onelink/entities/models";
import type ILinksService from "../../application/services/links.interface";
import { LinksRepository } from "../repositories/links.repository";
import { LinkDTO } from "../dtos/links.dto";
import { DatabaseOperationError } from "@onelink/entities/errros";
import { Scraper } from "@onelink/scraper";
import { RSS, type RSSFeed } from "@onelink/scraper/rss";
import { RSSDTO } from "../dtos/rss.dto";
export default class LinkService implements ILinksService {
  constructor(private readonly linkRepository = new LinksRepository()) {}

  async getAllChildLinks(
    parentId: string | null,
    ownerId: string,
  ): Promise<Link[] | undefined> {
    const getLinkSchema = LinkSchema.pick({
      owner_id: true,
      parent_id: true,
    });
    const data = getLinkSchema.parse({
      parent_id: parentId,
      owner_id: ownerId,
    });
    const links = await this.linkRepository.getAllLinksOfCollection(
      data.parent_id,
      data.owner_id,
    );

    if (!links) return undefined;

    return links.map((link) => LinkDTO.fromObject(link).toObject());
  }

  async createLink(link: LinkInsert): Promise<Link> {
    const scraper = new Scraper(link.link);
    const data = LinkSchema.omit({ id: true }).parse(link);
    const content = await scraper.scrape();
    const metadata = await scraper.extractMetadata(content);
    let rssLink = "";
    if (!metadata.rssLink || metadata.rssLink.length == 0) {
      const rss = new RSS(data.link);
      metadata.rssLink = await rss.findValidRSS();
    }
    const newLink = await this.linkRepository.createLink(
      LinkDTO.toDB(data, metadata),
    );
    if (!newLink) {
      throw new DatabaseOperationError("Cannot create link");
    }
    const linkDTO = LinkDTO.fromObject(newLink);
    return linkDTO.toObject();
  }
  async getRSSFeed(
    sinceDays: number,
    owner_id: string,
  ): Promise<RSSFeed[] | undefined> {
    const parsed = RSSInputSchema.parse({ owner_id, sinceDays });
    const rssLinks = await this.linkRepository.getRSSLinks(parsed.owner_id);

    if (!rssLinks) {
      return undefined;
    }

    const rssPromises = rssLinks.map(async (link) => {
      const rss = new RSS(link.link, link.rss);
      return rss.scrapeRSS(parsed.sinceDays);
    });

    const results = await Promise.allSettled(rssPromises);

    const rssData: RSSFeed[] = results
      .filter((result) => result.status === "fulfilled" && result.value)
      .flatMap((result) => (result as PromiseFulfilledResult<RSSFeed[]>).value);

    return rssData.map((rss) => RSSDTO.fromObject(rss).toObject());
  }
}
