import cron from "node-cron";
import logger from "../helpers/logger";
import FeedsService from "../infrastructure/services/feeds.service";

export default function cronLoader() {
  const feedsService = new FeedsService();

  const run = async () => {
    logger.info("[cron] Starting RSS feed refresh...");
    try {
      await feedsService.refreshAllFeeds();
      logger.info("[cron] RSS feed refresh complete.");
    } catch (err) {
      logger.error("[cron] RSS feed refresh failed:", err);
    }
  };

  // Fire once on startup
  run();

  // Schedule every 30 minutes: "*/30 * * * *"
  cron.schedule("*/30 * * * *", run);

  logger.info("[cron] RSS cron job registered (every 30 minutes).");
}
