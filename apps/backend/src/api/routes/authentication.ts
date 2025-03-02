import { Router } from "express";
import { AuthenticationAdapter } from "../../application/adapters/authentication.adapter";
import { middlewares } from "../middleware";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);
  //Static Routes
  route.get("/protected", middlewares.protectedRoute, (req, res) => {
    res.status(200).send("WELCOME");
  });
  route.post("/logout", AuthenticationAdapter.terminateSession);

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
