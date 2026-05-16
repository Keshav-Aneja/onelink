import cron from "node-cron";
import logger from "../helpers/logger";
import FeedsService from "../infrastructure/services/feeds.service";
import RssDiscoveryService from "../infrastructure/services/rss-discovery.service";

export default function cronLoader() {
  const feedsService = new FeedsService();
  const rssDiscoveryService = new RssDiscoveryService();

  const runFeedRefresh = async () => {
    logger.info("[cron] Starting RSS feed refresh...");
    try {
      await feedsService.refreshAllFeeds();
      logger.info("[cron] RSS feed refresh complete.");
    } catch (err) {
      logger.error("[cron] RSS feed refresh failed:", err);
    }
  };

  const runRssDiscovery = async () => {
    logger.info("[cron] Starting RSS discovery...");
    try {
      await rssDiscoveryService.processDiscoveryQueue();
      logger.info("[cron] RSS discovery complete.");
    } catch (err) {
      logger.error("[cron] RSS discovery failed:", err);
    }
  };

  // Fire once on startup
  runFeedRefresh();
  runRssDiscovery();

  // Schedule feed refresh every 30 minutes: "*/30 * * * *"
  cron.schedule("*/30 * * * *", runFeedRefresh);

  // Schedule RSS discovery every 15 minutes: "*/15 * * * *"
  cron.schedule("*/15 * * * *", runRssDiscovery);

  logger.info("[cron] Cron jobs registered - Feed refresh (every 30 minutes), RSS discovery (every 15 minutes).");
}
