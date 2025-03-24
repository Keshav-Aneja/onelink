import { Router } from "express";
import { middlewares } from "../middleware";
import LinkAdapter from "../../application/adapters/links.adapter";

const route = Router();

export default (app: Router) => {
  app.use("/links", route);
  route.use(middlewares.protectedRoute);

  route.post("/", LinkAdapter.createLink);
  route.post("/feed", LinkAdapter.getUpdatedFeed);

  route.get("/:id?", LinkAdapter.getLinks);
};
