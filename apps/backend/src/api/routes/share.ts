import { Router } from "express";
import { middlewares } from "../middleware";
import { PublicShareAdapter } from "../../application/adapters/public-share.adapter";
import { UserShareAdapter } from "../../application/adapters/user-share.adapter";

const route = Router();

export default (app: Router) => {
  app.use("/share", route);
  route.use(middlewares.protectedRoute);

  // Public share management (owner must be authenticated)
  route.post("/public", PublicShareAdapter.create);
  route.patch("/public/:share_id", PublicShareAdapter.update);
  route.delete("/public/:share_id", PublicShareAdapter.delete);
  route.get("/public/collection/:collection_id", PublicShareAdapter.getForCollection);

  // User invite management
  route.post("/users", UserShareAdapter.invite);
  route.delete("/users/:share_id", UserShareAdapter.remove);
  route.get("/users/shared-with-me", UserShareAdapter.sharedWithMe);
  route.get("/users/collection/:collection_id", UserShareAdapter.listInvitees);
  route.patch("/users/collection/:collection_id", UserShareAdapter.updateDepth);
  route.get("/users/view/:collection_id", UserShareAdapter.viewSharedCollection);
};
