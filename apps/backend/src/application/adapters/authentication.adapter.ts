import type { Request, Response } from "express";
import { AuthenticationError } from "@onelink/entities/errros";
import { FRONTEND_URL } from "../../config/constants";
import { UserService } from "../../infrastructure/services/user.services";
import { SessionService } from "../../infrastructure/services/session.services";
import AuthenticationFactory from "../factory/authentication.factory";
import { UsersRepository } from "../../infrastructure/repositories/users.repository";
import { ActionResponse } from "@onelink/action";
import { asyncHandler } from "../../helpers/async-handler";
import logger from "../../helpers/logger";
import { pathParam } from "../../helpers/request";

const userService = new UserService();
const sessionService = new SessionService();

export class AuthenticationAdapter {
  static authenticateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const provider = pathParam(req, "provider") ?? "";
    const { redirectTo } = req.query;
    const redirectToStr = typeof redirectTo === "string" ? redirectTo : "";
    const isRelativePath = redirectToStr.startsWith("/") && !redirectToStr.startsWith("//");
    req.session.redirect_to = isRelativePath ? redirectToStr : "";
    const authService = AuthenticationFactory(provider);
    const authUrl = await authService.initiateAuthorizationRequest(req.session);
    res.redirect(authUrl);
  });

  static processOAuthCallback = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const provider = pathParam(req, "provider") ?? "";
    const redirectTo = req.session.redirect_to;
    const authService = AuthenticationFactory(provider);
    const code_verifier = req.session.code_verifier;
    const code = typeof req.query["code"] === "string" ? req.query["code"] : undefined;
    const state = typeof req.query["state"] === "string" ? req.query["state"] : undefined;
    const authCode = await authService.getAuthorizationCode(code, state, req.session);
    const token = await authService.getAuthorizationToken(authCode, code_verifier);
    const data = await authService.getUserDetails(token);
    const sessionUser = await userService.getOrCreateUser(data);
    sessionService.createSession(sessionUser, req.session, req.ip, req.get("User-Agent"));
    res.status(200).redirect(
      `${FRONTEND_URL}/auth/callback?token=${req.sessionID}${redirectTo ? `&redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    );
  });

  static terminateSession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    res.clearCookie("connect.sid", { path: "/", httpOnly: true }).json({ success: true, redirect: true });
  });

  // TODO: Delete this afterwards
  static getUserDetails = asyncHandler(async (req: Request, res: Response) => {
    const usersRepository = new UsersRepository();
    if (req.session.provider_id) {
      const response = await usersRepository.getUserByProviderID(req.session.provider_id);
      ActionResponse.success(res, response, 200);
    } else {
      throw new AuthenticationError("Invalid Provider ID");
    }
  });
}
