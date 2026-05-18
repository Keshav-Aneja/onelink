import type { Express } from "express";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import session from "express-session";
import env from "../config/env";

type RedisClient = ReturnType<typeof createClient>;
let redisClient: RedisClient | null = null;

export const initRedisClient = async () => {
  if (!redisClient) {
    const clientOptions: Parameters<typeof createClient>[0] =
      env.REDIS_PASSWORD
        ? {
            username: "default",
            password: env.REDIS_PASSWORD,
            socket: { host: env.REDIS_URL, port: env.REDIS_PORT },
          }
        : { url: `redis://${env.REDIS_URL}:${env.REDIS_PORT}` };

    redisClient = createClient(clientOptions);

    redisClient.on("error", (err) => console.log("Redis Client Error", err));
    await redisClient.connect();
  }
  return redisClient;
};

export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error(
      "Redis client not initialized. Call initRedisClient first.",
    );
  }
  return redisClient;
};

export default async (app: Express) => {
  const client = await initRedisClient();
  let redisStore = new RedisStore({
    client: client,
    prefix: env.REDIS_PREFIX,
  });
  app.set("trust proxy", 1);
  app.use(
    session({
      store: redisStore,
      secret: env.SESS_SECRET,
      resave: false,
      proxy: process.env["NODE_ENV"] === "production",
      saveUninitialized: false,
      cookie: {
        secure: process.env["NODE_ENV"] === "production",
        httpOnly: false,
        maxAge: 60000 * 60 * 24 * 3, //expiry for 3 days,
        sameSite: process.env["NODE_ENV"] === "production" ? "none" : "lax",
        // domain: "onelinkapi.kustom.cc",
      },
    }),
  );

  return app;
};
