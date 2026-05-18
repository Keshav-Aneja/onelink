import type { Express } from "express";
import expressLoader from "./express.loader";
import redisLoader from "./redis.loader";
import loggerLoader from "./logger.loader";
import cronLoader from "./cron.loader";
import migrationsLoader from "./migrations.loader";
import logger from "../helpers/logger";

export default async (app: Express) => {
  await loggerLoader(app);
  logger.info("Processing loaders");
  await migrationsLoader();
  await redisLoader(app);
  await expressLoader(app);
  cronLoader();
  logger.info("Loaders initiated successfully");
};
