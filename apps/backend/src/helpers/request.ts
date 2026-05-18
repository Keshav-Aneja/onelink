import type { Request } from "express";

export const pathParam = (req: Request, key: string): string | undefined =>
  typeof req.params[key] === "string" ? (req.params[key] as string) : undefined;
