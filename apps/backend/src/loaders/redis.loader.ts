import type { Express } from "express";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import session from "express-session";
import env from "../config/env";
export default async (app: Express) => {
  const redisClient = createClient({
    username: "default",
    password: env.REDIS_PASSWORD,
    socket: {
      host: env.REDIS_URL,
      port: env.REDIS_PORT,
    },
  });

  redisClient.on("error", (err) => console.log("Redis Client Error", err));

  await redisClient.connect();
  let redisStore = new RedisStore({
    client: redisClient,
    prefix: env.REDIS_PREFIX,
  });

  app.use(
    session({
      store: redisStore,
      secret: env.SESS_SECRET, //it is used to sign the key
      resave: false,
      saveUninitialized: false,
      cookie: {
        // secure: process.env.NODE_ENV === "production",
        maxAge: 60000 * 60 * 24 * 3, //expiry for 3 days
      },
    }),
  );

  return app;
};
