import type { Express } from "express";
import { createClient, type RedisClientType } from "redis";
import { RedisStore } from "connect-redis";
import session from "express-session";
import env from "../config/env";
let redisClient: RedisClientType | null = null;

export const initRedisClient = async () => {
  if (!redisClient) {
    redisClient = createClient({
      username: "default",
      password: env.REDIS_PASSWORD,
      socket: {
        host: env.REDIS_URL,
        port: env.REDIS_PORT,
      },
    });

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
      secret: env.SESS_SECRET, //it is used to sign the key
      resave: false,
      proxy: process.env["NODE_ENV"] === "production",
      saveUninitialized: false,
      cookie: {
        secure: process.env["NODE_ENV"] === "production",
        httpOnly: true,
        maxAge: 60000 * 60 * 24 * 3, //expiry for 3 days,
        sameSite: process.env["NODE_ENV"] === "production" ? "none" : "lax",
        domain: "",
      },
    }),
  );

  return app;
};
