import db from "@onelink/db";
import { RssDiscoveryQueue, RssDiscoveryQueueInsert } from "@onelink/entities/models";

export class RssDiscoveryQueueRepository {

  async addToQueue(data: RssDiscoveryQueueInsert): Promise<RssDiscoveryQueue> {
    const [result] = await db("rss_discovery_queue")
      .insert(data)
      .returning("*");
    return result;
  }

  async getUnprocessedQueue(): Promise<RssDiscoveryQueue[]> {
    return db("rss_discovery_queue")
      .where("processed_at", null)
      .orderBy("created_at", "asc");
  }

  async markAsProcessed(id: string): Promise<void> {
    await db("rss_discovery_queue")
      .where("id", id)
      .update({ processed_at: db.fn.now() });
  }

  async deleteProcessedItem(id: string): Promise<void> {
    await db("rss_discovery_queue")
      .where("id", id)
      .delete();
  }
}
