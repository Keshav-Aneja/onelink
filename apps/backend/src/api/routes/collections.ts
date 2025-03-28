import { Router } from "express";
import { middlewares } from "../middleware";
import { CollectionAdapter } from "../../application/adapters/collections.adapter";

const route = Router();

export default (app: Router) => {
  app.use("/collection", route);
  route.use(middlewares.protectedRoute);

  route.get("/stats/:id?", CollectionAdapter.getCollectionStats);
  route.post("/", CollectionAdapter.createCollection);
  route.get("/:id?", CollectionAdapter.getCollections);
};
