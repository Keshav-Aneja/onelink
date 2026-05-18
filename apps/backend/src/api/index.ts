import { Router } from "express";
import authentication from "./routes/authentication";
import collections from "./routes/collections";
import links from "./routes/links";
import share from "./routes/share";
import publicRoutes from "./routes/public";
import tags from "./routes/tags";
import feeds from "./routes/feeds";
import userSettings from "./routes/user-settings";
import localAuth from "./routes/local-auth";
import env from "../config/env";

export default function Routes() {
  const router = Router();
  if (env.LOCAL_MODE) {
    localAuth(router);
  }
  authentication(router);
  collections(router);
  links(router);
  share(router);
  publicRoutes(router);
  tags(router);
  feeds(router);
  userSettings(router);
  return router;
}
