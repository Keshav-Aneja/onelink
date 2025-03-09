import { Router } from "express";
import authentication from "./routes/authentication";
import collections from "./routes/collections";

export default function Routes() {
  const router = Router();
  authentication(router);
  collections(router);
  return router;
}
