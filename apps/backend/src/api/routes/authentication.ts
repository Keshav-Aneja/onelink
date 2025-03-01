import { Router } from "express";
import { AuthenticationAdaptor } from "../../application/adapters/authentication.adapter";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.get("/google", AuthenticationAdaptor.authenticateUser);
  route.get("/google/callback", AuthenticationAdaptor.processOAuthCallback);
};
