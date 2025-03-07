import type { Request, Response, NextFunction } from "express";
import { UserService } from "../../infrastructure/services/user.services";
import { Provider } from "@onelink/entities";
import { asyncHandler } from "../../helpers/async-handler";
import { AuthenticationError } from "@onelink/entities/errros";

// Define a type for your session data
interface SessionData {
  provider_id?: string;
  [key: string]: any; // For any other properties your session might have
}

// Promisify the sessionStore.get method with proper typing
const getSession = (req: Request): Promise<SessionData> => {
  return new Promise((resolve, reject) => {
    req.sessionStore.get(req.session.id, (err, sessionData) => {
      if (err) {
        reject(new AuthenticationError("Unauthenticated request"));
      } else {
        // Cast the sessionData to our interface
        resolve((sessionData as SessionData) || {});
      }
    });
  });
};

export const protectedRoute = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Now sessionData will be properly typed
    const sessionData = await getSession(req);

    if (!sessionData?.provider_id) {
      throw new AuthenticationError("Active session is invalid");
    }

    const providerId = sessionData.provider_id;
    const userService = new UserService();
    const userExists = await userService.checkIfUserExists(providerId);

    if (!userExists) {
      throw new AuthenticationError("User not found. Please login again");
    }

    next();
  },
);

const isValidProvider = (provider: string): provider is Provider => {
  return Object.values(Provider).includes(provider as Provider);
};

export const validateProvider = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { provider } = req.params;
  if (!provider || !isValidProvider(provider)) {
    res.status(400).send("Invalid provider");
    return;
  }
  next();
};
