import type { Request, Response } from "express";
import type { IAuthenticationService } from "../../application/services/authentication.services.interface";
import type { User } from "@onelink/entities/models";
import type { SessionData } from "express-session";
import { SessionOperationError } from "@onelink/entities/errros";

export class AuthenticationService implements IAuthenticationService {
  /**
   *
   * @param request: Request
   * @param data: User
   * This helps storing data for the user session
   */
  createSession(request: Request, data: User): void {
    const { session } = request;
    session.user_id = data.id;
    session.provider = data.provider;
    session.provider_id = data.provider_id;
    session.ip = request.ip;
    session.user_agent = request.get("User-Agent");
  }
  /**
   *
   * @param request Request
   * @returns Boolean
   * used to check if the session is a valid session or not
   */
  validateSession(request: Request): Boolean {
    const { session } = request;
    if (
      session.user_id &&
      session.ip === request.ip &&
      session.user_agent === request.get("User-Agent")
    ) {
      return true;
    }
    return false;
  }
  /**
   *
   * @param request : Request
   * @param response : Response
   *
   * Clears the session cookie from the client
   * and destroys the session stored in the sessionStore
   */
  destroySession(request: Request, response: Response): void {
    request.session.destroy((err) => {
      if (err) {
        response.status(400).json({
          success: false,
        });
      }
      response.status(200).clearCookie("connect.sid").json({ success: true });
    });
  }
  /**
   *
   * @param request : Request
   * @returns SessionData
   * This helps in retrieving all the data stored in the current user session
   */
  getSessionData(request: Request): SessionData {
    let sessionData: SessionData | undefined | null;
    request.sessionStore.get(request.sessionID, (err, data) => {
      if (err) {
        throw new SessionOperationError("Failed to get Session data");
      }
      sessionData = data;
    });
    if (!sessionData) {
      throw new SessionOperationError("Session data does not exists");
    }
    return sessionData;
  }
}
