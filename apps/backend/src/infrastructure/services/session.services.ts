import type { User } from "@onelink/entities/models";
import type { Session, SessionData } from "express-session";
import { SessionOperationError } from "@onelink/entities/errros";
import type { ISessionService } from "../../application/services/session.services.interface";
import type session from "express-session";

export class SessionService implements ISessionService {
  /**
   *
   * @param request: Request
   * @param data: User
   * This helps storing data for the user session
   */
  createSession(
    data: User,
    session: Session & Partial<SessionData>,
    ip: string | undefined = "",
    userAgent: string | undefined = "",
  ): void {
    session.user_id = data.id;
    session.provider = data.provider;
    session.provider_id = data.provider_id;
    session.ip = ip;
    session.user_agent = userAgent;
  }
  /**
   *
   * @param request Request
   * @returns Boolean
   * used to check if the session is a valid session or not
   */
  validateSession(
    session: Session & Partial<SessionData>,
    ip: string | undefined = "",
    userAgent: string | undefined = "",
  ): Boolean {
    if (
      session.user_id &&
      session.ip === ip &&
      session.user_agent === userAgent
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
  destroySession(session: Session & Partial<SessionData>): Boolean {
    session.destroy((err) => {
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
  getSessionData(
    sessionID: string,
    sessionStore: session.Store & { generate: (req: Request) => void },
  ): SessionData {
    let sessionData: SessionData | undefined | null;
    sessionStore.get(sessionID, (err, data) => {
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
