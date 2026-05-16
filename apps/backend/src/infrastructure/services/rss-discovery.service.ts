import { RssDiscoveryQueueRepository } from "../repositories/rss-discovery-queue.repository";
import { LinksRepository } from "../repositories/links.repository";
import { Scraper } from "@onelink/scraper";
import { RSS } from "@onelink/scraper/rss";
import { RssSubscriptionsRepository } from "../repositories/rss-subscriptions.repository";
import logger from "../../helpers/logger";

export default class RssDiscoveryService {
  constructor(
    private readonly queueRepo = new RssDiscoveryQueueRepository(),
    private readonly linksRepo = new LinksRepository(),
    private readonly rssSubsRepo = new RssSubscriptionsRepository(),
  ) {}

  async processDiscoveryQueue(): Promise<void> {
    const queueItems = await this.queueRepo.getUnprocessedQueue();

    if (queueItems.length === 0) {
      logger.info("[rss-discovery] No pending items in discovery queue");
      return;
    }

    logger.info(`[rss-discovery] Processing ${queueItems.length} items from discovery queue`);

    const promises = queueItems.map((item) => this.processQueueItem(item));
    const results = await Promise.allSettled(promises);

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    logger.info(
      `[rss-discovery] Processing complete. Succeeded: ${succeeded}, Failed: ${failed}`,
    );
  }

  private async processQueueItem(item: { id: string; link_id: string; owner_id: string }) {
    try {
      const link = await this.linksRepo.getLinkById(item.link_id, item.owner_id);

      if (!link) {
        logger.warn(`[rss-discovery] Link ${item.link_id} not found, skipping`);
        await this.queueRepo.deleteProcessedItem(item.id);
        return;
      }

      // Find RSS feed for the link
      const rssLink = await this.findRSSFeedLink(link.link);

      if (rssLink) {
        // Update link with RSS feed URL
        await this.linksRepo.updateLink(item.owner_id, item.link_id, { rss: rssLink });

        // Create RSS subscription if it doesn't exist
        const existing = await this.rssSubsRepo.getByFeedUrl(item.owner_id, rssLink);
        if (!existing) {
          await this.rssSubsRepo.create({
            owner_id: item.owner_id,
            feed_url: rssLink,
            site_url: link.link,
            link_id: item.link_id,
          });
        }

        logger.info(
          `[rss-discovery] Successfully discovered RSS feed for link ${item.link_id}`,
        );
      } else {
        logger.info(`[rss-discovery] No RSS feed found for link ${item.link_id}`);
      }

      await this.queueRepo.deleteProcessedItem(item.id);
    } catch (err) {
      logger.error(`[rss-discovery] Error processing queue item ${item.id}:`, err);
      // Don't delete on error, retry on next run
    }
  }

  private async findRSSFeedLink(link: string): Promise<string | undefined> {
    try {
      const scraper = new Scraper(link);
      const content = await scraper.scrape();
      const metadata = await scraper.extractMetadata(content);

      if (metadata.rssLink) {
        return metadata.rssLink;
      } else if (metadata.atomLink) {
        return metadata.atomLink;
      } else {
        const rss = new RSS(link);
        return await rss.findValidRSS();
      }
    } catch (err) {
      logger.error(`[rss-discovery] Error finding RSS feed for ${link}:`, err);
      return undefined;
    }
  }
}
