import type { Express } from "express";
import expressLoader from "./express.loader";
import redisLoader from "./redis.loader";
import loggerLoader from "./logger.loader";
export default async (app: Express) => {
  console.log("### Processing loaders...");
  /**
   * Import in the following order always
   */
  await loggerLoader(app);
  await redisLoader(app);
  await expressLoader(app);
  console.log("### Loaders initiated successfully");
  return;
};
