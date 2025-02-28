import type { User } from "@onelink/entities/models";
import type { Request, Response } from "express";
import type { SessionData } from "express-session";
export interface IAuthenticationService {
  createSession(request: Request, data: User): void;
  validateSession(request: Request): Boolean;
  destroySession(request: Request, response: Response): void;
  getSessionData(request: Request): SessionData;
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
