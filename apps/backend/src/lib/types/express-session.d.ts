import "express-session";

declare module "express-session" {
  interface SessionData {
    user_id: string;
    provider: string;
    provider_id: string;

    //For security purposes
    ip: string;
    user_agent: string;
    code_verifier: string;
    csrf_token: string;
  }
}
