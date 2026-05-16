import db from "@onelink/db";
import type { RssSubscription, RssSubscriptionInsert } from "@onelink/entities/models";
import { DatabaseOperationError } from "@onelink/entities/errros";

export class RssSubscriptionsRepository {
  async getAll(owner_id: string): Promise<RssSubscription[]> {
    return db("rss_subscriptions").where({ owner_id }).orderBy("created_at", "desc");
  }

  async getById(id: string, owner_id: string): Promise<RssSubscription | undefined> {
    const [row] = await db("rss_subscriptions").where({ id, owner_id });
    return row;
  }

  async getByFeedUrl(owner_id: string, feed_url: string): Promise<RssSubscription | undefined> {
    const [row] = await db("rss_subscriptions").where({ owner_id, feed_url });
    return row;
  }

  async create(data: RssSubscriptionInsert): Promise<RssSubscription> {
    const [row] = await db("rss_subscriptions")
      .insert(data)
      .returning("*");
    if (!row) throw new DatabaseOperationError("Cannot create rss subscription");
    return row;
  }

  async delete(id: string, owner_id: string): Promise<string> {
    const [row] = await db("rss_subscriptions")
      .where({ id, owner_id })
      .delete()
      .returning("id");
    if (!row?.id) throw new DatabaseOperationError("Cannot delete rss subscription");
    return row.id;
  }

  async updateHealth(
    id: string,
    last_fetched_at: Date | null,
    last_error: string | null,
  ): Promise<void> {
    await db("rss_subscriptions").where({ id }).update({ last_fetched_at, last_error });
  }

  async markItemsRead(owner_id: string, item_hashes: string[]): Promise<void> {
    if (item_hashes.length === 0) return;
    const rows = item_hashes.map((item_hash) => ({ owner_id, item_hash }));
    await db("rss_read_items").insert(rows).onConflict(["owner_id", "item_hash"]).ignore();
  }

  async getReadHashes(owner_id: string): Promise<Set<string>> {
    const rows: { item_hash: string }[] = await db("rss_read_items")
      .where({ owner_id })
      .select("item_hash");
    return new Set(rows.map((r) => r.item_hash));
  }

  async cleanupOldReadItems(): Promise<void> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    await db("rss_read_items").where("read_at", "<", cutoff).delete();
  }

  async getAllSubscriptions(): Promise<RssSubscription[]> {
    return db("rss_subscriptions").select("*");
  }

  async upsertCacheItems(items: Array<{
    subscription_id: string;
    owner_id: string;
    item_hash: string;
    title?: string;
    link?: string;
    published_date?: Date | null;
  }>): Promise<void> {
    if (items.length === 0) return;
    await db("rss_feed_cache")
      .insert(items)
      .onConflict(["subscription_id", "item_hash"])
      .ignore();
  }

  async pruneCache(maxDays: number = 90): Promise<number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - maxDays);
    return db("rss_feed_cache").where("published_date", "<", cutoff).delete();
  }

  async getCachedItems(
    owner_id: string,
    sinceDays: number,
    feedId?: string,
  ): Promise<Array<{
    item_hash: string;
    title?: string;
    link?: string;
    published_date?: string;
    feed_id: string;
  }>> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - sinceDays);
    let q = db("rss_feed_cache")
      .where("owner_id", owner_id)
      .where("published_date", ">=", cutoff)
      .select("item_hash", "title", "link", "published_date", "subscription_id as feed_id")
      .orderBy("published_date", "desc");
    if (feedId) q = q.where("subscription_id", feedId);
    return q;
  }
}
