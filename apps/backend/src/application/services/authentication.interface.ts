import type { Request } from "express";
import type { User } from "@onelink/entities/models";
import type { Session } from "express-session";
import type { Credentials } from "google-auth-library";

export interface IAuthenticationService {
  /**
   *
   * This service initiates the google authentication request
   * generates a list of parameters and redirects to the google auth url for prompting the user to login
   */
  initiateAuthorizationRequest(): Promise<void>;
  /**
   * The provider returns a code after the authentication process at their side
   */
  getAuthorizationCode(): string;
  /**
   *
   * @param code
   * @param codeVerifier
   *
   * Exchange the code for the token from the provider
   *
   * NOTE: The type Credentials is for the google-auth-library, we have to confer if this is valid for github also or not
   */
  getAuthorizationToken(
    code: string,
    codeVerifier?: string,
  ): Promise<Credentials>;
  /**
   *
   * @param authToken
   * Finally use the authToken to access the user data & payload
   */
  getUserDetails(authToken: string): Promise<Omit<User, "id">>;
}
