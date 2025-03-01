import type { Request, Response } from "express";
import { asycnHandler } from "../../helpers/async-handler";
import { GoogleOAuthService } from "../../infrastructure/services/google.authentication.services";
import { AuthenticationError } from "@onelink/entities/errros";
import { FRONTEND_URL } from "../../config/constants";
/**
 * I can't create an interface for this adaptor class if I want to use these funations as static functions. Why? :::D Because interfaces expects the class instance methods not on the static methods.
 *
 * So if I try to implement static methods in a class that implements an interface, then it will complain that I haven't complied to the interface and thus not declared any functions. So it doesn't recognise the static functions
 *
 * And currently TS doesn't provide an features that implements on the static methods
 */

export class AuthenticationAdaptor {
  /**
   *
   * @param req
   * @param res
   *
   * Starts the Oauth procedure, calls the provider auth service to handle the login
   */
  static async authenticateUser(req: Request, res: Response): Promise<void> {
    try {
      const authService = new GoogleOAuthService();
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
      const authService = new GoogleOAuthService();
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
      if (!token || !token.id_token) {
        throw new AuthenticationError("Failed to get google token");
      }
      const data = await authService.getUserDetails(token.id_token);
      console.log(data);
      res.status(200).redirect(FRONTEND_URL);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
