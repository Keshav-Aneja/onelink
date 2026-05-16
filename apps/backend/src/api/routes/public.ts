import { Router } from "express";
import { PublicShareAdapter } from "../../application/adapters/public-share.adapter";

const route = Router();

export default (app: Router) => {
  app.use("/public", route);
  // No auth middleware — anyone can resolve a public share token
  route.get("/:token", PublicShareAdapter.resolve);
};
