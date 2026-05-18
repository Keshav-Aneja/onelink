import db from "@onelink/db";

export default async () => {
  await db.raw("CREATE EXTENSION IF NOT EXISTS pg_trgm");

  if (process.env["LOCAL_MODE"] !== "true") return;
  console.log("### Running database migrations...");
  await db.migrate.latest();
  console.log("### Migrations complete");
};
