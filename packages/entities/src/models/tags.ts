import { z } from "zod";

export const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(40),
  owner_id: z.string().uuid(),
  is_auto: z.boolean().default(true),
  confirmed: z.boolean().default(false),
  created_at: z.string().optional(),
});

export type Tag = z.infer<typeof TagSchema>;
