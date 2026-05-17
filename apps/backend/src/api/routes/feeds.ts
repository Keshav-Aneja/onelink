import { Router } from "express";
import { middlewares } from "../middleware";
import FeedsAdapter from "../../application/adapters/feeds.adapter";
import FeedsService from "../../infrastructure/services/feeds.service";

const route = Router();

export default (app: Router) => {
  app.use("/feeds", route);
  route.use(middlewares.protectedRoute);

  const feedsService = new FeedsService();
  const feedsAdapter = new FeedsAdapter(feedsService);

  route.get("/", feedsAdapter.getSubscriptions);
  route.post("/", feedsAdapter.subscribe);
  route.delete("/:id", feedsAdapter.unsubscribe);
  route.post("/items", feedsAdapter.getFeedItems);
  route.post("/notifications", feedsAdapter.getNotifications);
  route.get("/read-hashes", feedsAdapter.getReadHashes);
  route.post("/read", feedsAdapter.markRead);
  route.post("/read-all", feedsAdapter.markAllRead);
  route.delete("/inactive", feedsAdapter.pruneInactive);
  route.get("/opml", feedsAdapter.exportOpml);
  route.post("/opml", feedsAdapter.importOpml);
};
