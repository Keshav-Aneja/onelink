import {
  LinkSchema,
  RSSInputSchema,
  type Link,
  type LinkInsert,
  type LinkUpdate,
} from "@onelink/entities/models";
import type { SearchFilters } from "../search/link-search-query.builder";
import type ILinksService from "../../application/services/links.interface";
import { LinksRepository } from "../repositories/links.repository";
import { TagsRepository } from "../repositories/tags.repository";
import { LinkDTO } from "../dtos/links.dto";
import {
  AuthenticationError,
  DatabaseOperationError,
} from "@onelink/entities/errros";
import { Scraper, type WebsiteMetadata, deriveTags } from "@onelink/scraper";
import { RSS, type RSSFeed } from "@onelink/scraper/rss";
import { RSSDTO } from "../dtos/rss.dto";
import { RssSubscriptionsRepository } from "../repositories/rss-subscriptions.repository";
import RssDiscoveryService from "./rss-discovery.service";

const getLinkSchema = LinkSchema.pick({ owner_id: true, parent_id: true });
const createLinkSchema = LinkSchema.omit({ id: true, tags: true });
const deleteLinkSchema = LinkSchema.pick({ id: true, owner_id: true });

export default class LinkService implements ILinksService {
  constructor(
    private readonly linkRepository = new LinksRepository(),
    private readonly tagsRepository = new TagsRepository(),
    private readonly rssSubsRepo = new RssSubscriptionsRepository(),
  ) {}

  async getAllChildLinks(
    parentId: string | null,
    ownerId: string,
    requestQuery: Record<string, any>,
  ): Promise<Link[] | undefined> {
    const data = getLinkSchema.parse({ parent_id: parentId, owner_id: ownerId });
    const links = await this.linkRepository.getAllLinksOfCollection(
      data.parent_id,
      data.owner_id,
      requestQuery,
    );
    if (!links) return undefined;

    const linkIds = links.map((l) => l.id);
    const allTags = await this.tagsRepository.getTagsForLinks(linkIds);
    const tagsByLink = new Map<string, typeof allTags>();
    for (const tag of allTags) {
      const arr = tagsByLink.get(tag.link_id) ?? [];
      arr.push(tag);
      tagsByLink.set(tag.link_id, arr);
    }

    return links.map((link) => {
      const obj = LinkDTO.fromObject(link).toObject();
      obj.tags = tagsByLink.get(link.id) ?? [];
      return obj;
    });
  }

  async createLink(link: LinkInsert): Promise<Link> {
    const scraper = new Scraper(link.link);
    const { tags: userTags, ...linkData } = link;
    const data = createLinkSchema.parse(linkData);
    const content = await scraper.scrape();
    let metadata = {} as WebsiteMetadata;
    if (content) {
      metadata = await scraper.extractMetadata(content);
    }
    const newLink = await this.linkRepository.createLink(
      LinkDTO.toDB(data, metadata),
    );
    if (!newLink) {
      throw new DatabaseOperationError("Cannot create link");
    }

    // If user provided tags, use those (confirmed=true); otherwise auto-derive
    const confirmedTags: string[] = userTags && userTags.length > 0 ? userTags : [];
    const autoTags: string[] =
      userTags && userTags.length > 0 ? [] : deriveTags(metadata, link.link);

    const [confirmedTagRows, autoTagRows] = await Promise.all([
      confirmedTags.length > 0
        ? this.tagsRepository.upsertTagsForLink(
            newLink.id,
            data.owner_id,
            confirmedTags,
            true,
          )
        : Promise.resolve([]),
      autoTags.length > 0
        ? this.tagsRepository.upsertTagsForLink(
            newLink.id,
            data.owner_id,
            autoTags,
            false,
          )
        : Promise.resolve([]),
    ]);

    const linkDTO = LinkDTO.fromObject(newLink);
    const result = linkDTO.toObject();
    result.tags = [...confirmedTagRows, ...autoTagRows];
    return result;
  }
  async deleteLink(ownerId: string, linkId: string): Promise<{ id: string }> {
    const data = deleteLinkSchema.parse({ owner_id: ownerId, id: linkId });
    const id = await this.linkRepository.deleteLink(data.id, data.owner_id);
    return { id };
  }
  async findRSSFeedLink(link: string): Promise<string | undefined> {
    return RssDiscoveryService.findRSSFeedLink(link);
  }
  async getRSSFeed(
    owner_id: string,
    sinceDays?: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<RSSFeed[] | undefined> {
    const parsed = RSSInputSchema.parse({
      owner_id,
      sinceDays,
      startDate,
      endDate,
    });
    const rssLinks = await this.linkRepository.getRSSLinks(parsed.owner_id);

    if (!rssLinks) {
      return undefined;
    }

    const rssPromises = rssLinks.map(async (link) => {
      const rss = new RSS(link.link, link.rss);
      return rss.scrapeRSS(parsed.sinceDays, parsed.startDate, parsed.endDate);
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
    if (parsedData.subscribed === true) {
      const existingLink = await this.linkRepository.getLinkById(id, ownerId);
      if (existingLink && !existingLink.rss) {
        const feedUrl = await RssDiscoveryService.findRSSFeedLink(existingLink.link);
        if (feedUrl) {
          parsedData["rss"] = feedUrl;
        }
      }
      // Ensure an rss_subscriptions row exists for this link
      if (existingLink) {
        const feedUrl = (parsedData["rss"] as string | undefined) || existingLink.rss;
        if (feedUrl) {
          const existing = await this.rssSubsRepo.getByFeedUrl(owner_id, feedUrl);
          if (!existing) {
            await this.rssSubsRepo.create({
              owner_id,
              feed_url: feedUrl,
              site_url: existingLink.link,
              link_id: id,
            });
          }
        }
      }
    }
    const link = await this.linkRepository.updateLink(
      owner_id,
      id,
      parsedData as Partial<LinkUpdate>,
    );
    return LinkDTO.fromObject(link).toObject();
  }

  async getStarredLinks(owner_id: string): Promise<Link[] | undefined> {
    const links = await this.linkRepository.getStarredLinks(owner_id);
    return links?.map((link) => LinkDTO.fromObject(link).toObject());
  }

  async getLinksCount(
    owner_id: string,
    parent_id: string | null,
  ): Promise<number> {
    const linksCount = await this.linkRepository.getLinksCountByCollection(
      owner_id,
      parent_id,
    );
    return linksCount;
  }

  async searchLinks(owner_id: string, search_query: string, filters?: SearchFilters): Promise<Link[] | undefined> {
    const links = await this.linkRepository.getSearchLinks(owner_id, search_query, filters);
    if (!links) return undefined;

    const linkIds = links.map((l) => l.id);
    const allTags = await this.tagsRepository.getTagsForLinks(linkIds);
    const tagsByLink = new Map<string, typeof allTags>();
    for (const tag of allTags) {
      const arr = tagsByLink.get(tag.link_id) ?? [];
      arr.push(tag);
      tagsByLink.set(tag.link_id, arr);
    }

    return links.map((link) => {
      const obj = LinkDTO.fromObject(link).toObject();
      obj.tags = tagsByLink.get(link.id) ?? [];
      return obj;
    });
  }
}
