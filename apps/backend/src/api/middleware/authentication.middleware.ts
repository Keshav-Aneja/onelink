import type { Request, Response, NextFunction } from "express";
import { Provider } from "@onelink/entities";
import { asyncHandler } from "../../helpers/async-handler";
import { AuthenticationError } from "@onelink/entities/errros";
import { pathParam } from "../../helpers/request";

export const protectedRoute = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // express-session hydrates req.session from the store before this runs —
    // no extra sessionStore.get round-trip needed.
    if (!req.session.provider_id) {
      throw new AuthenticationError("Active session is invalid");
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
  const provider = pathParam(req, "provider") ?? "";
  if (!provider || !isValidProvider(provider)) {
    res.status(400).send("Invalid provider");
    return;
  }
  next();
};
