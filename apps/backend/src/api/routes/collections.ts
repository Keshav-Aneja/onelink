import { Router } from "express";
import { middlewares } from "../middleware";
import { CollectionAdapter } from "../../application/adapters/collections.adapter";

const route = Router();

export default (app: Router) => {
  app.use("/collection", route);
  route.use(middlewares.protectedRoute);

  route.get("/", CollectionAdapter.getCollections);
  route.post("/", CollectionAdapter.createCollection);
};
