import type { Express } from "express";
import morgan from "morgan";
import logger from "../helpers/logger";
export default async (app: Express) => {
  //Logger
  const morganFormat = ":method :url :status :response-time ms";
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    }),
  );
};
