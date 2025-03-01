import type { Request, Response } from "express";
import type { User } from "@onelink/entities/models";
import type { SessionData } from "express-session";
import { SessionOperationError } from "@onelink/entities/errros";
import type { ISessionService } from "../../application/services/session.services.interface";

export class Session implements ISessionService {
  constructor(private request: Request) {}
  /**
   *
   * @param request: Request
   * @param data: User
   * This helps storing data for the user session
   */
  createSession(data: User): void {
    const { session } = this.request;
    session.user_id = data.id;
    session.provider = data.provider;
    session.provider_id = data.provider_id;
    session.ip = this.request.ip;
    session.user_agent = this.request.get("User-Agent");
  }
  /**
   *
   * @param request Request
   * @returns Boolean
   * used to check if the session is a valid session or not
   */
  validateSession(): Boolean {
    const { session } = this.request;
    if (
      session.user_id &&
      session.ip === this.request.ip &&
      session.user_agent === this.request.get("User-Agent")
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
  destroySession(): Boolean {
    this.request.session.destroy((err) => {
      if (err) {
        return false;
      }
    });
    return true;
  }
  /**
   *
   * @param request : Request
   * @returns SessionData
   * This helps in retrieving all the data stored in the current user session
   */
  getSessionData(): SessionData {
    let sessionData: SessionData | undefined | null;
    this.request.sessionStore.get(this.request.sessionID, (err, data) => {
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
