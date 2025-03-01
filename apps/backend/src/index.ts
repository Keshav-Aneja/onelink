import express from "express";
import env from "./config/env";
import logger from "./helpers/logger";

async function startServer() {
  const app = express();
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
