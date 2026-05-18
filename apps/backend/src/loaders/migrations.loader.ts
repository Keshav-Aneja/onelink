import db from "@onelink/db";
import logger from "../helpers/logger";

export default async () => {
  await db.raw("CREATE EXTENSION IF NOT EXISTS pg_trgm");

  if (process.env["LOCAL_MODE"] !== "true") return;
  logger.info("Running database migrations");
  await db.migrate.latest();
  logger.info("Migrations complete");
};
