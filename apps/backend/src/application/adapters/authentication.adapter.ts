import type { Request, Response } from "express";
import { AuthenticationError, RequestError } from "@onelink/entities/errros";
import { FRONTEND_URL } from "../../config/constants";
import { UserService } from "../../infrastructure/services/user.services";
import { SessionService } from "../../infrastructure/services/session.services";
import AuthenticationFactory from "../factory/authentication.factory";
import { UsersRepository } from "../../infrastructure/repositories/users.repository";
import { ActionResponse } from "@onelink/action";
import { asyncHandler } from "../../helpers/async-handler";
/**
 * I can't create an interface for this adaptor class if I want to use these funations as static functions. Why? :::D Because interfaces expects the class instance methods not on the static methods.
 *
 * So if I try to implement static methods in a class that implements an interface, then it will complain that I haven't complied to the interface and thus not declared any functions. So it doesn't recognise the static functions
 *
 * And currently TS doesn't provide an features that implements on the static methods
 */

export class AuthenticationAdapter {
  /**
   *
   * @param req
   * @param res
   *
   * Starts the Oauth procedure, calls the provider auth service to handle the login
   */
  static async authenticateUser(req: Request, res: Response): Promise<void> {
    try {
      const { provider } = req.params;
      const authService = AuthenticationFactory(provider);
      const authUrl = await authService.initiateAuthorizationRequest(
        req.session,
      );
      res.redirect(authUrl);
    } catch (error: any) {
      // PROBLEM: This is just temporary will replace it with my ActionResponse package
      console.error(error);
      res.status(400).json({ success: false, error: error.message });
    }
  }
  /**
   *
   * @param req
   * @param res
   *
   * After processing authentication, to handle the callback from the provider. Recieve the code and exchange it for a token.
   */
  static async processOAuthCallback(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { provider } = req.params;
      const authService = AuthenticationFactory(provider);
      const userService = new UserService();
      const sessionService = new SessionService();
      const code_verifier = req.session.code_verifier;
      const { code, state } = req.query;
      const authCode = await authService.getAuthorizationCode(
        code,
        state,
        req.session,
      );
      const token = await authService.getAuthorizationToken(
        authCode,
        code_verifier,
      );
      const data = await authService.getUserDetails(token);

      const sessionUser = await userService.getOrCreateUser(data);
      sessionService.createSession(
        sessionUser,
        req.session,
        req.ip,
        req.get("User-Agent"),
      );
      res.status(200).redirect(FRONTEND_URL);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, error: error.message });
    }
  }
  /**
   *
   * @param req
   * @param res
   *
   * Logsout the user
   */
  static async terminateSession(req: Request, res: Response): Promise<void> {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).json({ success: false });
      }
      res
        .clearCookie("connect.sid", {
          path: "/",
          httpOnly: true,
        })
        .redirect(302, "frontend.com/auth");
    });
  }
  // TODO: Delete this afterwards
  static getUserDetails = asyncHandler(async (req: Request, res: Response) => {
    const userService = new UsersRepository();
    if (req.session.provider_id) {
      const response = await userService.getUserByProviderID(
        req.session.provider_id,
      );
      ActionResponse.success(res, response, 200);
    } else {
      throw new Error("Invalid Provider ID");
    }
  });
}
