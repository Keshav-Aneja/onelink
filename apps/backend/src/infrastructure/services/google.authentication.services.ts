import pkceChallenge from "pkce-challenge";
import type { IAuthenticationService } from "../../application/services/authentication.interface";
import type { Request, Response } from "express";
import env from "../../config/env";
import { AuthenticationError, ValidationError } from "@onelink/entities/errros";
import { OAuth2Client, type Credentials } from "google-auth-library";
import {
  UserSchema,
  UserSchemaWithoutID,
  type User,
} from "@onelink/entities/models";
import { UserDTO } from "../dtos/user.dto";
import type { Session, SessionData } from "express-session";

export class GoogleOAuthService implements IAuthenticationService {
  private readonly CLIENT_ID: string = env.GOOGLE_CLIENT_ID;
  private readonly REDIRECT_URI: string = env.GOOGLE_REDIRECT_URL;
  private readonly AUTH_URL: string = env.GOOGLE_AUTH_URL;
  private readonly CLIENT_SECRET: string = env.GOOGLE_CLIENT_SECRET;

  constructor(
    // Injecting the client
    private readonly client: OAuth2Client = new OAuth2Client(
      this.CLIENT_ID,
      this.CLIENT_SECRET,
      this.REDIRECT_URI,
    ),
  ) {}

  // -----------------------------------------------------------------------------

  async initiateAuthorizationRequest(
    session: Session & Partial<SessionData>,
  ): Promise<string> {
    const { code_verifier, code_challenge } = await pkceChallenge();
    const csrf_token = crypto.randomUUID();

    if (session) {
      session.code_verifier = code_verifier;
      session.csrf_token = csrf_token;
    }

    const params = new URLSearchParams({
      client_id: this.CLIENT_ID,
      redirect_uri: this.REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      state: csrf_token,
      code_challenge: code_challenge,
      code_challenge_method: "S256",
    });

    return `${this.AUTH_URL}?${params.toString()}`;
  }

  // -----------------------------------------------------------------------------

  getAuthorizationCode(
    code: unknown,
    state: unknown,
    session: Session & Partial<SessionData>,
  ): string {
    if (typeof code !== "string") {
      throw new AuthenticationError("Authorization code not found");
    }
    if (session?.csrf_token || session.csrf_token !== state) {
      throw new AuthenticationError("Invalid state parameter");
    }
    return code;
  }

  // -----------------------------------------------------------------------------

  async getAuthorizationToken(
    code: string,
    codeVerifier?: string,
  ): Promise<Credentials> {
    const { tokens } = await this.client.getToken({
      code,
      codeVerifier,
      redirect_uri: this.REDIRECT_URI,
    });

    return tokens;
  }

  // -----------------------------------------------------------------------------

  async getUserDetails(authToken: string): Promise<Omit<User, "id">> {
    //Verify ID Token
    const ticket = await this.client.verifyIdToken({
      idToken: authToken,
      audience: this.CLIENT_ID,
    });

    //Token Payload Validation
    const payload = ticket.getPayload();

    if (
      !payload ||
      (payload.iss !== "accounts.google.com" &&
        payload.iss !== "https://accounts.google.com")
    ) {
      throw new AuthenticationError("Invalid User from token");
    }

    const user = UserDTO.fromGoogleAuth(payload);
    const valid = UserSchemaWithoutID.safeParse(user);
    if (!valid.success) {
      throw new ValidationError("Incompatible user data from Google Service");
    }
    return user;
  }
}
