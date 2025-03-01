import type { Request, Response, NextFunction } from "express";
import { UserService } from "../../infrastructure/services/user.services";
export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.sessionStore.get(req.sessionID, async (err, sessionData) => {
    try {
      if (err) {
        return res.status(401).send("Unauthenticated request");
      }

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
      res.status(500).send("Internal Server Error");
    }
  });
};
