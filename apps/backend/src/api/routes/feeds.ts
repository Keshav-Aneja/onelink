import { Router } from "express";
import { middlewares } from "../middleware";
import FeedsAdapter from "../../application/adapters/feeds.adapter";

const route = Router();

export default (app: Router) => {
  app.use("/feeds", route);
  route.use(middlewares.protectedRoute);

  route.get("/", FeedsAdapter.getSubscriptions);
  route.post("/", FeedsAdapter.subscribe);
  route.delete("/:id", FeedsAdapter.unsubscribe);
  route.post("/items", FeedsAdapter.getFeedItems);
  route.post("/notifications", FeedsAdapter.getNotifications);
  route.get("/read-hashes", FeedsAdapter.getReadHashes);
  route.post("/read", FeedsAdapter.markRead);
  route.post("/read-all", FeedsAdapter.markAllRead);
  route.get("/opml", FeedsAdapter.exportOpml);
  route.post("/opml", FeedsAdapter.importOpml);
};
