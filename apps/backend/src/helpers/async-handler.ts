import type { Request, Response, NextFunction } from "express";

interface RequestHandler {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

const asycnHandler = (requestHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export { asycnHandler };
