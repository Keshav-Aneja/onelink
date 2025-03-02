import { z } from "zod";
const envSchema = z.object({
  PORT: z.coerce.number().min(1000),
  FRONTEND_URL: z.string().url(),
  ENV: z
    .union([
      z.literal("development"),
      z.literal("production"),
      z.literal("testing"),
    ])
    .default("development"),

  //Authentication variables
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URL: z.string().url(),
  GOOGLE_AUTH_URL: z.string().url(),

  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_REDIRECT_URL: z.string().url(),
  GITHUB_AUTH_URL: z.string().url(),

  //Redis Config
  REDIS_PASSWORD: z.string(),
  REDIS_URL: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_PREFIX: z.string(),

  //Session
  SESS_SECRET: z.string(),
});

const env = envSchema.parse(process.env);

//Extend the global processEnv interface
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
export default env;
