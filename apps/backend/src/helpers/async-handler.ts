import type { Request, Response, NextFunction } from "express";
import { ActionResponse } from "@onelink/action";

interface RequestHandler {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

const asyncHandler = (requestHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export { asyncHandler };
