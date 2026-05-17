import { Router } from "express";
import bcrypt from "bcryptjs";
import { UsersRepository } from "../../infrastructure/repositories/users.repository";
import { SessionService } from "../../infrastructure/services/session.services";
import { ActionResponse } from "@onelink/action";
import { asyncHandler } from "../../helpers/async-handler";
import { Provider } from "@onelink/entities";

const route = Router();

export default (app: Router) => {
  app.use("/auth/local", route);

  route.post(
    "/register",
    asyncHandler(async (req, res) => {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return ActionResponse.error(res, {}, 400, null, "email, password and name are required");
      }

      const repo = new UsersRepository();
      const existing = await repo.findByEmail(email);
      if (existing) {
        return ActionResponse.error(res, {}, 409, null, "Email already registered");
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await repo.createUser({
        email,
        name,
        provider: Provider.Kustom,
        provider_id: `local:${email}`,
        profile_url: "",
        password_hash: hashed,
      } as any);

      new SessionService().createSession(user, req.session, req.ip, req.get("User-Agent"));

      ActionResponse.success(
        res,
        { id: user.id, email: user.email, name: user.name, sessionID: req.sessionID },
        201,
      );
    }),
  );

  route.post(
    "/login",
    asyncHandler(async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
        return ActionResponse.error(res, {}, 400, null, "email and password are required");
      }

      const repo = new UsersRepository();
      const user = await repo.findByEmail(email);
      if (!user) {
        return ActionResponse.error(res, {}, 401, null, "Invalid credentials");
      }

      const match = await bcrypt.compare(password, (user as any).password_hash ?? "");
      if (!match) {
        return ActionResponse.error(res, {}, 401, null, "Invalid credentials");
      }

      new SessionService().createSession(user, req.session, req.ip, req.get("User-Agent"));

      ActionResponse.success(
        res,
        { id: user.id, email: user.email, name: user.name, sessionID: req.sessionID },
        200,
      );
    }),
  );
};
