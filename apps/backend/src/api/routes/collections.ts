import { Router } from "express";
import { middlewares } from "../middleware";

const route = Router();

export default (app: Router) => {
  app.use("/collections", route);
  route.use(middlewares.protectedRoute);
};
