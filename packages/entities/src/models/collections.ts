import { z } from "zod";

export const CollectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty(),
  color: z.string().length(9),
  description: z.string().optional(),
  is_protected: z.boolean().default(false),
  password: z.string(),

  parent_id: z.string().uuid().nullable(),
  owner_id: z.string().uuid().nonempty(),
});

export type Collection = z.infer<typeof CollectionSchema>;
export type CollectionUpdate = Partial<Omit<Collection, "id" | "owner_id">>;
