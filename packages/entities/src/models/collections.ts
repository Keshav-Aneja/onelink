import { z } from "zod";

export const CollectionSchema = z.object({
  id: z.string().uuid().nonempty(),
  name: z.string().nonempty(),
  color: z.string().length(7),
  description: z.string().optional(),
  is_protected: z.boolean().optional().default(false),
  password: z.string().optional(),

  parent_id: z.string().uuid().nullable(),
  owner_id: z.string().uuid().nonempty(),
});

export type Collection = z.infer<typeof CollectionSchema>;
export type CollectionInsert = Omit<Collection, "id">;
export type CollectionUpdate = Partial<Omit<Collection, "id" | "owner_id">>;
