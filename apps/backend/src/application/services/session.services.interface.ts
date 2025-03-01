import type { User } from "@onelink/entities/models";
import type session from "express-session";
import type { Session, SessionData } from "express-session";
export interface ISessionService {
  createSession(
    data: User,
    session: Session & Partial<SessionData>,
    ip: string | undefined,
    userAgent: string | undefined,
  ): void;
  validateSession(
    session: Session & Partial<SessionData>,
    ip: string | undefined,
    userAgent: string | undefined,
  ): Boolean;
  destroySession(session: Session & Partial<SessionData>): Boolean;
  getSessionData(
    sessionID: string,
    sessionStore: session.Store & { generate: (req: Request) => void },
  ): SessionData;
}

// Now based on this I will be implementing different authentication services
// In the callback
// the service will handle creation and verification of tokens
// a seperate session service will manage the session and logout etc
// Now a controller will will manage both of these things like calling the token service and after we get token then calling the session service

/**
 * I want a single api endpoint - /api/auth/login/provider
 * With this endpoint I want to handle
 * 1. Google Authentication - Both Instantiation and callback
 * 2. Kustom Authentication (For signup we have to create a separate endpoint /apit/auth/signup/kustom) for this
 * 3. Github Authentication
 */

/**
 * At the router level I want to only call the AuthenticationService without passing any dependency like which authnetication method to choose at the App level
 * Based on my params (provider) I will decide which authentication method to choose
 * For this we can choose a factory method to decide which authMethod to choose
 * An interface should be made for OAuthService which is implemented by Google & Github
 * This can include methods like
 *      a. Redirection to provider service
 *      b. Generate Token Payload
 * Kustom Auth Service will have to implement both login and signup separately
 *
 * Base Auth Service has method like:
 *      a. validateSession
 *      b. createSession
 *      c. invalidateSession
 *      d. get user id
 */

/**
 * Factory pattern should be checking the params
 * Based on the params it will return the instance or object of the particular AuthService
 * this instance will be of type AuthService
 *
 * so this way the whole logic of deciding which Oauth method to choose from is encapsulated in the factory
 * And the controller doesn't even need to know the specifics for the implementation
 *
 *
 * What is factory pattern?
 * It is just an interface for creating objects in a superclass.
 * In simpler terms, it's a way to create objects without specifying the exact class of object that will be created
 * We are doing this because the selection of a particular type of object is decided at runtime
 * Like in swiggy when we order, the order can be of type take-away, dine-in, or delivery. We have to decide at runtime what type of order has to be created.
 */
