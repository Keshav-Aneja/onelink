import { Router } from "express";
import authentication from "./routes/authentication";
import collections from "./routes/collections";
import links from "./routes/links";

export default function Routes() {
  const router = Router();
  authentication(router);
  collections(router);
  links(router);
  return router;
}
