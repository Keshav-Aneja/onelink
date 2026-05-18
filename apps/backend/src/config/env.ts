import { z } from "zod";

const isLocalMode = process.env["LOCAL_MODE"] === "true";

const envSchema = z.object({
  PORT: z.coerce.number().min(1000),
  FRONTEND_URL: z.string().url(),
  PG_CONNECTION: z.string(),
  ENV: z
    .union([
      z.literal("development"),
      z.literal("production"),
      z.literal("testing"),
    ])
    .default("development"),

  LOCAL_MODE: z
    .string()
    .optional()
    .transform((v) => v === "true"),

  //Authentication variables — optional in local mode
  GOOGLE_CLIENT_ID: isLocalMode ? z.string().optional() : z.string(),
  GOOGLE_CLIENT_SECRET: isLocalMode ? z.string().optional() : z.string(),
  GOOGLE_REDIRECT_URL: isLocalMode
    ? z.string().url().optional()
    : z.string().url(),
  GOOGLE_AUTH_URL: isLocalMode
    ? z.string().url().optional()
    : z.string().url(),

  GITHUB_CLIENT_ID: isLocalMode ? z.string().optional() : z.string(),
  GITHUB_CLIENT_SECRET: isLocalMode ? z.string().optional() : z.string(),
  GITHUB_REDIRECT_URL: isLocalMode
    ? z.string().url().optional()
    : z.string().url(),
  GITHUB_AUTH_URL: isLocalMode
    ? z.string().url().optional()
    : z.string().url(),

  //Redis Config
  REDIS_PASSWORD: z.string().optional().default(""),
  REDIS_URL: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_PREFIX: z.string(),

  //Session
  SESS_SECRET: z.string(),
});

const env = envSchema.parse(process.env);

type EnvVars = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      PORT?: string;
      FRONTEND_URL?: string;
      PG_CONNECTION?: string;
      ENV?: "development" | "production" | "testing";
      LOCAL_MODE?: string;
      GOOGLE_CLIENT_ID?: string;
      GOOGLE_CLIENT_SECRET?: string;
      GOOGLE_REDIRECT_URL?: string;
      GOOGLE_AUTH_URL?: string;
      GITHUB_CLIENT_ID?: string;
      GITHUB_CLIENT_SECRET?: string;
      GITHUB_REDIRECT_URL?: string;
      GITHUB_AUTH_URL?: string;
      REDIS_PASSWORD?: string;
      REDIS_URL?: string;
      REDIS_PORT?: string;
      REDIS_PREFIX?: string;
      SESS_SECRET?: string;
    }
  }
}

export type { EnvVars };
export default env;
