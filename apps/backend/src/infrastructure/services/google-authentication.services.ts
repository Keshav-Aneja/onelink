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
import { Provider } from "@onelink/entities";
import crypto from "crypto";
export class GoogleOAuthService implements IAuthenticationService {
  private readonly CLIENT_ID: string = env.GOOGLE_CLIENT_ID;
  private readonly REDIRECT_URI: string = env.GOOGLE_REDIRECT_URL;
  private readonly AUTH_URL: string = env.GOOGLE_AUTH_URL;
  private readonly CLIENT_SECRET: string = env.GOOGLE_CLIENT_SECRET;

  constructor(
    private readonly request: Request,
    private readonly response: Response,
    // Injecting the client
    private readonly client: OAuth2Client = new OAuth2Client(
      this.CLIENT_ID,
      this.CLIENT_SECRET,
      this.REDIRECT_URI,
    ),
  ) {}

  // -----------------------------------------------------------------------------

  async initiateAuthorizationRequest(): Promise<void> {
    const { code_verifier, code_challenge } = await pkceChallenge();
    const csrf_token = crypto.randomBytes(32).toString("hex");

    if (this.request.session) {
      this.request.session.code_verifier = code_verifier;
      this.request.session.csrf_token = csrf_token;
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

    this.response.redirect(`${this.AUTH_URL}?${params.toString()}`);
  }

  // -----------------------------------------------------------------------------

  getAuthorizationCode(): string {
    const { code, state } = this.request.query;
    if (typeof code !== "string") {
      throw new AuthenticationError("Authorization code not found");
    }
    if (
      !this.request.session?.csrf_token ||
      this.request.session.csrf_token !== state
    ) {
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

    if (!payload.email || !payload.name) {
      throw new ValidationError("Email or name is missing from the payload");
    }

    const user = {
      provider_id: payload.sub,
      provider: Provider.Google,
      email: payload.email,
      profile_url: payload.picture || "",
      name: payload.name,
    };

    const valid = UserSchemaWithoutID.safeParse(user);

    if (!valid.success) {
      throw new ValidationError("Invalid User Data");
    }
    return user;
  }
}
