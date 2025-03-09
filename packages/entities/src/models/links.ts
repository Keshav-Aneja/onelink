import { z } from "zod";

export const LinkSchema = z.object({
  id: z.string().uuid().nonempty(),
  name: z.string().optional(),
  description: z.string().optional(),
  fingerprint: z.string(),
  link: z.string().url(),
  open_graph: z.string().optional(),

  owner_id: z.string().uuid().nonempty(),
  parent_id: z.string().nullable(),
});

export type Link = z.infer<typeof LinkSchema>;
export type LinkInsert = Omit<Link, "id">;
export type LinkUpdate = Partial<Pick<Link, "id" | "owner_id">>;
