import type { Express } from "express";
import expressLoader from "./express.loader";
import redisLoader from "./redis.loader";
import loggerLoader from "./logger.loader";
import cronLoader from "./cron.loader";
import migrationsLoader from "./migrations.loader";

export default async (app: Express) => {
  console.log("### Processing loaders...");
  await loggerLoader(app);
  await migrationsLoader();
  await redisLoader(app);
  await expressLoader(app);
  cronLoader();
  console.log("### Loaders initiated successfully");
  return;
};
