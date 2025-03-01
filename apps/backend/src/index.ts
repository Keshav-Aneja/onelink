import express from "express";
import env from "./config/env";
import logger from "./helpers/logger";
import loaders from "./loaders";
import db from "@onelink/db";

async function startServer() {
  const app = express();
  app.get("/test-db", async (req, res) => {
    try {
      const result = await db.raw("SELECT 1+1 AS result");
      res.json({ database: "connected", result: result.rows[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  await loaders(app);
  app
    .listen(env.PORT, () => {
      logger.info(`
      ################################################
      🛡️  Server listening on port: ${env.PORT} 🛡️
      ################################################
    `);
    })
    .on("error", (err) => {
      logger.error(err);
      process.exit(1);
    });
}

startServer();

// app.get("/api/auth/google", AuthenticationAdaptor.authenticateUser);
// app.get(
//   "/api/auth/google/callback",
//   AuthenticationAdaptor.processOAuthCallback,
// );
