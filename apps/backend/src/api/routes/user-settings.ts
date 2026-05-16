import { Router } from "express";
import { middlewares } from "../middleware";
import UserSettingsAdapter from "../../application/adapters/user-settings.adapter";

const route = Router();

export default (app: Router) => {
  app.use("/settings", route);
  route.use(middlewares.protectedRoute);

  route.get("/", UserSettingsAdapter.getSettings);
  route.patch("/", UserSettingsAdapter.updateSettings);
};
