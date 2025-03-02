import type { IAuthenticationService } from "../services/authentication.interface";
import { GoogleOAuthService } from "../../infrastructure/services/google.authentication.services";
import { Provider } from "@onelink/entities";
import { AuthenticationError, RequestError } from "@onelink/entities/errros";
import { GithubOAuthService } from "../../infrastructure/services/github.authentication.service";

export default function AuthenticationFactory(
  provider: string | undefined,
): IAuthenticationService {
  let authService;
  switch (provider) {
    case "google":
      authService = new GoogleOAuthService();
      break;
    case "github":
      authService = new GithubOAuthService();
  }
  if (!authService) {
    throw new AuthenticationError("Cannot generate factory instance");
  }
  return authService;
}
