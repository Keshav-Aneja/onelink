import {
  LinkSchema,
  RSSInputSchema,
  type Link,
  type LinkInsert,
  type LinkUpdate,
} from "@onelink/entities/models";
import type ILinksService from "../../application/services/links.interface";
import { LinksRepository } from "../repositories/links.repository";
import { LinkDTO } from "../dtos/links.dto";
import {
  AuthenticationError,
  DatabaseOperationError,
} from "@onelink/entities/errros";
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
    console.log("WE ARE HERE");
    const data = LinkSchema.omit({ id: true }).parse(link);
    console.log("WE ARE NOT HERE");
    const content = await scraper.scrape();
    const metadata = await scraper.extractMetadata(content);
    // if (!metadata.rssLink || metadata.rssLink.length == 0) {
    //   const rss = new RSS(data.link);
    //   metadata.rssLink = await rss.findValidRSS();
    // }
    const newLink = await this.linkRepository.createLink(
      LinkDTO.toDB(data, metadata),
    );
    if (!newLink) {
      throw new DatabaseOperationError("Cannot create link");
    }
    const linkDTO = LinkDTO.fromObject(newLink);
    return linkDTO.toObject();
  }
  async findRSSFeedLink(link: string): Promise<string | undefined> {
    const scraper = new Scraper(link);
    const content = await scraper.scrape();
    const metadata = await scraper.extractMetadata(content);
    if (metadata.rssLink) {
      return metadata.rssLink;
    } else if (metadata.atomLink) {
      return metadata.atomLink;
    } else {
      const rss = new RSS(link);
      metadata.rssLink = await rss.findValidRSS();
    }
    return metadata.rssLink;
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
      .flatMap((result) => (result as PromiseFulfilledResult<RSSFeed[]>).value)
      .sort((a, b) => {
        if (!a.published_date) return -1;
        if (!b.published_date) return 1;

        const dateA = new Date(a.published_date).getTime();
        const dateB = new Date(b.published_date).getTime();

        return dateB - dateA;
      });

    return rssData.map((rss) => RSSDTO.fromObject(rss).toObject());
  }
  async updateLink(
    ownerId: string,
    linkId: string,
    data: Partial<LinkUpdate>,
  ): Promise<Link> {
    const parsed = LinkSchema.partial().parse({
      ...data,
      owner_id: ownerId,
      id: linkId,
    });
    const { owner_id, id, ...parsedData } = parsed;
    if (!owner_id || !id) {
      throw new AuthenticationError("Invalid owner or link id");
    }
    const link = await this.linkRepository.updateLink(
      owner_id,
      id,
      parsedData as Partial<LinkUpdate>,
    );
    return LinkDTO.fromObject(link).toObject();
  }
}
