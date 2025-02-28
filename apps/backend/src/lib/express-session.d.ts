import "express-session";

declare module "express-session" {
  interface SessionData {
    user_id: number;
    provider: string;
    provider_id: string;

    //For security purposes
    ip: string;
    user_agent: string;
  }
}
