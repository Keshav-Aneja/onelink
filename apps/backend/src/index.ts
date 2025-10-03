import express from "express";
import env from "./config/env";
import logger from "./helpers/logger";
import loaders from "./loaders";

async function startServer() {
  const app = express();
  app.get("/", async (req, res) => {
    try {
      res.json({ status: true, message: "Success" });
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
