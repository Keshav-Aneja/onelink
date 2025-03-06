import type { Request, Response, NextFunction } from "express";
import { UserService } from "../../infrastructure/services/user.services";
import { Provider } from "@onelink/entities";
export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.sessionStore.get(req.session.id, async (err, sessionData) => {
    try {
      if (err) {
        return res.status(401).send("Unauthenticated request");
      }
      console.log(sessionData);
      if (!sessionData?.provider_id) {
        return res.status(401).send("Invalid Session");
      }

      const providerId = sessionData.provider_id;
      const userService = new UserService();
      const userExists = await userService.checkIfUserExists(providerId);

      if (!userExists) {
        return res.status(404).send("User not found. Please login again");
      }

      next();
    } catch (error) {
      console.error("Protected route error:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
};

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
