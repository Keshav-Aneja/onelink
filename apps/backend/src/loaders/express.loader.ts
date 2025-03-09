import type { Express } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { apiPrefix, FRONTEND_URL } from "../config/constants";
import env from "../config/env";
import Routes from "../api";
import type { Request, Response, NextFunction, Errback } from "express";
import { ActionResponse } from "@onelink/action";
export default async (app: Express) => {
  app.use(cors({ origin: FRONTEND_URL, credentials: true }));
  app.use(express.json());
  app.use(cookieParser(env.SESS_SECRET));
  app.use(express.static("public"));
  app.enable("trust proxy");

  app.get("/status", (req, res) => {
    res.status(200).end();
  });

  app.use(apiPrefix, Routes());
  app.use((err: Errback, req: Request, res: Response, next: NextFunction) => {
    // Error handler
    console.error("ERROR: ", err);
    ActionResponse.error(res, err, 400);
  });
  return app;
};
