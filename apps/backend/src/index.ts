import express from "express";
import { AuthenticationAdaptor } from "./application/adapters/authentication.adapter";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import session from "express-session";
import env from "./config/env";
import { FRONTEND_URL } from "./config/constants";
const app = express();
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser(env.SESS_SECRET));
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
app.get("/api/auth/google", AuthenticationAdaptor.authenticateUser);
app.get(
  "/api/auth/google/callback",
  AuthenticationAdaptor.processOAuthCallback,
);

app.listen(env.PORT, () => {
  console.log("Server started on port ", env.PORT);
});
