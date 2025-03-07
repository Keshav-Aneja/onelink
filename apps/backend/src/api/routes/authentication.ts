import { Router } from "express";
import { AuthenticationAdapter } from "../../application/adapters/authentication.adapter";
import { middlewares } from "../middleware";
import { ActionResponse } from "@onelink/action";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);
  //Static Routes
  route.get("/unprotected", (req, res) => {
    ActionResponse.success(res, "PERFECT", 200);
  });
  route.get("/protected", middlewares.protectedRoute, (req, res) => {
    res.status(200).send("WELCOME");
  });
  route.post("/logout", AuthenticationAdapter.terminateSession);
  route.get(
    "/me",
    middlewares.protectedRoute,
    AuthenticationAdapter.getUserDetails,
  );
  //Dynamic Routes
  route.get(
    "/:provider",
    middlewares.validateProvider,
    AuthenticationAdapter.authenticateUser,
  );
  route.get(
    "/:provider/callback",
    middlewares.validateProvider,
    AuthenticationAdapter.processOAuthCallback,
  );
};
