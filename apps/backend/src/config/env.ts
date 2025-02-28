import { z } from "zod";
const envSchema = z.object({
  PORT: z.coerce.number().min(1000),
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
});

const env = envSchema.parse(process.env);

//Extend the global processEnv interface
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
export default env;
