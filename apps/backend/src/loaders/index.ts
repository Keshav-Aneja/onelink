import type { Express } from "express";
import expressLoader from "./express.loader";
import redisLoader from "./redis.loader";
import loggerLoader from "./logger.loader";
export default async (app: Express) => {
  console.log("### Processing loaders...");
  await expressLoader(app);
  await redisLoader(app);
  await loggerLoader(app);
  console.log("### Loaders initiated successfully");
};
