import { Router } from "express";
import authentication from "./routes/authentication";

export default function Routes() {
  const router = Router();
  authentication(router);

  return router;
}
