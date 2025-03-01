import { Router } from "express";
import { AuthenticationAdapter } from "../../application/adapters/authentication.adapter";
import { protectedRoute } from "../middleware/authentication.middleware";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);
  route.get("/google", AuthenticationAdapter.authenticateUser);
  route.get("/google/callback", AuthenticationAdapter.processOAuthCallback);
  route.post("/logout", AuthenticationAdapter.terminateSession);
  route.get("/protected", protectedRoute, (req, res) => {
    res.status(200).send("WELCOME");
  });
};
