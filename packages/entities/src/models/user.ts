import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  provider: z.string(),
  provider_id: z.string(),
  profile_url: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type UserInsert = Omit<User, "id">;
export type UserUpdate = Partial<
  Omit<User, "id" | "provider_id" | "providers">
>;
