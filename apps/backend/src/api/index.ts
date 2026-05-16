import { Router } from "express";
import authentication from "./routes/authentication";
import collections from "./routes/collections";
import links from "./routes/links";
import share from "./routes/share";
import publicRoutes from "./routes/public";

export default function Routes() {
  const router = Router();
  authentication(router);
  collections(router);
  links(router);
  share(router);
  publicRoutes(router);
  return router;
}
