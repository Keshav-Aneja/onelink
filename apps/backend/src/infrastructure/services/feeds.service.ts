import { RSS } from "@onelink/scraper/rss";
import { Scraper } from "@onelink/scraper";
import type { RssSubscription, RssSubscriptionWithUnread, RSSFeed } from "@onelink/entities/models";
import { RssSubscriptionsRepository } from "../repositories/rss-subscriptions.repository";
import { AuthenticationError } from "@onelink/entities/errros";

export default class FeedsService {
  constructor(
    private readonly repo = new RssSubscriptionsRepository(),
  ) {}

  async getSubscriptions(owner_id: string): Promise<RssSubscriptionWithUnread[]> {
    const subs = await this.repo.getAll(owner_id);
    const readHashes = await this.repo.getReadHashes(owner_id);

    // We can't compute exact unread count without fetching feeds; use 0 and let
    // the client derive it from item_hash list. For the dashboard we just surface
    // health state and metadata without re-fetching all feeds on every page load.
    return subs.map((s) => ({ ...s, unread_count: 0 }));
  }

  async subscribe(
    owner_id: string,
    input_url: string,
    link_id?: string,
  ): Promise<RssSubscription> {
    // Auto-discover feed URL if input_url is a webpage
    let feed_url = input_url;
    let site_url = input_url;
    let title: string | undefined;
    let favicon_url: string | undefined;

    try {
      const scraper = new Scraper(input_url);
      const content = await scraper.scrape();
      const metadata = await scraper.extractMetadata(content);
      title = metadata.title || undefined;
      favicon_url = metadata.favicon
        ? new URL(metadata.favicon, new URL(input_url).origin).toString()
        : undefined;

      if (metadata.rssLink || metadata.atomLink) {
        feed_url = (metadata.rssLink || metadata.atomLink)!;
      } else {
        const rss = new RSS(input_url);
        const found = await rss.findValidRSS();
        if (found) feed_url = found;
      }
    } catch {
      // If scraping fails, try using the URL directly as a feed URL
    }

    const existing = await this.repo.getByFeedUrl(owner_id, feed_url);
    if (existing) return existing;

    return this.repo.create({ owner_id, feed_url, site_url, title, favicon_url, link_id });
  }

  async unsubscribe(owner_id: string, id: string): Promise<{ id: string }> {
    const sub = await this.repo.getById(id, owner_id);
    if (!sub) throw new AuthenticationError("Subscription not found");
    const deletedId = await this.repo.delete(id, owner_id);
    return { id: deletedId };
  }

  async getFeedItems(
    owner_id: string,
    sinceDays?: number,
    startDate?: Date,
    endDate?: Date,
    feedId?: string,
  ): Promise<RSSFeed[]> {
    const effectiveDays = sinceDays ?? 7;

    // Try cache first
    const cached = await this.repo.getCachedItems(owner_id, effectiveDays, feedId);
    if (cached.length > 0) {
      return cached.map((item) => ({
        item_hash: item.item_hash,
        title: item.title,
        link: item.link,
        published_date: item.published_date,
        feed_id: item.feed_id,
      }));
    }

    // Cache miss — fall back to live scrape
    const subs = await this.repo.getAll(owner_id);
    const filtered = feedId ? subs.filter((s) => s.id === feedId) : subs;

    const promises = filtered.map(async (sub) => {
      try {
        const rss = new RSS(sub.site_url || sub.feed_url, sub.feed_url);
        const items = await rss.scrapeRSS(effectiveDays, startDate, endDate, sub.id);
        await this.repo.updateHealth(sub.id, new Date(), null);
        // Upsert into cache
        if (items && items.length > 0) {
          const toCache = items.map((i) => ({
            subscription_id: sub.id,
            owner_id,
            item_hash: i.item_hash!,
            title: i.title,
            link: i.link,
            published_date: i.published_date ? new Date(i.published_date) : null,
          })).filter((i) => i.item_hash);
          await this.repo.upsertCacheItems(toCache);
        }
        return items || [];
      } catch (err: any) {
        await this.repo.updateHealth(sub.id, null, err?.message || "Unknown error");
        return [];
      }
    });

    const results = await Promise.allSettled(promises);
    const all: RSSFeed[] = results
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => (r as PromiseFulfilledResult<RSSFeed[]>).value);

    return all.sort((a, b) => {
      if (!a.published_date) return 1;
      if (!b.published_date) return -1;
      return new Date(b.published_date).getTime() - new Date(a.published_date).getTime();
    });
  }

  async getFeedItemsFromCache(
    owner_id: string,
    sinceDays: number = 1,
    feedId?: string,
  ): Promise<RSSFeed[]> {
    const cached = await this.repo.getCachedItems(owner_id, sinceDays, feedId);
    return cached.map((item) => ({
      item_hash: item.item_hash,
      title: item.title,
      link: item.link,
      published_date: item.published_date,
      feed_id: item.feed_id,
    }));
  }

  async getReadHashes(owner_id: string): Promise<string[]> {
    const set = await this.repo.getReadHashes(owner_id);
    return Array.from(set);
  }

  async markRead(owner_id: string, item_hashes: string[]): Promise<void> {
    await this.repo.markItemsRead(owner_id, item_hashes);
  }

  async markAllRead(owner_id: string, sinceDays = 7): Promise<void> {
    const items = await this.getFeedItems(owner_id, sinceDays);
    const hashes = items.map((i) => i.item_hash).filter(Boolean) as string[];
    await this.repo.markItemsRead(owner_id, hashes);
  }

  async exportOpml(owner_id: string): Promise<string> {
    const subs = await this.repo.getAll(owner_id);
    const outlines = subs
      .map(
        (s) =>
          `    <outline type="rss" text="${escapeXml(s.title || s.feed_url)}" title="${escapeXml(s.title || s.feed_url)}" xmlUrl="${escapeXml(s.feed_url)}" htmlUrl="${escapeXml(s.site_url || s.feed_url)}"/>`,
      )
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head><title>OneLink RSS Subscriptions</title></head>
  <body>
${outlines}
  </body>
</opml>`;
  }

  async importOpml(owner_id: string, opmlXml: string): Promise<{ added: number }> {
    let match: RegExpExecArray | null;
    const entries: Array<{ feed_url: string; site_url?: string; title?: string }> = [];

    // Parse all outlines by scanning for xmlUrl
    const outlineRegex = /<outline[^>]+xmlUrl="([^"]+)"[^>]*>/g;
    while ((match = outlineRegex.exec(opmlXml)) !== null) {
      const outerHtml = match[0];
      const feed_url = match[1] ?? "";
      if (!feed_url) continue;
      const htmlMatch = outerHtml.match(/htmlUrl="([^"]+)"/);
      const titleMatch = outerHtml.match(/(?:text|title)="([^"]+)"/);
      entries.push({
        feed_url,
        site_url: htmlMatch?.[1],
        title: titleMatch?.[1],
      });
    }

    let added = 0;
    for (const entry of entries) {
      const existing = await this.repo.getByFeedUrl(owner_id, entry.feed_url);
      if (!existing) {
        await this.repo.create({ owner_id, ...entry });
        added++;
      }
    }
    return { added };
  }

  async refreshAllFeeds(): Promise<void> {
    const allSubs = await this.repo.getAllSubscriptions();
    const promises = allSubs.map(async (sub) => {
      try {
        const rss = new RSS(sub.site_url || sub.feed_url, sub.feed_url);
        const items = await rss.scrapeRSS(90, undefined, undefined, sub.id);
        await this.repo.updateHealth(sub.id, new Date(), null);
        if (items && items.length > 0) {
          const toCache = items.map((i) => ({
            subscription_id: sub.id,
            owner_id: sub.owner_id,
            item_hash: i.item_hash!,
            title: i.title,
            link: i.link,
            published_date: i.published_date ? new Date(i.published_date) : null,
          })).filter((i) => i.item_hash);
          await this.repo.upsertCacheItems(toCache);
        }
      } catch (err: any) {
        await this.repo.updateHealth(sub.id, null, err?.message || "Unknown error");
      }
    });
    await Promise.allSettled(promises);
    // Prune stale rows and old read items
    await this.repo.pruneCache(90);
    await this.repo.cleanupOldReadItems();
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
