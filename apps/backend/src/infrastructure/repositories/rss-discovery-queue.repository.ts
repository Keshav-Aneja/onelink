import { getDb } from "../../loaders/database.loader";
import { RssDiscoveryQueue, RssDiscoveryQueueInsert } from "@onelink/entities/models";

export class RssDiscoveryQueueRepository {
  private db = getDb();

  async addToQueue(data: RssDiscoveryQueueInsert): Promise<RssDiscoveryQueue> {
    const [result] = await this.db("rss_discovery_queue")
      .insert(data)
      .returning("*");
    return result;
  }

  async getUnprocessedQueue(): Promise<RssDiscoveryQueue[]> {
    return this.db("rss_discovery_queue")
      .where("processed_at", null)
      .orderBy("created_at", "asc");
  }

  async markAsProcessed(id: string): Promise<void> {
    await this.db("rss_discovery_queue")
      .where("id", id)
      .update({ processed_at: this.db.fn.now() });
  }

  async deleteProcessedItem(id: string): Promise<void> {
    await this.db("rss_discovery_queue")
      .where("id", id)
      .delete();
  }
}
