import { z } from "zod";
import { Provider } from "../constants";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  provider: z.enum([Provider.Github, Provider.Google, Provider.Kustom]),
  provider_id: z.string(),
  profile_url: z.string(),
});
export const UserSchemaWithoutID = UserSchema.omit({ id: true });

export type User = z.infer<typeof UserSchema>;
export type UserInsert = Omit<User, "id">;
export type UserUpdate = Partial<Omit<User, "id" | "provider_id" | "provider">>;
