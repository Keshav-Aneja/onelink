import pkceChallenge from "pkce-challenge";
import type { IAuthenticationService } from "../../application/services/authentication.interface";
import env from "../../config/env";
import { AuthenticationError, ValidationError } from "@onelink/entities/errros";
import { UserSchemaWithoutID, type User } from "@onelink/entities/models";
import { UserDTO } from "../dtos/user.dto";
import type { Session, SessionData } from "express-session";
export class GithubOAuthService implements IAuthenticationService {
  private readonly CLIENT_ID: string = env.GITHUB_CLIENT_ID;
  private readonly REDIRECT_URI: string = env.GITHUB_REDIRECT_URL;
  private readonly AUTH_URL: string = env.GITHUB_AUTH_URL;
  private readonly CLIENT_SECRET: string = env.GITHUB_CLIENT_SECRET;

  constructor() {}

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
      scope: "user:email",
      state: csrf_token,
    });

    return `${this.AUTH_URL}?${params.toString()}`;
  }

  // -----------------------------------------------------------------------------

  getAuthorizationCode(
    code: string,
    state: any,
    session: Session & Partial<SessionData>,
  ): string {
    if (typeof code !== "string") {
      throw new AuthenticationError("Authorization code not found");
    }
    return code;
  }

  // -----------------------------------------------------------------------------

  async getAuthorizationToken(
    code: string,
    codeVerifier?: string,
  ): Promise<string> {
    const authParams = new URLSearchParams({
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
      redirect_uri: `${this.REDIRECT_URI}`,
      code,
    });
    const response = await fetch(
      `https://github.com/login/oauth/access_token?${authParams}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch access token: ${response.statusText}`);
    }

    const data = await response.json();
    const accessToken = data.access_token;
    if (!accessToken) {
      throw new Error("Access token not found in response");
    }

    return accessToken;
  }

  // -----------------------------------------------------------------------------

  async getUserDetails(authToken: string): Promise<Omit<User, "id">> {
    const userResponse = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const userEmail = await fetch("https://api.github.com/user/emails", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await userResponse.json();
    const emails = await userEmail.json();
    const email = emails[0].email;
    const user = UserDTO.fromGithubAuth({ ...data, email });
    const valid = UserSchemaWithoutID.safeParse(user);
    if (!valid.success) {
      throw new ValidationError("Incompatible user data from Google Service");
    }
    return user;
  }
}
